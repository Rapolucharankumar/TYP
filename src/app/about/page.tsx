'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--teal)]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--butter)]/5 rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Content wrapped in a premium glass panel */}
        <article className="glass border border-white/5 rounded-[32px] p-8 sm:p-12 shadow-2xl shadow-black/50 space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--butter)] bg-[var(--butter)]/10 px-3 py-1 rounded-full border border-[var(--butter)]/20">
              Our Identity
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-none text-white mt-2 drop-shadow-md">
              The Editorial Manifesto
            </h1>
            <p className="text-[var(--muted)] text-sm sm:text-base max-w-xl mx-auto italic leading-relaxed border-b border-[var(--butter)]/30 inline-block pb-1">
              &ldquo;We do not merely report the news; we dissect the architectural systems shaping the future of our civilization.&rdquo;
            </p>
          </div>

          <hr className="border-white/5" />

          {/* Section: Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[var(--teal)]/5 to-transparent pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <h2 className="font-serif text-2xl font-bold text-white drop-shadow-sm">The Mission</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)] text-justify">
                <span className="border-b border-[var(--butter)]/40 text-[var(--foreground)]">To build a world-class editorial repository</span> that challenges corporate media silos. By bringing together computational scientists, legal scholars, and climate advocates under the age of 30, we inject analytical rigor and youthful urgency into the global discourse.
              </p>
            </div>
            <div className="space-y-3 relative z-10">
              <h2 className="font-serif text-2xl font-bold text-white drop-shadow-sm">The Vision</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)] text-justify">
                A media landscape where systemic challenges—algorithmic capture, green colonialism, global wealth inequality—are unpacked with depth rather than soundbites. <span className="border-b border-[var(--butter)]/40 text-[var(--foreground)]">We see a future where policy decisions are guided by generations who will live to see their consequences.</span>
              </p>
            </div>
          </div>

          {/* Section: Why We Exist */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-white border-b border-white/10 pb-3 drop-shadow-sm">
              Why The Youth Prism Exists
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)] text-justify">
              Traditional news organizations often view youth issues through a lens of novelty or superficiality. We are told our opinions are secondary because we lack &ldquo;decades of experience.&rdquo; 
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)] text-justify">
              Yet, it is precisely our generation that is constructing decentralized protocols, researching advanced therapeutics, and leading local union actions. The Youth Prism exists to consolidate this collective intellect into a single, high-fidelity publication that global leaders cannot ignore.
            </p>
          </section>

          {/* Blockquote quote */}
          <blockquote className="border-l-4 border-[var(--lavender)] pl-6 italic text-base sm:text-xl text-[var(--foreground)] font-quote leading-relaxed bg-[var(--lavender)]/5 py-6 rounded-r-2xl pr-6 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[var(--lavender)]/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              &ldquo;Youth is not a state of developmental preparation; it is a critical vantage point of absolute clarity, untethered to the legacies of historical systemic failure.&rdquo;
              <span className="block text-[10px] font-black uppercase tracking-widest text-[var(--butter)] mt-4 not-italic">— Maya Patel, Editor-in-Chief</span>
            </div>
          </blockquote>

          {/* Section: Editorial Philosophy */}
          <section className="space-y-6 glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--teal)]/5 to-transparent pointer-events-none" />
            <h2 className="font-serif text-2xl font-bold text-white border-b border-white/10 pb-3 relative z-10 drop-shadow-sm">Our Editorial Philosophy</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
              <div className="p-5 border border-white/5 bg-white/5 rounded-[20px] hover-glow-lavender transition-all duration-300">
                <h3 className="font-serif text-base font-bold mb-2 text-white drop-shadow-sm">01. Rigor</h3>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">Every claim must be backed by institutional data, policy codes, or peer-reviewed literature. No generalizations.</p>
              </div>
              <div className="p-5 border border-white/5 bg-white/5 rounded-[20px] hover-glow-lavender transition-all duration-300">
                <h3 className="font-serif text-base font-bold mb-2 text-white drop-shadow-sm">02. Aesthetics</h3>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">Form follows intellect. High-fidelity layouts encourage focused reading and respect the time of our audience.</p>
              </div>
              <div className="p-5 border border-white/5 bg-white/5 rounded-[20px] hover-glow-lavender transition-all duration-300">
                <h3 className="font-serif text-base font-bold mb-2 text-white drop-shadow-sm">03. Independence</h3>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">We accept no venture backing or corporate advertisements. We are supported entirely by subscribers and foundations.</p>
              </div>
            </div>
          </section>

          {/* Section: Future Goals */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-white border-b border-white/10 pb-3 drop-shadow-sm">Future Goals</h2>
            <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
              <li>Deploying localized physical print editions in university hubs across five continents.</li>
              <li>Launching an investigative grant fund targeting youth researchers in environmental justice.</li>
              <li>Establishing a decentralized syndication network for college newspapers globally.</li>
            </ul>
          </section>

        </article>
      </main>

      <Footer />
    </div>
  );
}
