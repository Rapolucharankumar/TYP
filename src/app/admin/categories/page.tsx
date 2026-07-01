'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/db';
import { Category } from '../../../types';
import { Plus, Trash2, AlertCircle, Check } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // UI status
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const loaded = await db.getCategories();
      setCategories(loaded);
    } catch (err: Error | unknown) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect -- async data loading within effect
     loadCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!name.trim() || !slug.trim()) {
      setErrorMsg('Category name and slug are required.');
      return;
    }

    setSubmitting(true);
    try {
      await db.createCategory({
        name,
        slug,
        description,
        image: image.trim() || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
      });
      setSuccessMsg('Category created successfully.');
      setName('');
      setSlug('');
      setDescription('');
      setImage('');
      loadCategories();
    } catch (err: Error | unknown) {
      setErrorMsg((err as Error).message || 'Failed to create category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All articles associated with this category might become unassigned.')) return;
    try {
      await db.deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Category Management</h1>
        <p className="text-xs text-muted mt-1">Structure distinct editorial sectors for grouping publications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Create form panel (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-card-bg border border-border p-6 rounded-2xl h-fit">
          <h2 className="font-serif text-lg font-bold border-b border-border/60 pb-2 text-accent mb-4">Add Editorial Sector</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-[10px] font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            
            {successMsg && (
              <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-[10px] font-semibold">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Sector Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="E.g., Cybersecurity"
                className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Slug path</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cybersecurity"
                className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs font-mono focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Description Summary</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief summary introducing the topics in this sector..."
                className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-accent leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Header Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-accent/90 flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Create Sector</span>
            </button>
          </form>
        </div>

        {/* Categories list table (lg:col-span-8) */}
        <div className="lg:col-span-8 border border-border bg-card-bg rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <p className="text-xs">No editorial sectors configured in the database.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border text-left text-xs">
              <thead className="bg-foreground/5 text-accent font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Sector Name</th>
                  <th className="px-6 py-4">Slug Path</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground/80">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-16 relative rounded overflow-hidden border border-border">
                        <img src={cat.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100'} alt={cat.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-serif text-sm font-bold text-foreground">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-muted">
                      /{cat.slug}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-muted leading-relaxed">
                      {cat.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 border border-border hover:border-red-500 hover:text-red-500 rounded-lg bg-background transition-colors text-muted"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
