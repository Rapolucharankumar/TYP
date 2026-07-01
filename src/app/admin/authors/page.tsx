'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/db';
import { Author } from '../../../types';
import { Plus, Trash2, AlertCircle, Check } from 'lucide-react';

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



export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('Contributor');
  const [avatar, setAvatar] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // UI status
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setSuccessMsg('Optimising avatar...');
    try {
      const { compressImage } = await import('../../../lib/utils');
      const compressed = await compressImage(file, 200, 200);
      setAvatar(compressed);
      setSuccessMsg('Avatar optimised and loaded.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to read or compress avatar image.');
    }
  };

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const loaded = await db.getAuthors();
      setAuthors(loaded);
    } catch (err: Error | unknown) {
      console.error('Failed to load authors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect -- async data loading within effect
     loadAuthors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!name.trim()) {
      setErrorMsg('Author name is required.');
      return;
    }

    setSubmitting(true);
    try {
      await db.createAuthor({
        name,
        bio,
        avatar: avatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role,
        social_links: {
          twitter: twitter.trim() || undefined,
          linkedin: linkedin.trim() || undefined
        }
      });
      setSuccessMsg('Author profile created.');
      setName('');
      setBio('');
      setRole('Contributor');
      setAvatar('');
      setTwitter('');
      setLinkedin('');
      loadAuthors();
    } catch (err: Error | unknown) {
      setErrorMsg((err as Error).message || 'Failed to create author.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author? All articles associated with this author might become unassigned.')) return;
    try {
      await db.deleteAuthor(id);
      loadAuthors();
    } catch (err) {
      console.error('Failed to delete author:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Author Management</h1>
        <p className="text-xs text-muted mt-1">Add, edit, or delete credentials of staff contributors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Create form panel (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-card-bg border border-border p-6 rounded-2xl h-fit">
          <h2 className="font-serif text-lg font-bold border-b border-border/60 pb-2 text-accent mb-4">Add Contributor</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-[10px] font-semibold">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            
            {successMsg && (
              <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-[10px] font-semibold">
                <Check className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Marcus Sterling"
                className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Biography Brief</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Marcus Sterling is a technology policy researcher focusing on..."
                className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-accent leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Editorial Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-background border border-border text-foreground px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-accent"
              >
                <option value="Editor-in-Chief">Editor-in-Chief</option>
                <option value="Managing Editor">Managing Editor</option>
                <option value="Creative Director">Creative Director</option>
                <option value="Geopolitical Lead">Geopolitical Lead</option>
                <option value="Policy Lead">Policy Lead</option>
                <option value="Healthcare Equity Lead">Healthcare Equity Lead</option>
                <option value="Senior Correspondent">Senior Correspondent</option>
                <option value="Staff Writer">Staff Writer</option>
                <option value="Contributor">Contributor</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Avatar Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={avatar.startsWith('data:') ? '[Uploaded File]' : avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Paste URL or upload below..."
                  className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-accent"
                  disabled={avatar.startsWith('data:')}
                />
                {avatar.startsWith('data:') && (
                  <button 
                    type="button" 
                    onClick={() => setAvatar('')}
                    className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-xs border border-red-500/20 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] text-muted">Local upload (Max 800KB)</span>
                <label className="bg-background border border-border hover:border-accent hover:text-accent px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors inline-block">
                  Choose File...
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Twitter URL</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/..."
                className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">LinkedIn URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-accent/90 flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Author</span>
            </button>
          </form>
        </div>

        {/* Authors list table (lg:col-span-8) */}
        <div className="lg:col-span-8 border border-border bg-card-bg rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : authors.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <p className="text-xs">No contributors registered in database.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border text-left text-xs">
              <thead className="bg-foreground/5 text-accent font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Avatar</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Bio Details</th>
                  <th className="px-6 py-4">Social</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground/80">
                {authors.map((auth) => (
                  <tr key={auth.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={auth.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'} alt={auth.name} className="h-10 w-10 rounded-full object-cover border border-border" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-serif text-sm font-bold text-foreground">
                      {auth.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[9px] font-black uppercase tracking-wider text-accent bg-accent/15 px-2.5 py-0.5 rounded border border-accent/10">
                        {auth.role || 'Contributor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-muted leading-relaxed">
                      {auth.bio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      {auth.social_links?.twitter && <TwitterIcon className="w-3.5 h-3.5 inline text-muted" />}
                      {auth.social_links?.linkedin && <LinkedinIcon className="w-3.5 h-3.5 inline text-muted" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(auth.id)}
                        className="p-2 border border-border hover:border-red-500 hover:text-red-500 rounded-lg bg-background transition-colors text-muted"
                        title="Delete Author"
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
