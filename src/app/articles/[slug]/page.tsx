'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Clock, Calendar, Link2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { db } from '../../../lib/db';
import { Article } from '../../../types';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

// JSON-LD Structured Data Component
const JsonLd = ({ article }: { article: Article }) => {
  if (!article) return null;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "author": {
      "@type": "Person",
      "name": article.author?.name || "The Youth Prism",
    },
    "publisher": {
      "@type": "Organization",
      "name": "The Youth Prism",
      "logo": {
        "@type": "ImageObject",
        "url": "https://youthprism.com/favicon.ico",
      },
    },
    "datePublished": article.published_at || article.created_at,
    "image": article.cover_image,
    "url": `https://youthprism.com/articles/${article.slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default function ArticleDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  
  const [article, setArticle] = useState<Article | null>(null);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [headings, setHeadings] = useState<{ text: string; id: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const loadedArticle = await db.getArticleBySlug(slug);
        const loadedArticles = await db.getArticles();
        setArticle(loadedArticle || null);
        setAllArticles(loadedArticles.filter(a => a.status === 'published'));
        if (loadedArticle) {
          await db.incrementArticleViews(loadedArticle.id);
        }
      } catch (err) {
        console.error('Error loading article detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // Extract headings from markdown content for Table of Contents
  useEffect(() => {
    if (!article?.content) return;
    
    const lines = article.content.split('\n');
    const extractedHeadings: { text: string; id: string }[] = [];
    
    lines.forEach(line => {
      const match = line.match(/^(##|###)\s+(.*)$/);
      if (match) {
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        extractedHeadings.push({ text, id });
      }
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derived state from article content
    setHeadings(extractedHeadings);
  }, [article]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Related Articles
  const relatedArticles = allArticles
    .filter(a => a.id !== article?.id && a.category_id === article?.category_id)
    .slice(0, 3);

  // Next / Previous navigation
  const currentIndex = allArticles.findIndex(a => a.id === article?.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // Simple Markdown Parser & Custom HTML Renderer
  const parseMarkdown = (markdown: string) => {
    const blocks = markdown.split(/\n\n+/);

    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Handle Headings
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="font-serif text-3xl sm:text-4xl font-black mt-10 mb-5 leading-tight text-brand-midnight">{trimmed.replace('# ', '')}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace('## ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return <h2 key={idx} id={id} className="font-serif text-2xl sm:text-3xl font-bold mt-8 mb-4 leading-tight scroll-mt-24 border-b border-card-border/60 pb-2 text-brand-midnight">{text}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace('### ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return <h3 key={idx} id={id} className="font-serif text-xl sm:text-2xl font-bold mt-6 mb-3 leading-tight scroll-mt-24 text-brand-midnight">{text}</h3>;
      }

      // Handle Blockquotes
      if (trimmed.startsWith('> ')) {
        const quote = trimmed.replace(/>\s+/g, '').replace(/\n>\s+/g, '\n');
        const quoteLines = quote.split('\n');
        const isKeyInsight = quote.toLowerCase().includes('insight') || quote.toLowerCase().includes('key');
        const isWarning = quote.toLowerCase().includes('warning') || quote.toLowerCase().includes('danger');
        
        let containerClass = "border-l-4 border-brand-lavender pl-6 my-8 italic text-base sm:text-lg text-brand-midnight font-serif leading-relaxed bg-brand-lavender/30 py-4 pr-4 rounded-r-2xl";
        if (isKeyInsight) containerClass = "border border-brand-butter p-6 my-8 italic text-base sm:text-lg text-brand-midnight font-serif leading-relaxed bg-brand-butter/20 rounded-[20px] shadow-sm";
        if (isWarning) containerClass = "border-l-4 border-brand-cherry pl-6 my-8 italic text-base sm:text-lg text-brand-cherry font-serif leading-relaxed bg-brand-cherry/10 py-4 pr-4 rounded-r-2xl";

        return (
          <blockquote key={idx} className={containerClass}>
            {quoteLines.map((line, lIdx) => (
              <p key={lIdx} className={lIdx > 0 ? 'mt-2' : ''}>{line.replace(/^—\s*/, '— ')}</p>
            ))}
          </blockquote>
        );
      }

      // Handle Tables
      if (trimmed.startsWith('|')) {
        const rows = trimmed.split('\n').map(row => row.split('|').map(cell => cell.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1));
        const header = rows[0];
        const body = rows.slice(2); // Skip separator row
        return (
          <div key={idx} className="overflow-x-auto my-8 border border-card-border rounded-[24px] bg-background/30 p-1">
            <table className="min-w-full divide-y divide-card-border">
              <thead className="bg-accent/5">
                <tr>
                  {header.map((col, cIdx) => (
                    <th key={cIdx} className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-accent">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-xs sm:text-sm">
                {body.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-accent/5 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-6 py-4 whitespace-nowrap text-foreground/80 font-medium">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // Handle Bullet Lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split(/\n[\*\-]\s+/).map(item => item.replace(/^[\*\-]\s+/, ''));
        return (
          <ul key={idx} className="list-disc pl-6 my-6 space-y-2 text-xs sm:text-sm leading-relaxed text-foreground/80">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        );
      }

      // Handle Paragraphs with Drop Caps
      if (idx === 1 || (idx === 0 && !trimmed.startsWith('#'))) {
        const text = trimmed;
        const firstLetter = text.charAt(0);
        const rest = text.slice(1);
        return (
          <p key={idx} className="text-xs sm:text-sm leading-relaxed text-brand-midnight2 mb-6 text-justify">
            <span className="font-serif text-4xl sm:text-5xl font-black float-left mr-2.5 mt-0.5 leading-[0.85] text-brand-teal">{firstLetter}</span>
            {rest}
          </p>
        );
      }

      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed text-brand-midnight2 mb-6 text-justify">
          {trimmed}
        </p>
      );
    });
  };

  const getReadingTime = (text: string) => {
    const words = text ? text.split(/\s+/).length : 0;
    return `${Math.max(1, Math.ceil(words / 250))} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="border border-card-border bg-card-bg rounded-[32px] p-10 max-w-md shadow-lg space-y-4">
            <h1 className="font-serif text-3xl font-bold">Article Not Found</h1>
            <p className="text-muted text-sm">The article you are looking for does not exist or has been deleted.</p>
            <Link href="/articles" className="bg-accent text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-accent/90 shadow-md inline-block">
              Back to Articles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <JsonLd article={article} />
      <div className="min-h-screen flex flex-col paper-pattern bg-brand-cream text-brand-midnight2 transition-colors duration-300">
        <Navbar />

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          
          <div>
            <Link
              href="/articles"
              className="inline-flex items-center text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Archive
            </Link>
          </div>

          <header className="border border-card-border bg-card-bg rounded-[32px] p-8 sm:p-12 shadow-md space-y-6">
            <div className="text-center space-y-4">
              <div>
                <Link 
                  href={`/categories/${article.category?.slug}`}
                  className="text-[10px] font-black uppercase tracking-widest text-white bg-accent px-4 py-2 rounded-full shadow-sm hover:bg-accent/90"
                >
                  {article.category?.name}
                </Link>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] max-w-3xl mx-auto text-foreground">
                {article.title}
              </h1>

              <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto italic font-medium leading-relaxed">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-muted font-bold uppercase tracking-wider pt-4 border-t border-card-border/60 max-w-sm mx-auto">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span>{getReadingTime(article.content)}</span>
                </span>
                <span className="text-card-border">•</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>
                    {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <aside className="lg:col-span-3 hidden lg:block sticky top-28 space-y-8 self-start bg-card-bg border border-card-border rounded-[32px] p-6 shadow-sm">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Disseminate</h3>
                <div className="flex space-x-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-card-border hover:border-accent hover:text-accent rounded-full bg-background text-muted transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Share on X"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-card-border hover:border-accent hover:text-accent rounded-full bg-background text-muted transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Share on LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="p-2.5 border border-card-border hover:border-accent hover:text-accent rounded-full bg-background text-muted transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Copy page link"
                  >
                    {copied ? <Check className="w-4 h-4 text-accent" /> : <Link2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {headings.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-card-border/60">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Contents</h3>
                  <nav className="flex flex-col space-y-2 border-l border-card-border/80 pl-3">
                    {headings.map((heading, idx) => (
                      <a
                        key={idx}
                        href={`#${heading.id}`}
                        className="text-[11px] font-bold text-muted hover:text-accent transition-colors leading-relaxed block py-0.5"
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </aside>

            <main className="lg:col-span-6 bg-card-bg border border-card-border p-6 sm:p-10 rounded-[32px] shadow-md space-y-8">
              <div className="w-full h-[250px] sm:h-[420px] relative overflow-hidden rounded-[24px] border border-card-border/50">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none prose-a:text-brand-teal prose-a:font-bold">
                {parseMarkdown(article.content)}
              </div>

              <hr className="border-card-border/80" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 p-5 border border-card-border/60 bg-card-border/30 rounded-[24px]">
                <img
                  src={article.author?.avatar}
                  alt={article.author?.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-card-border shadow-inner"
                />
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-serif text-lg font-bold text-foreground">{article.author?.name}</h4>
                  <span className="text-[9px] font-black text-accent uppercase tracking-widest bg-accent/10 px-2.5 py-0.5 rounded border border-accent/10 inline-block">
                    Contributor
                  </span>
                  <p className="text-xs text-muted leading-relaxed">{article.author?.bio}</p>
                  <div className="pt-2 flex justify-center sm:justify-start space-x-3">
                    {article.author?.social_links?.twitter && (
                      <a href={article.author.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-muted hover:text-accent transition-colors uppercase tracking-wider">Twitter</a>
                    )}
                    {article.author?.social_links?.linkedin && (
                      <a href={article.author.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-muted hover:text-accent transition-colors uppercase tracking-wider">LinkedIn</a>
                    )}
                  </div>
                </div>
              </div>
            </main>

            <aside className="lg:col-span-3 bg-card-bg border border-card-border rounded-[32px] p-6 shadow-sm space-y-6">
              <div className="border-b border-card-border/60 pb-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Related Analysis</h3>
              </div>
              
              {relatedArticles.length === 0 ? (
                <p className="text-xs text-muted">No related essays found.</p>
              ) : (
                <div className="space-y-5">
                  {relatedArticles.map(rel => (
                    <div key={rel.id} className="space-y-2 group">
                      <div className="h-[130px] relative w-full overflow-hidden rounded-[16px] border border-card-border/50">
                        <Link href={`/articles/${rel.slug}`}>
                          <img
                            src={rel.cover_image}
                            alt={rel.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        </Link>
                      </div>
                      <h4 className="font-serif text-sm font-bold leading-snug group-hover:text-accent text-foreground transition-colors line-clamp-2">
                        <Link href={`/articles/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                      <p className="text-[9px] text-muted font-bold">BY {rel.author?.name?.toUpperCase()}</p>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>

          {(prevArticle || nextArticle) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {prevArticle ? (
                <Link 
                  href={`/articles/${prevArticle.slug}`} 
                  className="group flex items-center justify-between p-5 border border-card-border bg-card-bg hover:shadow-md rounded-[24px] transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <ChevronLeft className="w-6 h-6 text-accent group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <span className="text-[9px] font-black text-accent uppercase tracking-widest block">Prev Essay</span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold line-clamp-1 text-foreground">{prevArticle.title}</h4>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="hidden md:block" />
              )}

              {nextArticle && (
                <Link 
                  href={`/articles/${nextArticle.slug}`} 
                  className="group flex items-center justify-between p-5 border border-card-border bg-card-bg hover:shadow-md rounded-[24px] transition-all text-right cursor-pointer"
                >
                  <div className="flex items-center space-x-3 ml-auto">
                    <div>
                      <span className="text-[9px] font-black text-accent uppercase tracking-widest block">Next Essay</span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold line-clamp-1 text-foreground">{nextArticle.title}</h4>
                    </div>
                    <ChevronRight className="w-6 h-6 text-accent group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}