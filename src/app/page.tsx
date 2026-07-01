'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, TrendingUp, Sparkles, BookOpen, UserCheck, Award, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import Logo from '../components/Logo';
import { db } from '../lib/db';
import { Article, Category, SiteSettings, Opportunity, HomepageLayout } from '../types';

// New Premium Components
import PremiumHeroPrism from '../components/PremiumHeroPrism';
import LivingNewsroom from '../components/LivingNewsroom';
import GlobalIntelligenceGlobe from '../components/GlobalIntelligenceGlobe';
import FocusAreaEcosystem from '../components/FocusAreaEcosystem';
import ReadingPathways from '../components/ReadingPathways';
import DynamicConstellation from '../components/DynamicConstellation';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [layout, setLayout] = useState<HomepageLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedArticles, loadedCategories, loadedSettings, loadedOpps, loadedLayout] = await Promise.all([
          db.getArticles(),
          db.getCategories(),
          db.getSettings(),
          db.getOpportunities(),
          db.getHomepageLayout(),
        ]);
        const published = loadedArticles.filter(a => a.status === 'published');
        setArticles(published);
        setCategories(loadedCategories);
        setSettings(loadedSettings);
        setOpportunities(loadedOpps);
        setLayout(loadedLayout);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Scroll-triggered animations using GSAP ScrollTrigger
  useEffect(() => {
    if (loading) return; // wait until sections are rendered
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallax background elements
    gsap.utils.toArray('.animate-float-1, .animate-float-2').forEach((el: any) => {
      gsap.to(el, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    // Fade-up sections
    gsap.utils.toArray('.fade-up').forEach((el: any) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    // Fade-in sections
    gsap.utils.toArray('.fade-in').forEach((el: any) => {
      gsap.fromTo(el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loading]);


  const featuredArticle = articles.find(a => a.featured) || articles[0];
  const latestHeroArticles = articles.filter(a => a.id !== featuredArticle?.id).slice(0, 3);
  const trendingArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
  const editorsPicks = articles.slice().reverse().slice(0, 3);

  // Filter despatches by selected country
  const filteredLatestArticles = articles.filter(art => {
    if (!selectedCountry) return true;
    const authorCountry = art.author?.country?.toLowerCase() || '';
    const selected = selectedCountry.toLowerCase();
    
    // Support matching United States / USA, etc.
    if (selected === 'usa') {
      return authorCountry === 'united states' || authorCountry === 'usa';
    }
    return authorCountry === selected;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <div className="aurora-bg" />
      <div className="noise-bg" />
      <Navbar />

      {/* Dynamic Homepage Sections rendering based on database configuration */}
      {loading ? (
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        (() => {
          const defaultOrder = ['Hero', 'Newsroom', 'Globe', 'Despatches', 'Node Graph', 'Pathways', 'Reports', 'Voice', 'Opportunities', 'Archive'];
          const order = layout?.config?.order || defaultOrder;
          const visible = layout?.config?.visible || {};

          const renderSection = (sectionName: string) => {
            const isVisible = visible[sectionName] !== false;
            if (!isVisible) return null;

            switch (sectionName) {
              case 'Hero':
                return (
                  <section key="hero" className="fade-up bg-[var(--background)] text-brand-cream relative overflow-hidden py-12 lg:py-16 border-b border-brand-teal/20">
                    {/* Ambient Light dispersion background blobs */}
                    <div className="absolute inset-0 z-0 opacity-25 pointer-events-none overflow-hidden">
                      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0B5A47] blur-[120px] animate-float-1 mix-blend-screen opacity-40" />
                      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#E1D6FF] blur-[140px] animate-float-2 mix-blend-screen opacity-20" />
                    </div>

                    <DynamicConstellation />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                      {/* 3-Column Editorial Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Column 1: Latest Despatches */}
                        <div className="lg:col-span-3 space-y-5 fade-up delay-1">
                          <div className="flex items-center space-x-2 border-b border-teal-light/20 pb-2">
                            <BookOpen className="w-4 h-4 text-butter" />
                            <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-butter">Latest Despatches</h3>
                          </div>
                          <div className="space-y-4">
                            {latestHeroArticles.length === 0 ? (
                              <p className="text-xs text-butter/70">No despatches available.</p>
                            ) : (
                              latestHeroArticles.map((article) => (
                                <div key={article.id} className="group border-b border-teal-light/10 pb-4 last:border-b-0 last:pb-0 space-y-2 transition-all duration-300 hover:pl-2">
                                  <Link 
                                    href={`/categories/${article.category?.slug || 'general'}`} 
                                    className="text-[9px] font-bold text-butter tracking-widest uppercase hover:underline"
                                  >
                                    {article.category?.name || 'General'}
                                  </Link>
                                  <h4 className="font-serif text-sm font-bold leading-snug hover:text-butter transition-colors">
                                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                                  </h4>
                                  <div className="flex items-center space-x-2.5 text-[10px] text-brand-warmgrey font-sans font-medium">
                                    <span>By {article.author?.name}</span>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3 text-muted-on-dark/70" />
                                      <span>{article.content ? Math.max(1, Math.ceil(article.content.split(/\s+/).length / 250)) : 1} min read</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Column 2: The Hero centerpiece */}
                        <div className="lg:col-span-6 py-6 lg:py-0 fade-up delay-2">
                          <PremiumHeroPrism />
                        </div>

                        {/* Column 3: Trending Analysis */}
                        <div className="lg:col-span-3 space-y-5 fade-up delay-3">
                          <div className="flex items-center space-x-2 border-b border-teal-light/20 pb-2">
                            <TrendingUp className="w-4 h-4 text-butter" />
                            <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-butter">Trending Essays</h3>
                          </div>
                          <div className="space-y-4">
                            {trendingArticles.length === 0 ? (
                              <p className="text-xs text-butter/70">No trending essays available.</p>
                            ) : (
                              trendingArticles.map((article, idx) => (
                                <div key={article.id} className="flex gap-4 items-start pb-4 border-b border-teal-light/10 last:border-b-0 last:pb-0 group transition-all duration-300 hover:pl-2">
                                  <span className="font-serif text-3xl font-black text-butter/40 group-hover:text-butter transition-colors leading-none select-none pt-0.5">
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                  <div className="space-y-1.5 flex-1">
                                    <Link 
                                      href={`/categories/${article.category?.slug || 'general'}`} 
                                      className="text-[8px] font-bold text-butter/90 tracking-widest uppercase hover:underline"
                                    >
                                      {article.category?.name || 'General'}
                                    </Link>
                                    <h4 className="font-serif text-xs sm:text-sm font-bold leading-snug hover:text-butter transition-colors line-clamp-2">
                                      <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                                    </h4>
                                    <div className="flex items-center justify-between text-[9px] text-brand-warmgrey font-sans font-medium">
                                      <span>By {article.author?.name}</span>
                                      <span className="text-butter font-semibold">{article.views || 0} views</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );

              case 'Newsroom':
                return (
                  <section key="newsroom" className="fade-up w-full py-12 bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent">
                    <div className="absolute inset-0 bg-[var(--background)] z-[-1]" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <LivingNewsroom />
                    </div>
                  </section>
                );

              case 'Globe':
                return (
                  <section key="globe" className="fade-up w-full py-12 bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent">
                    <div className="absolute inset-0 bg-[var(--background)] z-[-1]" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <GlobalIntelligenceGlobe onSelectCountry={setSelectedCountry} />
                    </div>
                  </section>
                );

              case 'Despatches':
                return (
                  <section key="despatches" className="fade-in w-full py-12 bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent">
                    <div className="absolute inset-0 bg-[var(--background)] z-[-1]" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                      {/* Left Col: Despatches list */}
                      <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-teal" />
                            <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-midnight">
                              {selectedCountry ? `Despatches: ${selectedCountry}` : 'All Despatches'}
                            </h2>
                          </div>
                          {selectedCountry && (
                            <button 
                              onClick={() => setSelectedCountry(null)}
                              className="text-xs font-bold text-teal hover:underline font-sans cursor-pointer"
                            >
                              Clear Filter
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-6">
                          {filteredLatestArticles.length === 0 ? (
                            <div className="border border-dashed border-border/50 rounded-2xl p-10 text-center text-muted font-sans text-xs">
                              No articles found matching country index: &ldquo;{selectedCountry}&rdquo;
                            </div>
                          ) : (
                            filteredLatestArticles.map((article, idx) => (
                              <div key={article.id} className="flex gap-5 items-start py-5 border-b border-border/30 last:border-b-0 group">
                                <span className="font-serif text-3xl font-black text-brand-teal/20 group-hover:text-brand-teal transition-colors leading-none select-none pt-0.5">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center justify-between">
                                    <Link 
                                      href={`/categories/${article.category?.slug}`} 
                                      className="text-[9px] font-bold text-brand-teal dark:text-brand-teal-light tracking-widest uppercase bg-brand-teal/5 dark:bg-brand-teal-light/5 px-2.5 py-0.5 rounded border border-brand-teal/10"
                                    >
                                      {article.category?.name}
                                    </Link>
                                    {article.author?.country && (
                                      <span className="text-[9px] font-bold text-muted bg-card-bg border border-border/30 px-2 py-0.5 rounded">
                                        {article.author.country}
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug hover:text-brand-teal transition-colors">
                                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                                  </h3>
                                  <p className="text-xs sm:text-sm text-muted line-clamp-2 leading-relaxed font-sans font-medium">
                                    {article.excerpt}
                                  </p>
                                  <div className="pt-2 flex items-center justify-between border-t border-border/20 text-[10px] text-muted font-bold">
                                    <span>By {article.author?.name}</span>
                                    <Link href={`/articles/${article.slug}`} className="text-brand-teal dark:text-brand-teal-light hover:underline flex items-center gap-1 font-black">
                                      Read Article &rarr;
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right Col: Board Widget */}
                      <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center space-x-2 border-b border-border/60 pb-3">
                          <UserCheck className="w-5 h-5 text-brand-teal" />
                          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-foreground">The Board</h2>
                        </div>

                        <div className="border border-border/40 bg-card-bg text-foreground rounded-[32px] overflow-hidden shadow-lg flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
                          <div className="bg-brand-teal p-6 text-brand-midnight border-b border-brand-teal/10 flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-midnight/10 bg-brand-midnight flex items-center justify-center p-2">
                              <Logo variant="mark" size="sm" />
                            </div>
                            <div>
                              <h3 className="font-serif text-base font-bold tracking-wide leading-tight text-brand-midnight">The Youth Prism</h3>
                              <p className="text-[9px] text-brand-midnight/75 italic tracking-wider">Editorial Collective</p>
                            </div>
                          </div>

                          <div className="p-6 space-y-5">
                            <div className="space-y-1.5">
                              <h4 className="font-serif text-lg font-black leading-tight text-foreground">Global Editorial Board</h4>
                              <p className="text-xs text-muted leading-relaxed font-sans font-medium">A collaborative policy, law, and tech intelligence node written and managed by researchers under 30.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 bg-brand-teal/5 rounded-2xl p-4 text-center border border-brand-teal/10">
                              <div>
                                <span className="block text-lg font-black text-brand-teal dark:text-brand-teal-light">
                                  {settings?.papersCount || '12'}
                                </span>
                                <span className="text-[9px] text-muted font-bold uppercase tracking-wider font-sans">Papers</span>
                              </div>
                              <div className="border-x border-border/20">
                                <span className="block text-lg font-black text-brand-teal dark:text-brand-teal-light">
                                  {settings?.readersCount ? settings.readersCount.replace('+', '') : '24k'}
                                </span>
                                <span className="text-[9px] text-muted font-bold uppercase tracking-wider font-sans">Readers</span>
                              </div>
                              <div>
                                <span className="block text-lg font-black text-brand-teal dark:text-brand-teal-light">
                                  {settings?.sectorsCount || '5'}
                                </span>
                                <span className="text-[9px] text-muted font-bold uppercase tracking-wider font-sans">Sectors</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <Link 
                                href="/team" 
                                className="bg-brand-teal hover:bg-brand-teal/90 text-center py-2.5 rounded-full text-[10px] uppercase tracking-wider font-bold text-brand-midnight transition-all shadow-md block"
                              >
                                Collective
                              </Link>
                              <Link 
                                href="/about" 
                                className="bg-transparent border border-border/40 hover:bg-card-bg text-center py-2.5 rounded-full text-[10px] uppercase tracking-wider font-bold text-foreground transition-all block"
                              >
                                Manifesto
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );

              case 'Node Graph':
                return (
                  <section key="node-graph" className="fade-in w-full py-12 bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent">
                    <div className="absolute inset-0 bg-[var(--background)] z-[-1]" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
                      <div className="border-b border-white/10 pb-3">
                        <h2 className="font-serif text-xl sm:text-2xl font-black uppercase tracking-wide text-brand-cream">Focus Areas Intersections</h2>
                      </div>
                      <FocusAreaEcosystem />
                    </div>
                  </section>
                );

              case 'Pathways':
                return (
                  <section key="pathways" className="fade-in bg-transparent py-12 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent">
                    <div className="absolute inset-0 bg-[var(--background)] z-[-1]" />
                    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
                      <div className="border-b border-white/10 pb-3">
                        <h2 className="font-serif text-xl sm:text-2xl font-black uppercase tracking-wide text-brand-cream">Guided Learning Journeys</h2>
                      </div>
                      <ReadingPathways />
                    </div>
                  </section>
                );

              case 'Reports':
                return (
                  <section key="reports" className="fade-in w-full py-12 bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent">
                    <div className="absolute inset-0 bg-[var(--background)] z-[-1]" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-5 h-5 text-brand-teal" />
                          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-brand-cream">Special Reports & Booklets</h2>
                        </div>
                        <Link href="/publications" className="text-xs font-bold text-brand-teal hover:text-brand-lavender hover:underline flex items-center transition-colors">
                          Bookshelf Catalog &rarr;
                        </Link>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Report 1 */}
                        <div className="group flex bg-card-bg/20 border border-border/40 glass rounded-[32px] p-6 items-center gap-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <div className="w-24 h-32 flex-shrink-0 bg-gradient-to-br from-brand-teal to-brand-midnight2 border border-white/10 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-500 flex flex-col justify-between p-3 relative overflow-hidden">
                            <span className="text-[6px] tracking-widest uppercase font-bold text-brand-butter">TYP Publication</span>
                            <span className="font-serif text-[10px] font-bold text-foreground leading-tight tracking-tight mt-2 block">AI Governance & Sovereignty</span>
                            <span className="text-[6px] text-butter font-semibold mt-auto block">Annual Report 2026</span>
                          </div>
                          <div className="space-y-2 flex-1">
                            <span className="text-[9px] font-bold text-midnight tracking-widest uppercase bg-butter/90 px-2 py-0.5 rounded border border-butter/20">Special Edition</span>
                            <h3 className="font-serif text-base font-bold text-foreground">The AI Sovereignty Report</h3>
                            <p className="text-xs text-muted leading-relaxed line-clamp-2 font-sans font-medium">Exploring national regulatory models and the future of open-source models.</p>
                            <Link href="/publications/issue-01" className="text-[10px] font-bold text-brand-butter hover:text-foreground hover:underline block pt-1 font-sans">Read Digital Issue &rarr;</Link>
                          </div>
                        </div>

                        {/* Report 2 */}
                        <div className="group flex bg-card-bg/20 border border-border/40 glass rounded-[32px] p-6 items-center gap-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-cherry/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <div className="w-24 h-32 flex-shrink-0 bg-gradient-to-br from-brand-cherry to-brand-midnight2 border border-white/10 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-500 flex flex-col justify-between p-3 relative overflow-hidden">
                            <span className="text-[6px] tracking-widest uppercase font-bold text-foreground">TYP Publication</span>
                            <span className="font-serif text-[10px] font-bold text-foreground leading-tight tracking-tight mt-2 block">Healthcare Equity Systems</span>
                            <span className="text-[6px] text-butter font-semibold mt-auto block">Policy Brief 2026</span>
                          </div>
                          <div className="space-y-2 flex-1">
                            <span className="text-[9px] font-bold text-cream tracking-widest uppercase bg-cherry/80 px-2 py-0.5 rounded border border-cherry/20">Policy Brief</span>
                            <h3 className="font-serif text-base font-bold text-foreground">Vaccine Sovereignty</h3>
                            <p className="text-xs text-muted leading-relaxed line-clamp-2 font-sans font-medium">Deconstructing global patent regimes and pharmaceutical distribution disparities.</p>
                            <Link href="/publications/issue-02" className="text-[10px] font-bold text-brand-butter hover:text-foreground hover:underline block pt-1 font-sans">Read Digital Issue &rarr;</Link>
                          </div>
                        </div>

                        {/* Report 3 */}
                        <div className="group flex bg-card-bg/20 border border-border/40 glass rounded-[32px] p-6 items-center gap-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-lavender/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <div className="w-24 h-32 flex-shrink-0 bg-gradient-to-br from-brand-lavender/35 to-brand-midnight2 border border-white/10 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-500 flex flex-col justify-between p-3 relative overflow-hidden">
                            <span className="text-[6px] tracking-widest uppercase font-bold text-brand-lavender">TYP Publication</span>
                            <span className="font-serif text-[10px] font-bold text-foreground leading-tight tracking-tight mt-2 block">Technology & Labor Markets</span>
                            <span className="text-[6px] text-butter font-semibold mt-auto block">Whitepaper 2025</span>
                          </div>
                          <div className="space-y-2 flex-1">
                            <span className="text-[9px] font-bold text-midnight tracking-widest uppercase bg-lavender/90 px-2 py-0.5 rounded border border-lavender/20">Whitepaper</span>
                            <h3 className="font-serif text-base font-bold text-foreground">The Gig Work Paradigm</h3>
                            <p className="text-xs text-muted leading-relaxed line-clamp-2 font-sans font-medium">Algorithmic labor management and collective rights in digital platforms.</p>
                            <Link href="/publications/issue-01" className="text-[10px] font-bold text-brand-butter hover:text-foreground hover:underline block pt-1 font-sans">Read Digital Issue &rarr;</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );

              case 'Voice':
                return (
                  <section key="voice" className="fade-up w-full py-16 bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent">
                    <div className="absolute inset-0 bg-[var(--background)] z-[-1]" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <section className="relative border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] glass rounded-[32px] p-10 sm:p-16 overflow-hidden shadow-lg text-brand-cream grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      {/* Background quote mark */}
                      <span className="absolute -top-14 -left-10 font-serif text-[260px] font-black text-teal/5 select-none leading-none pointer-events-none">"</span>
                      
                      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-border/20 pb-6 lg:pb-0 lg:pr-8 space-y-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-teal bg-teal/10 px-3.5 py-1.5 rounded-full border border-teal/15 font-sans inline-block">
                          Voice of the Week
                        </span>
                        <h4 className="font-serif text-2xl font-black text-midnight">The Sovereign Algorithm</h4>
                        <p className="text-xs text-midnight/60 font-sans font-medium leading-relaxed">
                          Examining the structural transfer of global policy negotiation rights from legislative assemblies to algorithmic frameworks.
                        </p>
                      </div>

                      <div className="lg:col-span-8 space-y-6">
                        <p className="font-serif text-xl sm:text-2xl italic font-black leading-relaxed text-midnight">
                          "Power is no longer just negotiated in parliaments or battlefield trenches; it is written into the foundational algorithms of our global platforms."
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs font-sans">
                          <span className="font-serif text-sm font-bold text-teal">— Aria Sterling</span>
                          <span className="hidden sm:inline text-midnight/30">|</span>
                          <span className="text-midnight/60 font-medium">From the essay:</span>
                          <Link href="/articles/algorithmic-sovereignty" className="text-teal font-black hover:underline">
                            Algorithmic Sovereignty & the New Geopolitics of AI Regulation
                          </Link>
                        </div>
                      </div>
                      </section>
                    </div>
                  </section>
                );

              case 'Opportunities':
                return (
                  <section key="opportunities" className="fade-in w-full py-12 bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent">
                    <div className="absolute inset-0 bg-[var(--background)] z-[-1]" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                      {/* Focus Area Categories Overview */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                          <div className="flex items-center space-x-2">
                            <Award className="w-5 h-5 text-brand-teal" />
                            <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-foreground">Desks Directories</h2>
                          </div>
                          <Link href="/categories" className="text-xs font-bold text-brand-teal hover:underline flex items-center">
                            All Sectors &rarr;
                          </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          {categories.length > 0 ? (
                            <>
                              {categories[0] && (
                                <Link
                                  href={`/categories/${categories[0].slug}`}
                                  className="group md:col-span-7 relative overflow-hidden rounded-[24px] border border-border/40 bg-card-bg/35 p-6 flex flex-col justify-between h-[300px] shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                  <div className="relative z-10 space-y-2">
                                    <span className="text-[9px] font-black tracking-widest text-brand-teal uppercase bg-brand-teal/15 px-2.5 py-1 rounded border border-brand-teal/20 font-sans">
                                      Key Sector
                                    </span>
                                    <h3 className="font-serif text-2xl font-black text-foreground group-hover:text-brand-teal transition-colors pt-3">
                                      {categories[0].name}
                                    </h3>
                                    <p className="text-xs text-muted leading-relaxed line-clamp-4 font-sans font-medium">
                                      {categories[0].description}
                                    </p>
                                  </div>
                                  <span className="relative z-10 text-[10px] font-bold text-brand-teal hover:underline uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                    Explore Essays &rarr;
                                  </span>
                                </Link>
                              )}

                              <div className="md:col-span-5 flex flex-col gap-4 h-[300px]">
                                {categories.slice(1, 4).map((category) => (
                                  <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="group p-4 border border-border/40 bg-card-bg/20 hover:bg-card-bg/40 hover:shadow-md rounded-[20px] transition-all flex flex-col justify-between flex-grow"
                                  >
                                    <div className="space-y-1">
                                      <h4 className="font-serif text-sm font-bold text-foreground group-hover:text-brand-teal transition-colors leading-tight">
                                        {category.name}
                                      </h4>
                                      <p className="text-[10px] text-muted leading-snug line-clamp-2 font-sans font-medium">
                                        {category.description}
                                      </p>
                                    </div>
                                    <span className="text-[8px] font-black text-brand-teal uppercase tracking-wider pt-2 block group-hover:translate-x-1 transition-transform">
                                      Read &rarr;
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="md:col-span-12 p-8 text-center border border-dashed border-border/50 rounded-[24px] bg-card-bg/40">
                              <p className="text-xs text-muted">No sectors configured yet.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Opportunities Desk list overview */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-brand-teal" />
                            <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-foreground">Opportunities Desk</h2>
                          </div>
                          <Link href="/opportunities" className="text-xs font-bold text-brand-teal hover:underline flex items-center">
                            Opps Desk &rarr;
                          </Link>
                        </div>

                        <div className="border border-border/40 bg-card-bg/30 glass rounded-[28px] overflow-hidden shadow-lg">
                          {opportunities.length === 0 ? (
                            <div className="p-8 text-center bg-brand-teal/5">
                              <p className="text-xs text-muted font-sans">No active opportunities posted yet.</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-border/20">
                              {opportunities.slice(0, 4).map((opp) => (
                                <div 
                                  key={opp.id} 
                                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-card-bg/30 transition-colors group"
                                >
                                  <div className="space-y-1.5 flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="tag !px-2 !py-0.5 !text-[8px] tag-teal bg-brand-teal text-brand-midnight border border-brand-teal/20">
                                        {opp.type}
                                      </span>
                                      <span className="text-[9px] text-muted font-semibold tracking-wider uppercase font-sans">
                                        {opp.location}
                                      </span>
                                    </div>
                                    <h3 className="font-serif text-base font-bold text-foreground group-hover:text-brand-teal transition-colors leading-tight">
                                      {opp.title}
                                    </h3>
                                  </div>
                                  
                                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-border/20 pt-2 sm:pt-0 font-sans">
                                    {opp.stipend && (
                                      <span className="text-[10px] font-black text-brand-teal bg-brand-teal/10 px-2.5 py-0.5 rounded border border-brand-teal/20">
                                        {opp.stipend}
                                      </span>
                                    )}
                                    <div className="flex items-center space-x-3 text-[10px] text-muted font-sans">
                                      <span>Due: {opp.deadline}</span>
                                      <Link href="/opportunities" className="text-brand-teal font-black hover:underline flex items-center gap-0.5">
                                        Apply &rarr;
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                );

              case 'Archive':
                return (
                  <section key="archive" className="fade-in w-full py-12 bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent">
                    <div className="absolute inset-0 bg-[var(--background)] z-[-1]" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                      {/* Left Col: Grid feed of editorial selections */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-foreground">Editorial Archive</h2>
                          <Link href="/articles" className="text-xs font-bold tracking-widest uppercase text-brand-teal hover:underline flex items-center">
                            Archive <ChevronRight className="w-4 h-4 ml-0.5" />
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {articles.slice(0, 4).map(article => (
                            <ArticleCard key={article.id} article={article} />
                          ))}
                        </div>
                      </div>

                      {/* Right Col: Choice Widget board */}
                      <div className="space-y-6">
                        <div className="border-b border-border/60 pb-3">
                          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-foreground">Editor&apos;s Choices</h2>
                        </div>
                        
                        <div className="bg-card-bg/40 border border-border/40 glass rounded-[32px] p-6 shadow-xl space-y-6 text-foreground">
                          {editorsPicks.map((article) => (
                            <div 
                              key={article.id} 
                              className="group border-b border-border/20 pb-5 last:border-0 last:pb-0 space-y-2"
                            >
                              <Link
                                href={`/categories/${article.category?.slug}`}
                                className="text-[9px] font-semibold text-brand-teal dark:text-brand-teal-light uppercase tracking-[0.15em] block"
                              >
                                {article.category?.name}
                              </Link>
                              <h3 className="font-serif text-base font-bold leading-snug hover:text-brand-teal transition-colors">
                                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                              </h3>
                              <p className="text-xs text-muted line-clamp-2 leading-relaxed font-sans font-medium">{article.excerpt}</p>
                              
                              <div className="mt-3 flex items-center justify-between text-[9px] text-muted font-semibold uppercase tracking-wider">
                                <span>By {article.author?.name}</span>
                                <span>
                                  {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                );

              default:
                return null;
            }
          };

          return (
            <>
              {order.map(sectionName => renderSection(sectionName))}
            </>
          );
        })()
      )}

      <Footer />
    </div>
  );
}
