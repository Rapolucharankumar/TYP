'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Circle, Map, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PathwayStep {
  title: string;
  slug: string;
  duration: string;
  description: string;
  isRead?: boolean;
}

interface Pathway {
  id: string;
  title: string;
  description: string;
  difficulty: 'Introductory' | 'Intermediate' | 'Advanced';
  steps: PathwayStep[];
}

const PATHWAYS: Pathway[] = [
  {
    id: 'ai-gov',
    title: 'Understanding AI Governance',
    description: 'Trace the progression of algorithmic sovereignty, transatlantic regulatory risks, and state computing grid setups.',
    difficulty: 'Intermediate',
    steps: [
      {
        title: 'Algorithmic Sovereignty & the New Geopolitics of AI Regulation',
        slug: 'algorithmic-sovereignty',
        duration: '6 min read',
        description: 'Analyze how the transatlantic divide on model risk ratings is carving new alliances.'
      },
      {
        title: 'Silicon Cartography: The Quantum Semiconductor Supply Chain',
        slug: 'silicon-cartography',
        duration: '8 min read',
        description: 'Examine ASML lithography equipment, TSMC production grids, and raw silicone controls.'
      },
      {
        title: 'Algorithmic Despotism: Gig Work in the Age of Automation',
        slug: 'gig-economy-automation',
        duration: '5 min read',
        description: 'Understand how delivery platforms use gamified dispatch code to govern workforce behaviors.'
      }
    ]
  },
  {
    id: 'indo-pacific',
    title: 'Understanding Indo-Pacific Strategy',
    description: 'Deconstruct regional mini-lateral alliances, trade agreements, and maritime supply chain protection grids.',
    difficulty: 'Advanced',
    steps: [
      {
        title: 'Redefining the Indo-Pacific Strategy for a Multipolitical World',
        slug: 'indo-pacific-strategy',
        duration: '7 min read',
        description: 'Examine regional minilaterals around the Malacca Strait designed to protect maritime trade.'
      },
      {
        title: 'Silicon Cartography: The Quantum Semiconductor Supply Chain',
        slug: 'silicon-cartography',
        duration: '8 min read',
        description: 'Explore chip fab concentration and tech export rules across the Hsinchu-Tokyo corridor.'
      }
    ]
  },
  {
    id: 'health-equity',
    title: 'Understanding Global Health',
    description: 'Analyze post-colonial medical frameworks, patent waiver rules, and vaccine production decentralization.',
    difficulty: 'Introductory',
    steps: [
      {
        title: 'Democratizing Vaccines: Intellectual Property vs Health Equity',
        slug: 'vaccine-intellectual-property',
        duration: '7 min read',
        description: 'Analyze how international patent laws affect vaccine access and manufacturing capabilities in developing nations.'
      }
    ]
  }
];

