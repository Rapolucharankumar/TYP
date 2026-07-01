const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

const dbUrl = process.env.DATABASE_URL || '';
const isConfigured = !!dbUrl;

let pool = null;
if (isConfigured) {
  pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }, // Required for Supabase / Heroku SSL Postgres connections
    lookup: (hostname, options, callback) => {
      if (hostname.includes('supabase.co')) {
        // Resolve to Supabase's IPv4 connection pooler in Singapore (ap-southeast-1)
        dns.lookup('aws-0-ap-southeast-1.pooler.supabase.com', { family: 4 }, callback);
      } else {
        dns.lookup(hostname, { family: 4 }, callback);
      }
    }
  });

  // Prevent unhandled process crashes due to connection drops on idle clients
  pool.on('error', (err) => {
    console.error('[TYP Database] Unexpected error on idle database client:', err.message);
  });

  console.log('[TYP Database] Configured with remote PostgreSQL.');
} else {
  console.log('[TYP Database] No DATABASE_URL found. Running in local JSON-file fallback mode.');
}


// ==========================================
// FILE-SYSTEM LOCAL JSON DATABASE FALLBACK
// ==========================================
const JSON_DB_PATH = path.join(__dirname, 'local_db.json');

const INITIAL_JSON_DB = {
  profiles: [
    {
      id: 'mock-admin-id',
      email: 'admin@youthprism.com',
      role: 'super_admin',
      suspended: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'mock-writer-id',
      email: 'writer@youthprism.com',
      role: 'writer',
      suspended: false,
      created_at: new Date().toISOString()
    }
  ],
  authors: [],
  categories: [],
  tags: [],
  articles: [],
  subscribers: [],
  campaigns: [],
  settings: {
    siteName: 'The Youth Prism',
    logo: 'The Youth Prism',
    favicon: '/favicon.ico',
    metaTitleDefault: 'The Youth Prism | Premium Youth Editorial',
    metaDescriptionDefault: 'The Youth Prism explores technology, policy, healthcare, global affairs, and current affairs through the lens of youth.',
    openGraphImage: '',
    writersCount: '17+',
    countriesCount: '4',
    partnershipsCount: '3',
    readersCount: '24k+',
    papersCount: '12',
    sectorsCount: '5'
  },
  opportunities: [],
  magazine_issues: [],
  globe_markers: [
    {
      id: 'marker-1',
      name: 'Geneva',
      lat: 46.2044,
      lng: 6.1432,
      type: 'research',
      country: 'Switzerland',
      headline: 'Global Geopolitics Fellowship 2026 launched.',
      active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'marker-2',
      name: 'New Delhi',
      lat: 28.6139,
      lng: 77.2090,
      type: 'writer',
      country: 'India',
      headline: 'Sovereign data governance systems reports.',
      active: true,
      created_at: new Date().toISOString()
    }
  ],
  activity_logs: [],
  homepage_layout: [
    {
      id: 'sections',
      config: {
        order: ['Hero', 'Despatches', 'Newsroom', 'Globe', 'Node Graph', 'Opportunities'],
        visible: {
          'Hero': true,
          'Despatches': true,
          'Newsroom': true,
          'Globe': true,
          'Node Graph': true,
          'Opportunities': true
        }
      }
    }
  ]
};

function readJsonDb() {
  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(INITIAL_JSON_DB, null, 2));
    return INITIAL_JSON_DB;
  }
  try {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read local JSON database, resetting:', err);
    return INITIAL_JSON_DB;
  }
}

function writeJsonDb(data) {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write local JSON database:', err);
  }
}

// Helper to query either Postgres or JSON File
async function query(text, params) {
  if (isConfigured && pool) {
    return await pool.query(text, params);
  }
  throw new Error('Database connection not established.');
}

