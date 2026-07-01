'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/db';
import { Opportunity } from '../../../types';
import { 
  Plus, Edit3, Trash2, Calendar, MapPin, Award, 
  AlertCircle, Check, Loader2, RefreshCw 
} from 'lucide-react';

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Fellowship');
  const [tagClass, setTagClass] = useState('tag-butter');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [stipend, setStipend] = useState('');

  // UI status states
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const data = await db.getOpportunities();
      setOpportunities(data);
    } catch (err: Error | unknown) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect -- async data loading within effect
     loadOpportunities();
  }, []);

  const handleEdit = (opp: Opportunity) => {
    setEditingId(opp.id);
    setTitle(opp.title);
    setType(opp.type);
    setTagClass(opp.tagClass);
    setDeadline(opp.deadline);
    setLocation(opp.location);
    setDescription(opp.description);
    setStipend(opp.stipend || '');
    
    // Scroll to form
    const formElement = document.getElementById('opportunity-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await db.deleteOpportunity(id);
      alert('Opportunity deleted successfully.');
      loadOpportunities();
    } catch (err: Error | unknown) {
      console.error('Failed to delete opportunity:', err);
      alert('Failed to delete: ' + ((err as Error).message || err));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    clearForm();
  };

  const clearForm = () => {
    setTitle('');
    setType('Fellowship');
    setTagClass('tag-butter');
    setDeadline('');
    setLocation('');
    setDescription('');
    setStipend('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload: Omit<Opportunity, 'id'> = {
        title,
        type,
        tagClass,
        deadline,
        location,
        description,
        stipend: stipend || undefined
      };

      if (editingId) {
        await db.updateOpportunity(editingId, payload);
        setSuccessMsg('Opportunity updated successfully.');
      } else {
        await db.createOpportunity(payload);
        setSuccessMsg('Opportunity created successfully.');
      }

      setEditingId(null);
      clearForm();
      setTimeout(() => setSuccessMsg(''), 3000);
      loadOpportunities();
    } catch (err: Error | unknown) {
      console.error('Failed to save opportunity:', err);
      setErrorMsg((err as Error).message || 'Failed to save opportunity.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Opportunities Desk Curation</h1>
          <p className="text-xs text-muted mt-1">Manage public writing fellowships, essay contests, and research programs.</p>
        </div>
        <button
          onClick={loadOpportunities}
          disabled={loading}
          className="p-2.5 border border-border hover:border-accent hover:text-accent rounded-lg bg-background transition-colors text-muted flex items-center space-x-1"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Editor Panel Form */}
      <div id="opportunity-form" className="bg-card-bg border border-border p-6 sm:p-8 rounded-2xl space-y-6">
        <h2 className="font-serif text-lg font-bold border-b border-border/40 pb-2 text-accent">
          {editingId ? 'Edit Opportunity Context' : 'Announce New Opportunity'}
        </h2>

        {successMsg && (
          <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs font-semibold">
            <Check className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs font-semibold">
            <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., The Youth Prism Fellowship 2026"
                className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Type Category</label>
              <input
                type="text"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g., Fellowship, Workshop, Competition"
                className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Stipend or Funding</label>
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="e.g., $1,200 Stipend, Free"
                className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Deadline Date</label>
              <input
                type="text"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g., July 15, 2026"
                className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Raipur / Remote, Global / Online"
                className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Color Accent Tag</label>
              <select
                value={tagClass}
                onChange={(e) => setTagClass(e.target.value)}
                className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent appearance-none font-semibold"
              >
                <option value="tag-butter">Gold / Yellow (tag-butter)</option>
                <option value="tag-cherry">Red (tag-cherry)</option>
                <option value="tag-teal">Teal (tag-teal)</option>
                <option value="tag-sand">Sand Beige (tag-sand)</option>
                <option value="tag-lavender">Lavender (tag-lavender)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Description Detail</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the scope of opportunities, requirements, stipends, and expectations..."
              className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent leading-relaxed"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="border border-border text-foreground/85 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-card-border/40 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="bg-accent text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-accent/90 shadow-md flex items-center space-x-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{editingId ? 'Save Opportunity' : 'Publish Opportunity'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Opportunities List Table */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-foreground">Current Active Listings</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-32 border border-border rounded-xl bg-card-bg">
            <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-border border-dashed rounded-xl p-12 text-center bg-card-bg">
            <p className="font-serif text-lg font-bold">No active opportunities announced</p>
            <p className="text-xs text-muted mt-1">Use the form above to add an essay prize or fellowship.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-border rounded-xl bg-card-bg">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-foreground/5 text-xs font-bold uppercase tracking-wider text-accent">
                <tr>
                  <th className="px-6 py-4">Title & Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4 max-w-sm">
                      <span className="font-serif text-sm font-bold text-foreground block">
                        {opp.title}
                      </span>
                      <span className="text-[10px] text-muted block mt-0.5 line-clamp-1">{opp.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`tag ${opp.tagClass}`}>
                        {opp.type}
                      </span>
                      {opp.stipend && (
                        <span className="block text-[9px] text-muted font-bold mt-1 uppercase tracking-wider">
                          {opp.stipend}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        <span>{opp.location}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-muted">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>{opp.deadline}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleEdit(opp)}
                        className="inline-flex p-2 border border-border hover:border-accent hover:text-accent rounded-lg bg-background transition-colors text-muted cursor-pointer"
                        title="Edit Opportunity"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(opp.id)}
                        className="inline-flex p-2 border border-border hover:border-red-500 hover:text-red-500 rounded-lg bg-background transition-colors text-muted cursor-pointer"
                        title="Delete Opportunity"
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
    </div>
  );
}
