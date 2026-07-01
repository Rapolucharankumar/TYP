'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { db } from '../../lib/db';
import { Author, Article } from '../../types';
import { Mail, Search, Globe, Shield, Tag, BookOpen } from 'lucide-react';

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

export default function TeamPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Leadership' | 'Editorial' | 'Writers' | 'Researchers' | 'Technology'>('All');

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedAuthors, loadedArticles] = await Promise.all([
          db.getAuthors(),
          db.getArticles()
        ]);
        setAuthors(loadedAuthors);
        setArticles(loadedArticles);
      } catch (err) {
        console.error('Failed to load team data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter based on query and tab selection
  const filteredAuthors = authors.filter(author => {
    const query = searchQuery.toLowerCase();
    const nameMatches = author.name.toLowerCase().includes(query);
    const roleMatches = (author.role || '').toLowerCase().includes(query);
    const countryMatches = (author.country || '').toLowerCase().includes(query);
    const expertiseMatches = (author.expertise || []).some(exp => exp.toLowerCase().includes(query));

    const queryMatches = nameMatches || roleMatches || countryMatches || expertiseMatches;

    if (!queryMatches) return false;

    if (activeTab === 'All') return true;
    if (activeTab === 'Leadership') {
      return ['Editor-in-Chief', 'Managing Editor', 'Geopolitical Lead', 'Policy Lead', 'Healthcare Equity Lead'].includes(author.role || '');
    }
    if (activeTab === 'Editorial') {
      return ['Editor-in-Chief', 'Managing Editor', 'Editor'].includes(author.role || '');
    }
    if (activeTab === 'Writers') {
      return ['Senior Correspondent', 'Geopolitical Lead', 'Policy Lead', 'Contributor', 'Writers'].includes(author.role || '');
    }
    if (activeTab === 'Researchers') {
      return ['Research Fellow', 'Healthcare Equity Lead', 'Researchers'].includes(author.role || '') || (author.expertise && author.expertise.length > 0);
    }
    if (activeTab === 'Technology') {
      return ['Senior Technology Analyst', 'Technology Lead', 'Design', 'Technology'].includes(author.role || '') || (author.expertise && author.expertise.includes('Semiconductor Logistics'));
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--teal)]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--lavender)]/5 rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Page Header */}
        <div className="border border-brand-midnight2 bg-brand-midnight rounded-[32px] p-8 sm:p-10 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
          <span className="tag text-brand-teal bg-brand-teal/10 border border-brand-teal/20 font-sans">
            Editorial Collective
          </span>
          <h1 id="page-title" className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-brand-cream mt-3 mb-4">
            The Collective & Desks
          </h1>
          <p className="text-brand-warmgrey text-sm sm:text-base max-w-2xl leading-relaxed font-sans font-medium">
            Meet the international researchers, policy analysts, and journalists managing the desks, despatches, and intelligence briefings of The Youth Prism.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card-bg/20 border border-border/40 glass p-4 rounded-2xl">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {(['All', 'Leadership', 'Editorial', 'Writers', 'Researchers', 'Technology'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-sans font-bold transition-all border ${
                  activeTab === tab
                    ? 'bg-brand-teal text-brand-midnight border-brand-teal/30 shadow'
                    : 'bg-card-bg/30 text-muted border-border/40 hover:bg-card-bg/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, country, expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background/50 border border-border/40 text-foreground px-4 py-2.5 pl-10 rounded-full text-xs focus:outline-none focus:border-brand-teal shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-muted absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Collective Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAuthors.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border/50 rounded-[32px] bg-card-bg/25">
            <p className="text-sm text-muted">No collective profiles matching current search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredAuthors.map((author) => {
              // Get articles authored by this writer
              const authorArticles = articles.filter(a => a.author_id === author.id);

              return (
                <div 
                  key={author.id}
                  className="group relative border border-white/5 bg-white/5 glass-panel rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover-glow-butter hover:border-white/10"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--teal)]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[var(--teal)]/20" />

                  <div className="space-y-6">
                    {/* Top Row: Avatar & Bio */}
                    <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border/50 group-hover:border-brand-teal transition-colors duration-500 flex-shrink-0 relative">
                        <img
                          src={author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                          alt={author.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-serif text-xl font-black text-[var(--foreground)] group-hover:text-[var(--teal)] transition-colors leading-tight">
                          {author.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-[9px] font-black text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full border border-brand-teal/15 font-sans">
                            {author.role || 'Contributor'}
                          </span>
                          {author.country && (
                            <span className="text-[9px] font-bold text-brand-teal bg-brand-teal/5 border border-brand-teal/20 px-2.5 py-0.5 rounded-md font-sans flex items-center gap-1">
                              <Globe className="w-3 h-3 text-brand-teal" />
                              {author.country}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-muted leading-relaxed font-sans font-medium">
                      {author.bio}
                    </p>

                    {/* Expertise tags */}
                    {author.expertise && author.expertise.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-black uppercase text-muted/65 tracking-wider block">Areas of Research</span>
                        <div className="flex flex-wrap gap-1.5">
                          {author.expertise.map((exp, idx) => (
                            <span 
                              key={idx}
                              className="text-[9px] font-sans font-bold text-foreground bg-card-bg/60 border border-border/30 px-2.5 py-0.5 rounded-md"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Published Work lists */}
                    {authorArticles.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-border/20">
                        <span className="text-[9px] font-black uppercase text-muted/65 tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-brand-teal" />
                          Recent Despatches
                        </span>
                        <div className="space-y-1.5">
                          {authorArticles.slice(0, 2).map((art) => (
                            <Link 
                              key={art.id}
                              href={`/articles/${art.slug}`}
                              className="text-xs font-serif font-bold text-foreground/90 hover:text-brand-teal block leading-snug line-clamp-1 hover:underline"
                            >
                              {art.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Social links & Footer */}
                  <div className="mt-6 pt-4 border-t border-border/20 flex justify-between items-center">
                    <div className="flex space-x-2.5">
                      {author.social_links?.twitter && (
                        <a
                          href={`https://twitter.com/${author.social_links.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-border/40 hover:border-brand-teal hover:text-brand-teal rounded-full bg-background text-muted transition-colors"
                          aria-label={`${author.name} Twitter`}
                        >
                          <TwitterIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {author.social_links?.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${author.social_links.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-border/40 hover:border-brand-teal hover:text-brand-teal rounded-full bg-background text-muted transition-colors"
                          aria-label={`${author.name} LinkedIn`}
                        >
                          <LinkedinIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <a
                        href="mailto:editorial@youthprism.com"
                        className="p-2 border border-border/40 hover:border-brand-teal hover:text-brand-teal rounded-full bg-background text-muted transition-colors"
                        aria-label={`Email ${author.name}`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <Link 
                      href={`/authors/${author.id}`}
                      className="text-[10px] font-black text-brand-teal uppercase tracking-widest hover:underline font-sans"
                    >
                      Dossier Profile &rarr;
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
