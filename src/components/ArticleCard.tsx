'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Clock, Calendar } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D tilt and magnetic hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);
  
  // Spotlight effect following cursor
  const lightX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const lightY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Values from -0.5 to 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const getReadingTime = (text: string) => {
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 250));
    return `${minutes} min read`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Draft';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryTagClass = (slug?: string) => {
    if (!slug) return 'tag-butter';
    const s = slug.toLowerCase();
    if (s.includes('tech')) return 'tag-lav';
    if (s.includes('policy')) return 'tag-teal';
    if (s.includes('health')) return 'tag-cherry';
    if (s.includes('global') || s.includes('geopolitic')) return 'tag-butter';
    if (s.includes('econ')) return 'tag-sand';
    if (s.includes('current') || s.includes('break')) return 'tag-cherry';
    return 'tag-butter';
  };

  const formattedDate = formatDate(article.published_at || article.created_at);
  const readingTime = getReadingTime(article.content);

  const MotionComponent = featured ? motion.div : motion.article;

  // We use the refined premium glassmorphism aesthetic
  const cardClassName = `group relative ${featured ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 lg:p-8' : 'flex flex-col h-full'} border border-white/5 bg-card-bg/20 glass rounded-[32px] overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-white/20`;

  return (
    <MotionComponent
      ref={cardRef as any}
      className={cardClassName}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Soft internal hover spotlight tracking cursor */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none rounded-[32px]"
        style={{
          background: isHovered 
            ? `radial-gradient(800px circle at ${lightX.get()} ${lightY.get()}, rgba(255,255,255,0.06), transparent 40%)` 
            : 'transparent',
          transition: 'background 0.2s',
        }}
      />
      
      {/* Animated Prism Border using pseudo-element trick mapped in CSS via hover-glow-prism, but we can add a stronger one here */}
      {isHovered && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-0 pointer-events-none rounded-[32px]"
          style={{
            padding: '1px',
            background: 'linear-gradient(115deg, rgba(11, 90, 71, 0.4), rgba(255, 233, 161, 0.2), transparent)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}
      
      {featured ? (
        <>
          {/* Cover Image with floating author pill badge */}
          <div className="lg:col-span-7 h-[300px] sm:h-[450px] relative w-full overflow-hidden rounded-[24px] border border-white/10 z-10" style={{ transform: 'translateZ(20px)' }}>
            <Link href={`/articles/${article.slug}`} className="block w-full h-full">
              <img
                src={article.cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </Link>
            {/* Floating Author Badge */}
            <Link 
              href={`/authors/${article.author_id}`}
              className="absolute bottom-4 left-4 right-4 flex items-center space-x-3 bg-black/80 text-white hover:text-accent p-3 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md max-w-sm hover:scale-[1.02] transition-all duration-300"
            >
              <img
                src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={article.author?.name || 'Author'}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate leading-tight">{article.author?.name || 'Editorial Team'}</p>
                <p className="text-[10px] text-white/50 truncate italic leading-none mt-0.5">{article.author?.role || 'Featured Author'}</p>
              </div>
            </Link>
          </div>

          {/* Content Details */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5 z-10" style={{ transform: 'translateZ(30px)' }}>
            <div>
              <Link 
                href={`/categories/${article.category?.slug || 'general'}`} 
                className={`tag transition-all ${getCategoryTagClass(article.category?.slug)}`}
              >
                {article.category?.name || 'General'}
              </Link>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white hover:text-white/80 transition-colors">
              <Link href={`/articles/${article.slug}`}>
                {article.title}
              </Link>
            </h2>

            <p className="text-white/60 text-sm leading-relaxed line-clamp-4">
              {article.excerpt}
            </p>

            <div className="pt-2">
              <hr className="border-white/10 mb-4" />
              <div className="flex items-center justify-between text-xs text-white/50 font-bold">
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-white/10 px-2.5 py-1 rounded">
                  ESSAY
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{readingTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Cover Image & Category tag */}
          <div className="h-[240px] relative w-full overflow-hidden p-3 pb-0 z-10" style={{ transform: 'translateZ(20px)' }}>
            <div className="relative w-full h-full overflow-hidden rounded-[24px] border border-white/10">
              <Link href={`/articles/${article.slug}`} className="block w-full h-full">
                <img
                  src={article.cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </Link>
              <Link 
                href={`/categories/${article.category?.slug}`} 
                className={`absolute top-3 left-3 shadow-md backdrop-blur-md tag ${getCategoryTagClass(article.category?.slug)}`}
              >
                {article.category?.name || 'General'}
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col z-10" style={{ transform: 'translateZ(30px)' }}>
            <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug mb-3 text-white hover:text-white/80 transition-colors">
              <Link href={`/articles/${article.slug}`}>
                {article.title}
              </Link>
            </h3>
            <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-6 font-sans">
              {article.excerpt}
            </p>
            
            <div className="mt-auto border-t border-white/10 pt-4 flex flex-col gap-3">
              {/* Author Row */}
              <Link href={`/authors/${article.author_id}`} className="flex items-center space-x-3 group/author w-fit">
                <img
                  src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={article.author?.name || 'Author'}
                  className="w-7 h-7 rounded-full object-cover border border-white/20 group-hover/author:border-white/50 transition-colors"
                />
                <span className="text-[11px] font-bold text-white group-hover/author:text-white/80 transition-colors">
                  {article.author?.name || 'Editorial Team'}
                </span>
              </Link>

              {/* Meta Row */}
              <div className="flex items-center justify-between text-[10px] text-white/50 font-bold font-sans">
                <div className="flex items-center space-x-1 bg-white/5 px-2 py-1 rounded">
                  <Calendar className="w-3 h-3" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/5 px-2 py-1 rounded">
                  <Clock className="w-3 h-3" />
                  <span>{readingTime}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </MotionComponent>
  );
}
