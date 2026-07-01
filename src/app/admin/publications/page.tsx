'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/db';
import { useAuth } from '../../../context/auth-context';
import { MagazineIssue, Article } from '../../../types';
import { 
  BookOpen, Plus, Edit2, Trash2, ShieldAlert, Sparkles, 
  FileText, Check, Calendar, AlertCircle, Eye 
} from 'lucide-react';

export default function PublicationsPage() {
  const { user: currentUser, hasPermission } = useAuth();
  const [publications, setPublications] = useState<MagazineIssue[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [editorialNote, setEditorialNote] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [featured, setFeatured] = useState(false);
  const [publishedAt, setPublishedAt] = useState('');
  
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [pubData, artData] = await Promise.all([
        db.getPublications(),
        db.getArticles()
      ]);
      setPublications(pubData);
      setArticles(artData.filter(a => a.status === 'published'));
    } catch (err) {
      console.error('Failed to load publication desk data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleEditInit = (pub: MagazineIssue) => {
    setIsEditing(true);
    setEditId(pub.id);
    setTitle(pub.title);
    setSlug(pub.slug);
    setCoverImage(pub.cover_image || '');
    setEditorialNote(pub.editorial_note || '');
    setStatus(pub.status);
    setFeatured(pub.featured || false);
    setPublishedAt(pub.published_at ? pub.published_at.slice(0, 10) : '');
    
    // De-serialize article selections if stored in note or mock
    try {
      if (pub.editorial_note?.includes('Associated Articles JSON:')) {
        const parts = pub.editorial_note.split('Associated Articles JSON:');
        setEditorialNote(parts[0].trim());
        setSelectedArticles(JSON.parse(parts[1].trim()));
      } else {
        setSelectedArticles([]);
      }
    } catch {
      setSelectedArticles([]);
    }
  };

  const handleCreateInit = () => {
    setIsEditing(true);
    setEditId(null);
    setTitle('');
    setSlug('');
    setCoverImage('');
    setEditorialNote('');
    setStatus('draft');
    setFeatured(false);
    setPublishedAt(new Date().toISOString().slice(0, 10));
    setSelectedArticles([]);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;
    
    setActionLoading(true);
    setFeedback(null);
    
    // Save associated articles inside editorial note for schema consistency
    let finalNote = editorialNote;
    if (selectedArticles.length > 0) {
      finalNote = `${editorialNote.trim()}\n\nAssociated Articles JSON:${JSON.stringify(selectedArticles)}`;
    }
    
    const payload = {
      title,
      slug: slug.trim().toLowerCase(),
      cover_image: coverImage || undefined,
      editorial_note: finalNote || undefined,
      status,
      featured,
      published_at: status === 'published' ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) : null
    };

    try {
      if (editId) {
        // Update
        const updated = await db.updatePublication(editId, payload);
        setPublications(prev => prev.map(p => p.id === editId ? updated : p));
        setFeedback({ type: 'success', message: 'Magazine issue updated successfully.' });
        
        await db.createActivityLog({
          user_email: currentUser?.email || 'system',
          role: currentUser?.role || 'editor',
          action: 'Update Magazine Publication',
          details: { title: updated.title, id: editId }
        });
      } else {
        // Create
        const created = await db.createPublication(payload);
        setPublications(prev => [created, ...prev]);
        setFeedback({ type: 'success', message: 'Magazine issue compiled and registered.' });
        
        await db.createActivityLog({
          user_email: currentUser?.email || 'system',
          role: currentUser?.role || 'editor',
          action: 'Compile Magazine Publication',
          details: { title: created.title, slug: created.slug }
        });
      }
      
      // Reset form
      setTimeout(() => {
        setIsEditing(false);
        setEditId(null);
        setFeedback(null);
      }, 1500);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Action execution failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this digital publication issue?')) return;
    try {
      const target = publications.find(p => p.id === id);
      await db.deletePublication(id);
      setPublications(prev => prev.filter(p => p.id !== id));
      
      await db.createActivityLog({
        user_email: currentUser?.email || 'system',
        role: currentUser?.role || 'editor',
        action: 'Delete Magazine Publication',
        details: { title: target?.title }
      });
    } catch (err) {
      console.error('Failed to delete issue:', err);
      alert('Failed to delete publication issue.');
    }
  };

  const toggleArticleSelection = (artId: string) => {
    setSelectedArticles(prev => 
      prev.includes(artId) ? prev.filter(id => id !== artId) : [...prev, artId]
    );
  };

  // Gate access check
  if (!hasPermission('manage_publications')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red animate-pulse">
          <ShieldAlert className="w-16 h-16" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-serif text-2xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-muted text-xs sm:text-sm">
            Your security clearance level is insufficient to access the Publications desk.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-black text-foreground">Publications / Issues Desk</h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Compile individual published despatches into curated quarterly digital magazine issues.
          </p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleCreateInit}
            className="btn-primary !rounded-full flex items-center space-x-2 shadow-lg hover:shadow-brand-gold/15"
          >
            <Plus className="w-4 h-4" />
            <span>Assemble Issue</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Assembly Board Form */
        <div className="border border-card-border bg-background/30 p-6 sm:p-8 rounded-[24px] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-card-border/60 pb-4">
            <h3 className="font-serif text-lg font-bold text-foreground flex items-center">
              <Sparkles className="w-5 h-5 text-accent mr-2" />
              {editId ? 'Revise Issue Blueprint' : 'Assemble Digital Issue'}
            </h3>
            <button 
              onClick={() => setIsEditing(false)}
              className="text-xs text-muted hover:text-accent font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {feedback && (
              <div className={`flex items-center space-x-2 border p-3.5 rounded-2xl text-xs font-semibold ${
                feedback.type === 'success' 
                  ? 'text-brand-teal bg-brand-teal/10 border-brand-teal/20' 
                  : 'text-brand-red bg-brand-red/10 border-brand-red/20'
              }`}>
                {feedback.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Issue Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editId) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                    placeholder="Volume 1, Issue 2: Digital Cartography"
                    className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Issue Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="volume-1-issue-2"
                    className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Cover Image URL</label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Publication Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent cursor-pointer"
                    >
                      <option value="draft">Draft (Private)</option>
                      <option value="published">Published (Public)</option>
                      <option value="archived">Archived (Deprioritized)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Publish Date</label>
                    <input
                      type="date"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      className="w-full bg-background border border-card-border text-foreground px-4 py-2 rounded-2xl text-xs focus:outline-none focus:border-accent cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-card-border bg-background text-accent focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-xs font-bold uppercase tracking-wider text-foreground cursor-pointer">
                    Feature prominently on the Homepage centerpiece
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Editorial Lead Note</label>
              <textarea
                value={editorialNote}
                onChange={(e) => setEditorialNote(e.target.value)}
                placeholder="Write the prologue, setting the tone for this curated collection of analyses..."
                rows={5}
                className="w-full bg-background border border-card-border text-foreground p-4 rounded-2xl text-xs focus:outline-none focus:border-accent"
              />
            </div>

            {/* Curating Articles Selector */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Curate Articles into this Collection</label>
                <p className="text-[10px] text-muted">Select from recently published articles on the platform to include in this magazine issue.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border border-card-border/60 rounded-2xl bg-background/20">
                {articles.map(art => {
                  const selected = selectedArticles.includes(art.id);
                  return (
                    <div 
                      key={art.id} 
                      onClick={() => toggleArticleSelection(art.id)}
                      className={`flex items-center justify-between p-3 border rounded-xl text-xs font-semibold cursor-pointer transition-all hover:bg-background/40 ${
                        selected 
                          ? 'border-accent bg-accent/5 text-foreground' 
                          : 'border-card-border text-muted hover:text-foreground'
                      }`}
                    >
                      <div className="truncate pr-4">
                        <div className="truncate">{art.title}</div>
                        <span className="text-[9px] text-muted font-mono">{art.category?.name} • By {art.author?.name}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        selected ? 'border-accent bg-accent text-brand-midnight' : 'border-card-border'
                      }`}>
                        {selected && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary !rounded-full"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="btn-primary !rounded-full flex items-center space-x-2"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-brand-midnight border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Compile Blueprint</span>
                    <BookOpen className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Compiled Issues Showcase */
        <div className="space-y-6">
          {publications.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-card-border rounded-[24px] text-muted text-xs font-semibold bg-background/10 space-y-4">
              <BookOpen className="w-12 h-12 mx-auto text-card-border/80" />
              <p>No quarterly magazine issues have been compiled yet.</p>
              <button 
                onClick={handleCreateInit}
                className="btn-secondary !rounded-full"
              >
                Curate first issue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub) => {
                let articleCount = 0;
                try {
                  if (pub.editorial_note?.includes('Associated Articles JSON:')) {
                    const parts = pub.editorial_note.split('Associated Articles JSON:');
                    const ids = JSON.parse(parts[1].trim());
                    articleCount = ids.length;
                  }
                } catch {}

                return (
                  <div key={pub.id} className="border border-card-border bg-background/20 rounded-[24px] p-6 hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {pub.cover_image && (
                        <div className="w-full h-40 rounded-xl overflow-hidden bg-muted/10 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={pub.cover_image} 
                            alt={pub.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {pub.featured && (
                            <span className="absolute top-3 left-3 bg-brand-gold text-brand-midnight text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-brand-gold/30">
                              Featured
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                            pub.status === 'published' 
                              ? 'bg-brand-teal/15 text-brand-teal border-brand-teal/30'
                              : pub.status === 'archived'
                              ? 'bg-card-border/80 text-muted border-card-border'
                              : 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
                          }`}>
                            {pub.status}
                          </span>
                          <span className="text-[10px] text-muted flex items-center font-semibold">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {pub.published_at ? pub.published_at.slice(0, 10) : 'Draft'}
                          </span>
                        </div>

                        <h3 className="font-serif text-lg font-black text-foreground group-hover:text-accent transition-colors">
                          {pub.title}
                        </h3>
                        
                        <p className="text-xs text-muted font-mono line-clamp-3">
                          {pub.editorial_note?.split('Associated Articles JSON:')[0].trim() || 'No prologue note available.'}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-card-border/60 pt-4 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center">
                        <FileText className="w-4 h-4 mr-1.5" />
                        {articleCount} Curated Essays
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditInit(pub)}
                          className="p-2 border border-card-border hover:border-accent hover:text-accent rounded-full bg-background/50 text-muted transition-colors cursor-pointer"
                          title="Revise blueprint"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(pub.id)}
                          className="p-2 border border-brand-red/20 text-brand-red hover:bg-brand-red/10 rounded-full bg-background/50 transition-colors cursor-pointer"
                          title="Dissolve collection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
