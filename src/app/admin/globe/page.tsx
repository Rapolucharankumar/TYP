'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/db';
import { useAuth } from '../../../context/auth-context';
import { GlobeMarker } from '../../../types';
import { 
  Globe, Plus, Edit2, Trash2, ShieldAlert, Sparkles, 
  MapPin, Check, AlertCircle, ToggleLeft, ToggleRight, Search 
} from 'lucide-react';

export default function GlobeContentPage() {
  const { user: currentUser, hasPermission } = useAuth();
  const [markers, setMarkers] = useState<GlobeMarker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Editor Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [type, setType] = useState<'writer' | 'origin' | 'research'>('writer');
  const [country, setCountry] = useState('');
  const [headline, setHeadline] = useState('');
  const [active, setActive] = useState(true);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadMarkers();
  }, []);

  async function loadMarkers() {
    setLoading(true);
    try {
      const data = await db.getGlobeMarkers();
      setMarkers(data);
    } catch (err) {
      console.error('Failed to load globe coordinates:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateInit = () => {
    setIsEditing(true);
    setEditId(null);
    setName('');
    setLat('');
    setLng('');
    setType('writer');
    setCountry('');
    setHeadline('');
    setActive(true);
    setFeedback(null);
  };

  const handleEditInit = (marker: GlobeMarker) => {
    setIsEditing(true);
    setEditId(marker.id);
    setName(marker.name);
    setLat(marker.lat.toString());
    setLng(marker.lng.toString());
    setType(marker.type);
    setCountry(marker.country);
    setHeadline(marker.headline);
    setActive(marker.active);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !lat || !lng || !country || !headline) return;

    setActionLoading(true);
    setFeedback(null);

    const payload = {
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      type,
      country,
      headline,
      active
    };

    try {
      if (editId) {
        // Update
        const updated = await db.updateGlobeMarker(editId, payload);
        setMarkers(prev => prev.map(m => m.id === editId ? updated : m));
        setFeedback({ type: 'success', message: 'Globe marker coordinates updated successfully.' });

        await db.createActivityLog({
          user_email: currentUser?.email || 'system',
          role: currentUser?.role || 'editor',
          action: 'Modify Globe Marker',
          details: { name: updated.name, id: editId }
        });
      } else {
        // Create
        const created = await db.createGlobeMarker(payload);
        setMarkers(prev => [created, ...prev]);
        setFeedback({ type: 'success', message: 'New coordinates plotted successfully.' });

        await db.createActivityLog({
          user_email: currentUser?.email || 'system',
          role: currentUser?.role || 'editor',
          action: 'Plot Globe Marker',
          details: { name: created.name, country: created.country }
        });
      }

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

  const handleToggleActive = async (marker: GlobeMarker) => {
    try {
      const updated = await db.updateGlobeMarker(marker.id, { active: !marker.active });
      setMarkers(prev => prev.map(m => m.id === marker.id ? updated : m));
      
      await db.createActivityLog({
        user_email: currentUser?.email || 'system',
        role: currentUser?.role || 'editor',
        action: updated.active ? 'Activate Globe Marker' : 'Deactivate Globe Marker',
        details: { name: updated.name }
      });
    } catch (err) {
      console.error('Failed to toggle active state:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently remove this coordinate marker from the WebGL centerpiece?')) return;
    try {
      const target = markers.find(m => m.id === id);
      await db.deleteGlobeMarker(id);
      setMarkers(prev => prev.filter(m => m.id !== id));
      
      await db.createActivityLog({
        user_email: currentUser?.email || 'system',
        role: currentUser?.role || 'editor',
        action: 'Delete Globe Marker',
        details: { name: target?.name }
      });
    } catch (err) {
      console.error('Failed to delete globe marker:', err);
    }
  };

  // Gate access check
  if (!hasPermission('manage_globe')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red animate-pulse">
          <ShieldAlert className="w-16 h-16" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-serif text-2xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-muted text-xs sm:text-sm">
            Your security clearance level is insufficient to access the Globe Coordinates control desk.
          </p>
        </div>
      </div>
    );
  }

  const filteredMarkers = markers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.headline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-black text-foreground">WebGL Globe Plotter</h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Plottings, coordinates, and live geopolitical despatches mapped onto the homepage centerpiece canvas.
          </p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleCreateInit}
            className="btn-primary !rounded-full flex items-center space-x-2 shadow-lg hover:shadow-brand-gold/15"
          >
            <Plus className="w-4 h-4" />
            <span>Plot Coordinate</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Form Editor */}
        {isEditing && (
          <div className="xl:col-span-1 border border-card-border bg-background/30 p-6 rounded-[24px] shadow-sm space-y-6 h-fit">
            <div className="flex items-center justify-between border-b border-card-border/60 pb-3">
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center">
                <Sparkles className="w-5 h-5 text-accent mr-2" />
                {editId ? 'Revise Coordinates' : 'Plot Coordinates'}
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-xs text-muted hover:text-accent font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Location Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Geneva, Switzerland"
                  className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="e.g., 46.2044"
                    className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="e.g., 6.1432"
                    className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Node Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="writer">Writer Desk</option>
                    <option value="origin">Origin Supply</option>
                    <option value="research">Research Hub</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Country Code</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., CHE, USA, IND"
                    className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Despatch Headline</label>
                <textarea
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Query headline briefing to display on node interaction..."
                  rows={3}
                  className="w-full bg-background border border-card-border text-foreground p-4 rounded-2xl text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded border-card-border bg-background text-accent focus:ring-0 cursor-pointer"
                />
                <label htmlFor="active" className="text-xs font-bold uppercase tracking-wider text-foreground cursor-pointer">
                  Activate plotted point immediately
                </label>
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
                      <span>Plot Coordinates</span>
                      <MapPin className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Right Side: Plotted Node Directory Table */}
        <div className={`${isEditing ? 'xl:col-span-2' : 'xl:col-span-3'} border border-card-border bg-background/30 p-6 rounded-[24px] shadow-sm space-y-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">Plotted Coordinates Directory</h3>
            </div>
            
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search coordinate registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-card-border text-foreground pl-10 pr-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredMarkers.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-card-border rounded-2xl text-muted text-xs font-semibold bg-background/10">
              No plotted coordinate markers match the search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-card-border/60 text-accent font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Coordinates</th>
                    <th className="pb-3 font-semibold">Node Type</th>
                    <th className="pb-3 font-semibold">Brief Summary</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/40">
                  {filteredMarkers.map((marker) => (
                    <tr key={marker.id} className={`group hover:bg-background/25 transition-colors ${!marker.active ? 'opacity-60' : ''}`}>
                      <td className="py-4">
                        <div className="font-semibold text-foreground">{marker.name}</div>
                        <div className="text-[10px] text-muted uppercase tracking-widest mt-0.5">{marker.country}</div>
                      </td>
                      <td className="py-4 font-mono text-muted text-[10px]">
                        {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                      </td>
                      <td className="py-4">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                          marker.type === 'origin'
                            ? 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
                            : marker.type === 'research'
                            ? 'bg-brand-lavender/15 text-brand-lavender border-brand-lavender/30'
                            : 'bg-brand-teal/15 text-brand-teal border-brand-teal/30'
                        }`}>
                          {marker.type}
                        </span>
                      </td>
                      <td className="py-4 max-w-xs truncate font-medium text-foreground">
                        {marker.headline}
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(marker)}
                          className="text-muted hover:text-accent transition-colors cursor-pointer"
                          title={marker.active ? 'Deactivate node' : 'Activate node'}
                        >
                          {marker.active ? (
                            <ToggleRight className="w-6 h-6 text-brand-teal" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-muted" />
                          )}
                        </button>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditInit(marker)}
                            className="p-2 border border-card-border hover:border-accent hover:text-accent rounded-full bg-background text-muted transition-colors cursor-pointer"
                            title="Edit coordinates"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(marker.id)}
                            className="p-2 border border-brand-red/20 text-brand-red hover:bg-brand-red/10 rounded-full bg-background transition-colors cursor-pointer"
                            title="Delete plotted point"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
