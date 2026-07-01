'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { db } from '../../lib/db';
import { 
  LayoutDashboard, FileText, Folder, Tag, Users, Image as ImageIcon, 
  Mail, Settings, LogOut, Globe, LogIn, AlertCircle, Menu, X, Award,
  BookOpen, Shield, History, Sliders
} from 'lucide-react';
import Logo from '../../components/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn, signOut, isAdmin, hasPermission } = useAuth();
  const pathname = usePathname();
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Counts state for sidebar
  const [counts, setCounts] = useState({
    articles: 0,
    categories: 0,
    authors: 0,
    subscribers: 0,
  });

  useEffect(() => {
    async function loadCounts() {
      if (user) {
        try {
          const stats = await db.getStats();
          setCounts({
            articles: stats.totalArticles,
            categories: stats.totalCategories,
            authors: stats.totalAuthors,
            subscribers: stats.newsletterSubscribers,
          });
        } catch (err) {
          console.error('Failed to load stats for sidebar:', err);
        }
      }
    }
    loadCounts();
  }, [user, pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const success = await signIn(email, password);
    setLoginLoading(false);
    if (!success) {
      setLoginError('Invalid administrator credentials.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1025] text-brand-cream">
        <div className="w-10 h-10 border-4 border-brand-lavender border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Auth gate - Show Login UI if not signed in
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center paper-pattern bg-[#0A1025] px-4 transition-colors">
        <div className="max-w-md w-full bg-brand-midnight2 border border-brand-midnight3 rounded-[32px] p-8 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <Link href="/" className="font-serif text-2xl font-black tracking-widest text-brand-lavender hover:opacity-90 inline-block">
              THE YOUTH PRISM
            </Link>
            <h2 className="font-serif text-xl font-bold text-brand-cream">Admin Workspace Gate</h2>
            <p className="text-xs text-brand-warmgrey">Identify yourself with publication access keys.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-2xl text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-lavender block">Office Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A1025] border border-brand-midnight3 text-brand-cream px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-brand-lavender shadow-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-lavender block">Access Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A1025] border border-brand-midnight3 text-brand-cream px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-brand-lavender shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-brand-lavender text-brand-midnight py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand-lavender/90 shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? (
                <div className="w-4 h-4 border-2 border-brand-midnight border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Unlock Workspace</span>
                  <LogIn className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-brand-warmgrey hover:text-brand-lavender font-semibold transition-colors">
              &larr; Return to main site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin', show: true },
    { name: 'Articles', icon: FileText, href: '/admin/articles', count: counts.articles, show: true },
    { name: 'Publications', icon: BookOpen, href: '/admin/publications', show: hasPermission('manage_publications') },
    { name: 'Globe Content', icon: Globe, href: '/admin/globe', show: hasPermission('manage_globe') },
    { name: 'Opportunities', icon: Award, href: '/admin/opportunities', show: true },
    { name: 'Categories', icon: Folder, href: '/admin/categories', count: counts.categories, show: true },
    { name: 'Tags', icon: Tag, href: '/admin/tags', show: true },
    { name: 'Authors', icon: Users, href: '/admin/authors', count: counts.authors, show: true },
    { name: 'Media Library', icon: ImageIcon, href: '/admin/media', show: true },
    { name: 'Newsletter', icon: Mail, href: '/admin/newsletter', count: counts.subscribers, show: hasPermission('manage_publications') },
    { name: 'Users & RBAC', icon: Shield, href: '/admin/users', show: hasPermission('manage_users') },
    { name: 'Homepage Layout', icon: Sliders, href: '/admin/homepage', show: hasPermission('manage_homepage') },
    { name: 'Audit Trails', icon: History, href: '/admin/audit', show: hasPermission('view_audit_logs') },
    { name: 'Site Settings', icon: Settings, href: '/admin/settings', show: hasPermission('manage_settings') },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen flex bg-[#0A1025] text-brand-cream transition-colors duration-300">
      
      {/* Sidebar - Desktop (Floating Modular Card) */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-midnight2 border border-brand-midnight3 rounded-[32px] m-4 mr-0 shadow-lg text-brand-cream sticky top-4 self-start h-[calc(100vh-32px)]">
        <div className="h-20 border-b border-brand-midnight3 flex items-center px-6 justify-between">
          <Link href="/admin" className="transition-opacity hover:opacity-90 flex items-center space-x-2">
            <Logo size="sm" className="!p-0.5 border border-brand-midnight3" />
            <span className="text-[9px] font-black text-brand-warmgrey uppercase tracking-widest leading-tight block">Workspace<br />Panel</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-colors ${
                  active 
                    ? 'bg-brand-lavender text-brand-midnight shadow-md' 
                    : 'text-brand-cream/80 hover:bg-brand-midnight3/40 hover:text-brand-lavender'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                    active ? 'bg-brand-midnight/20 text-brand-midnight' : 'bg-brand-midnight3/80 text-brand-warmgrey border border-brand-midnight3'
                  }`}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-midnight3 space-y-2 bg-brand-lavender/5 rounded-b-[32px]">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-brand-midnight3/40 hover:text-brand-lavender transition-colors"
          >
            <Globe className="w-4 h-4 text-brand-warmgrey" />
            <span>View Website</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden flex p-4">
          <div className="w-64 bg-brand-midnight2 border border-brand-midnight3 rounded-[32px] h-full flex flex-col justify-between text-brand-cream shadow-2xl overflow-hidden">
            <div>
              <div className="h-20 border-b border-brand-midnight3 flex items-center justify-between px-6">
                <div className="flex items-center space-x-2">
                  <Logo size="sm" className="!p-0.5" />
                  <span className="font-serif text-sm font-black tracking-wider text-brand-lavender leading-none">
                    YOUTH PRISM
                  </span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-brand-midnight3/40 rounded-full cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="p-4 space-y-1.5">
                {menuItems.map((item) => {
                  const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-colors ${
                        active 
                          ? 'bg-brand-lavender text-brand-midnight shadow-md' 
                          : 'text-brand-cream/80 hover:bg-brand-midnight3/40 hover:text-brand-lavender'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="p-4 border-t border-brand-midnight3 space-y-2 bg-brand-lavender/5">
              <Link href="/" className="flex items-center space-x-3 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider hover:bg-brand-midnight3/40 hover:text-brand-lavender transition-colors">
                <Globe className="w-4 h-4" />
                <span>View Site</span>
              </Link>
              <button onClick={() => { signOut(); setSidebarOpen(false); }} className="w-full flex items-center space-x-3 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header bar (Floating Pill) */}
        <header className="h-16 border border-brand-midnight3 bg-brand-midnight2 rounded-full m-4 shadow-sm px-6 flex items-center justify-between sticky top-4 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-brand-midnight3/40 rounded-full cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-[10px] font-black text-brand-warmgrey uppercase tracking-widest">
              Admin / <span className="text-brand-cream">{pathname.split('/').filter(Boolean).slice(1).join(' / ') || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-[9px] font-black text-brand-midnight bg-brand-lavender px-3 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block border border-brand-lavender/30">
              {user.email}
            </span>
          </div>
        </header>

        {/* Content Wrapper (Floating Card Container) */}
        <main className="flex-1 m-4 mt-0 bg-brand-midnight2 border border-brand-midnight3 rounded-[32px] p-6 lg:p-8 overflow-y-auto shadow-md">
          {children}
        </main>
      </div>

    </div>
  );
}