// Whitelist arrays to prevent SQL Injection key interpolation
const ARTICLE_COLUMNS = ['title', 'slug', 'excerpt', 'content', 'cover_image', 'status', 'featured', 'author_id', 'category_id', 'published_at', 'seo_title', 'seo_description', 'views'];
const AUTHOR_COLUMNS = ['name', 'bio', 'avatar', 'social_links'];
const CATEGORY_COLUMNS = ['name', 'slug', 'description', 'image'];
const OPPORTUNITY_COLUMNS = ['title', 'type', 'tagClass', 'deadline', 'location', 'description', 'stipend'];
const SETTINGS_COLUMNS = ['siteName', 'logo', 'favicon', 'metaTitleDefault', 'metaDescriptionDefault', 'openGraphImage', 'writersCount', 'countriesCount', 'partnershipsCount', 'readersCount', 'papersCount', 'sectorsCount', 'linkedin', 'instagram', 'twitter', 'youtube'];
const PROFILE_COLUMNS = ['role', 'suspended', 'email'];
const MAGAZINE_ISSUE_COLUMNS = ['title', 'slug', 'cover_image', 'editorial_note', 'status', 'featured', 'published_at'];
const GLOBE_MARKER_COLUMNS = ['name', 'lat', 'lng', 'type', 'country', 'headline', 'active'];
const ACTIVITY_LOG_COLUMNS = ['user_email', 'role', 'action', 'details', 'ip_address'];
const HOMEPAGE_LAYOUT_COLUMNS = ['id', 'config'];

