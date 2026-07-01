'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle2, List, Sparkles, User, RefreshCw } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  author: string;
  readTime: string;
  content: React.ReactNode;
}

const ISSUE_DATA = {
  'issue-01': {
    title: 'The Sovereign Tech Shift',
    volume: 'Volume I • Issue 1',
    date: 'June 2026',
    editorNote: 'Welcome to the inaugural issue of The Youth Prism. This issue investigates the restructuring of international borders around computational infrastructure. As computing weights, logic fabs, and regulatory risk definitions partition, strategic alliances are being rewritten in algorithms rather than geographic lines.',
    contributors: [
      { name: 'Aria Sterling', role: 'Geopolitical Lead', bio: 'Focuses on transatlantic tech risk acts.' },
      { name: 'Kabir Mehta', role: 'Policy Desk Lead', bio: 'Focuses on Indo-Pacific maritime logistics.' },
      { name: 'Mei Lin', role: 'Technology Scholar', bio: 'Semiconductor supply chain analyst.' }
    ],
    chapters: [
      {
        id: 'editorial',
        title: 'Editorial Note',
        author: 'Editorial Desk',
        readTime: '2 min read',
        content: (
          <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
            <p className="first-letter:text-5xl first-letter:font-black first-letter:text-brand-teal first-letter:float-left first-letter:mr-2">
              The division of the internet into distinct national compartments is no longer a hypothetic scenario. As we enter 2026, algorithmic structures have emerged as the primary boundaries of geopolitical influence.
            </p>
            <p>
              In this inaugural dossier, our correspondents detail the mechanics of the emerging sovereign compute stack. From lithography chokepoints in the Low Countries to delivery algorithm code on the streets of San Francisco, the nodes of global authority are changing.
            </p>
            <p>
              This publication represents a collaborative effort by researchers under 30 across four continents to outline these shifts. We hope it sparks critical debate.
            </p>
          </div>
        )
      },
      {
        id: 'chap-1',
        title: 'I. Algorithmic Sovereignty & the New Geopolitics of AI Regulation',
        author: 'Aria Sterling',
        readTime: '6 min read',
        content: (
          <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
            <h4 className="text-xl font-bold text-foreground">1. The Digital Boundary Layer</h4>
            <p>
              For decades, the internet functioned under a relatively unified protocol stack, governed by consensus-based bodies mostly anchored in Western institutions. Today, that structure is fragmenting. The concept of algorithmic sovereignty has moved from academic margins to the center of foreign policy desks.
            </p>
            <blockquote className="border-l-4 border-brand-teal pl-4 italic text-muted text-base my-6">
              “Power is no longer just negotiated in parliaments or battlefield trenches; it is written into the foundational algorithms of our global platforms.”
            </blockquote>
            <h4 className="text-xl font-bold text-foreground">2. Silicon Cartography</h4>
            <p>
              The transatlantic divide on AI risk models is shifting alliances. While the European Union’s AI Act focuses on a tiered risk model that targets application deployment, the United States continues to rely on executive orders and industry self-regulation. This leaves developing nations in an asymmetric bind: either import models with embedded value systems or attempt to build national computing grids from scratch.
            </p>
          </div>
        )
      },
      {
        id: 'chap-2',
        title: 'II. Silicon Cartography: The Quantum Semiconductor Supply Chain',
        author: 'Mei Lin',
        readTime: '8 min read',
        content: (
          <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
            <h4 className="text-xl font-bold text-foreground">1. The Lithography Chokepoints</h4>
            <p>
              Modern computation relies on highly concentrated points of manufacturing. The equipment required to print sub-3nm transistors is produced by a single company in Veldhoven, Netherlands, using components from dozens of specialized global suppliers.
            </p>
            <p>
              Extreme Ultraviolet (EUV) systems represent the pinnacle of precise optics. Without them, fabrication plants cannot build high-density processor nodes. The export control of these systems is a core geopolitical tool in tech-bloc containment strategies.
            </p>
            <h4 className="text-xl font-bold text-foreground">2. Fabrication Relocation Costs</h4>
            <p>
              Both the US and EU have passed legislative subsidy packages to attract domestic manufacturing fabs. However, training the specialized labor and establishing chemical refinement networks takes years, keeping global supply chains highly interdependent.
            </p>
          </div>
        )
      },
      {
        id: 'chap-3',
        title: 'III. Algorithmic Despotism: Gig Work in the Age of Automation',
        author: 'Kabir Mehta',
        readTime: '5 min read',
        content: (
          <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
            <h4 className="text-xl font-bold text-foreground">1. Algorithmic Dispatch Arbitrage</h4>
            <p>
              Labor organization is facing a new kind of threat. Platforms do not use human managers to allocate work or discipline drivers; they use proprietary dispatch code.
            </p>
            <p>
              By offering volatile multiplier bonuses and tracking cancellation rates, platform algorithms nudge workers into longer shifts and unsafe driving practices. Workers are isolated, lacking physical offices or colleagues to share grievances with.
            </p>
            <h4 className="text-xl font-bold text-foreground">2. Regulatory Interventions</h4>
            <p>
              Courts across Europe and California are challenging the ‘independent contractor’ designation of gig workers. Classifying workers as employees forces companies to guarantee minimum wages, health coverage, and collective bargaining rights.
            </p>
          </div>
        )
      },
      {
        id: 'references',
        title: 'References & Dossier Notes',
        author: 'Editorial Desk',
        readTime: '3 min read',
        content: (
          <div className="space-y-2 font-mono text-[11px] text-muted leading-relaxed">
            <p>[1] Brussels AI Regulatory Act, European Parliament, COM(2024) 250 final.</p>
            <p>[2] Executive Order 14110 on Safe, Secure, and Trustworthy Development of Artificial Intelligence, US Federal Register, 2023.</p>
            <p>[3] Semiconductor Choke Points, Center for Security and Technology (CSET), 2024.</p>
            <p>[4] Algorithmic Labor Controls and Union Adaptation, International Labor Journal, 2025.</p>
          </div>
        )
      }
    ]
  },
  'issue-02': {
    title: 'The Health Patent Monopolies',
    volume: 'Volume I • Issue 2',
    date: 'August 2026',
    editorNote: 'Welcome to Issue 2. This dossier investigates how post-pandemic patent regimes and global WTO manufacturing rules restrict vaccine distribution in low-to-mid income sovereign areas.',
    contributors: [
      { name: 'Dr. Clara Vance', role: 'Healthcare Lead', bio: 'Physician-scientist focusing on vaccine equity.' },
      { name: 'Kabir Mehta', role: 'Policy Desk Lead', bio: 'Specialist in WTO patent policies.' }
    ],
    chapters: [
      {
        id: 'editorial',
        title: 'Editorial Note',
        author: 'Dr. Clara Vance',
        readTime: '2 min read',
        content: (
          <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
            <p className="first-letter:text-5xl first-letter:font-black first-letter:text-brand-red first-letter:float-left first-letter:mr-2">
              Global healthcare continues to suffer from structural inequality. The concentration of vaccine production licenses in a few northern hemisphere hubs has created severe distribution disparities.
            </p>
            <p>
              In this issue, we examine the legal mechanisms under WTO rules that restrict mRNA vaccine development in developing regions, and investigate local consortiums attempting to build patent-free production facilities.
            </p>
          </div>
        )
      },
      {
        id: 'chap-1',
        title: 'I. Democratizing Vaccines: Intellectual Property vs Health Equity',
        author: 'Dr. Clara Vance',
        readTime: '7 min read',
        content: (
          <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
            <h4 className="text-xl font-bold text-foreground">1. The Patent Monopoly</h4>
            <p>
              Under WTO rules, intellectual property protection on clinical assets blocks generic manufacturers in India and South Africa from scaling up distribution. Waiving these patents during health emergencies is not just a commercial dispute; it is a life-or-death structural policy.
            </p>
            <h4 className="text-xl font-bold text-foreground">2. Decentralized Biomanufacturing</h4>
            <p>
              To achieve true health security, developing regions are establishing independent mRNA vaccine manufacturing consortia. By scaling local bioreactors and training local scientists, they bypass the dependency loops of multinational supply chains.
            </p>
          </div>
        )
      },
      {
        id: 'references',
        title: 'References & Dossier Notes',
        author: 'Editorial Desk',
        readTime: '2 min read',
        content: (
          <div className="space-y-2 font-mono text-[11px] text-muted leading-relaxed">
            <p>[1] TRIPS Patent Agreement Reforms, WTO Council Document WT/GC/M/201, 2024.</p>
            <p>[2] WHO Hub Vaccine Equity Initiative Report, 2025.</p>
          </div>
        )
      }
    ]
  }
};

