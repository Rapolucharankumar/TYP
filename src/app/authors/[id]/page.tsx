'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ArticleCard from '../../../components/ArticleCard';
import { db } from '../../../lib/db';
import { Author, Article } from '../../../types';
import { Mail, ChevronLeft, BookOpen, Eye, Award } from 'lucide-react';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AuthorDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedAuthors, loadedArticles] = await Promise.all([
          db.getAuthors(),
          db.getArticles(),
        ]);
        const foundAuthor = loadedAuthors.find(a => a.id === id);
        setAuthor(foundAuthor || null);
        
        if (foundAuthor) {
          const authorArticles = loadedArticles.filter(
            art => art.author_id === foundAuthor.id && art.status === 'published'
          );
          setArticles(authorArticles);
        }
      } catch (err) {
        console.error('Failed to load author detail page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

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

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="border border-card-border bg-card-bg rounded-[32px] p-10 max-w-md shadow-lg">
            <h1 className="font-serif text-3xl font-bold mb-4">Contributor Not Found</h1>
            <p className="text-muted text-sm mb-6">The author profile you are looking for does not exist or has been removed.</p>
            <Link href="/team" className="bg-accent text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-accent/90 shadow-md cursor-pointer inline-block">
              View Collective
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalViews = articles.reduce((sum, art) => sum + (art.views || 0), 0);

  return (
    <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/team"
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Collective
          </Link>
        </div>

        {/* Author Header Card */}
        <section className="border border-card-border bg-card-bg rounded-[32px] p-8 sm:p-10 lg:p-12 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar inside nice container */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border border-card-border shadow-inner bg-background flex-shrink-0">
              <img
                src={author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content info block */}
            <div className="space-y-4 text-center md:text-left flex-grow">
              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground animate-fade-in">
                  {author.name}
                </h1>
                <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/15 inline-block">
                  {author.role || 'Contributor'}
                </span>
              </div>

              <p className="text-muted text-sm sm:text-base leading-relaxed max-w-3xl">
                {author.bio}
              </p>

              {/* Social links */}
              <div className="flex justify-center md:justify-start gap-3 pt-2">
                {author.social_links?.twitter && (
                  <a
                    href={author.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-card-border hover:border-accent hover:text-accent rounded-full bg-background text-muted transition-colors flex items-center justify-center cursor-pointer"
                    aria-label={`${author.name} Twitter`}
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                )}
                {author.social_links?.linkedin && (
                  <a
                    href={author.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-card-border hover:border-accent hover:text-accent rounded-full bg-background text-muted transition-colors flex items-center justify-center cursor-pointer"
                    aria-label={`${author.name} LinkedIn`}
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                <a
                  href="mailto:editorial@youthprism.com"
                  className="p-2 border border-card-border hover:border-accent hover:text-accent rounded-full bg-background text-muted transition-colors flex items-center justify-center cursor-pointer"
                  aria-label={`Email ${author.name}`}
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Author Stats Block (adds credibility!) */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 bg-card-border/30 rounded-2xl p-5 text-center md:text-left h-fit min-w-[180px]">
              <div className="space-y-1">
                <span className="block text-[9px] text-muted font-black uppercase tracking-wider">Despatches</span>
                <span className="text-2xl font-serif font-black text-accent flex items-center justify-center md:justify-start gap-1.5">
                  <BookOpen className="w-5 h-5 text-accent" />
                  {articles.length}
                </span>
              </div>
              <div className="space-y-1 border-l md:border-l-0 md:border-t border-card-border/60 pt-0 md:pt-3">
                <span className="block text-[9px] text-muted font-black uppercase tracking-wider">Total Reach</span>
                <span className="text-2xl font-serif font-black text-accent flex items-center justify-center md:justify-start gap-1.5">
                  <Eye className="w-5 h-5 text-accent" />
                  {totalViews.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Author Despatches list */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-card-border/60 pb-3">
            <Award className="w-5 h-5 text-accent" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide">
              Despatches by {author.name}
            </h2>
          </div>

          {articles.length === 0 ? (
            <div className="border border-card-border border-dashed rounded-[32px] p-12 text-center bg-card-bg">
              <h3 className="font-serif text-lg font-bold">No published articles</h3>
              <p className="text-xs text-muted mt-1">This contributor has not published any essays yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((art) => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
