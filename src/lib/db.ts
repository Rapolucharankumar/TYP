import { createClient } from '@supabase/supabase-js';
import { Article, Author, Category, Tag, NewsletterSubscriber, DashboardStats, Campaign, SiteSettings, Opportunity, Profile, MagazineIssue, GlobeMarker, ActivityLog, HomepageLayout } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// MOCK DATA FOR LOCAL STORAGE FALLBACK
// ==========================================

const DEFAULT_AUTHORS: Author[] = [
  {
    id: "auth-aria",
    name: "Aria Sterling",
    bio: "Senior Correspondent and Geopolitical Lead at TYP. Former fellow at the Center for Global Governance, specializing in algorithmic sovereignty, AI policy, and international trade tech dynamics.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    role: "Geopolitical Lead",
    country: "United States",
    expertise: ["Algorithmic Sovereignty", "Transatlantic Trade", "AI Governance"],
    social_links: { twitter: "ariasterling", linkedin: "aria-sterling", role: "Geopolitical Lead" }
  },
  {
    id: "auth-kabir",
    name: "Kabir Mehta",
    bio: "Policy Desk Lead. Focuses on tech legislation, Indo-Pacific diplomacy, and sovereign data governance systems across South Asia.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    role: "Policy Lead",
    country: "India",
    expertise: ["Data Sovereignty", "Indo-Pacific Security", "Tech Diplomacy"],
    social_links: { twitter: "kabirmehta", linkedin: "kabir-mehta", role: "Policy Lead" }
  },
  {
    id: "auth-clara",
    name: "Dr. Clara Vance",
    bio: "Healthcare Equity Lead. Physician-scientist and researcher investigating post-colonial medical structures, IP waivers, and drug supply chain decentralization.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
    role: "Healthcare Equity Lead",
    country: "Canada",
    expertise: ["Post-Colonial Health", "Vaccine Patents", "Biomanufacturing"],
    social_links: { twitter: "claravance", linkedin: "clara-vance", role: "Healthcare Equity Lead" }
  },
  {
    id: "auth-meilin",
    name: "Mei Lin",
    bio: "Senior Technology Analyst. Focuses on semiconductor logistics, quantum network infrastructure, and global silicon supply chain dynamics.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300",
    role: "Senior Correspondent",
    country: "China",
    expertise: ["Semiconductor Logistics", "Quantum Networks", "Silicon Geopolitics"],
    social_links: { twitter: "meilin", linkedin: "mei-lin", role: "Senior Correspondent" }
  }
];

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-tech",
    name: "Technology",
    slug: "technology",
    description: "Deconstructing autonomous infrastructure, microchips supply lines, computing grids, and artificial intelligence regulations."
  },
  {
    id: "cat-policy",
    name: "Policy",
    slug: "policy",
    description: "Analyzing the legislative framework, legal governance, and regulatory standards shaping sovereign digital states."
  },
  {
    id: "cat-healthcare",
    name: "Healthcare",
    slug: "healthcare",
    description: "Investigating health sovereignty, clinical equity, pharmaceutical global monopolies, and pandemic architectures."
  },
  {
    id: "cat-global",
    name: "Global Affairs",
    slug: "global-affairs",
    description: "Examining international border disputes, diplomatic alliances, resource conflicts, and changing geopolitical treaties."
  }
];

const DEFAULT_TAGS: Tag[] = [
  { id: "tag-ai", name: "AI Regulation", slug: "ai-regulation" },
  { id: "tag-climate", name: "Climate Justice", slug: "climate-justice" },
  { id: "tag-geopolitics", name: "Geopolitics", slug: "geopolitics" },
  { id: "tag-health", name: "Health Equity", slug: "health-equity" },
  { id: "tag-labor", name: "Labor Rights", slug: "labor-rights" }
];

