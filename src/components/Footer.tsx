'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { db } from '../lib/db';
import Logo from './Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await db.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="dark bg-background text-foreground pt-16 pb-8 transition-all duration-300">
      {/* Content wrapped in a Pinterest rounded cream footer card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-card-border bg-card-bg rounded-[32px] p-8 sm:p-10 shadow-lg space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 pb-10 border-b border-card-border/60">
            {/* Brand Info */}
            <div className="space-y-5">
              <Link href="/" className="transition-opacity hover:opacity-90 block">
                <Logo variant="horizontal" size="md" />
              </Link>
              <p className="text-foreground/90 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">
                An independent, youth-run editorial examining technology, global policies, medical justice, and societal shifts shaping the next century.
              </p>
              <div className="flex space-x-3 text-[10px] sm:text-xs">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-accent transition-colors font-black uppercase tracking-wider">Twitter</a>
                <span className="text-card-border">•</span>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-accent transition-colors font-black uppercase tracking-wider">LinkedIn</a>
                <span className="text-card-border">•</span>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-accent transition-colors font-black uppercase tracking-wider">Instagram</a>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-8 lg:col-span-1">
              <div>
                <h3 className="text-[10px] font-black tracking-widest text-accent uppercase mb-4">Magazine</h3>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  <li><Link href="/articles" className="text-foreground/90 hover:text-accent transition-colors font-semibold">All Articles</Link></li>
                  <li><Link href="/categories" className="text-foreground/90 hover:text-accent transition-colors font-semibold">Categories</Link></li>
                  <li><Link href="/team" className="text-foreground/90 hover:text-accent transition-colors font-semibold">Editorial Collective</Link></li>
                  <li><Link href="/opportunities" className="text-foreground/90 hover:text-accent transition-colors font-semibold">Opportunities</Link></li>
                  <li><Link href="/about" className="text-foreground/90 hover:text-accent transition-colors font-semibold">About Us</Link></li>
                  <li><Link href="/contact" className="text-foreground/90 hover:text-accent transition-colors font-semibold">Write for Us</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] font-black tracking-widest text-accent uppercase mb-4">Categories</h3>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  <li><Link href="/categories/technology" className="text-foreground/90 hover:text-accent transition-colors font-semibold">Technology</Link></li>
                  <li><Link href="/categories/policy" className="text-foreground/90 hover:text-accent transition-colors font-semibold">Policy</Link></li>
                  <li><Link href="/categories/healthcare" className="text-foreground/90 hover:text-accent transition-colors font-semibold">Healthcare</Link></li>
                  <li><Link href="/categories/global-affairs" className="text-foreground/90 hover:text-accent transition-colors font-semibold">Global Affairs</Link></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Box (Blended Container on Cream Card) */}
            <div className="bg-brand-butter border border-brand-butter2 p-6 rounded-[24px] shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-midnight">Subscribe to the Briefing</h3>
                <p className="text-xs text-brand-midnight/80 font-medium leading-relaxed mt-1">
                  Receive our weekly curated breakdown of tech, policy, and healthcare issues delivered straight to your inbox.
                </p>
              </div>
              {subscribed ? (
                <div className="flex items-center space-x-2 text-brand-midnight p-3 bg-brand-cream/50 rounded-2xl border border-brand-midnight/15">
                  <span className="text-[11px] font-bold">Thank you! You have subscribed.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex relative items-center">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-brand-cream border border-brand-midnight/20 text-brand-midnight px-4 py-3 pr-12 rounded-full text-xs font-medium focus:outline-none focus:border-brand-midnight focus:ring-1 focus:ring-brand-midnight shadow-inner transition-all placeholder:text-brand-midnight/50"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1.5 p-2 bg-brand-midnight text-brand-cream rounded-full hover:bg-brand-teal transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-foreground/90 font-bold uppercase tracking-wider">
            <p>© {new Date().getFullYear()} The Youth Prism. All rights reserved.</p>
            <div className="mt-4 sm:mt-0 flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href="/about" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-accent transition-colors">Contact Support</Link>
              <Link href="/admin" className="hover:text-accent transition-colors font-bold text-accent">Admin Workspace</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
