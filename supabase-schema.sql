-- Supabase Database Schema for The Youth Prism

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  role text not null default 'writer' check (role in ('super_admin', 'admin', 'senior_editor', 'editor', 'writer', 'researcher', 'contributor', 'moderator')),
  suspended boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Authors (profiles that write articles)
create table public.authors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  bio text,
  avatar text,
  social_links jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tags
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Articles
create table public.articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image text,
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  featured boolean default false not null,
  author_id uuid references public.authors(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  seo_title text,
  seo_description text
);

-- Article-Tags join table (many-to-many)
create table public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- Newsletter Subscribers
create table public.newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Opportunities
create table public.opportunities (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  type text not null,
  "tagClass" text not null,
  deadline text not null,
  location text not null,
  description text not null,
  stipend text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Magazine Issues / Publications
create table public.magazine_issues (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  cover_image text,
  editorial_note text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Globe Coordinate Markers
create table public.globe_markers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  type text not null check (type in ('writer', 'origin', 'research')),
  country text not null,
  headline text not null,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Platform Activity Logs / Audit Trails
create table public.activity_logs (
  id uuid default uuid_generate_v4() primary key,
  user_email text not null,
  role text not null,
  action text not null,
  details jsonb default '{}'::jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dynamic Homepage Settings
create table public.homepage_layout (
  id text primary key, -- 'hero', 'sections', etc.
  config jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS & Policies (Example setup)
alter table public.profiles enable row level security;
alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_tags enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.opportunities enable row level security;
alter table public.magazine_issues enable row level security;
alter table public.globe_markers enable row level security;
alter table public.activity_logs enable row level security;
alter table public.homepage_layout enable row level security;

-- Public read access
create policy "Allow public read access to authors" on public.authors for select using (true);
create policy "Allow public read access to categories" on public.categories for select using (true);
create policy "Allow public read access to tags" on public.tags for select using (true);
create policy "Allow public read access to articles" on public.articles for select using (status = 'published');
create policy "Allow public read access to article_tags" on public.article_tags for select using (true);
create policy "Allow public read access to opportunities" on public.opportunities for select using (true);
create policy "Allow public read access to magazine_issues" on public.magazine_issues for select using (status = 'published');
create policy "Allow public read access to globe_markers" on public.globe_markers for select using (active = true);
create policy "Allow public read access to homepage_layout" on public.homepage_layout for select using (true);

-- Admin & Author policies (simplified)
create policy "Allow full admin control" on public.profiles for all using (true);
create policy "Allow full author control to authors" on public.authors for all using (true);
create policy "Allow write access to categories for admin" on public.categories for all using (true);
create policy "Allow write access to tags for admin" on public.tags for all using (true);
create policy "Allow write access to articles for admin/author" on public.articles for all using (true);
create policy "Allow write access to article_tags for admin/author" on public.article_tags for all using (true);
create policy "Allow signup to newsletter for anyone" on public.newsletter_subscribers for insert with check (true);
create policy "Allow read newsletter subscribers for admin" on public.newsletter_subscribers for select using (true);
create policy "Allow write access to opportunities for admin" on public.opportunities for all using (true);
create policy "Allow write access to magazine_issues for admin" on public.magazine_issues for all using (true);
create policy "Allow write access to globe_markers for admin" on public.globe_markers for all using (true);
create policy "Allow full access to activity_logs for admin" on public.activity_logs for all using (true);
create policy "Allow write access to homepage_layout for admin" on public.homepage_layout for all using (true);
