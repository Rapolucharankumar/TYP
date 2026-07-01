const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// General read API rate limiter: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again later.' }
});

// Strict write limiter: 20 requests per 15 minutes per IP (for admin mutations)
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests. Please wait before submitting again.' }
});

// Apply general limiter to all /api routes
app.use('/api', apiLimiter);

// Auth Middleware to protect admin endpoints
const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format.' });
  }

  const token = authHeader.split(' ')[1];
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Fallback for mock environment
  if (!db.isConfigured || !supabaseUrl || !supabaseAnonKey) {
    if (token.startsWith('mock-admin-token')) {
      const isWriter = token.includes('mock-writer-id') || token.includes('writer');
      const email = isWriter ? 'writer@youthprism.com' : 'admin@youthprism.com';
      
      try {
        const users = await db.getUsers();
        const userProfile = users.find(u => u.email === email);
        if (userProfile) {
          if (userProfile.suspended) {
            return res.status(403).json({ error: 'Forbidden: Account is suspended.' });
          }
          req.user = { id: userProfile.id, email: userProfile.email, role: userProfile.role };
        } else {
          req.user = { id: 'mock-admin-id', email, role: isWriter ? 'writer' : 'super_admin' };
        }
      } catch (err) {
        req.user = { id: 'mock-admin-id', email, role: isWriter ? 'writer' : 'super_admin' };
      }
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid credentials in mock environment.' });
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey
      }
    });

    if (!response.ok) {
      return res.status(401).json({ error: 'Unauthorized: Session validation failed.' });
    }

    const userData = await response.json();
    req.user = userData;

    // Resolve user profile role and suspension status
    try {
      const users = await db.getUsers();
      const userProfile = users.find(u => u.id === userData.id || u.email === userData.email);
      if (userProfile) {
        if (userProfile.suspended) {
          return res.status(403).json({ error: 'Forbidden: Account is suspended.' });
        }
        req.user.role = userProfile.role;
      } else {
        req.user.role = 'writer'; // default fallback role
      }
    } catch (err) {
      console.warn('Failed to load profile for role check, using writer fallback:', err);
      req.user.role = 'writer';
    }

    next();
  } catch (err) {
    console.error('Backend authentication check failed:', err);
    return res.status(500).json({ error: 'Authentication service error.' });
  }
};

// Welcome Page
app.get('/', (req, res) => {
  res.send('<h1>The Youth Prism API Server</h1><p>Status: Active. Use <a href="/api/health">/api/health</a> to check connection.</p>');
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: db.isConfigured ? 'postgres' : 'mock-memory' });
});