const DEFAULT_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "Algorithmic Sovereignty & the New Geopolitics of AI Regulation",
    slug: "algorithmic-sovereignty",
    excerpt: "Sovereign digital structures are emerging as the new boundaries of global authority. We examine how the transatlantic divide on AI risk models is shifting alliances.",
    content: `## The Emergence of the Sovereign Stack

For decades, the internet functioned under a relatively unified protocol stack, governed by consensus-based bodies mostly anchored in Western institutions. Today, that structure is fragmenting. The concept of **algorithmic sovereignty** has moved from academic margins to the center of foreign policy desks in Brussels, Washington, and Beijing.

The global competition is no longer restricted to physical territory or sea lanes; it is being negotiated in the deep weights of foundational transformer models and the compute clusters that train them. As governments realize that whoever controls the training parameters controls the information layout, we see the rise of digital borders.

### The Transatlantic Regulatory Divide

While the European Union's AI Act focuses on a tiered risk model that targets application deployment, the United States continues to rely on executive orders and industry self-regulation, prioritizing model capability and silicon trade embargoes. This divergence leaves developing nations in an asymmetric bind: either import models with embedded value systems or attempt to build national computing grids from scratch.

> "Power is no longer just negotiated in parliaments or battlefield trenches; it is written into the foundational algorithms of our global platforms." — Aria Sterling

### Compute as Geopolitics

The silicon supply chain represents the ultimate choke point. A single fab in Hsinchu produces over 90% of the world's advanced logic microchips. As semiconductor exports are restricted under national security doctrines, the ability to train next-generation models becomes an exclusive club of superpower states. For the rest of the world, sovereignty is increasingly digital clientelism.`,
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    featured: true,
    author_id: "auth-aria",
    category_id: "cat-tech",
    published_at: "2026-06-01T12:00:00.000Z",
    created_at: "2026-06-01T12:00:00.000Z",
    views: 4320
  },
  {
    id: "art-2",
    title: "Redefining the Indo-Pacific Strategy for a Multipolitical World",
    slug: "indo-pacific-strategy",
    excerpt: "As trade alliances realign across the Malacca Strait, mid-level regional powers are forging mini-lateral security treaties to maintain supply resilience.",
    content: `## Beyond Bilateralism in the Malacca Strait

The Indo-Pacific is no longer defined by a simple, bipolar balancing act. Rather, regional states are creating a network of **mini-lateral arrangements** designed to buffer against supply shocks and maritime disruptions.

### Supply Chains as Shielding

Countries like India, Japan, and Australia have initiated the Supply Chain Resilience Initiative (SCRI). This moves manufacturing hubs away from single-source concentration. By distributing hardware assembly across Southeast Asian nodes, regional actors reduce vulnerability to economic coercion.

### Mini-Lateral Dynamics

From Quad taskforces to localized maritime cooperation agreements, nations are prioritizing flexible alliances over rigid treaties. This allows smaller sovereign states to exercise strategic autonomy, positioning themselves as critical gatekeepers of global trade networks.`,
    cover_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    featured: false,
    author_id: "auth-kabir",
    category_id: "cat-global",
    published_at: "2026-06-03T10:00:00.000Z",
    created_at: "2026-06-03T10:00:00.000Z",
    views: 3120
  },
  {
    id: "art-3",
    title: "Democratizing Vaccines: Intellectual Property vs Health Equity",
    slug: "vaccine-intellectual-property",
    excerpt: "Deconstructing how post-pandemic patent regimes and global WTO manufacturing rules restrict vaccine distribution in low-income sovereign areas.",
    content: `## The Patent Monopoly and Global Access

Global healthcare continues to suffer from structural inequality. The concentration of vaccine production licenses in a few northern hemisphere hubs has created severe distribution disparities.

### The TRIPS Waiver Debate

Under WTO rules, intellectual property protection on clinical assets blocks generic manufacturers in India and South Africa from scaling up distribution. Waiving these patents during health emergencies is not just a commercial dispute; it is a life-or-death structural policy.

### Decentralized Biomanufacturing

To achieve true health security, developing regions are establishing independent mRNA vaccine manufacturing consortia. By scaling local bioreactors and training local scientists, they bypass the dependency loops of multinational supply chains.`,
    cover_image: "https://images.unsplash.com/photo-1584037013000-607b38398934?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    featured: false,
    author_id: "auth-clara",
    category_id: "cat-healthcare",
    published_at: "2026-06-05T08:00:00.000Z",
    created_at: "2026-06-05T08:00:00.000Z",
    views: 2650
  },
  {
    id: "art-4",
    title: "Silicon Cartography: The Quantum Semiconductor Supply Chain",
    slug: "silicon-cartography",
    excerpt: "An in-depth look at ASML lithography, TSMC production grids, and the geopolitical battle to secure the raw components of advanced computation.",
    content: `## The Silicon Choke Points

Modern computation relies on highly concentrated points of manufacturing. The equipment required to print sub-3nm transistors is produced by a single company in Veldhoven, Netherlands, using components from dozens of specialized global suppliers.

### High-NA EUV Lithography

Extreme Ultraviolet (EUV) systems represent the pinnacle of precise optics. Without them, fabrication plants cannot build high-density processor nodes. The export control of these systems is a core geopolitical tool in tech-bloc containment strategies.

### Sovereign Fabs and Domestic Subsidies

Both the US and EU have passed legislative subsidy packages to attract domestic manufacturing fabs. However, training the specialized labor and establishing chemical refinement networks takes years, keeping global supply chains highly interdependent.`,
    cover_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    featured: false,
    author_id: "auth-meilin",
    category_id: "cat-tech",
    published_at: "2026-06-06T14:00:00.000Z",
    created_at: "2026-06-06T14:00:00.000Z",
    views: 2180
  },
  {
    id: "art-5",
    title: "Algorithmic Despotism: Gig Work in the Age of Automation",
    slug: "gig-economy-automation",
    excerpt: "How delivery platforms and taxi applications utilize gamified algorithms to control workforce behaviors, bypassing labor unions and wage laws.",
    content: `## The Algorithmic Manager

Labor organization is facing a new kind of threat. Platforms do not use human managers to allocate work or discipline drivers; they use proprietary dispatch code.

### Gamified Coercion

By offering volatile multiplier bonuses and tracking cancellation rates, platform algorithms nudge workers into longer shifts and unsafe driving practices. Workers are isolated, lacking physical offices or colleagues to share grievances with.

### Legal Status Reforms

Courts across Europe and California are challenging the 'independent contractor' designation of gig workers. Classifying workers as employees forces companies to guarantee minimum wages, health coverage, and collective bargaining rights.`,
    cover_image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    featured: false,
    author_id: "auth-kabir",
    category_id: "cat-policy",
    published_at: "2026-06-08T09:00:00.000Z",
    created_at: "2026-06-08T09:00:00.000Z",
    views: 1450
  }
];

const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [];

const DEFAULT_CAMPAIGNS: Campaign[] = [];

