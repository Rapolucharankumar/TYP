'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldAlert, Globe, Coins, HeartPulse, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FocusCardProps {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<any>;
  slug: string;
  color: string;
  delay: number;
}

const NODES: FocusCardProps[] = [
  { id: 'tech', name: 'Technology', desc: 'Algorithmic computing, AI risk profiles, and semiconductor production.', icon: Cpu, slug: 'technology', color: 'teal', delay: 0 },
  { id: 'policy', name: 'Policy', desc: 'Legislative acts, antitrust codes, and digital sovereignty frameworks.', icon: ShieldAlert, slug: 'policy', color: 'butter', delay: 0.1 },
  { id: 'geopolitics', name: 'Geopolitics', desc: 'Maritime security, border sovereign conflicts, and mineral supply wars.', icon: Globe, slug: 'global-affairs', color: 'cherry', delay: 0.2 },
  { id: 'economics', name: 'Economics', desc: 'Trade embargoes, intellectual asset rents, and international pricing models.', icon: Coins, slug: 'policy', color: 'lavender', delay: 0.3 },
  { id: 'healthcare', name: 'Healthcare', desc: 'Global access consortia, pandemic security, and vaccine patent waivers.', icon: HeartPulse, slug: 'healthcare', color: 'teal', delay: 0.4 }
];

export default function FocusAreaEcosystem() {
  return (
    <div className="space-y-12 w-full">
      <div className="space-y-4 max-w-3xl">
        <p className="text-sm text-foreground/80 leading-relaxed font-sans font-medium">
          Geopolitical intelligence does not live in isolated silos. Algorithmic networks shape legislative policy, policy restricts hardware manufacturing, and economic parameters govern clinical and healthcare outcomes. Explore our interconnected nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {NODES.map((node) => {
          const Icon = node.icon;
          return (
            <Link href={`/categories/${node.slug}`} key={node.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: node.delay, ease: "easeOut" }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`group relative h-[220px] flex flex-col p-6 sm:p-8 rounded-[32px] overflow-hidden glass border border-white/5 hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl`}
              >
                {/* Animated Gradient Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute -inset-[100%] group-hover:inset-0 bg-[var(--prism-gradient-soft)] opacity-0 group-hover:opacity-10 transition-all duration-700 pointer-events-none blur-3xl rounded-full" />
                
                {/* Icon Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-brand-${node.color} group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_25px_var(--color-brand-${node.color})]`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1" />
                </div>

                {/* Content */}
                <div className="space-y-3 relative z-10 flex-grow">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground tracking-wide">
                    {node.name}
                  </h3>
                  <p className="font-sans text-sm text-muted leading-relaxed font-medium">
                    {node.desc}
                  </p>
                </div>

                {/* Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-teal group-hover:w-full transition-all duration-700 ease-in-out opacity-70" />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