type Params = Promise<{ slug: string }>;

export default function IssueReaderPage({ params }: { params: Params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const issue = ISSUE_DATA[slug as keyof typeof ISSUE_DATA];
  
  const [activeChapterId, setActiveChapterId] = useState<string>('editorial');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((window.scrollY / docHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!issue) {
    return (
      <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center py-20 text-center space-y-4">
          <h2 className="font-serif text-2xl font-black">Issue Dossier Not Found</h2>
          <p className="text-xs text-muted max-w-sm">The publication you requested is currently restricted or does not exist in local archives.</p>
          <Link href="/publications" className="btn-primary !py-2 !px-4">Back to Bookshelf</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const activeChapter = issue.chapters.find(c => c.id === activeChapterId) || issue.chapters[0];

  return (
    <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground transition-colors duration-300">
      
      {/* Scroll indicator ribbon */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border/20 z-[60]">
        <div className="h-full bg-brand-teal transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
      </div>

      <Navbar />

      {/* Floating Reader Menu */}
      <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur border-b border-border/40 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
        <Link 
          href="/publications" 
          className="flex items-center space-x-1 font-bold text-muted hover:text-brand-teal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bookshelf</span>
        </Link>
        <span className="font-serif font-black text-foreground">
          {issue.title} • {issue.volume}
        </span>
        <span className="text-[10px] text-muted font-bold tracking-widest uppercase bg-card-bg border border-border/50 px-2.5 py-1 rounded">
          {issue.date}
        </span>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Core Layout Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Sticky Navigation Index (3 cols) */}
          <div className="lg:col-span-3 sticky top-32 space-y-5 hidden lg:block">
            <div className="flex items-center space-x-2 border-b border-border/60 pb-2">
              <List className="w-4 h-4 text-brand-teal" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-teal">Issue Chapters</h4>
            </div>
            <nav className="flex flex-col space-y-1.5">
              {issue.chapters.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => {
                    setActiveChapterId(chap.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left py-2 px-3 rounded-lg text-xs font-serif font-bold transition-all border ${
                    activeChapterId === chap.id
                      ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20 pl-4 font-black'
                      : 'border-transparent text-foreground/80 hover:bg-card-bg/40'
                  }`}
                >
                  {chap.title.replace(/^[IVX]+\.\s+/, '')}
                </button>
              ))}
            </nav>
          </div>

          {/* Column 2: Main Editorial Content Reader (6 cols) */}
          <div className="lg:col-span-6 border border-border/40 bg-card-bg/25 glass p-6 sm:p-10 rounded-[32px] shadow-lg space-y-8 min-h-[500px]">
            <div className="border-b border-border/30 pb-4 space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-black text-brand-teal block">
                {activeChapter.author} • {activeChapter.readTime}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground leading-tight">
                {activeChapter.title}
              </h1>
            </div>

            {/* Rendered Chapter Node Content */}
            <div className="animate-fade-in">
              {activeChapter.content}
            </div>

            {/* Mobile bottom chapter navigations */}
            <div className="border-t border-border/30 pt-6 flex justify-between items-center text-xs">
              {(() => {
                const curIdx = issue.chapters.findIndex(c => c.id === activeChapterId);
                const prev = issue.chapters[curIdx - 1];
                const next = issue.chapters[curIdx + 1];

                return (
                  <>
                    {prev ? (
                      <button
                        onClick={() => {
                          setActiveChapterId(prev.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center space-x-1 text-muted hover:text-brand-teal transition-colors font-bold"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>
                    ) : <div />}

                    {next ? (
                      <button
                        onClick={() => {
                          setActiveChapterId(next.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center space-x-1 text-brand-teal hover:underline font-bold"
                      >
                        <span>Next Chapter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : <div />}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Column 3: Contributors & Info Side Panel (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Contributors block */}
            <div className="border border-border/40 bg-card-bg/30 glass p-5 rounded-[24px] space-y-4">
              <div className="flex items-center space-x-2 border-b border-border/60 pb-2">
                <User className="w-4 h-4 text-brand-teal" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-teal">Contributors</h4>
              </div>
              
              <div className="space-y-4">
                {issue.contributors.map((contrib, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="font-serif text-xs font-black text-foreground block">
                      {contrib.name}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-brand-teal-light block">
                      {contrib.role}
                    </span>
                    <p className="text-[10px] text-muted leading-relaxed font-sans">
                      {contrib.bio}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive metadata box */}
            <div className="border border-border/40 bg-card-bg/20 glass p-5 rounded-[24px] space-y-3 text-xs">
              <span className="text-[9px] uppercase font-black tracking-widest text-muted block">Dossier Details</span>
              <div className="flex justify-between py-1 border-b border-border/10 font-sans">
                <span className="text-muted">Issue:</span>
                <span className="font-bold text-foreground">{issue.volume.split('•')[1]}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/10 font-sans">
                <span className="text-muted">Release:</span>
                <span className="font-bold text-foreground">{issue.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/10 font-sans">
                <span className="text-muted">Format:</span>
                <span className="font-bold text-foreground">Digital-Ink HTML5</span>
              </div>
              <div className="flex justify-between py-1 font-sans">
                <span className="text-muted">Security:</span>
                <span className="font-bold text-brand-teal">Public Access</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