const DEFAULT_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Global Geopolitics Research Fellowship 2026",
    type: "Fellowships",
    tagClass: "tag-teal",
    deadline: "2026-07-15",
    location: "Geneva, Switzerland / Remote",
    description: "A 6-month residency program for researchers investigating emerging digital borders, maritime trade choke points, and global silicon logistics. Stipend included.",
    stipend: "$4,500 / month"
  },
  {
    id: "opp-2",
    title: "Annual Emerging Technologies Essay Prize",
    type: "Competitions",
    tagClass: "tag-butter",
    deadline: "2026-08-01",
    location: "Global Entry",
    description: "Submit a policy essay on structural AI governance, chip supply chain resilience, or quantum network security. Winning essay published in the winter issue.",
    stipend: "$2,500 Prize"
  },
  {
    id: "opp-3",
    title: "Post-Colonial Health Policy Grant",
    type: "Research Programs",
    tagClass: "tag-lav",
    deadline: "2026-07-30",
    location: "Remote / Field-work",
    description: "Grants supporting fieldwork on drug patent distribution barriers and local vaccine manufacturing efforts in low-to-mid income sovereign states.",
    stipend: "$6,000 Grant"
  },
  {
    id: "opp-4",
    title: "Sovereign Tech Law & Policy Internship",
    type: "Internships",
    tagClass: "tag-sand",
    deadline: "2026-06-25",
    location: "Brussels, Belgium",
    description: "Work with our legislative tracking team analyzing digital services regulation, data sovereignty, and algorithmic auditing frameworks in the EU.",
    stipend: "Paid position"
  }
];

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'The Youth Prism',
  logo: 'The Youth Prism',
  favicon: '/favicon.ico',
  metaTitleDefault: 'The Youth Prism | Premium Youth Editorial',
  metaDescriptionDefault: 'The Youth Prism explores technology, policy, healthcare, global affairs, and current affairs through the lens of youth.',
  openGraphImage: '',
  linkedin: '',
  instagram: '',
  twitter: '',
  youtube: '',
  writersCount: '',
  countriesCount: '',
  partnershipsCount: '',
  readersCount: '',
  papersCount: '',
  sectorsCount: ''
};

// ==========================================
// LOCAL STORAGE DATABASE STATE (CLIENT SIDE SAFE)
// ==========================================

