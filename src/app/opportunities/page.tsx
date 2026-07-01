'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Calendar, MapPin, Award, BookOpen, Send, Search, Star, Clock, AlertTriangle } from 'lucide-react';
import { db } from '../../lib/db';
import { Opportunity } from '../../types';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Fellowships' | 'Scholarships' | 'Competitions' | 'Internships' | 'Research Programs' | 'Conferences'>('All');

  useEffect(() => {
    async function loadOpps() {
      try {
        const loaded = await db.getOpportunities();
        setOpportunities(loaded);
      } catch (err) {
        console.error('Failed to load opportunities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOpps();
  }, []);

  // Filter logic
  const filteredOpps = opportunities.filter((opp) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = opp.title.toLowerCase().includes(query);
    const locationMatch = opp.location.toLowerCase().includes(query);
    const descMatch = opp.description.toLowerCase().includes(query);
    const typeMatch = opp.type.toLowerCase().includes(query);

    const textMatch = titleMatch || locationMatch || descMatch || typeMatch;

    if (!textMatch) return false;
    if (activeTab === 'All') return true;
    return opp.type.toLowerCase() === activeTab.toLowerCase();
  });

  const featuredOpp = opportunities[0]; // Let's take the first one as featured
  const normalOpps = filteredOpps.filter(o => o.id !== featuredOpp?.id);

  // Helper to parse deadline days
  const getDeadlineBadge = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const today = new Date('2026-06-10'); // Anchored mock time
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="tag tag-cherry !px-2.5 !py-0.5 !text-[8.5px] font-sans flex items-center gap-1">
          Closed
        </span>
      );
    }
    if (diffDays <= 7) {
      return (
        <span className="tag tag-cherry !px-2.5 !py-0.5 !text-[8.5px] font-sans flex items-center gap-1 animate-pulse">
          <AlertTriangle className="w-3 h-3 text-red-500" />
          Closing in {diffDays} {diffDays === 1 ? 'day' : 'days'}
        </span>
      );
    }
    if (diffDays <= 30) {
      return (
        <span className="tag tag-butter !px-2.5 !py-0.5 !text-[8.5px] font-sans flex items-center gap-1">
          <Clock className="w-3 h-3 text-brand-gold" />
          Closing in {diffDays} days
        </span>
      );
    }
    return (
      <span className="tag tag-teal !px-2.5 !py-0.5 !text-[8.5px] font-sans flex items-center gap-1">
        Open ({diffDays} days left)
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--teal)]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--butter)]/5 rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Page Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="tag text-brand-teal bg-brand-teal/10 border border-brand-teal/20 font-sans">
            Collective Opportunities Desk
          </span>
          <h1 id="page-title" className="font-serif text-4xl sm:text-6xl font-black tracking-tight text-foreground">
            Opportunities Discovery
          </h1>
          <p className="text-muted text-sm sm:text-base leading-relaxed font-sans font-medium">
            Explore curated international fellowships, research grants, writing competitions, and policy internships designed to elevate and fund your investigative work.
          </p>
        </section>

        {/* Filter and Search controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass-panel border border-white/5 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {(['All', 'Fellowships', 'Scholarships', 'Competitions', 'Internships', 'Research Programs', 'Conferences'] as const).map(tab => (
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

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by title, location, desk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background/50 border border-border/40 text-foreground px-4 py-2.5 pl-10 rounded-full text-xs focus:outline-none focus:border-brand-teal shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-muted absolute left-3.5 top-3" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="border border-border/40 border-dashed rounded-[32px] p-12 text-center bg-card-bg/25 max-w-4xl mx-auto">
            <h3 className="font-serif text-xl font-bold">No active opportunities</h3>
            <p className="text-xs text-muted mt-1 font-sans">Check back later or subscribe to our briefing letter below.</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Featured Opportunity Section */}
            {featuredOpp && activeTab === 'All' && searchQuery === '' && (
              <section className="glass-panel border border-white/5 rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="absolute top-4 left-4 flex items-center space-x-1 text-[9px] font-black text-brand-teal uppercase tracking-widest font-sans">
                  <Star className="w-3.5 h-3.5 fill-brand-teal" />
                  <span>Featured Opportunity</span>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="tag tag-teal bg-brand-teal text-brand-midnight border-brand-teal/20">
                      {featuredOpp.type}
                    </span>
                    {featuredOpp.stipend && (
                      <span className="tag tag-butter bg-brand-teal/15 text-brand-teal-light border border-brand-teal/20">
                        {featuredOpp.stipend}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-foreground leading-snug">
                    {featuredOpp.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans font-medium">
                    {featuredOpp.description}
                  </p>
                </div>

                <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-border/30 pt-6 lg:pt-0 lg:pl-6 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-2.5 text-xs text-muted font-sans">
                    <div className="flex justify-between items-center py-1 border-b border-border/10">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brand-teal" /> Deadline:</span>
                      <span className="font-bold text-foreground">{featuredOpp.deadline}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/10">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-teal" /> Location:</span>
                      <span className="font-bold text-foreground">{featuredOpp.location}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Status:</span>
                      {getDeadlineBadge(featuredOpp.deadline)}
                    </div>
                  </div>

                  <Link
                    href="/contact?topic=fellowship"
                    className="btn-primary w-full text-center py-2.5"
                  >
                    Submit Fellowship Application
                  </Link>
                </div>
              </section>
            )}

            {/* Opportunity Card Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(activeTab === 'All' && searchQuery === '' ? normalOpps : filteredOpps).map((opp) => (
                <div
                  key={opp.id}
                  className="glass-panel border border-white/5 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-lg hover:shadow-xl hover:border-white/10 hover-glow-butter transition-all duration-300 h-full space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className={`tag ${opp.tagClass} bg-brand-teal/15 border-brand-teal/20`}>
                        {opp.type}
                      </span>
                      {opp.stipend && (
                        <span className="tag text-brand-teal bg-brand-teal/10 border border-brand-teal/20">
                          {opp.stipend}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-serif text-xl sm:text-2xl font-black text-foreground leading-snug">
                      {opp.title}
                    </h3>
                    
                    <p className="text-xs text-muted leading-relaxed font-sans font-medium">
                      {opp.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/20 flex flex-wrap gap-y-2 justify-between items-center text-xs text-muted font-sans font-semibold">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                        <span className="text-foreground">{opp.location}</span>
                      </span>
                      <div className="flex items-center gap-1.5 pt-1">
                        {getDeadlineBadge(opp.deadline)}
                      </div>
                    </div>

                    <Link
                      href="/contact?topic=fellowship"
                      className="text-xs font-black text-brand-teal hover:underline uppercase tracking-widest"
                    >
                      Inquire Desk &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </section>

          </div>
        )}

        {/* Opportunities Newsletter pitch */}
        <section className="glass-panel border border-white/5 rounded-[32px] p-8 sm:p-10 shadow-lg text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-foreground">Stay Informed on Fellowships & Prizes</h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans font-medium">
              We send out specialized despatches detailing writing prompts, competitive essay submissions, and workshop registrations twice a month. Join the writers desk circle.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to opportunities list!'); }} className="flex relative items-center">
              <input
                id="opps-email-input"
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full bg-background/50 border border-border/40 text-foreground px-4 py-3 pr-12 rounded-full text-xs focus:outline-none focus:border-brand-teal shadow-inner"
              />
              <button
                id="opps-subscribe-btn"
                type="submit"
                className="absolute right-1.5 p-2 bg-brand-teal text-brand-midnight rounded-full hover:opacity-90 transition-colors cursor-pointer flex items-center justify-center border-none"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