// ==========================================
// UNIFIED DATABASE ADAPTER LAYER
// ==========================================
const db = {
  isConfigured,

  // Articles
  getArticles: async () => {
    if (isConfigured) {
      const sql = `
        SELECT a.*, 
               au.name as author_name, au.bio as author_bio, au.avatar as author_avatar, au.social_links as author_social_links,
               cat.name as category_name, cat.slug as category_slug, cat.description as category_description
        FROM public.articles a
        LEFT JOIN public.authors au ON a.author_id = au.id
        LEFT JOIN public.categories cat ON a.category_id = cat.id
        ORDER BY a.created_at DESC
      `;
      const result = await query(sql);
      return result.rows.map((r, idx) => {
        const authorRole = r.author_social_links?.role || 'Contributor';
        return {
          id: r.id,
          title: r.title,
          slug: r.slug,
          excerpt: r.excerpt,
          content: r.content,
          cover_image: r.cover_image,
          status: r.status,
          featured: r.featured,
          author_id: r.author_id,
          category_id: r.category_id,
          published_at: r.published_at,
          created_at: r.created_at,
          seo_title: r.seo_title,
          seo_description: r.seo_description,
          views: r.views !== undefined && r.views !== null ? r.views : (3200 - idx * 450 > 0 ? 3200 - idx * 450 : 100),
          author: r.author_id ? {
            id: r.author_id,
            name: r.author_name,
            bio: r.author_bio,
            avatar: r.author_avatar,
            role: authorRole,
            social_links: {
              ...r.author_social_links,
              role: authorRole
            }
          } : undefined,
          category: r.category_id ? {
            id: r.category_id,
            name: r.category_name,
            slug: r.category_slug,
            description: r.category_description
          } : undefined
        };
      });
    } else {
      const data = readJsonDb();
      return data.articles.map(art => {
        const author = data.authors.find(a => a.id === art.author_id);
        const category = data.categories.find(c => c.id === art.category_id);
        return {
          ...art,
          author,
          category
        };
      });
    }
  },

  getArticleBySlug: async (slug) => {
    if (isConfigured) {
      const sql = `
        SELECT a.*, 
               au.name as author_name, au.bio as author_bio, au.avatar as author_avatar, au.social_links as author_social_links,
               cat.name as category_name, cat.slug as category_slug, cat.description as category_description
        FROM public.articles a
        LEFT JOIN public.authors au ON a.author_id = au.id
        LEFT JOIN public.categories cat ON a.category_id = cat.id
        WHERE a.slug = $1
        LIMIT 1
      `;
      const result = await query(sql, [slug]);
      if (result.rows.length === 0) return null;
      const r = result.rows[0];
      const authorRole = r.author_social_links?.role || 'Contributor';
      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        content: r.content,
        cover_image: r.cover_image,
        status: r.status,
        featured: r.featured,
        author_id: r.author_id,
        category_id: r.category_id,
        published_at: r.published_at,
        created_at: r.created_at,
        seo_title: r.seo_title,
        seo_description: r.seo_description,
        views: r.views || 0,
        author: r.author_id ? {
          id: r.author_id,
          name: r.author_name,
          bio: r.author_bio,
          avatar: r.author_avatar,
          role: authorRole,
          social_links: {
            ...r.author_social_links,
            role: authorRole
          }
        } : undefined,
        category: r.category_id ? {
          id: r.category_id,
          name: r.category_name,
          slug: r.category_slug,
          description: r.category_description
        } : undefined
      };
    } else {
      const data = readJsonDb();
      const art = data.articles.find(a => a.slug === slug);
      if (!art) return null;
      const author = data.authors.find(a => a.id === art.author_id);
      const category = data.categories.find(c => c.id === art.category_id);
      return {
        ...art,
        author,
        category
      };
    }
  },

  createArticle: async (article) => {
    if (isConfigured) {
      const sql = `
        INSERT INTO public.articles (
          title, slug, excerpt, content, cover_image, status, featured, author_id, category_id, published_at, seo_title, seo_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      const params = [
        article.title,
        article.slug,
        article.excerpt,
        article.content,
        article.cover_image,
        article.status,
        article.featured,
        article.author_id || null,
        article.category_id || null,
        article.published_at,
        article.seo_title,
        article.seo_description
      ];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      const newArticle = {
        ...article,
        id: `art-${Date.now()}`,
        created_at: new Date().toISOString(),
        views: 0
      };
      data.articles.push(newArticle);
      writeJsonDb(data);
      return newArticle;
    }
  },

  updateArticle: async (id, dataToUpdate) => {
    if (isConfigured) {
      const keys = Object.keys(dataToUpdate).filter(k => ARTICLE_COLUMNS.includes(k));
      if (keys.length === 0) return null;
      const setClauses = keys.map((key, idx) => `"${key}" = $${idx + 2}`).join(', ');
      const sql = `
        UPDATE public.articles
        SET ${setClauses}
        WHERE id = $1
        RETURNING *
      `;
      const params = [id, ...keys.map(key => dataToUpdate[key])];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      const index = data.articles.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Article not found');
      data.articles[index] = { ...data.articles[index], ...dataToUpdate };
      writeJsonDb(data);
      return data.articles[index];
    }
  },

  deleteArticle: async (id) => {
    if (isConfigured) {
      const sql = `DELETE FROM public.articles WHERE id = $1`;
      await query(sql, [id]);
    } else {
      const data = readJsonDb();
      data.articles = data.articles.filter(a => a.id !== id);
      writeJsonDb(data);
    }
  },

  incrementArticleViews: async (id) => {
    if (isConfigured) {
      const sql = `UPDATE public.articles SET views = COALESCE(views, 0) + 1 WHERE id = $1`;
      await query(sql, [id]);
    } else {
      const data = readJsonDb();
      const index = data.articles.findIndex(a => a.id === id);
      if (index !== -1) {
        data.articles[index].views = (data.articles[index].views || 0) + 1;
        writeJsonDb(data);
      }
    }
  },

  // Authors
  getAuthors: async () => {
    if (isConfigured) {
      const sql = `SELECT * FROM public.authors ORDER BY name ASC`;
      const result = await query(sql);
      return result.rows.map(a => {
        const role = a.social_links?.role || 'Contributor';
        return {
          ...a,
          role,
          social_links: {
            ...a.social_links,
            role
          }
        };
      });
    } else {
      const data = readJsonDb();
      return data.authors;
    }
  },

  createAuthor: async (author) => {
    const role = author.role || author.social_links?.role || 'Contributor';
    const socialLinks = {
      ...author.social_links,
      role
    };

    if (isConfigured) {
      const sql = `
        INSERT INTO public.authors (name, bio, avatar, social_links)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const params = [author.name, author.bio, author.avatar, JSON.stringify(socialLinks)];
      const result = await query(sql, params);
      const created = result.rows[0];
      return {
        ...created,
        role,
        social_links: socialLinks
      };
    } else {
      const data = readJsonDb();
      const newAuthor = {
        ...author,
        id: `author-${Date.now()}`,
        role,
        social_links: socialLinks
      };
      data.authors.push(newAuthor);
      writeJsonDb(data);
      return newAuthor;
    }
  },

  updateAuthor: async (id, dataToUpdate) => {
    const data = { ...dataToUpdate };
    if (data.social_links || data.role) {
      data.social_links = {
        ...data.social_links,
        role: data.role || data.social_links?.role || 'Contributor'
      };
    }

    if (isConfigured) {
      const keys = Object.keys(data).filter(k => k !== 'role' && AUTHOR_COLUMNS.includes(k));
      if (keys.length === 0) return null;
      const setClauses = keys.map((key, idx) => `"${key}" = $${idx + 2}`).join(', ');
      const sql = `
        UPDATE public.authors
        SET ${setClauses}
        WHERE id = $1
        RETURNING *
      `;
      const params = [id, ...keys.map(key => key === 'social_links' ? JSON.stringify(data[key]) : data[key])];
      const result = await query(sql, params);
      const updated = result.rows[0];
      const role = updated.social_links?.role || 'Contributor';
      return {
        ...updated,
        role,
        social_links: {
          ...updated.social_links,
          role
        }
      };
    } else {
      const dbData = readJsonDb();
      const index = dbData.authors.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Author not found');
      
      const merged = { ...dbData.authors[index], ...data };
      const role = merged.role || merged.social_links?.role || 'Contributor';
      dbData.authors[index] = {
        ...merged,
        role,
        social_links: {
          ...merged.social_links,
          role
        }
      };
      writeJsonDb(dbData);
      return dbData.authors[index];
    }
  },

  deleteAuthor: async (id) => {
    if (isConfigured) {
      const sql = `DELETE FROM public.authors WHERE id = $1`;
      await query(sql, [id]);
    } else {
      const data = readJsonDb();
      data.authors = data.authors.filter(a => a.id !== id);
      writeJsonDb(data);
    }
  },

  // Categories
  getCategories: async () => {
    if (isConfigured) {
      const sql = `SELECT * FROM public.categories ORDER BY name ASC`;
      const result = await query(sql);
      return result.rows;
    } else {
      const data = readJsonDb();
      return data.categories;
    }
  },

  getCategoryBySlug: async (slug) => {
    if (isConfigured) {
      const sql = `SELECT * FROM public.categories WHERE slug = $1 LIMIT 1`;
      const result = await query(sql, [slug]);
      return result.rows[0] || null;
    } else {
      const data = readJsonDb();
      return data.categories.find(c => c.slug === slug) || null;
    }
  },

  createCategory: async (category) => {
    if (isConfigured) {
      const sql = `
        INSERT INTO public.categories (name, slug, description, image)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await query(sql, [category.name, category.slug, category.description, category.image]);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      const newCat = { ...category, id: `cat-${Date.now()}` };
      data.categories.push(newCat);
      writeJsonDb(data);
      return newCat;
    }
  },

  updateCategory: async (id, dataToUpdate) => {
    if (isConfigured) {
      const keys = Object.keys(dataToUpdate).filter(k => CATEGORY_COLUMNS.includes(k));
      if (keys.length === 0) return null;
      const setClauses = keys.map((key, idx) => `"${key}" = $${idx + 2}`).join(', ');
      const sql = `
        UPDATE public.categories
        SET ${setClauses}
        WHERE id = $1
        RETURNING *
      `;
      const params = [id, ...keys.map(key => dataToUpdate[key])];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      const index = data.categories.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Category not found');
      data.categories[index] = { ...data.categories[index], ...dataToUpdate };
      writeJsonDb(data);
      return data.categories[index];
    }
  },

  deleteCategory: async (id) => {
    if (isConfigured) {
      const sql = `DELETE FROM public.categories WHERE id = $1`;
      await query(sql, [id]);
    } else {
      const data = readJsonDb();
      data.categories = data.categories.filter(c => c.id !== id);
      writeJsonDb(data);
    }
  },

  // Tags
  getTags: async () => {
    if (isConfigured) {
      const sql = `SELECT * FROM public.tags ORDER BY name ASC`;
      const result = await query(sql);
      return result.rows;
    } else {
      const data = readJsonDb();
      return data.tags;
    }
  },

  createTag: async (tag) => {
    if (isConfigured) {
      const sql = `
        INSERT INTO public.tags (name, slug)
        VALUES ($1, $2)
        RETURNING *
      `;
      const result = await query(sql, [tag.name, tag.slug]);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      const newTag = { ...tag, id: `tag-${Date.now()}` };
      data.tags.push(newTag);
      writeJsonDb(data);
      return newTag;
    }
  },

  deleteTag: async (id) => {
    if (isConfigured) {
      const sql = `DELETE FROM public.tags WHERE id = $1`;
      await query(sql, [id]);
    } else {
      const data = readJsonDb();
      data.tags = data.tags.filter(t => t.id !== id);
      writeJsonDb(data);
    }
  },

  // Opportunities
  getOpportunities: async () => {
    if (isConfigured) {
      try {
        const sql = `SELECT * FROM public.opportunities ORDER BY created_at DESC`;
        const result = await query(sql);
        return result.rows;
      } catch (err) {
        console.warn('Postgres opportunities table not found, using JSON fallback:', err.message);
      }
    }
    const data = readJsonDb();
    return data.opportunities;
  },

  createOpportunity: async (opp) => {
    if (isConfigured) {
      try {
        const sql = `
          INSERT INTO public.opportunities (title, type, "tagClass", deadline, location, description, stipend)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;
        const result = await query(sql, [opp.title, opp.type, opp.tagClass, opp.deadline, opp.location, opp.description, opp.stipend]);
        return result.rows[0];
      } catch (err) {
        console.warn('Postgres create opportunity failed, using JSON fallback:', err.message);
      }
    }
    const data = readJsonDb();
    const newOpp = { ...opp, id: `opp-${Date.now()}`, created_at: new Date().toISOString() };
    data.opportunities.push(newOpp);
    writeJsonDb(data);
    return newOpp;
  },

  updateOpportunity: async (id, dataToUpdate) => {
    if (isConfigured) {
      try {
        const keys = Object.keys(dataToUpdate).filter(k => OPPORTUNITY_COLUMNS.includes(k));
        if (keys.length === 0) return null;
        const setClauses = keys.map((key, idx) => `"${key}" = $${idx + 2}`).join(', ');
        const sql = `
          UPDATE public.opportunities
          SET ${setClauses}
          WHERE id = $1
          RETURNING *
        `;
        const params = [id, ...keys.map(key => dataToUpdate[key])];
        const result = await query(sql, params);
        return result.rows[0];
      } catch (err) {
        console.warn('Postgres update opportunity failed, using JSON fallback:', err.message);
      }
    }
    const data = readJsonDb();
    const index = data.opportunities.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Opportunity not found');
    data.opportunities[index] = { ...data.opportunities[index], ...dataToUpdate };
    writeJsonDb(data);
    return data.opportunities[index];
  },

  deleteOpportunity: async (id) => {
    if (isConfigured) {
      try {
        const sql = `DELETE FROM public.opportunities WHERE id = $1`;
        await query(sql, [id]);
        return;
      } catch (err) {
        console.warn('Postgres delete opportunity failed, using JSON fallback:', err.message);
      }
    }
    const data = readJsonDb();
    data.opportunities = data.opportunities.filter(o => o.id !== id);
    writeJsonDb(data);
  },

  // Subscribers
  getSubscribers: async () => {
    if (isConfigured) {
      const sql = `SELECT * FROM public.newsletter_subscribers ORDER BY created_at DESC`;
      const result = await query(sql);
      return result.rows;
    } else {
      const data = readJsonDb();
      return data.subscribers;
    }
  },

  subscribeNewsletter: async (email) => {
    if (isConfigured) {
      const sql = `
        INSERT INTO public.newsletter_subscribers (email)
        VALUES ($1)
        ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
        RETURNING *
      `;
      const result = await query(sql, [email]);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      const existing = data.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (existing) return existing;
      const newSub = { id: `sub-${Date.now()}`, email, created_at: new Date().toISOString() };
      data.subscribers.push(newSub);
      writeJsonDb(data);
      return newSub;
    }
  },

  deleteSubscriber: async (id) => {
    if (isConfigured) {
      const sql = `DELETE FROM public.newsletter_subscribers WHERE id = $1`;
      await query(sql, [id]);
    } else {
      const data = readJsonDb();
      data.subscribers = data.subscribers.filter(s => s.id !== id);
      writeJsonDb(data);
    }
  },

  // Campaigns
  getCampaigns: async () => {
    const data = readJsonDb();
    return data.campaigns;
  },

  sendNewsletterCampaign: async (subject, content) => {
    const data = readJsonDb();
    const newCamp = {
      id: `camp-${Date.now()}`,
      subject,
      content,
      sent_at: new Date().toISOString(),
      recipients_count: data.subscribers.length
    };
    data.campaigns.push(newCamp);
    writeJsonDb(data);
    return newCamp;
  },

  // Settings
  getSettings: async () => {
    const data = readJsonDb();
    return data.settings;
  },

  updateSettings: async (dataToUpdate) => {
    const data = readJsonDb();
    data.settings = { ...data.settings, ...dataToUpdate };
    writeJsonDb(data);
    return data.settings;
  },

  // Stats
  getStats: async () => {
    const articles = await db.getArticles();
    const categories = await db.getCategories();
    const authors = await db.getAuthors();
    const subs = await db.getSubscribers();

    return {
      totalArticles: articles.length,
      draftArticles: articles.filter(a => a.status === 'draft').length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
      scheduledArticles: articles.filter(a => a.status === 'scheduled').length,
      totalCategories: categories.length,
      totalAuthors: authors.length,
      newsletterSubscribers: subs.length,
      totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0)
    };
  },

  // Profile / RBAC Management
  getUsers: async () => {
    if (isConfigured) {
      const sql = `SELECT * FROM public.profiles ORDER BY created_at DESC`;
      const result = await query(sql);
      return result.rows;
    } else {
      const data = readJsonDb();
      if (!data.profiles) data.profiles = INITIAL_JSON_DB.profiles;
      return data.profiles;
    }
  },

  createUser: async (profile) => {
    if (isConfigured) {
      const sql = `
        INSERT INTO public.profiles (id, email, role, suspended)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const params = [profile.id, profile.email, profile.role || 'writer', profile.suspended || false];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      if (!data.profiles) data.profiles = INITIAL_JSON_DB.profiles;
      const newProfile = {
        id: profile.id || `profile-${Date.now()}`,
        email: profile.email,
        role: profile.role || 'writer',
        suspended: profile.suspended || false,
        created_at: new Date().toISOString()
      };
      data.profiles.push(newProfile);
      writeJsonDb(data);
      return newProfile;
    }
  },

  updateUser: async (id, dataToUpdate) => {
    if (isConfigured) {
      const keys = Object.keys(dataToUpdate).filter(k => PROFILE_COLUMNS.includes(k));
      if (keys.length === 0) return null;
      const setClauses = keys.map((key, idx) => `"${key}" = $${idx + 2}`).join(', ');
      const sql = `
        UPDATE public.profiles
        SET ${setClauses}
        WHERE id = $1
        RETURNING *
      `;
      const params = [id, ...keys.map(key => dataToUpdate[key])];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      if (!data.profiles) data.profiles = INITIAL_JSON_DB.profiles;
      const index = data.profiles.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Profile not found');
      data.profiles[index] = { ...data.profiles[index], ...dataToUpdate };
      writeJsonDb(data);
      return data.profiles[index];
    }
  },

  deleteUser: async (id) => {
    if (isConfigured) {
      const sql = `DELETE FROM public.profiles WHERE id = $1`;
      await query(sql, [id]);
    } else {
      const data = readJsonDb();
      if (!data.profiles) data.profiles = INITIAL_JSON_DB.profiles;
      data.profiles = data.profiles.filter(p => p.id !== id);
      writeJsonDb(data);
    }
  },

  // Publications / Magazine Issues
  getPublications: async () => {
    if (isConfigured) {
      const sql = `SELECT * FROM public.magazine_issues ORDER BY created_at DESC`;
      const result = await query(sql);
      return result.rows;
    } else {
      const data = readJsonDb();
      if (!data.magazine_issues) data.magazine_issues = [];
      return data.magazine_issues;
    }
  },

  createPublication: async (pub) => {
    if (isConfigured) {
      const sql = `
        INSERT INTO public.magazine_issues (title, slug, cover_image, editorial_note, status, featured, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const params = [pub.title, pub.slug, pub.cover_image, pub.editorial_note, pub.status || 'draft', pub.featured || false, pub.published_at || null];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      if (!data.magazine_issues) data.magazine_issues = [];
      const newPub = {
        ...pub,
        id: `pub-${Date.now()}`,
        created_at: new Date().toISOString(),
        published_at: pub.published_at || (pub.status === 'published' ? new Date().toISOString() : null)
      };
      data.magazine_issues.push(newPub);
      writeJsonDb(data);
      return newPub;
    }
  },

  updatePublication: async (id, dataToUpdate) => {
    if (isConfigured) {
      const keys = Object.keys(dataToUpdate).filter(k => MAGAZINE_ISSUE_COLUMNS.includes(k));
      if (keys.length === 0) return null;
      const setClauses = keys.map((key, idx) => `"${key}" = $${idx + 2}`).join(', ');
      const sql = `
        UPDATE public.magazine_issues
        SET ${setClauses}
        WHERE id = $1
        RETURNING *
      `;
      const params = [id, ...keys.map(key => dataToUpdate[key])];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      if (!data.magazine_issues) data.magazine_issues = [];
      const index = data.magazine_issues.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Publication not found');
      data.magazine_issues[index] = { ...data.magazine_issues[index], ...dataToUpdate };
      writeJsonDb(data);
      return data.magazine_issues[index];
    }
  },

  deletePublication: async (id) => {
    if (isConfigured) {
      const sql = `DELETE FROM public.magazine_issues WHERE id = $1`;
      await query(sql, [id]);
    } else {
      const data = readJsonDb();
      if (!data.magazine_issues) data.magazine_issues = [];
      data.magazine_issues = data.magazine_issues.filter(p => p.id !== id);
      writeJsonDb(data);
    }
  },

  // Globe Markers
  getGlobeMarkers: async () => {
    if (isConfigured) {
      const sql = `SELECT * FROM public.globe_markers ORDER BY created_at DESC`;
      const result = await query(sql);
      return result.rows;
    } else {
      const data = readJsonDb();
      if (!data.globe_markers) data.globe_markers = INITIAL_JSON_DB.globe_markers;
      return data.globe_markers;
    }
  },

  createGlobeMarker: async (marker) => {
    if (isConfigured) {
      const sql = `
        INSERT INTO public.globe_markers (name, lat, lng, type, country, headline, active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const params = [marker.name, parseFloat(marker.lat), parseFloat(marker.lng), marker.type, marker.country, marker.headline, marker.active !== false];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      if (!data.globe_markers) data.globe_markers = INITIAL_JSON_DB.globe_markers;
      const newMarker = {
        ...marker,
        lat: parseFloat(marker.lat),
        lng: parseFloat(marker.lng),
        active: marker.active !== false,
        id: `marker-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      data.globe_markers.push(newMarker);
      writeJsonDb(data);
      return newMarker;
    }
  },

  updateGlobeMarker: async (id, dataToUpdate) => {
    const prepared = { ...dataToUpdate };
    if (prepared.lat !== undefined) prepared.lat = parseFloat(prepared.lat);
    if (prepared.lng !== undefined) prepared.lng = parseFloat(prepared.lng);

    if (isConfigured) {
      const keys = Object.keys(prepared).filter(k => GLOBE_MARKER_COLUMNS.includes(k));
      if (keys.length === 0) return null;
      const setClauses = keys.map((key, idx) => `"${key}" = $${idx + 2}`).join(', ');
      const sql = `
        UPDATE public.globe_markers
        SET ${setClauses}
        WHERE id = $1
        RETURNING *
      `;
      const params = [id, ...keys.map(key => prepared[key])];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      if (!data.globe_markers) data.globe_markers = INITIAL_JSON_DB.globe_markers;
      const index = data.globe_markers.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Globe marker not found');
      data.globe_markers[index] = { ...data.globe_markers[index], ...prepared };
      writeJsonDb(data);
      return data.globe_markers[index];
    }
  },

  deleteGlobeMarker: async (id) => {
    if (isConfigured) {
      const sql = `DELETE FROM public.globe_markers WHERE id = $1`;
      await query(sql, [id]);
    } else {
      const data = readJsonDb();
      if (!data.globe_markers) data.globe_markers = INITIAL_JSON_DB.globe_markers;
      data.globe_markers = data.globe_markers.filter(m => m.id !== id);
      writeJsonDb(data);
    }
  },

  // Activity Logs
  getActivityLogs: async () => {
    if (isConfigured) {
      const sql = `SELECT * FROM public.activity_logs ORDER BY created_at DESC LIMIT 500`;
      const result = await query(sql);
      return result.rows;
    } else {
      const data = readJsonDb();
      if (!data.activity_logs) data.activity_logs = [];
      return data.activity_logs;
    }
  },

  createActivityLog: async (log) => {
    if (isConfigured) {
      const sql = `
        INSERT INTO public.activity_logs (user_email, role, action, details, ip_address)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const params = [log.user_email, log.role, log.action, JSON.stringify(log.details || {}), log.ip_address || null];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      if (!data.activity_logs) data.activity_logs = [];
      const newLog = {
        ...log,
        details: log.details || {},
        id: `log-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      data.activity_logs.unshift(newLog);
      if (data.activity_logs.length > 200) {
        data.activity_logs = data.activity_logs.slice(0, 200);
      }
      writeJsonDb(data);
      return newLog;
    }
  },

  // Homepage Layout Config
  getHomepageLayout: async () => {
    if (isConfigured) {
      const sql = `SELECT * FROM public.homepage_layout WHERE id = 'sections' LIMIT 1`;
      const result = await query(sql);
      return result.rows[0] ? { id: result.rows[0].id, config: result.rows[0].config } : null;
    } else {
      const data = readJsonDb();
      if (!data.homepage_layout) data.homepage_layout = INITIAL_JSON_DB.homepage_layout;
      let found = data.homepage_layout.find(l => l.id === 'sections');
      if (!found) {
        found = INITIAL_JSON_DB.homepage_layout[0];
        data.homepage_layout.push(found);
        writeJsonDb(data);
      }
      return found;
    }
  },

  updateHomepageLayout: async (dataToUpdate) => {
    const configData = dataToUpdate.config || dataToUpdate;
    if (isConfigured) {
      const sql = `
        INSERT INTO public.homepage_layout (id, config, updated_at)
        VALUES ('sections', $1, now())
        ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config, updated_at = now()
        RETURNING *
      `;
      const params = [JSON.stringify(configData)];
      const result = await query(sql, params);
      return result.rows[0];
    } else {
      const data = readJsonDb();
      if (!data.homepage_layout) data.homepage_layout = INITIAL_JSON_DB.homepage_layout;
      let index = data.homepage_layout.findIndex(l => l.id === 'sections');
      const updated = {
        id: 'sections',
        config: configData,
        updated_at: new Date().toISOString()
      };
      if (index === -1) {
        data.homepage_layout.push(updated);
      } else {
        data.homepage_layout[index] = updated;
      }
      writeJsonDb(data);
      return updated;
    }
  }
};

module.exports = db;