class LocalDB {
  private getStorageItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(`typ_${key}`);
    if (!item) {
      localStorage.setItem(`typ_${key}`, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  }

  private setStorageItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`typ_${key}`, JSON.stringify(value));
  }

  getAuthors(): Author[] {
    const authors = this.getStorageItem('authors', DEFAULT_AUTHORS);
    return authors.map(a => {
      const role = a.role || a.social_links?.role || 'Contributor';
      return {
        ...a,
        role,
        social_links: {
          ...a.social_links,
          role
        }
      };
    });
  }

  getAuthorById(id: string): Author | undefined {
    return this.getAuthors().find(a => a.id === id);
  }

  createAuthor(author: Omit<Author, 'id'>): Author {
    const authors = this.getAuthors();
    const role = author.role || author.social_links?.role || 'Contributor';
    const newAuthor: Author = {
      ...author,
      role,
      social_links: {
        ...author.social_links,
        role
      },
      id: `author-${Date.now()}`
    };
    authors.push(newAuthor);
    this.setStorageItem('authors', authors);
    return newAuthor;
  }

  updateAuthor(id: string, data: Partial<Author>): Author {
    const authors = this.getAuthors();
    const index = authors.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Author not found');
    
    const role = data.role !== undefined ? data.role : (data.social_links?.role !== undefined ? data.social_links.role : (authors[index].role || authors[index].social_links?.role || 'Contributor'));
    
    authors[index] = { 
      ...authors[index], 
      ...data,
      role,
      social_links: {
        ...authors[index].social_links,
        ...data.social_links,
        role
      }
    };
    this.setStorageItem('authors', authors);
    return authors[index];
  }

  deleteAuthor(id: string): void {
    let authors = this.getAuthors();
    authors = authors.filter(a => a.id !== id);
    this.setStorageItem('authors', authors);
  }

  getCategories(): Category[] {
    return this.getStorageItem('categories', DEFAULT_CATEGORIES);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.getCategories().find(c => c.slug === slug);
  }

  createCategory(category: Omit<Category, 'id'>): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`
    };
    categories.push(newCategory);
    this.setStorageItem('categories', categories);
    return newCategory;
  }

  updateCategory(id: string, data: Partial<Category>): Category {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    categories[index] = { ...categories[index], ...data };
    this.setStorageItem('categories', categories);
    return categories[index];
  }

  deleteCategory(id: string): void {
    let categories = this.getCategories();
    categories = categories.filter(c => c.id !== id);
    this.setStorageItem('categories', categories);
  }

  getTags(): Tag[] {
    return this.getStorageItem('tags', DEFAULT_TAGS);
  }

  createTag(tag: Omit<Tag, 'id'>): Tag {
    const tags = this.getTags();
    const newTag: Tag = {
      ...tag,
      id: `tag-${Date.now()}`
    };
    tags.push(newTag);
    this.setStorageItem('tags', tags);
    return newTag;
  }

  deleteTag(id: string): void {
    let tags = this.getTags();
    tags = tags.filter(t => t.id !== id);
    this.setStorageItem('tags', tags);
  }

  getArticles(): Article[] {
    const articles = this.getStorageItem('articles', DEFAULT_ARTICLES);
    const authors = this.getAuthors();
    const categories = this.getCategories();
    const tags = this.getTags();

    const defaultViewsMap: { [key: string]: number } = {
      'art-1': 4320,
      'art-2': 3120,
      'art-3': 2650,
      'art-4': 2180,
      'art-5': 1450,
      'art-6': 1100,
      'art-7': 0
    };

    // Populate joined relations
    return articles.map(article => {
      const author = authors.find(a => a.id === article.author_id);
      const category = categories.find(c => c.id === article.category_id);
      
      // Simple static mock tag assignment for the demo database
      let articleTags: Tag[] = [];
      if (article.id === 'art-1') articleTags = [tags[0]]; // AI
      else if (article.id === 'art-2') articleTags = [tags[2]]; // Geopolitics
      else if (article.id === 'art-3') articleTags = [tags[3]]; // Health Equity
      else if (article.id === 'art-4') articleTags = [tags[1]]; // Climate Justice
      else if (article.id === 'art-5') articleTags = [tags[4]]; // Labor Rights
      else if (article.id === 'art-6') articleTags = [tags[3]]; // Health Equity

      return {
        ...article,
        views: article.views !== undefined ? article.views : (defaultViewsMap[article.id] || 0),
        author,
        category,
        tags: articleTags
      };
    });
  }

  getArticleBySlug(slug: string): Article | undefined {
    return this.getArticles().find(a => a.slug === slug);
  }

  createArticle(article: Omit<Article, 'id' | 'created_at'>): Article {
    const articles = this.getStorageItem('articles', DEFAULT_ARTICLES);
    const newArticle: Article = {
      ...article,
      id: `art-${Date.now()}`,
      created_at: new Date().toISOString(),
      published_at: article.status === 'published' ? new Date().toISOString() : null,
      views: 0
    };
    articles.push(newArticle);
    this.setStorageItem('articles', articles);
    return newArticle;
  }

  updateArticle(id: string, data: Partial<Article>): Article {
    const articles = this.getStorageItem('articles', DEFAULT_ARTICLES);
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Article not found');
    
    let published_at = articles[index].published_at;
    if (data.status === 'published' && articles[index].status !== 'published') {
      published_at = new Date().toISOString();
    } else if (data.status === 'draft') {
      published_at = null;
    }

    articles[index] = { 
      ...articles[index], 
      ...data,
      published_at: data.published_at !== undefined ? data.published_at : published_at
    };
    this.setStorageItem('articles', articles);
    return articles[index];
  }

  deleteArticle(id: string): void {
    let articles = this.getStorageItem('articles', DEFAULT_ARTICLES);
    articles = articles.filter(a => a.id !== id);
    this.setStorageItem('articles', articles);
  }

  incrementArticleViews(id: string): void {
    const articles = this.getStorageItem('articles', DEFAULT_ARTICLES);
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index].views = (articles[index].views || 0) + 1;
      this.setStorageItem('articles', articles);
    }
  }

  getSubscribers(): NewsletterSubscriber[] {
    return this.getStorageItem('subscribers', DEFAULT_SUBSCRIBERS);
  }

  subscribeNewsletter(email: string): NewsletterSubscriber {
    const subs = this.getSubscribers();
    const existing = subs.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      created_at: new Date().toISOString()
    };
    subs.push(newSub);
    this.setStorageItem('subscribers', subs);
    return newSub;
  }

  deleteSubscriber(id: string): void {
    let subs = this.getSubscribers();
    subs = subs.filter(s => s.id !== id);
    this.setStorageItem('subscribers', subs);
  }

  getCampaigns(): Campaign[] {
    return this.getStorageItem('campaigns', DEFAULT_CAMPAIGNS);
  }

  sendNewsletterCampaign(subject: string, content: string): Campaign {
    const campaigns = this.getCampaigns();
    const subs = this.getSubscribers();
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      subject,
      content,
      sent_at: new Date().toISOString(),
      recipients_count: subs.length
    };
    campaigns.push(newCamp);
    this.setStorageItem('campaigns', campaigns);
    return newCamp;
  }

  getSettings(): SiteSettings {
    return this.getStorageItem('settings', DEFAULT_SETTINGS);
  }

  updateSettings(data: Partial<SiteSettings>): SiteSettings {
    const settings = this.getSettings();
    const updated = { ...settings, ...data };
    this.setStorageItem('settings', updated);
    return updated;
  }

  getStats(): DashboardStats {
    const articles = this.getArticles();
    const categories = this.getCategories();
    const authors = this.getAuthors();
    const subs = this.getSubscribers();

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
  }

  getOpportunities(): Opportunity[] {
    return this.getStorageItem('opportunities', DEFAULT_OPPORTUNITIES);
  }

  createOpportunity(opp: Omit<Opportunity, 'id'>): Opportunity {
    const opps = this.getOpportunities();
    const newOpp: Opportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    opps.push(newOpp);
    this.setStorageItem('opportunities', opps);
    return newOpp;
  }

  updateOpportunity(id: string, data: Partial<Opportunity>): Opportunity {
    const opps = this.getOpportunities();
    const index = opps.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Opportunity not found');
    opps[index] = { ...opps[index], ...data };
    this.setStorageItem('opportunities', opps);
    return opps[index];
  }

  deleteOpportunity(id: string): void {
    let opps = this.getOpportunities();
    opps = opps.filter(o => o.id !== id);
    this.setStorageItem('opportunities', opps);
  }

  getUsers(): Profile[] {
    const defaultProfiles: Profile[] = [
      { id: 'mock-admin-id', email: 'admin@youthprism.com', role: 'super_admin', suspended: false, created_at: new Date().toISOString() },
      { id: 'mock-writer-id', email: 'writer@youthprism.com', role: 'writer', suspended: false, created_at: new Date().toISOString() }
    ];
    return this.getStorageItem('profiles', defaultProfiles);
  }

  createUser(profile: Omit<Profile, 'id' | 'created_at'> & { id?: string }): Profile {
    const users = this.getUsers();
    const newProfile: Profile = {
      id: profile.id || `profile-${Date.now()}`,
      email: profile.email,
      role: profile.role || 'writer',
      suspended: profile.suspended || false,
      created_at: new Date().toISOString()
    };
    users.push(newProfile);
    this.setStorageItem('profiles', users);
    return newProfile;
  }

  updateUser(id: string, data: Partial<Profile>): Profile {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Profile not found');
    users[index] = { ...users[index], ...data };
    this.setStorageItem('profiles', users);
    return users[index];
  }

  deleteUser(id: string): void {
    let users = this.getUsers();
    users = users.filter(u => u.id !== id);
    this.setStorageItem('profiles', users);
  }

  getPublications(): MagazineIssue[] {
    return this.getStorageItem('magazine_issues', []);
  }

  createPublication(pub: Omit<MagazineIssue, 'id' | 'created_at'>): MagazineIssue {
    const issues = this.getPublications();
    const newPub: MagazineIssue = {
      ...pub,
      id: `pub-${Date.now()}`,
      created_at: new Date().toISOString(),
      published_at: pub.published_at || (pub.status === 'published' ? new Date().toISOString() : null)
    };
    issues.push(newPub);
    this.setStorageItem('magazine_issues', issues);
    return newPub;
  }

  updatePublication(id: string, data: Partial<MagazineIssue>): MagazineIssue {
    const issues = this.getPublications();
    const index = issues.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Publication not found');
    issues[index] = { ...issues[index], ...data };
    this.setStorageItem('magazine_issues', issues);
    return issues[index];
  }

  deletePublication(id: string): void {
    let issues = this.getPublications();
    issues = issues.filter(p => p.id !== id);
    this.setStorageItem('magazine_issues', issues);
  }

  getGlobeMarkers(): GlobeMarker[] {
    const defaultMarkers: GlobeMarker[] = [
      { id: 'marker-1', name: 'Geneva', lat: 46.2044, lng: 6.1432, type: 'research', country: 'Switzerland', headline: 'Global Geopolitics Fellowship 2026 launched.', active: true },
      { id: 'marker-2', name: 'New Delhi', lat: 28.6139, lng: 77.2090, type: 'writer', country: 'India', headline: 'Sovereign data governance systems reports.', active: true }
    ];
    return this.getStorageItem('globe_markers', defaultMarkers);
  }

  createGlobeMarker(marker: Omit<GlobeMarker, 'id'>): GlobeMarker {
    const markers = this.getGlobeMarkers();
    const newMarker: GlobeMarker = {
      ...marker,
      id: `marker-${Date.now()}`
    };
    markers.push(newMarker);
    this.setStorageItem('globe_markers', markers);
    return newMarker;
  }

  updateGlobeMarker(id: string, data: Partial<GlobeMarker>): GlobeMarker {
    const markers = this.getGlobeMarkers();
    const index = markers.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Globe marker not found');
    markers[index] = { ...markers[index], ...data };
    this.setStorageItem('globe_markers', markers);
    return markers[index];
  }

  deleteGlobeMarker(id: string): void {
    let markers = this.getGlobeMarkers();
    markers = markers.filter(m => m.id !== id);
    this.setStorageItem('globe_markers', markers);
  }

  getActivityLogs(): ActivityLog[] {
    return this.getStorageItem('activity_logs', []);
  }

  createActivityLog(log: Omit<ActivityLog, 'id' | 'created_at'>): ActivityLog {
    const logs = this.getActivityLogs();
    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    logs.unshift(newLog);
    if (logs.length > 200) {
      logs.splice(200);
    }
    this.setStorageItem('activity_logs', logs);
    return newLog;
  }

  getHomepageLayout(): HomepageLayout {
    const defaultLayout: HomepageLayout = {
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
    };
    return this.getStorageItem('homepage_layout_sections', defaultLayout);
  }

  updateHomepageLayout(data: { config: { order: string[]; visible: Record<string, boolean> } }): HomepageLayout {
    const updated: HomepageLayout = {
      id: 'sections',
      config: data.config || data,
      updated_at: new Date().toISOString()
    };
    this.setStorageItem('homepage_layout_sections', updated);
    return updated;
  }
}

export const localDB = new LocalDB();

// ==========================================
// UNIFIED DB ROUTER INTERFACE
// ==========================================

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

async function fetchFromBackend<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BACKEND_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout for cold starts

  // Retrieve Authorization Header JWT if active
  let authHeader = '';
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        authHeader = `Bearer ${data.session.access_token}`;
      }
    } catch (err) {
      console.warn('Failed to retrieve active session token:', err);
    }
  } else {
    // Local mock login session
    const mockSession = typeof window !== 'undefined' ? localStorage.getItem('typ_admin_session') : null;
    if (mockSession) {
      try {
        const user = JSON.parse(mockSession);
        authHeader = `Bearer mock-admin-token-${user.id}`;
      } catch {}
    }
  }

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
        ...options?.headers,
      },
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        try {
          const body = await response.json();
          if (body && (body.error === 'Article not found' || body.error === 'Category not found' || body.error === 'Opportunity not found')) {
            return undefined as unknown as T;
          }
        } catch {
          // ignore non-JSON or missing error fields
        }
      }
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }
    
    return response.json() as Promise<T>;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Caching helper to write safely to localStorage
const cacheEntity = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`typ_${key}`, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to cache ${key} to localStorage:`, err);
  }
};

