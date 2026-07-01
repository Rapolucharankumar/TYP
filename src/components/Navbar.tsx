'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const navLinks = [
    { name: 'Articles', href: '/articles' },
    { name: 'Research', href: '/categories' },
    { name: 'Publications', href: '/publications' },
    { name: 'Collective', href: '/team' },
    { name: 'Opportunities', href: '/opportunities' },
    { name: 'About', href: '/about' },
    { name: 'Write for Us', href: '/contact' },
  ];

  const isActive = (href: string) => pathname === href;

  const scrollToFooter = (e: React.MouseEvent) => {
    e.preventDefault();
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headerRef = useRef<HTMLElement>(null);

  // Scroll effect to add/remove .scrolled class and track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const el = headerRef.current;
      if (!el) return;
      if (window.scrollY > 30) {
        el.classList.add('scrolled');
      } else {
        el.classList.remove('scrolled');
      }

      // Update scroll progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    // Run on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div 
        id="reading-progress"
        className="fixed top-0 left-0 h-[2px] z-[200] transition-[width] duration-100 ease-out" 
        style={{ width: `${scrollProgress}%`, background: 'var(--prism-gradient)', boxShadow: '0 0 10px rgba(255,0,85,0.5), 0 0 20px rgba(0,255,170,0.5)' }}
      />
      <nav className="sticky top-0 z-50 w-full h-[60px] bg-black/60 backdrop-blur-2xl border-b border-white/10 transition-all duration-300" ref={headerRef}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
          
          {/* Left: Horizontal Lockup Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="transition-opacity hover:opacity-90">
              <Logo variant="horizontal" size="sm" />
            </Link>
          </div>

          {/* Center: Desktop Links (Inter, CAPS, 0.14em tracking, 11px) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-sans text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-brand-cream hover:after:w-full after:transition-[width] after:duration-300 after:ease-in-out ${
                  isActive(link.href)
                    ? 'text-brand-butter font-bold after:w-full after:bg-brand-butter'
                    : 'text-brand-cream/80 hover:text-brand-cream'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Search, Theme Toggle, CTA & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <Link
              href="/search"
              aria-label="Search articles"
              className="p-2 rounded-full text-brand-cream/70 hover:text-brand-cream hover:bg-[rgba(255,255,255,0.05)] transition-all"
            >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>


          {/* Subscribe CTA: Brand Book — Midnight bg #05163B + Butter text #FFE9A1 */}
          <button
            onClick={scrollToFooter}
            className="hidden sm:inline-flex btn-primary !py-2 !px-4 !text-[10px]"
          >
            Subscribe
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-brand-cream/70 hover:text-brand-cream hover:bg-[rgba(255,255,255,0.05)] transition-all cursor-pointer"
            aria-label="Open main menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[rgba(255,255,255,0.08)] bg-black/90 backdrop-blur-2xl overflow-hidden"
          >
            <div className="py-4 px-2 flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'bg-[rgba(255,255,255,0.08)] text-brand-butter'
                      : 'text-brand-cream/90 hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  scrollToFooter(e);
                }}
                className="w-full btn-primary !py-2.5 mt-2"
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  </>
  );
}
