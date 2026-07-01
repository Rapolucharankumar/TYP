'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ArticleCard from '../../components/ArticleCard';
import { db } from '../../lib/db';
import { Article, Author, Category } from '../../types';
import { Search, User, Folder, BookOpen } from 'lucide-react';

type Tab = 'all' | 'articles' | 'authors' | 'categories';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');
  
  // Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedArticles, loadedAuthors, loadedCats] = await Promise.all([
          db.getArticles(),
          db.getAuthors(),
          db.getCategories()
        ]);
        setArticles(loadedArticles.filter(a => a.status === 'published'));
        setAuthors(loadedAuthors);
        setCategories(loadedCats);
      } catch (err) {
        console.error('Failed to load search data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter Results
  const matchedArticles = articles.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    a.content.toLowerCase().includes(query.toLowerCase())
  );

  const matchedAuthors = authors.filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.bio.toLowerCase().includes(query.toLowerCase())
  );

  const matchedCategories = categories.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = matchedArticles.length + matchedAuthors.length + matchedCategories.length;

  return (
    <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Search Input Hero inside a rounded cream card container */}
        <div className="border border-card-border bg-card-bg rounded-[32px] p-8 sm:p-10 shadow-md max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/15">
            Query Interface
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2 text-foreground">
            Search The Youth Prism
          </h1>
          <div className="relative flex items-center max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Type keywords, topics, authors, or analysis fields..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-background border border-card-border text-foreground px-6 py-4 pl-14 rounded-full text-sm focus:outline-none focus:border-accent shadow-sm"
              autoFocus
            />
            <Search className="w-5 h-5 text-muted absolute left-5" />
          </div>
          {query && (
            <p className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full inline-block border border-accent/10">
              Found {totalResults} matches for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        {/* Tab Controls styled as burgundy or cream capsule bar */}
        <div className="flex justify-center">
          <div className="bg-card-bg border border-card-border p-1.5 rounded-full inline-flex space-x-1 shadow-sm overflow-x-auto max-w-full">
            {(['all', 'articles', 'authors', 'categories'] as Tab[]).map((tab) => {
              const counts: Record<Tab, number> = {
                all: totalResults,
                articles: matchedArticles.length,
                authors: matchedAuthors.length,
                categories: matchedCategories.length
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-muted hover:text-foreground hover:bg-card-border/20'
                  }`}
                >
                  {tab} ({counts[tab]})
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !query ? (
          <div className="text-center py-16 text-muted">
            <p className="text-sm">Enter search terms above to query the editorial database.</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-16 border border-card-border border-dashed rounded-[32px] bg-card-bg shadow-sm max-w-md mx-auto">
            <p className="font-serif text-lg font-bold">No matches found</p>
            <p className="text-xs text-muted mt-1">Try utilizing broader keywords or double check spelling.</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* ARTICLES TAB */}
            {(activeTab === 'all' || activeTab === 'articles') && matchedArticles.length > 0 && (
              <div className="space-y-6">
                {activeTab === 'all' && (
                  <div className="flex items-center space-x-2 border-b border-card-border/60 pb-2">
                    <BookOpen className="w-4 h-4 text-accent" />
                    <h2 className="font-serif text-lg font-bold uppercase tracking-wider">Matched Essays</h2>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {matchedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}

            {/* AUTHORS TAB */}
            {(activeTab === 'all' || activeTab === 'authors') && matchedAuthors.length > 0 && (
              <div className="space-y-6">
                {activeTab === 'all' && (
                  <div className="flex items-center space-x-2 border-b border-card-border/60 pb-2">
                    <User className="w-4 h-4 text-accent" />
                    <h2 className="font-serif text-lg font-bold uppercase tracking-wider">Matched Writers</h2>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {matchedAuthors.map((author) => (
                    <div key={author.id} className="border border-card-border bg-card-bg p-5 rounded-[24px] flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-card-border shadow-inner flex-shrink-0">
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Link href="/team" className="font-serif text-base font-bold text-foreground hover:text-accent transition-colors block leading-snug">
                          {author.name}
                        </Link>
                        <p className="text-xs text-muted line-clamp-2 mt-0.5">{author.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORIES TAB */}
            {(activeTab === 'all' || activeTab === 'categories') && matchedCategories.length > 0 && (
              <div className="space-y-6">
                {activeTab === 'all' && (
                  <div className="flex items-center space-x-2 border-b border-card-border/60 pb-2">
                    <Folder className="w-4 h-4 text-accent" />
                    <h2 className="font-serif text-lg font-bold uppercase tracking-wider">Matched Sectors</h2>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {matchedCategories.map((cat) => (
                    <div key={cat.id} className="border border-card-border bg-card-bg p-6 rounded-[24px] space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-serif text-lg font-bold text-foreground leading-snug">{cat.name}</h3>
                        <p className="text-xs text-muted line-clamp-2 leading-relaxed">{cat.description}</p>
                      </div>
                      <Link 
                        href={`/categories/${cat.slug}`}
                        className="text-[10px] font-black text-accent uppercase tracking-wider block hover:underline"
                      >
                        Enter Sector &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
