export type UserRole = 'super_admin' | 'admin' | 'senior_editor' | 'editor' | 'writer' | 'researcher' | 'contributor' | 'moderator' | 'author';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  suspended?: boolean;
  created_at: string;
}

export interface MagazineIssue {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  editorial_note?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  published_at: string | null;
  created_at: string;
}

export interface GlobeMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'writer' | 'origin' | 'research';
  country: string;
  headline: string;
  active: boolean;
  created_at?: string;
}

export interface ActivityLog {
  id: string;
  user_email: string;
  role: string;
  action: string;
  details: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface HomepageLayout {
  id: string;
  config: {
    order: string[];
    visible: Record<string, boolean>;
  };
  updated_at?: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  role?: string;
  country?: string;
  expertise?: string[];
  social_links: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    role?: string;
  };
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  created_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  status: 'draft' | 'published' | 'scheduled';
  featured: boolean;
  author_id: string;
  category_id: string;
  published_at: string | null;
  created_at: string;
  seo_title?: string;
  seo_description?: string;
  // Join properties populated by the database abstraction layer:
  author?: Author;
  category?: Category;
  tags?: Tag[];
  views?: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface DashboardStats {
  totalArticles: number;
  draftArticles: number;
  publishedArticles: number;
  scheduledArticles: number;
  totalCategories: number;
  totalAuthors: number;
  newsletterSubscribers: number;
  totalViews: number;
}

export interface Campaign {
  id: string;
  subject: string;
  content: string;
  sent_at: string;
  recipients_count: number;
}

export interface SiteSettings {
  siteName: string;
  logo: string;
  favicon: string;
  metaTitleDefault: string;
  metaDescriptionDefault: string;
  openGraphImage: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  youtube: string;
  // Dynamic Stats
  writersCount: string;
  countriesCount: string;
  partnershipsCount: string;
  readersCount: string;
  papersCount: string;
  sectorsCount: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: string;
  tagClass: string;
  deadline: string;
  location: string;
  description: string;
  stipend?: string;
  created_at?: string;
}
