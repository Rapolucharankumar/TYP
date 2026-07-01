'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { db } from '../../lib/db';
import { Category, Article } from '../../types';
import { BookOpen } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedCats, loadedArticles] = await Promise.all([
          db.getCategories(),
          db.getArticles(),
        ]);
        setCategories(loadedCats);
        setArticles(loadedArticles.filter(a => a.status === 'published'));
      } catch (err) {
        console.error('Failed to load categories page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getArticleCount = (catId: string) => {
    return articles.filter(a => a.category_id === catId).length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative overflow-hidden">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Page Header inside a rounded cream capsule card */}
        <div className="border border-card-border bg-card-bg rounded-[32px] p-8 sm:p-10 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/15">
            Publications
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mt-3 mb-4">
            Editorial Sectors
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore our publications grouped by key themes. Each sector brings together youth-led insights examining modern systems and global power balances.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => {
              const count = getArticleCount(category.id);
              return (
                <div 
                  key={category.id} 
                  className="group border border-card-border bg-card-bg rounded-[32px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    {/* Cover image mockup styled with inner container padding */}
                    <div className="p-3 pb-0">
                      <div className="h-[240px] relative w-full overflow-hidden rounded-[24px] border border-card-border/40">
                        <img
                          src={category.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-6">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-card-bg px-3 py-1 rounded-full border border-card-border shadow-md">
                              {count} {count === 1 ? 'Essay' : 'Essays'}
                            </span>
                            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-tight">
                              {category.name}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-5">
                      <p className="text-muted text-xs sm:text-sm leading-relaxed line-clamp-4">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-accent group-hover:underline"
                    >
                      Browse {category.name} articles
                      <BookOpen className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