// Extractor helper to update related entity caches (authors and categories) when articles are fetched
const cacheArticlesAndRelations = (articles: Article[]) => {
  if (typeof window === 'undefined') return;
  cacheEntity('articles', articles);
  
  // Extract and merge authors
  try {
    const existingAuthorsStr = localStorage.getItem('typ_authors');
    const authorsMap = new Map<string, Author>();
    if (existingAuthorsStr) {
      const existingAuthors = JSON.parse(existingAuthorsStr) as Author[];
      existingAuthors.forEach(a => authorsMap.set(a.id, a));
    }
    articles.forEach(art => {
      if (art.author) {
        authorsMap.set(art.author.id, art.author);
      }
    });
    localStorage.setItem('typ_authors', JSON.stringify(Array.from(authorsMap.values())));
  } catch (e) {
    console.warn('Failed to cache extracted authors:', e);
  }

  // Extract and merge categories
  try {
    const existingCatsStr = localStorage.getItem('typ_categories');
    const categoriesMap = new Map<string, Category>();
    if (existingCatsStr) {
      const existingCats = JSON.parse(existingCatsStr) as Category[];
      existingCats.forEach(c => categoriesMap.set(c.id, c));
    }
    articles.forEach(art => {
      if (art.category) {
        categoriesMap.set(art.category.id, art.category);
      }
    });
    localStorage.setItem('typ_categories', JSON.stringify(Array.from(categoriesMap.values())));
  } catch (e) {
    console.warn('Failed to cache extracted categories:', e);
  }
};

