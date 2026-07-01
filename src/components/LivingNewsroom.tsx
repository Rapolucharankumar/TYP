'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ChevronDown, ChevronUp, AlertCircle, Cpu, Globe, Compass, ShieldAlert, ThermometerSun } from 'lucide-react';

interface NewsItem {
  category: string;
  headline: string;
  source: string;
  urgency: 'high' | 'medium' | 'low';
}

const LIVE_NEWS: NewsItem[] = [
  { category: 'AI Governance', headline: 'EU drafts unified standards on large model open-source weight distribution.', source: 'Brussels Bureau', urgency: 'high' },
  { category: 'Geopolitics', headline: 'Supply chain consortium starts construction of sub-3nm packing facility in Osaka.', source: 'Nikkei Dispatch', urgency: 'medium' },
  { category: 'Climate', headline: 'COP31 draft protocol recommends legal refugee status expansion for island states.', source: 'Geneva Council', urgency: 'high' },
  { category: 'Global Health', headline: 'WTO initiates emergency hearing on patent exemptions for tuberculosis strains.', source: 'WHO Wire', urgency: 'medium' },
  { category: 'Technology', headline: 'Quantum communication network established between Hamburg and Copenhagen research units.', source: 'Tech Desk', urgency: 'low' },
  { category: 'International Affairs', headline: 'Indian Ocean shipping corridors patrol augmented under new mini-lateral pact.', source: 'Maritime Command', urgency: 'high' }
];

const DAILY_BRIEFS = [
  {
    title: 'Transatlantic AI Divergence Deepens',
    desc: 'The US chip embargo expansion has forced EU firms to adjust compliance structures. Brussels concerns center on proprietary lock-ins, while US defense desks prioritize hardware sovereignty over strict auditing frameworks.',
    tag: 'Technology Policy',
    icon: Cpu,
    color: 'text-brand-teal bg-brand-teal/10 border-brand-teal/20'
  },
  {
    title: 'Indo-Pacific Chip Alliances Shift',
    desc: 'Bilateral semiconductor manufacturing agreements signed between Tokyo and Bangalore indicate secondary supply loops are accelerating, bypassing primary shipping routes across the Taiwan Strait.',
    tag: 'Geopolitics',
    icon: Globe,
    color: 'text-brand-red bg-brand-red/10 border-brand-red/20'
  },
  {
    title: 'WTO TRIPS Vaccine Patent Stalemate',
    desc: 'Several low-and-middle-income countries are demanding a complete intellectual property waiver on upcoming clinical mRNA structures. Major bio-pharma corporations continue to lobby for license agreements instead.',
    tag: 'Global Health',
    icon: ShieldAlert,
    color: 'text-brand-lavender bg-brand-lavender/10 border-brand-lavender/20'
  }
];

export default function LivingNewsroom() {
  const [briefingOpen, setBriefingOpen] = useState(false);

  return (
    <div className="w-full space-y-4">
      
      {/* Horizontal News Ticker */}
      <div 
        className="w-full h-10 bg-brand-midnight2 border-y border-border/40 overflow-hidden flex items-center relative text-brand-cream"
      >
        {/* Active Badge */}
        <div className="absolute left-0 top-0 bottom-0 px-4 bg-brand-teal text-brand-midnight text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 z-10 shadow-[8px_0_16px_rgba(0,0,0,0.5)] border-r border-border/20">
          <Radio className="w-3.5 h-3.5 text-brand-butter animate-pulse" />
          <span>Intelligence Feed</span>
        </div>

        {/* Marquee Wrapper */}
        <div className="flex w-full overflow-hidden items-center pl-36">
          <motion.div 
            animate={{ x: [0, -1800] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear"
            }}
            whileHover={{ x: 0 }} // Pause on hover doesn't work directly with x transition like this, so we use CSS marquee style or just continuous motion
            className="flex items-center space-x-12 whitespace-nowrap pr-12 cursor-pointer hover:[animation-play-state:paused]"
          >
            {/* Double items for loop seamless transition */}
            {[...LIVE_NEWS, ...LIVE_NEWS].map((news, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-xs">
                <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                  news.urgency === 'high' 
                    ? 'bg-brand-red/20 text-red-400 border-brand-red/35' 
                    : 'bg-brand-teal/20 text-brand-butter border-brand-teal/30'
                }`}>
                  {news.category}
                </span>
                <span className="font-sans font-medium text-brand-cream/90">{news.headline}</span>
                <span className="text-brand-cream/70 italic text-[10px]">— {news.source}</span>
                <span className="text-brand-butter/40">•</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Daily Briefing Ribbon (Expandable) */}
      <div className="border border-border/40 bg-card-bg/40 glass rounded-[24px] overflow-hidden transition-all duration-300">
        <button
          onClick={() => setBriefingOpen(!briefingOpen)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-card-bg/30 transition-colors focus:outline-none"
        >
          <div className="flex items-center space-x-3">
            <span className="p-1.5 rounded-lg bg-brand-red/10 border border-brand-red/20 text-brand-red">
              <AlertCircle className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-serif text-sm font-bold text-foreground">Global Intelligence Briefing</h4>
              <p className="text-[10px] text-foreground/90 font-sans mt-0.5">Analysis of the day&apos;s key geopolitical and technological movements</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-accent font-sans bg-accent/5 px-2.5 py-1 rounded border border-accent/15">
              3 Briefs Active
            </span>
            {briefingOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
          </div>
        </button>

        <AnimatePresence>
          {briefingOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-t border-border/30"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border/20">
                {DAILY_BRIEFS.map((brief, idx) => {
                  const Icon = brief.icon;
                  return (
                    <div key={idx} className={`space-y-3 ${idx > 0 ? 'md:pl-6' : ''} ${idx > 0 ? 'pt-6 md:pt-0' : ''}`}>
                      <div className="flex items-center justify-between">
                        <span className={`tag !px-2.5 !py-0.5 !text-[8.5px] border ${brief.color}`}>
                          {brief.tag}
                        </span>
                        <Icon className="w-4 h-4 text-muted/85" />
                      </div>
                      <h5 className="font-serif text-sm font-bold text-foreground hover:text-accent transition-colors leading-tight">
                        {brief.title}
                      </h5>
                      <p className="text-xs text-foreground/90 leading-relaxed font-sans font-medium">
                        {brief.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