// Articles Endpoints
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await db.getArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/articles/:slug', async (req, res) => {
  try {
    const article = await db.getArticleBySlug(req.params.slug);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/articles', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const article = await db.createArticle(req.body);
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/articles/:id', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const article = await db.updateArticle(req.params.id, req.body);
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/articles/:id', requireAdmin, async (req, res) => {
  try {
    await db.deleteArticle(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/articles/:id/view', async (req, res) => {
  try {
    await db.incrementArticleViews(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authors Endpoints
app.get('/api/authors', async (req, res) => {
  try {
    const authors = await db.getAuthors();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/authors', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const author = await db.createAuthor(req.body);
    res.status(201).json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/authors/:id', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const author = await db.updateAuthor(req.params.id, req.body);
    res.json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/authors/:id', requireAdmin, async (req, res) => {
  try {
    await db.deleteAuthor(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories Endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories/:slug', async (req, res) => {
  try {
    const cat = await db.getCategoryBySlug(req.params.slug);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', requireAdmin, async (req, res) => {
  try {
    const cat = await db.createCategory(req.body);
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    const cat = await db.updateCategory(req.params.id, req.body);
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    await db.deleteCategory(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tags Endpoints
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await db.getTags();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tags', requireAdmin, async (req, res) => {
  try {
    const tag = await db.createTag(req.body);
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tags/:id', requireAdmin, async (req, res) => {
  try {
    await db.deleteTag(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Opportunities Endpoints
app.get('/api/opportunities', async (req, res) => {
  try {
    const opps = await db.getOpportunities();
    res.json(opps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/opportunities', requireAdmin, async (req, res) => {
  try {
    const opp = await db.createOpportunity(req.body);
    res.status(201).json(opp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/opportunities/:id', requireAdmin, async (req, res) => {
  try {
    const opp = await db.updateOpportunity(req.params.id, req.body);
    res.json(opp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/opportunities/:id', requireAdmin, async (req, res) => {
  try {
    await db.deleteOpportunity(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subscribers Endpoints
app.get('/api/subscribers', requireAdmin, async (req, res) => {
  try {
    const subs = await db.getSubscribers();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const sub = await db.subscribeNewsletter(req.body.email);
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/subscribers/:id', requireAdmin, async (req, res) => {
  try {
    await db.deleteSubscriber(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Campaigns Endpoints
app.get('/api/campaigns', requireAdmin, async (req, res) => {
  try {
    const camps = await db.getCampaigns();
    res.json(camps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/campaigns', requireAdmin, async (req, res) => {
  try {
    const camp = await db.sendNewsletterCampaign(req.body.subject, req.body.content);
    res.status(201).json(camp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings Endpoints
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', requireAdmin, async (req, res) => {
  try {
    const settings = await db.updateSettings(req.body);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats Endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Users & RBAC Management
app.get('/api/users', requireAdmin, async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const user = await db.createUser(req.body);
    await db.createActivityLog({
      user_email: req.user.email,
      role: req.user.role || 'admin',
      action: 'Create User Profile',
      details: { target_email: user.email, target_role: user.role },
      ip_address: req.ip
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const user = await db.updateUser(req.params.id, req.body);
    await db.createActivityLog({
      user_email: req.user.email,
      role: req.user.role || 'admin',
      action: 'Update User Profile',
      details: { target_email: user.email, ...req.body },
      ip_address: req.ip
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', requireAdmin, async (req, res) => {
  try {
    await db.deleteUser(req.params.id);
    await db.createActivityLog({
      user_email: req.user.email,
      role: req.user.role || 'admin',
      action: 'Delete User Profile',
      details: { target_id: req.params.id },
      ip_address: req.ip
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publications / Magazine Issues Endpoints
app.get('/api/publications', async (req, res) => {
  try {
    const issues = await db.getPublications();
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/publications', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const pub = await db.createPublication(req.body);
    await db.createActivityLog({
      user_email: req.user.email,
      role: req.user.role || 'admin',
      action: 'Create Publication Issue',
      details: { title: pub.title, slug: pub.slug },
      ip_address: req.ip
    });
    res.status(201).json(pub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/publications/:id', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const pub = await db.updatePublication(req.params.id, req.body);
    await db.createActivityLog({
      user_email: req.user.email,
      role: req.user.role || 'admin',
      action: 'Update Publication Issue',
      details: { title: pub.title, slug: pub.slug, ...req.body },
      ip_address: req.ip
    });
    res.json(pub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/publications/:id', requireAdmin, async (req, res) => {
  try {
    await db.deletePublication(req.params.id);
    await db.createActivityLog({
      user_email: req.user.email,
      role: req.user.role || 'admin',
      action: 'Delete Publication Issue',
      details: { target_id: req.params.id },
      ip_address: req.ip
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Globe Markers Endpoints
app.get('/api/globe-markers', async (req, res) => {
  try {
    const markers = await db.getGlobeMarkers();
    res.json(markers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/globe-markers', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const marker = await db.createGlobeMarker(req.body);
    await db.createActivityLog({
      user_email: req.user.email,
      role: req.user.role || 'admin',
      action: 'Create Globe Marker',
      details: { name: marker.name, lat: marker.lat, lng: marker.lng },
      ip_address: req.ip
    });
    res.status(201).json(marker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/globe-markers/:id', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const marker = await db.updateGlobeMarker(req.params.id, req.body);
    await db.createActivityLog({
      user_email: req.user.email,
      role: req.user.role || 'admin',
      action: 'Update Globe Marker',
      details: { name: marker.name, ...req.body },
      ip_address: req.ip
    });
    res.json(marker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/globe-markers/:id', requireAdmin, async (req, res) => {
  try {
    await db.deleteGlobeMarker(req.params.id);
    await db.createActivityLog({
      user_email: req.user.email,
      role: req.user.role || 'admin',
      action: 'Delete Globe Marker',
      details: { target_id: req.params.id },
      ip_address: req.ip
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activity Logs Endpoints
app.get('/api/activity-logs', requireAdmin, async (req, res) => {
  try {
    const logs = await db.getActivityLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/activity-logs', requireAdmin, async (req, res) => {
  try {
    const log = await db.createActivityLog({
      ...req.body,
      ip_address: req.ip
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Homepage Layout Endpoints
app.get('/api/homepage-layout', async (req, res) => {
  try {
    const layout = await db.getHomepageLayout();
    res.json(layout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/homepage-layout', requireAdmin, writeLimiter, async (req, res) => {
  try {
    const layout = await db.updateHomepageLayout(req.body);
    await db.createActivityLog({
      user_email: req.user.email,
      role: req.user.role || 'admin',
      action: 'Update Homepage Layout',
      details: { ...req.body },
      ip_address: req.ip
    });
    res.json(layout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[TYP Backend Server] Running on http://localhost:${PORT}`);
});
