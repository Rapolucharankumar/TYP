'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col paper-pattern bg-brand-cream text-brand-midnight transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        {/* Content wrapped in a premium Pinterest rounded card container */}
        <article className="bg-brand-cream border border-brand-midnight/10 rounded-[32px] p-8 sm:p-12 shadow-lg space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/15">
              Our Identity
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-none text-foreground mt-2">
              The Editorial Manifesto
            </h1>
            <p className="text-brand-midnight/70 text-sm sm:text-base max-w-xl mx-auto italic leading-relaxed border-b-2 border-brand-butter inline-block pb-1">
              &ldquo;We do not merely report the news; we dissect the architectural systems shaping the future of our civilization.&rdquo;
            </p>
          </div>

          <hr className="border-card-border/80" />

          {/* Section: Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 bg-brand-sand p-8 rounded-3xl">
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-brand-midnight">The Mission</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-brand-midnight/90 text-justify">
                <span className="border-b-2 border-brand-butter">To build a world-class editorial repository</span> that challenges corporate media silos. By bringing together computational scientists, legal scholars, and climate advocates under the age of 30, we inject analytical rigor and youthful urgency into the global discourse.
              </p>
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-brand-midnight">The Vision</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-brand-midnight/90 text-justify">
                A media landscape where systemic challenges—algorithmic capture, green colonialism, global wealth inequality—are unpacked with depth rather than soundbites. <span className="border-b-2 border-brand-butter">We see a future where policy decisions are guided by generations who will live to see their consequences.</span>
              </p>
            </div>
          </div>

          {/* Section: Why We Exist */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground border-b border-card-border/60 pb-3">
              Why The Youth Prism Exists
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 text-justify">
              Traditional news organizations often view youth issues through a lens of novelty or superficiality. We are told our opinions are secondary because we lack &ldquo;decades of experience.&rdquo; 
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 text-justify">
              Yet, it is precisely our generation that is constructing decentralized protocols, researching advanced therapeutics, and leading local union actions. The Youth Prism exists to consolidate this collective intellect into a single, high-fidelity publication that global leaders cannot ignore.
            </p>
          </section>

          {/* Blockquote quote */}
          <blockquote className="border-l-2 border-brand-lavender pl-6 italic text-base sm:text-xl text-brand-midnight font-quote leading-relaxed bg-brand-lavender/30 py-5 rounded-r-2xl pr-4">
            &ldquo;Youth is not a state of developmental preparation; it is a critical vantage point of absolute clarity, untethered to the legacies of historical systemic failure.&rdquo;
            <span className="block text-[10px] font-black uppercase tracking-widest text-brand-teal mt-3 not-italic">— Maya Patel, Editor-in-Chief</span>
          </blockquote>

          {/* Section: Editorial Philosophy */}
          <section className="space-y-6 bg-brand-sand p-8 rounded-3xl">
            <h2 className="font-serif text-2xl font-bold text-brand-midnight border-b border-brand-midnight/10 pb-3">Our Editorial Philosophy</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 border border-brand-midnight/10 bg-brand-cream rounded-[20px]">
                <h3 className="font-serif text-base font-bold mb-2 text-brand-midnight">01. Rigor</h3>
                <p className="text-[11px] text-brand-midnight/70 leading-relaxed">Every claim must be backed by institutional data, policy codes, or peer-reviewed literature. No generalizations.</p>
              </div>
              <div className="p-5 border border-brand-midnight/10 bg-brand-cream rounded-[20px]">
                <h3 className="font-serif text-base font-bold mb-2 text-brand-midnight">02. Aesthetics</h3>
                <p className="text-[11px] text-brand-midnight/70 leading-relaxed">Form follows intellect. High-fidelity layouts encourage focused reading and respect the time of our audience.</p>
              </div>
              <div className="p-5 border border-brand-midnight/10 bg-brand-cream rounded-[20px]">
                <h3 className="font-serif text-base font-bold mb-2 text-brand-midnight">03. Independence</h3>
                <p className="text-[11px] text-brand-midnight/70 leading-relaxed">We accept no venture backing or corporate advertisements. We are supported entirely by subscribers and foundations.</p>
              </div>
            </div>
          </section>

          {/* Section: Future Goals */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground border-b border-card-border/60 pb-3">Future Goals</h2>
            <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm leading-relaxed text-foreground/80">
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