export default function ReadingPathways() {
  const [activePathId, setActivePathId] = useState<string>('ai-gov');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [hoveredPathId, setHoveredPathId] = useState<string | null>(null);
  const [hoveredStepSlug, setHoveredStepSlug] = useState<string | null>(null);

  const activePath = PATHWAYS.find(p => p.id === activePathId) || PATHWAYS[0];

  const toggleStepRead = (stepSlug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCompletedSteps(prev => ({
      ...prev,
      [stepSlug]: !prev[stepSlug]
    }));
  };

  const pathCompletedCount = activePath.steps.filter(s => completedSteps[s.slug]).length;
  const pathProgressPercent = (pathCompletedCount / activePath.steps.length) * 100;

  return (
    <div className="bg-brand-midnight border border-brand-midnight2 p-6 sm:p-8 rounded-[32px] shadow-lg relative overflow-hidden">
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(189,231,217,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Pathway Menu (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center space-x-2.5">
            <Compass className="w-5 h-5 text-brand-butter" />
            <h3 className="font-serif text-lg font-black text-brand-cream">Reading Pathways</h3>
          </div>
          <p className="text-xs text-brand-warmgrey leading-relaxed font-sans font-medium">
            Explore complete intellectual systems rather than isolated articles. Select an editorial track below to begin your guided journey.
          </p>

          <div className="space-y-2 pt-2">
            {PATHWAYS.map((path) => {
              const isDimmed = hoveredPathId !== null && hoveredPathId !== path.id;
              return (
                <button
                  key={path.id}
                  onClick={() => setActivePathId(path.id)}
                  onMouseEnter={() => setHoveredPathId(path.id)}
                  onMouseLeave={() => setHoveredPathId(null)}
                  style={{
                    opacity: isDimmed ? 0.5 : 1,
                    transition: 'opacity 0.3s ease, background 0.3s ease, border-color 0.3s ease'
                  }}
                  className={`w-full text-left p-4 rounded-[20px] border transition-all flex flex-col justify-between ${
                    activePathId === path.id
                      ? 'bg-brand-midnight2 border-brand-butter text-brand-cream shadow'
                      : 'bg-brand-midnight2/50 border-brand-midnight3 text-brand-warmgrey hover:bg-brand-midnight2 hover:border-brand-butter/50 hover:text-brand-cream'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`tag !px-2 !py-0.5 !text-[7px] ${
                        path.difficulty === 'Introductory' ? 'tag-teal' : path.difficulty === 'Intermediate' ? 'tag-butter' : 'tag-cherry'
                      }`}>
                        {path.difficulty}
                      </span>
                      <span className="text-[9px] font-sans font-bold text-brand-warmgrey">
                        {path.steps.length} Chapters
                      </span>
                    </div>
                    <h4 className="font-serif text-sm font-bold pt-1">{path.title}</h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Step Progression Node List (8 cols) */}
        <div className="lg:col-span-8 border border-brand-midnight3 bg-brand-midnight2/80 p-6 rounded-[24px] space-y-6">
          
          {/* Pathway Header Status */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-brand-midnight3">
            <div>
              <h4 className="font-serif text-base font-bold text-brand-cream">
                {activePath.title}
              </h4>
              <p className="text-xs text-brand-warmgrey leading-relaxed font-sans font-medium mt-1">
                {activePath.description}
              </p>
            </div>
            
            {/* Progress circle/meter */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-16 h-1.5 bg-border/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-butter transition-all duration-500" 
                  style={{ width: `${pathProgressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-sans font-black uppercase tracking-wider text-brand-butter">
                {pathCompletedCount} / {activePath.steps.length} Done
              </span>
            </div>
          </div>

          {/* Connected Steps Timeline */}
          <div className="relative pl-6 space-y-6">
            
            {/* Vertical connecting line */}
            <div className="absolute left-[9px] top-3 bottom-3 w-0.5 bg-border/20" />
            <div 
              className="absolute left-[9px] top-3 w-0.5 bg-brand-teal transition-all duration-700 ease-in-out" 
              style={{ 
                height: pathProgressPercent > 0 ? `calc(${pathProgressPercent}% - 24px)` : '0%', 
                bottom: 'auto' 
              }}
            />

            {activePath.steps.map((step, idx) => {
              const isRead = !!completedSteps[step.slug];
              const isDimmed = hoveredStepSlug !== null && hoveredStepSlug !== step.slug;

              return (
                <div 
                  key={step.slug}
                  onMouseEnter={() => setHoveredStepSlug(step.slug)}
                  onMouseLeave={() => setHoveredStepSlug(null)}
                  style={{
                    opacity: isDimmed ? 0.5 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                  className="relative flex items-start gap-4 group"
                >
                  {/* Step status node */}
                  <button 
                    onClick={(e) => toggleStepRead(step.slug, e)}
                    className="absolute -left-[24px] top-1 z-10 p-0.5 rounded-full bg-brand-midnight border border-brand-midnight3 transition-colors hover:border-brand-butter"
                    title={isRead ? "Mark as unread" : "Mark as completed"}
                  >
                    {isRead ? (
                      <CheckCircle className="w-4 h-4 text-brand-butter fill-brand-butter/5" />
                    ) : (
                      <Circle className="w-4 h-4 text-brand-warmgrey/45" />
                    )}
                  </button>

                  <div className="flex-1 border border-brand-midnight3 hover:border-brand-butter/60 bg-brand-midnight2 rounded-2xl p-4 transition-all duration-300 relative group-hover:translate-x-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[9px] uppercase tracking-widest font-black text-brand-butter">
                        Chapter {String(idx + 1).padStart(2, '0')} • {step.duration}
                      </span>
                      
                      {/* Check mark badge */}
                      {isRead && (
                        <span className="text-[9px] font-black uppercase text-brand-butter bg-brand-butter/10 px-2 py-0.5 rounded border border-brand-butter/20 font-sans w-max self-start sm:self-center">
                          Chapter Completed
                        </span>
                      )}
                    </div>

                    <h5 className="font-serif text-sm sm:text-base font-bold text-brand-cream mt-2 leading-snug group-hover:text-brand-butter transition-colors">
                      <Link href={`/articles/${step.slug}`}>
                        {step.title}
                      </Link>
                    </h5>
                    
                    <p className="text-xs text-brand-warmgrey font-sans font-medium leading-relaxed mt-1 line-clamp-2">
                      {step.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-brand-midnight3 flex items-center justify-between">
                      <Link 
                        href={`/articles/${step.slug}`}
                        className="text-[10px] font-black text-brand-butter hover:underline uppercase tracking-widest flex items-center gap-1"
                      >
                        Read Chapter <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      
                      {/* Toggle button */}
                      <button 
                        onClick={(e) => toggleStepRead(step.slug, e)}
                        className="text-[10px] font-bold text-brand-warmgrey hover:text-brand-butter transition-colors"
                      >
                        {isRead ? 'Mark Active' : 'Mark Completed'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

        </div>

      </div>

    </div>
  );
}
