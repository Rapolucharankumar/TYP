'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../../../lib/db';
import { Article, Category } from '../../../types';
import { 
  Plus, Search, Edit3, Trash2, CheckCircle2, XCircle, 
  Clock, AlertTriangle, Eye 
} from 'lucide-react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadArticlesData = async () => {
    setLoading(true);
    try {
      const [loadedArticles, loadedCategories] = await Promise.all([
        db.getArticles(),
        db.getCategories(),
      ]);
      setArticles(loadedArticles);
      setCategories(loadedCategories);
    } catch (err: Error | unknown) {
      console.error('Failed to load articles management data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect -- async data loading within effect
     loadArticlesData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await db.deleteArticle(id);
      alert('Article deleted successfully.');
      // Reload lists
      loadArticlesData();
    } catch (err: Error | unknown) {
      console.error('Failed to delete article:', err);
      alert('Failed to delete article: ' + ((err as Error).message || err));
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: Article['status']) => {
    const nextStatus: Article['status'] = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await db.updateArticle(id, { status: nextStatus });
      loadArticlesData();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Filter computation
  const filteredArticles = articles.filter(a => {
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || a.category_id === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: Article['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            <span>Published</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            <span>Draft</span>
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-brand-lavender bg-brand-lavender/10 px-2 py-0.5 rounded-full border border-brand-lavender/20 uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            <span>Scheduled</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Article Management</h1>
          <p className="text-xs text-muted mt-1">Compose, audit, schedule, and structure essays for publication.</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-accent text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-accent/90 shadow-md flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Despatch</span>
        </Link>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-border bg-card-bg p-4 rounded-xl">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search titles, abstracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border text-foreground px-4 py-2 pl-9 rounded-lg text-xs focus:outline-none focus:border-accent"
          />
          <Search className="w-3.5 h-3.5 text-muted absolute left-3" />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-background border border-border text-foreground px-4 py-2 rounded-lg text-xs focus:outline-none focus:border-accent appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-background border border-border text-foreground px-4 py-2 rounded-lg text-xs focus:outline-none focus:border-accent appearance-none"
          >
            <option value="all">All Sectors</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Article Listing Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-border border-dashed rounded-xl p-12 text-center bg-card-bg">
          <p className="font-serif text-lg font-bold">No articles found</p>
          <p className="text-xs text-muted mt-1">Refine your keywords or select other filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border rounded-xl bg-card-bg">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-foreground/5 text-xs font-bold uppercase tracking-wider text-accent">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Sector</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredArticles.map((art) => (
                <tr key={art.id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4 max-w-xs sm:max-w-sm truncate">
                    <span className="font-serif text-sm font-bold text-foreground block truncate">
                      {art.title}
                    </span>
                    <span className="text-[10px] text-muted block mt-0.5 truncate">{art.excerpt}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground/80">
                    {art.category?.name || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {art.author?.name || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(art.id, art.status)}
                      title="Click to toggle Status"
                      className="hover:scale-95 transition-transform"
                    >
                      {getStatusBadge(art.status)}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-muted">
                    {new Date(art.published_at || art.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <Link
                      href={`/admin/articles/edit/${art.id}`}
                      className="inline-flex p-2 border border-border hover:border-accent hover:text-accent rounded-lg bg-background transition-colors text-muted"
                      title="Edit Despatch"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="inline-flex p-2 border border-border hover:border-red-500 hover:text-red-500 rounded-lg bg-background transition-colors text-muted"
                      title="Delete Despatch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
