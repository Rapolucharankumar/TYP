'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ArticleCard from '../../../components/ArticleCard';
import { db } from '../../../lib/db';
import { Category, Article } from '../../../types';
import { ChevronLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const cat = await db.getCategoryBySlug(slug);
        if (cat) {
          setCategory(cat);
          const allArticles = await db.getArticles();
          // Filter to only published articles in this category
          const catArticles = allArticles.filter(
            (a) => a.category_id === cat.id && a.status === 'published'
          );
          setArticles(catArticles);
        }
      } catch (err) {
        console.error('Failed to load category articles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="border border-card-border bg-card-bg rounded-[32px] p-10 max-w-md shadow-lg">
            <h1 className="font-serif text-3xl font-bold mb-4">Sector Not Found</h1>
            <p className="text-muted text-sm mb-6">The category you are requesting does not exist.</p>
            <Link href="/categories" className="bg-accent text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-accent/90 shadow-md cursor-pointer inline-block">
              Back to Sectors
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/categories"
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Sectors
          </Link>
        </div>

        {/* Category Header inside rounded cream card */}
        <div className="border border-card-border bg-card-bg rounded-[32px] p-8 sm:p-10 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/15">
            Focus Sector
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mt-3 mb-4">
            Sector: {category.name}
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Article Grid */}
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-card-border border-dashed rounded-[32px] p-12 text-center bg-card-bg shadow-sm">
            <p className="font-serif text-xl font-bold mb-2">No articles in this sector yet</p>
            <p className="text-sm text-muted mb-6">We are currently drafting long-form essays for this area. Check back soon.</p>
            <Link
              href="/articles"
              className="bg-accent text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider hover:bg-accent/90 shadow-md cursor-pointer"
            >
              Browse All Articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
