'use client';

import React, { useEffect, useState } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ArticleCard from '../../components/ArticleCard';
import { db } from '../../lib/db';
import { Article, Category, Tag } from '../../types';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'alphabetical'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedArticles, loadedCategories, loadedTags] = await Promise.all([
          db.getArticles(),
          db.getCategories(),
          db.getTags(),
        ]);
        // Only show published articles in the archive
        const published = loadedArticles.filter(a => a.status === 'published');
        setArticles(published);
        setCategories(loadedCategories);
        setTags(loadedTags);
      } catch (err) {
        console.error('Failed to load articles data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter and Sort Logic
  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || article.category?.slug === selectedCategory;

      const matchesTag =
        selectedTag === 'all' || article.tags?.some((t) => t.slug === selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime();
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Pagination Logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

// Reset page on filter changes
  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional pagination reset on filter change
     setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedTag, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--teal)]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--lavender)]/5 rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Title inside rounded cream capsule card */}
        <div className="glass-panel border border-white/5 rounded-[32px] p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--lavender)]/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/15">
            Manifesto
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mt-3 mb-4">
            The Journal Archive
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-2xl leading-relaxed">
            Browse our full catalog of long-form reports, editorial reviews, and analytical perspectives covering critical issues shaping the future.
          </p>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left panel: Filters in custom cream card */}
          <div className="lg:col-span-1 border border-white/5 bg-white/5 glass-panel rounded-[32px] p-6 shadow-lg space-y-6 self-start">
            
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-accent block">Search Essays</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Keywords, concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-card-border text-foreground px-4 py-3 pl-10 rounded-2xl text-sm focus:outline-none focus:border-accent shadow-sm"
                />
                <Search className="w-4 h-4 text-muted absolute left-3.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-accent block">Sectors</span>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-left border transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-accent text-white border-accent shadow-md'
                      : 'bg-background text-foreground/80 border-card-border hover:border-accent hover:bg-card-border/10'
                  }`}
                >
                  All Sectors
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-left border transition-all cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-accent text-white border-accent shadow-md'
                        : 'bg-background text-foreground/80 border-card-border hover:border-accent hover:bg-card-border/10'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag Filter */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-accent block">Trending Tags</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag('all')}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                    selectedTag === 'all'
                      ? 'bg-foreground text-background border-foreground shadow-sm'
                      : 'bg-background text-foreground/80 border-card-border hover:border-foreground hover:bg-card-border/10'
                  }`}
                >
                  All Tags
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.slug)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                      selectedTag === tag.slug
                        ? 'bg-foreground text-background border-foreground shadow-sm'
                        : 'bg-background text-foreground/80 border-card-border hover:border-foreground hover:bg-card-border/10'
                    }`}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-accent block">Sort Order</label>
              <div className="relative flex items-center">
<select
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest' | 'alphabetical')}
                   className="w-full bg-background border border-card-border text-foreground px-4 py-3 pl-10 rounded-2xl text-sm appearance-none focus:outline-none focus:border-accent shadow-sm cursor-pointer"
                 >
                  <option value="latest">Latest Published</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">Title Alphabetical</option>
                </select>
                <ArrowUpDown className="w-4 h-4 text-muted absolute left-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right panel: Article Grid */}
          <div className="lg:col-span-3 space-y-12">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : paginatedArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-white/10 border-dashed rounded-[32px] bg-white/5 glass-panel p-12 text-center shadow-lg">
                <p className="font-serif text-xl font-bold mb-2">No articles match your selection</p>
                <p className="text-sm text-muted mb-6">Try refining your search terms or choosing another category filter.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedTag('all');
                    setSortBy('latest');
                  }}
                  className="bg-accent text-white px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider hover:bg-accent/90 shadow-md cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {paginatedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-card-border/60 pt-6">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1 px-4 py-2 border border-card-border rounded-full text-xs font-bold uppercase tracking-wider bg-background hover:bg-card-border/10 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>
                    
                    <span className="text-xs font-bold uppercase tracking-widest text-muted">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-1 px-4 py-2 border border-card-border rounded-full text-xs font-bold uppercase tracking-wider bg-background hover:bg-card-border/10 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