const isDynamicServerError = (err: any): boolean => {
  if (!err) return false;
  if (typeof err === 'object') {
    if (err.digest === 'DYNAMIC_SERVER_USAGE') return true;
    if (err.message && (err.message.includes('DYNAMIC_SERVER_USAGE') || err.message.includes('Dynamic server usage') || err.message.includes('dynamic-server-error'))) return true;
  }
  return false;
};

const handleQueryError = <T>(err: any, warnMsg: string, fallbackFn: () => T): T => {
  if (isDynamicServerError(err)) {
    throw err;
  }
  console.warn(warnMsg, err);
  return fallbackFn();
};

export const db = {
  // Articles
  getArticles: async (): Promise<Article[]> => {
    try {
      const articles = await fetchFromBackend<Article[]>('/api/articles');
      cacheArticlesAndRelations(articles);
      return articles;
    } catch (err) {
      return handleQueryError(err, 'Backend getArticles failed, falling back to local storage:', () => localDB.getArticles());
    }
  },

  getArticleBySlug: async (slug: string): Promise<Article | undefined> => {
    try {
      const article = await fetchFromBackend<Article | undefined>(`/api/articles/${slug}`);
      if (article) {
        if (typeof window !== 'undefined') {
          try {
            const existing = localStorage.getItem('typ_articles');
            let articles: Article[] = existing ? JSON.parse(existing) : [];
            const idx = articles.findIndex(a => a.id === article.id || a.slug === article.slug);
            if (idx !== -1) {
              articles[idx] = article;
            } else {
              articles.push(article);
            }
            cacheArticlesAndRelations(articles);
          } catch {}
        }
      }
      return article;
    } catch (err) {
      return handleQueryError(err, `Backend getArticleBySlug(${slug}) failed, falling back to local storage:`, () => localDB.getArticleBySlug(slug));
    }
  },

  createArticle: async (article: Omit<Article, 'id' | 'created_at'>): Promise<Article> => {
    try {
      return await fetchFromBackend<Article>('/api/articles', {
        method: 'POST',
        body: JSON.stringify(article),
      });
    } catch (err) {
      console.warn('Backend createArticle failed, falling back to local storage:', err);
      return localDB.createArticle(article);
    }
  },

  updateArticle: async (id: string, data: Partial<Article>): Promise<Article> => {
    try {
      return await fetchFromBackend<Article>(`/api/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn(`Backend updateArticle(${id}) failed, falling back to local storage:`, err);
      return localDB.updateArticle(id, data);
    }
  },

  deleteArticle: async (id: string): Promise<void> => {
    try {
      await fetchFromBackend<void>(`/api/articles/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn(`Backend deleteArticle(${id}) failed, falling back to local storage:`, err);
      localDB.deleteArticle(id);
    }
  },

  incrementArticleViews: async (id: string): Promise<void> => {
    try {
      await fetchFromBackend<void>(`/api/articles/${id}/view`, {
        method: 'POST',
      });
    } catch (err) {
      console.warn(`Backend incrementArticleViews(${id}) failed, falling back to local storage:`, err);
      localDB.incrementArticleViews(id);
    }
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const categories = await fetchFromBackend<Category[]>('/api/categories');
      cacheEntity('categories', categories);
      return categories;
    } catch (err) {
      return handleQueryError(err, 'Backend getCategories failed, falling back to local storage:', () => localDB.getCategories());
    }
  },

  getCategoryBySlug: async (slug: string): Promise<Category | undefined> => {
    try {
      return await fetchFromBackend<Category | undefined>(`/api/categories/${slug}`);
    } catch (err) {
      return handleQueryError(err, `Backend getCategoryBySlug(${slug}) failed, falling back to local storage:`, () => localDB.getCategoryBySlug(slug));
    }
  },

  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      return await fetchFromBackend<Category>('/api/categories', {
        method: 'POST',
        body: JSON.stringify(category),
      });
    } catch (err) {
      console.warn('Backend createCategory failed, falling back to local storage:', err);
      return localDB.createCategory(category);
    }
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    try {
      return await fetchFromBackend<Category>(`/api/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn(`Backend updateCategory(${id}) failed, falling back to local storage:`, err);
      return localDB.updateCategory(id, data);
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await fetchFromBackend<void>(`/api/categories/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn(`Backend deleteCategory(${id}) failed, falling back to local storage:`, err);
      localDB.deleteCategory(id);
    }
  },

  // Tags
  getTags: async (): Promise<Tag[]> => {
    try {
      const tags = await fetchFromBackend<Tag[]>('/api/tags');
      cacheEntity('tags', tags);
      return tags;
    } catch (err) {
      return handleQueryError(err, 'Backend getTags failed, falling back to local storage:', () => localDB.getTags());
    }
  },

  createTag: async (tag: Omit<Tag, 'id'>): Promise<Tag> => {
    try {
      return await fetchFromBackend<Tag>('/api/tags', {
        method: 'POST',
        body: JSON.stringify(tag),
      });
    } catch (err) {
      console.warn('Backend createTag failed, falling back to local storage:', err);
      return localDB.createTag(tag);
    }
  },

  deleteTag: async (id: string): Promise<void> => {
    try {
      await fetchFromBackend<void>(`/api/tags/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn(`Backend deleteTag(${id}) failed, falling back to local storage:`, err);
      localDB.deleteTag(id);
    }
  },

  // Authors
  getAuthors: async (): Promise<Author[]> => {
    try {
      const authors = await fetchFromBackend<Author[]>('/api/authors');
      cacheEntity('authors', authors);
      return authors;
    } catch (err) {
      return handleQueryError(err, 'Backend getAuthors failed, falling back to local storage:', () => localDB.getAuthors());
    }
  },

  createAuthor: async (author: Omit<Author, 'id'>): Promise<Author> => {
    try {
      return await fetchFromBackend<Author>('/api/authors', {
        method: 'POST',
        body: JSON.stringify(author),
      });
    } catch (err) {
      console.warn('Backend createAuthor failed, falling back to local storage:', err);
      return localDB.createAuthor(author);
    }
  },

  updateAuthor: async (id: string, data: Partial<Author>): Promise<Author> => {
    try {
      return await fetchFromBackend<Author>(`/api/authors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn(`Backend updateAuthor(${id}) failed, falling back to local storage:`, err);
      return localDB.updateAuthor(id, data);
    }
  },

  deleteAuthor: async (id: string): Promise<void> => {
    try {
      await fetchFromBackend<void>(`/api/authors/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn(`Backend deleteAuthor(${id}) failed, falling back to local storage:`, err);
      localDB.deleteAuthor(id);
    }
  },

  // Newsletter Subscribers
  getSubscribers: async (): Promise<NewsletterSubscriber[]> => {
    try {
      return await fetchFromBackend<NewsletterSubscriber[]>('/api/subscribers');
    } catch (err) {
      return handleQueryError(err, 'Backend getSubscribers failed, falling back to local storage:', () => localDB.getSubscribers());
    }
  },

  subscribeNewsletter: async (email: string): Promise<NewsletterSubscriber> => {
    try {
      return await fetchFromBackend<NewsletterSubscriber>('/api/subscribers', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      console.warn('Backend subscribeNewsletter failed, falling back to local storage:', err);
      return localDB.subscribeNewsletter(email);
    }
  },

  deleteSubscriber: async (id: string): Promise<void> => {
    try {
      await fetchFromBackend<void>(`/api/subscribers/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn(`Backend deleteSubscriber(${id}) failed, falling back to local storage:`, err);
      localDB.deleteSubscriber(id);
    }
  },

  // Campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      return await fetchFromBackend<Campaign[]>('/api/campaigns');
    } catch (err) {
      return handleQueryError(err, 'Backend getCampaigns failed, falling back to local storage:', () => localDB.getCampaigns());
    }
  },

  sendNewsletterCampaign: async (subject: string, content: string): Promise<Campaign> => {
    try {
      return await fetchFromBackend<Campaign>('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({ subject, content }),
      });
    } catch (err) {
      console.warn('Backend sendNewsletterCampaign failed, falling back to local storage:', err);
      return localDB.sendNewsletterCampaign(subject, content);
    }
  },

  // Stats
  getStats: async (): Promise<DashboardStats> => {
    try {
      return await fetchFromBackend<DashboardStats>('/api/stats');
    } catch (err) {
      return handleQueryError(err, 'Backend getStats failed, falling back to local storage:', () => localDB.getStats());
    }
  },

  // Settings
  getSettings: async (): Promise<SiteSettings> => {
    try {
      const settings = await fetchFromBackend<SiteSettings>('/api/settings');
      cacheEntity('settings', settings);
      return settings;
    } catch (err) {
      return handleQueryError(err, 'Backend getSettings failed, falling back to local storage:', () => localDB.getSettings());
    }
  },

  updateSettings: async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
    try {
      return await fetchFromBackend<SiteSettings>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn('Backend updateSettings failed, falling back to local storage:', err);
      return localDB.updateSettings(data);
    }
  },

  // Opportunities
  getOpportunities: async (): Promise<Opportunity[]> => {
    try {
      const opps = await fetchFromBackend<Opportunity[]>('/api/opportunities');
      cacheEntity('opportunities', opps);
      return opps;
    } catch (err) {
      return handleQueryError(err, 'Backend getOpportunities failed, falling back to local storage:', () => localDB.getOpportunities());
    }
  },

  createOpportunity: async (opp: Omit<Opportunity, 'id'>): Promise<Opportunity> => {
    try {
      return await fetchFromBackend<Opportunity>('/api/opportunities', {
        method: 'POST',
        body: JSON.stringify(opp),
      });
    } catch (err) {
      console.warn('Backend createOpportunity failed, falling back to local storage:', err);
      return localDB.createOpportunity(opp);
    }
  },

  updateOpportunity: async (id: string, data: Partial<Opportunity>): Promise<Opportunity> => {
    try {
      return await fetchFromBackend<Opportunity>(`/api/opportunities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn(`Backend updateOpportunity(${id}) failed, falling back to local storage:`, err);
      return localDB.updateOpportunity(id, data);
    }
  },

  deleteOpportunity: async (id: string): Promise<void> => {
    try {
      await fetchFromBackend<void>(`/api/opportunities/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn(`Backend deleteOpportunity(${id}) failed, falling back to local storage:`, err);
      localDB.deleteOpportunity(id);
    }
  },

  // Users & RBAC Management
  getUsers: async (): Promise<Profile[]> => {
    try {
      return await fetchFromBackend<Profile[]>('/api/users');
    } catch (err) {
      return handleQueryError(err, 'Backend getUsers failed, falling back to local storage:', () => localDB.getUsers());
    }
  },

  createUser: async (user: Omit<Profile, 'id' | 'created_at'> & { id?: string }): Promise<Profile> => {
    try {
      return await fetchFromBackend<Profile>('/api/users', {
        method: 'POST',
        body: JSON.stringify(user)
      });
    } catch (err) {
      console.warn('Backend createUser failed, falling back to local storage:', err);
      return localDB.createUser(user);
    }
  },

  updateUser: async (id: string, data: Partial<Profile>): Promise<Profile> => {
    try {
      return await fetchFromBackend<Profile>(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn(`Backend updateUser(${id}) failed, falling back to local storage:`, err);
      return localDB.updateUser(id, data);
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await fetchFromBackend<void>(`/api/users/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn(`Backend deleteUser(${id}) failed, falling back to local storage:`, err);
      localDB.deleteUser(id);
    }
  },

  // Publications / Magazine Issues
  getPublications: async (): Promise<MagazineIssue[]> => {
    try {
      return await fetchFromBackend<MagazineIssue[]>('/api/publications');
    } catch (err) {
      return handleQueryError(err, 'Backend getPublications failed, falling back to local storage:', () => localDB.getPublications());
    }
  },

  createPublication: async (pub: Omit<MagazineIssue, 'id' | 'created_at'>): Promise<MagazineIssue> => {
    try {
      return await fetchFromBackend<MagazineIssue>('/api/publications', {
        method: 'POST',
        body: JSON.stringify(pub)
      });
    } catch (err) {
      console.warn('Backend createPublication failed, falling back to local storage:', err);
      return localDB.createPublication(pub);
    }
  },

  updatePublication: async (id: string, data: Partial<MagazineIssue>): Promise<MagazineIssue> => {
    try {
      return await fetchFromBackend<MagazineIssue>(`/api/publications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn(`Backend updatePublication(${id}) failed, falling back to local storage:`, err);
      return localDB.updatePublication(id, data);
    }
  },

  deletePublication: async (id: string): Promise<void> => {
    try {
      await fetchFromBackend<void>(`/api/publications/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn(`Backend deletePublication(${id}) failed, falling back to local storage:`, err);
      localDB.deletePublication(id);
    }
  },

  // Globe Markers
  getGlobeMarkers: async (): Promise<GlobeMarker[]> => {
    try {
      return await fetchFromBackend<GlobeMarker[]>('/api/globe-markers');
    } catch (err) {
      return handleQueryError(err, 'Backend getGlobeMarkers failed, falling back to local storage:', () => localDB.getGlobeMarkers());
    }
  },

  createGlobeMarker: async (marker: Omit<GlobeMarker, 'id'>): Promise<GlobeMarker> => {
    try {
      return await fetchFromBackend<GlobeMarker>('/api/globe-markers', {
        method: 'POST',
        body: JSON.stringify(marker)
      });
    } catch (err) {
      console.warn('Backend createGlobeMarker failed, falling back to local storage:', err);
      return localDB.createGlobeMarker(marker);
    }
  },

  updateGlobeMarker: async (id: string, data: Partial<GlobeMarker>): Promise<GlobeMarker> => {
    try {
      return await fetchFromBackend<GlobeMarker>(`/api/globe-markers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn(`Backend updateGlobeMarker(${id}) failed, falling back to local storage:`, err);
      return localDB.updateGlobeMarker(id, data);
    }
  },

  deleteGlobeMarker: async (id: string): Promise<void> => {
    try {
      await fetchFromBackend<void>(`/api/globe-markers/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn(`Backend deleteGlobeMarker(${id}) failed, falling back to local storage:`, err);
      localDB.deleteGlobeMarker(id);
    }
  },

  // Activity Logs
  getActivityLogs: async (): Promise<ActivityLog[]> => {
    try {
      return await fetchFromBackend<ActivityLog[]>('/api/activity-logs');
    } catch (err) {
      return handleQueryError(err, 'Backend getActivityLogs failed, falling back to local storage:', () => localDB.getActivityLogs());
    }
  },

  createActivityLog: async (log: Omit<ActivityLog, 'id' | 'created_at'>): Promise<ActivityLog> => {
    try {
      return await fetchFromBackend<ActivityLog>('/api/activity-logs', {
        method: 'POST',
        body: JSON.stringify(log)
      });
    } catch (err) {
      console.warn('Backend createActivityLog failed, falling back to local storage:', err);
      return localDB.createActivityLog(log);
    }
  },

  // Homepage Layout Config
  getHomepageLayout: async (): Promise<HomepageLayout> => {
    try {
      return await fetchFromBackend<HomepageLayout>('/api/homepage-layout');
    } catch (err) {
      return handleQueryError(err, 'Backend getHomepageLayout failed, falling back to local storage:', () => localDB.getHomepageLayout());
    }
  },

  updateHomepageLayout: async (data: { config: { order: string[]; visible: Record<string, boolean> } }): Promise<HomepageLayout> => {
    try {
      return await fetchFromBackend<HomepageLayout>('/api/homepage-layout', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn('Backend updateHomepageLayout failed, falling back to local storage:', err);
      return localDB.updateHomepageLayout(data);
    }
  }
};
