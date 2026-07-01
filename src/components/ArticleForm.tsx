'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../lib/db';
import { Article, Category, Author, Tag } from '../types';
import { Save, Globe, Eye, ArrowLeft, Plus, AlertCircle, Check } from 'lucide-react';
import Link from 'next/link';

interface ArticleFormProps {
  articleId?: string;
}

export default function ArticleForm({ articleId }: ArticleFormProps) {
  const router = useRouter();
  
  // Static options state
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<Article['status']>('draft');
  const [featured, setFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [tagInput, setTagInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    // Wrap selection or insert template
    const replacement = prefix + (selectedText || '') + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText || '').length
      );
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setSuccessMsg('Optimising image...');
    try {
      const { compressImage } = await import('../lib/utils');
      const compressed = await compressImage(file, 1000, 750);
      setCoverImage(compressed);
      setSuccessMsg('Image optimised and loaded.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to read or compress image.');
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedCats, loadedAuthors, loadedTags] = await Promise.all([
          db.getCategories(),
          db.getAuthors(),
          db.getTags()
        ]);
        setCategories(loadedCats);
        setAuthors(loadedAuthors);
        setTags(loadedTags);

        // If edit mode, load article details
        if (articleId) {
          const articles = await db.getArticles();
          const art = articles.find(a => a.id === articleId);
          if (art) {
            setTitle(art.title);
            setSlug(art.slug);
            setExcerpt(art.excerpt);
            setContent(art.content);
            setCoverImage(art.cover_image);
            setCategoryId(art.category_id);
            setAuthorId(art.author_id);
            setStatus(art.status);
            setFeatured(art.featured);
            setSeoTitle(art.seo_title || '');
            setSeoDescription(art.seo_description || '');
            setSelectedTags(art.tags?.map(t => t.id) || []);
          } else {
            setErrorMsg('Requested article not found.');
          }
        } else {
          // Pre-select first category and author if creating
          if (loadedCats.length > 0) setCategoryId(loadedCats[0].id);
          if (loadedAuthors.length > 0) setAuthorId(loadedAuthors[0].id);
        }
      } catch (err) {
        console.error('Failed to load form parameters:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [articleId]);

  // Handle title edit to generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!articleId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .replace(/\s+/g, '-') // spaces to dashes
        .replace(/-+/g, '-'); // collapse multiple dashes
      setSlug(generatedSlug);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      // Check if tag already exists in local tags list
      const matched = tags.find(t => t.name.toLowerCase() === tagInput.trim().toLowerCase());
      if (matched) {
        if (!selectedTags.includes(matched.id)) {
          setSelectedTags([...selectedTags, matched.id]);
        }
      } else {
        // Mock add new tag
        const newTagId = `tag-${Date.now()}`;
        const newTag: Tag = { id: newTagId, name: tagInput.trim(), slug: tagInput.trim().toLowerCase().replace(/\s+/g, '-') };
        setTags([...tags, newTag]);
        setSelectedTags([...selectedTags, newTagId]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  const handleSave = async (submitStatus: Article['status']) => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!title.trim() || !content.trim() || !slug.trim()) {
      setErrorMsg('Title, Slug, and Editorial content are required fields.');
      return;
    }

    setSaving(true);
    try {
      const payload: Omit<Article, 'id' | 'created_at'> = {
        title,
        slug,
        excerpt: excerpt.trim() || title.substring(0, 150),
        content,
        cover_image: coverImage.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        category_id: categoryId,
        author_id: authorId,
        status: submitStatus,
        featured,
        published_at: submitStatus === 'published' ? new Date().toISOString() : null,
        seo_title: seoTitle || title,
        seo_description: seoDescription || excerpt
      };

      if (articleId) {
        await db.updateArticle(articleId, payload);
        setSuccessMsg('Article updated successfully.');
      } else {
        await db.createArticle(payload);
        setSuccessMsg('New article created successfully.');
      }
      
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1000);
    } catch (err: Error | unknown) {
      setErrorMsg((err as Error).message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
</div>
      );
}

  return (
    <div className="space-y-6">
      {/* Top Header bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/articles"
          className="flex items-center space-x-1 text-xs font-bold uppercase tracking-widest text-muted hover:text-accent"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center space-x-1.5 px-4 py-2 border border-border rounded-lg text-xs font-bold uppercase tracking-wider bg-card-bg hover:bg-foreground/5 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center space-x-1.5 px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-accent/90 shadow-md hover:shadow-accent/25 transition-all disabled:opacity-50"
          >
            <Globe className="w-4 h-4" />
            <span>Publish Despatch</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs font-semibold">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs font-semibold">
          <Check className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Core editor (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border border-border bg-card-bg p-6 sm:p-8 rounded-2xl space-y-6">
            
            {/* Title */}
            <div className="space-y-1">
              <label className="form-lbl">Despatch Title</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="E.g., The Geopolitics of Semiconductors..."
                className="form-inp font-bold !text-sm"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="form-lbl">Slug Identifier</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="generated-slug-path"
                className="form-inp font-mono !text-xs"
              />
            </div>

            {/* Abstract */}
            <div className="space-y-1">
              <label className="form-lbl">Abstract / Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="A brief, two-sentence digest summarising the essay's core findings."
                className="form-inp leading-relaxed !text-xs"
              />
            </div>

            {/* Rich Editor Mockup */}
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="form-lbl !mb-0">Editorial Content</label>
                <span className="text-[10px] text-muted font-mono">Markdown syntax supported</span>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-background">
                {/* Editor buttons bar mockup */}
                <div className="bg-foreground/5 border-b border-border p-2 flex flex-wrap gap-2 text-xs text-muted font-bold uppercase tracking-wider">
                  <button type="button" onClick={() => insertFormat('# ', '\n')} className="px-2.5 py-1 bg-background border border-border hover:text-accent rounded cursor-pointer transition-colors" title="Heading 1">Heading 1</button>
                  <button type="button" onClick={() => insertFormat('## ', '\n')} className="px-2.5 py-1 bg-background border border-border hover:text-accent rounded cursor-pointer transition-colors" title="Heading 2">Heading 2</button>
                  <button type="button" onClick={() => insertFormat('**', '**')} className="px-2.5 py-1 bg-background border border-border hover:text-accent rounded cursor-pointer transition-colors font-extrabold" title="Bold">B</button>
                  <button type="button" onClick={() => insertFormat('*', '*')} className="px-2.5 py-1 bg-background border border-border hover:text-accent rounded cursor-pointer transition-colors italic" title="Italic">I</button>
                  <button type="button" onClick={() => insertFormat('> ', '\n')} className="px-2.5 py-1 bg-background border border-border hover:text-accent rounded cursor-pointer transition-colors font-serif" title="Pull Quote">Quote</button>
                  <button type="button" onClick={() => insertFormat('* ', '\n')} className="px-2.5 py-1 bg-background border border-border hover:text-accent rounded cursor-pointer transition-colors" title="Bullet List">List</button>
                  <button type="button" onClick={() => insertFormat('[', '](https://)')} className="px-2.5 py-1 bg-background border border-border hover:text-accent rounded cursor-pointer transition-colors" title="Link">Link</button>
                  <button type="button" onClick={() => insertFormat('\n| Column 1 | Column 2 |\n|---|---|\n| Item 1 | Item 2 |\n')} className="px-2.5 py-1 bg-background border border-border hover:text-accent rounded cursor-pointer transition-colors" title="Table">Table</button>
                </div>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  placeholder="# Write your essay body here... Use formatting buttons above to structure your text easily without writing code!"
                  className="w-full bg-transparent border-0 text-foreground px-4 py-3 rounded-b-lg text-sm focus:outline-none leading-relaxed font-mono resize-y"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Options & Metadata (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-border bg-card-bg p-6 rounded-2xl space-y-6">
            <h3 className="font-serif text-md font-bold border-b border-border/60 pb-2 text-accent">Despatch Meta</h3>
            
            {/* Sector */}
            <div className="space-y-1">
              <label className="form-lbl">Editorial Sector</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="form-inp appearance-none cursor-pointer !text-xs"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="space-y-1">
              <label className="form-lbl">Assigned Contributor</label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="form-inp appearance-none cursor-pointer !text-xs"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between border-t border-b border-border/60 py-4">
              <div>
                <label className="form-lbl">Featured Essay</label>
                <p className="text-[10px] text-muted">Affix this article to the home page hero slot.</p>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-accent cursor-pointer"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="form-lbl">Cover Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImage.startsWith('data:') ? '[Uploaded File]' : coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Paste URL or upload a file below..."
                  className="form-inp !text-xs flex-grow"
                  disabled={coverImage.startsWith('data:')}
                />
                {coverImage.startsWith('data:') && (
                  <button 
                    type="button" 
                    onClick={() => setCoverImage('')}
                    className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-xs border border-red-500/20 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] text-muted font-bold">Local upload (Max 1.5MB)</span>
                <label className="bg-background border border-border hover:border-accent hover:text-accent px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors inline-block">
                  Choose File...
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {coverImage && (
                <div className="h-32 w-full relative rounded-lg overflow-hidden border border-border bg-foreground/5 mt-2">
                   <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Tags multi-select chip area */}
            <div className="space-y-2">
              <label className="form-lbl">Despatch Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedTags.map(id => {
                  const tag = tags.find(t => t.id === id);
                  if (!tag) return null;
                  return (
                    <span key={id} className="inline-flex items-center space-x-1 bg-foreground/10 text-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      <span>#{tag.name}</span>
                      <button type="button" onClick={() => handleRemoveTag(id)} className="hover:text-red-500 font-normal">×</button>
                    </span>
                  );
                })}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag & hit Enter"
                className="form-inp !text-xs"
              />
            </div>

          </div>

          {/* SEO Block */}
          <div className="border border-border bg-card-bg p-6 rounded-2xl space-y-4">
            <h3 className="font-serif text-md font-bold border-b border-border/60 pb-2 text-accent">Search Engine Indexing</h3>
            
            <div className="space-y-1">
              <label className="form-lbl">Meta Title Override</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || "Article Title Defaults"}
                className="form-inp !text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="form-lbl">Meta Description Override</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                placeholder={excerpt || "Excerpt Summary Defaults"}
                className="form-inp leading-relaxed !text-xs"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
  
  // Quick typo handler
  function setSeSeoTitle(val: string) {
    setSeoTitle(val);
  }
}
