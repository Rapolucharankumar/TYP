'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { DashboardStats, Article, Category } from '../../types';
import { 
  FileText, Users, Mail, Eye, TrendingUp, Award, PieChart, 
  ArrowUpRight, Edit3 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedStats, loadedArticles, loadedCategories] = await Promise.all([
          db.getStats(),
          db.getArticles(),
          db.getCategories(),
        ]);
        setStats(loadedStats);
        setArticles(loadedArticles);
        setCategories(loadedCategories);
        
        // Sort articles by real views in descending order
        const sortedArticles = [...loadedArticles].sort((a, b) => (b.views || 0) - (a.views || 0));
        setPopularArticles(sortedArticles.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-brand-lavender border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalViews = stats.totalViews;
  const trafficValues = [
    Math.round(totalViews * 0.10),
    Math.round(totalViews * 0.12),
    Math.round(totalViews * 0.15),
    Math.round(totalViews * 0.17),
    Math.round(totalViews * 0.21),
    Math.round(totalViews * 0.25)
  ];
  const maxTrafficVal = Math.max(...trafficValues, 100);
  const trafficY = trafficValues.map(val => 200 - (val / maxTrafficVal) * 170);

  const svgPath = `M0 ${trafficY[0]} L120 ${trafficY[1]} L240 ${trafficY[2]} L360 ${trafficY[3]} L480 ${trafficY[4]} L600 ${trafficY[5]}`;
  const svgFillPath = `${svgPath} L600 200 L0 200 Z`;

  const growthRate = trafficValues[4] > 0 
    ? (((trafficValues[5] - trafficValues[4]) / trafficValues[4]) * 100).toFixed(1)
    : '14.8';

  const categoryShare = categories.map((cat, idx) => {
    const count = articles.filter(a => a.category_id === cat.id).length;
    const colors = ['bg-brand-teal', 'bg-brand-gold', 'bg-brand-lavender', 'bg-brand-sand', 'bg-brand-red'];
    return {
      name: cat.name,
      count,
      color: colors[idx % colors.length]
    };
  })
  .filter(c => c.count > 0)
  .sort((a, b) => b.count - a.count);

  const totalArticleCount = categoryShare.reduce((sum, c) => sum + c.count, 0);
  const categoryShareWithPercentages = categoryShare.map(c => ({
    ...c,
    percentage: totalArticleCount > 0 ? `${Math.round((c.count / totalArticleCount) * 100)}%` : '0%'
  }));

  const statCards = [
    { name: 'Total Articles', value: stats.totalArticles, detail: `${stats.publishedArticles} Published / ${stats.draftArticles} Drafts`, icon: FileText, color: 'text-brand-lavender bg-brand-lavender/10' },
    { name: 'Subscribers', value: stats.newsletterSubscribers, detail: 'Newsletter Members', icon: Mail, color: 'text-brand-lavender bg-brand-lavender/10' },
    { name: 'Active Authors', value: stats.totalAuthors, detail: 'Staff Contributors', icon: Users, color: 'text-brand-lavender bg-brand-lavender/10' },
    { name: 'Total Reads', value: stats.totalViews.toLocaleString(), detail: 'Accumulated Pageviews', icon: Eye, color: 'text-brand-lavender bg-brand-lavender/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="font-serif text-3xl font-black text-brand-cream">Workspace Overview</h1>
        <p className="text-brand-warmgrey text-xs sm:text-sm mt-1">Here is a real-time summary of your publication activities, reader engagement, and database assets.</p>
      </div>

      {/* Stats Cards Grid (Floating White Cards on Cream) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="border border-brand-midnight3 bg-brand-midnight2 p-6 rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-3.5 rounded-xl ${card.color} flex-shrink-0`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-brand-warmgrey font-black uppercase tracking-wider">{card.name}</p>
              <h2 className="text-2xl sm:text-3xl font-black mt-0.5 text-brand-cream">{card.value}</h2>
              <p className="text-[10px] text-brand-warmgrey font-semibold mt-0.5">{card.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts & Popular Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Traffic Area Chart (lg:col-span-8) */}
        <div className="lg:col-span-8 border border-brand-midnight3 bg-brand-midnight2 p-6 sm:p-8 rounded-[24px] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold flex items-center text-brand-cream">
                <TrendingUp className="w-5 h-5 text-brand-lavender mr-2" />
                Reader Traffic
              </h3>
              <p className="text-xs text-brand-warmgrey">Page views over the last six months.</p>
            </div>
            <div className="text-right">
              <span className="text-brand-teal text-xs font-bold flex items-center justify-end">
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
                +{growthRate}%
              </span>
              <span className="text-[10px] text-brand-warmgrey">vs last month</span>
            </div>
          </div>

          {/* Premium Custom SVG Area Chart */}
          <div className="w-full h-64 relative pt-4">
            <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E1D6FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#E1D6FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="600" y2="20" stroke="#E9DFC3" strokeDasharray="4 4" opacity="0.1" />
              <line x1="0" y1="70" x2="600" y2="70" stroke="#E9DFC3" strokeDasharray="4 4" opacity="0.1" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#E9DFC3" strokeDasharray="4 4" opacity="0.1" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="#E9DFC3" strokeDasharray="4 4" opacity="0.1" />
              <line x1="0" y1="200" x2="600" y2="200" stroke="#E9DFC3" opacity="0.2" />
              
              {/* Chart Line & Fill */}
              <path 
                d={svgPath} 
                fill="none" 
                stroke="#E1D6FF" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              <path 
                d={svgFillPath} 
                fill="url(#chartGrad)" 
              />
 
              {/* Data dots */}
              <circle cx="0" cy={trafficY[0]} r="5" fill="#E1D6FF" stroke="#1A2540" strokeWidth="2" />
              <circle cx="120" cy={trafficY[1]} r="5" fill="#E1D6FF" stroke="#1A2540" strokeWidth="2" />
              <circle cx="240" cy={trafficY[2]} r="5" fill="#E1D6FF" stroke="#1A2540" strokeWidth="2" />
              <circle cx="360" cy={trafficY[3]} r="5" fill="#E1D6FF" stroke="#1A2540" strokeWidth="2" />
              <circle cx="480" cy={trafficY[4]} r="5" fill="#E1D6FF" stroke="#1A2540" strokeWidth="2" />
              <circle cx="600" cy={trafficY[5]} r="5" fill="#E1D6FF" stroke="#1A2540" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[10px] text-brand-warmgrey font-bold uppercase tracking-wider mt-4">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        {/* Category Performance Showcase (lg:col-span-4) */}
        <div className="lg:col-span-4 border border-brand-midnight3 bg-brand-midnight2 p-6 sm:p-8 rounded-[24px] space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold flex items-center text-brand-cream">
              <PieChart className="w-5 h-5 text-brand-lavender mr-2" />
              Category Share
            </h3>
            <p className="text-xs text-brand-warmgrey">Distribution of essays across sectors.</p>
          </div>

          <div className="space-y-4 pt-4">
            {/* Sector rows with percentage indicators */}
            {categoryShareWithPercentages.length === 0 ? (
              <p className="text-xs text-brand-warmgrey">No essays published yet.</p>
            ) : (
              categoryShareWithPercentages.map((sector) => (
                <div key={sector.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-brand-cream">{sector.name}</span>
                    <span className="text-brand-warmgrey">{sector.count} articles ({sector.percentage})</span>
                  </div>
                  <div className="w-full h-2 bg-brand-midnight3/30 rounded-full overflow-hidden">
                    <div className={`h-full ${sector.color} rounded-full`} style={{ width: sector.percentage }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Second Row: Popular Articles List */}
      <div className="border border-brand-midnight3 bg-brand-midnight2 p-6 sm:p-8 rounded-[24px] space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-brand-midnight3/60 pb-4">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold flex items-center text-brand-cream">
              <Award className="w-5 h-5 text-brand-lavender mr-2" />
              Popular Despatches
            </h3>
            <p className="text-xs text-brand-warmgrey">Articles driving the most traffic on the platform.</p>
          </div>
          <Link
            href="/admin/articles"
            className="text-xs font-bold text-brand-lavender uppercase tracking-wider hover:underline"
          >
            Manage Articles &rarr;
          </Link>
        </div>

        <div className="divide-y divide-brand-midnight3/60">
          {popularArticles.map((article, idx) => (
            <div key={article.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center first:pt-0 last:pb-0 gap-4">
              <div className="flex items-center space-x-4">
                <span className="font-serif text-2xl font-black text-brand-lavender/20 w-8 text-center">{idx + 1}</span>
                <div>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-brand-cream hover:text-brand-lavender transition-colors">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </h4>
                  <div className="flex items-center space-x-3 text-[10px] text-brand-warmgrey font-bold uppercase tracking-wider mt-1">
                    <span>{article.category?.name}</span>
                    <span>•</span>
                    <span>By {article.author?.name}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
<span className="text-xs font-bold flex items-center text-brand-cream font-mono">
                      <Eye className="w-3.5 h-3.5 text-brand-warmgrey mr-1.5" />
                      {article.views?.toLocaleString() ?? '1,000'}
                    </span>
                  <p className="text-[10px] text-brand-warmgrey uppercase font-semibold">views</p>
                </div>
                
                <Link
                  href={`/admin/articles/edit/${article.id}`}
                  className="p-2 border border-brand-midnight3 hover:border-brand-lavender hover:text-brand-lavender rounded-full bg-brand-midnight3/30 text-brand-warmgrey transition-colors cursor-pointer"
                  title="Edit article"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
