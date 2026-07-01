'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BookOpen, Calendar, ArrowRight, Star, ArrowUpRight } from 'lucide-react';

interface PublicationIssue {
  slug: string;
  volume: string;
  date: string;
  title: string;
  coverImage: string;
  bgColor: string;
  accentColor: string;
  description: string;
  articlesCount: number;
}

const ISSUES: PublicationIssue[] = [
  {
    slug: 'issue-01',
    volume: 'Volume I • Issue 1',
    date: 'June 2026',
    title: 'The Sovereign Tech Shift',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    bgColor: 'from-brand-teal to-brand-midnight2',
    accentColor: 'text-brand-teal-light',
    description: 'Investigating national compute infrastructure, microchip border controls, transatlantic AI auditing acts, and algorithmic labor organizations.',
    articlesCount: 5
  },
  {
    slug: 'issue-02',
    volume: 'Volume I • Issue 2',
    date: 'August 2026',
    title: 'The Health Patent Monopolies',
    coverImage: 'https://images.unsplash.com/photo-1584037013000-607b38398934?auto=format&fit=crop&w=600&q=80',
    bgColor: 'from-brand-red to-brand-midnight2',
    accentColor: 'text-brand-red',
    description: 'Deconstructing TRIPS patent exclusions, vaccine manufacturing decentralization in low-to-mid income sovereign regions, and pandemic architectures.',
    articlesCount: 4
  }
];

export default function PublicationsPage() {
  const featured = ISSUES[0];

  return (
    <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Page Header */}
        <section className="border border-border/40 bg-card-bg/40 glass rounded-[32px] p-8 sm:p-10 shadow-md relative overflow-hidden text-center max-w-4xl mx-auto space-y-3">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
          <span className="tag text-brand-teal bg-brand-teal/10 border border-brand-teal/20 font-sans">
            Editorial Publications
          </span>
          <h1 id="page-title" className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Digital Archives
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-sans font-medium">
            Explore our curated quarterly print and digital booklets. We compile exhaustive dossiers on technology stacks, trade corridors, and global medical equity.
          </p>
        </section>

        {/* Featured Issue Spotlight */}
        {featured && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-card-bg/30 border border-border/40 glass p-6 sm:p-8 rounded-[32px] shadow-lg relative overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center space-x-1 text-[9px] font-black text-brand-teal uppercase tracking-widest font-sans">
              <Star className="w-3.5 h-3.5 fill-brand-teal" />
              <span>Current Issue Spotlight</span>
            </div>

            {/* Left Col: Cover booklet mockup */}
            <div className="lg:col-span-5 flex justify-center py-6">
              <Link href={`/publications/${featured.slug}`} className="group relative block w-56 h-76">
                {/* 3D cover shadows & depth */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-black/25 to-black/5 blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                
                {/* Spine representation */}
                <div className="absolute top-0 bottom-0 left-0 w-3 bg-black/45 rounded-l-2xl z-20 shadow-inner" />
                
                {/* Book Face */}
                <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 group-hover:-translate-y-2 transition-transform duration-500 z-10 flex flex-col justify-between p-4 bg-gradient-to-br from-brand-teal to-brand-midnight2">
                  <div className="space-y-1">
                    <span className="text-[7px] tracking-widest uppercase font-black text-brand-teal-light block">
                      The Youth Prism Journal
                    </span>
                    <span className="text-[6px] tracking-wider uppercase font-bold text-white/50 block">
                      {featured.volume}
                    </span>
                  </div>
                  
                  <div className="space-y-2 my-auto">
                    <h3 className="font-serif text-lg font-black text-white leading-tight">
                      {featured.title}
                    </h3>
                    <p className="text-[8px] text-white/70 line-clamp-3 font-sans leading-relaxed">
                      {featured.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[6px] text-white/60 font-bold uppercase tracking-wider">
                    <span>{featured.date}</span>
                    <span>{featured.articlesCount} Articles</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Col: Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-sans font-black uppercase text-brand-teal tracking-widest block">
                  {featured.volume}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
                  {featured.title}
                </h2>
                <div className="flex items-center space-x-2.5 text-xs text-muted font-sans font-medium">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Published: {featured.date}</span>
                  </span>
                  <span>•</span>
                  <span>{featured.articlesCount} Editorial Despatches</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans font-medium">
                {featured.description} This current issue traces the shifting paradigm of computational stack boundaries, local microchip fabrication strategies, European AI risk standardizations, and automation impact on gig labor rights.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href={`/publications/${featured.slug}`}
                  className="btn-primary flex items-center gap-1.5"
                >
                  Read Digital Issue <BookOpen className="w-4 h-4" />
                </Link>
                
                <a
                  href="/contact"
                  className="btn-secondary flex items-center gap-1"
                >
                  Request Print Copy <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Bookshelf Library Grid */}
        <section className="space-y-6">
          <div className="border-b border-border/40 pb-3">
            <h3 className="font-serif text-xl sm:text-2xl font-black uppercase tracking-wide">
              The Bookshelf Archive
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ISSUES.map((issue) => (
              <div 
                key={issue.slug}
                className="group flex flex-col sm:flex-row bg-card-bg/25 border border-border/40 glass rounded-[32px] p-6 gap-6 items-center shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* 3D Cover Book layout */}
                <div className="w-32 h-44 flex-shrink-0 relative">
                  <div className="absolute -inset-1 rounded-xl bg-black/20 blur-sm opacity-60" />
                  <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-black/40 rounded-l-xl z-20" />
                  <div className={`w-full h-full rounded-xl overflow-hidden relative border border-white/5 shadow-lg flex flex-col justify-between p-3 z-10 bg-gradient-to-br ${issue.bgColor} text-white`}>
                    <span className="text-[5px] uppercase tracking-widest font-black text-white/70 block">TYP Journal</span>
                    <h4 className="font-serif text-[10px] font-bold leading-tight mt-1">{issue.title}</h4>
                    <span className="text-[5px] text-white/50 block mt-auto">{issue.date}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <span className="text-[9px] uppercase tracking-wider font-black text-brand-teal font-sans">
                    {issue.volume}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-foreground">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2 font-sans font-medium">
                    {issue.description}
                  </p>
                  <div className="pt-2 flex items-center justify-center sm:justify-between">
                    <Link
                      href={`/publications/${issue.slug}`}
                      className="text-[10px] font-black text-brand-teal hover:underline uppercase tracking-wider flex items-center gap-1"
                    >
                      Read Digital Issue <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
