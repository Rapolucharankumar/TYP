'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/db';
import { SiteSettings } from '../../../types';
import { Save, Check, Settings, Globe, Share2, AlertCircle } from 'lucide-react';

type Tab = 'general' | 'seo' | 'social';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('general');

  // Form states
  const [siteName, setSiteName] = useState('');
  const [logo, setLogo] = useState('');
  const [favicon, setFavicon] = useState('');
  
  const [metaTitleDefault, setMetaTitleDefault] = useState('');
  const [metaDescriptionDefault, setMetaDescriptionDefault] = useState('');
  const [openGraphImage, setOpenGraphImage] = useState('');
  
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [youtube, setYoutube] = useState('');

  // Stats states
  const [writersCount, setWritersCount] = useState('');
  const [countriesCount, setCountriesCount] = useState('');
  const [partnershipsCount, setPartnershipsCount] = useState('');
  const [readersCount, setReadersCount] = useState('');
  const [papersCount, setPapersCount] = useState('');
  const [sectorsCount, setSectorsCount] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const loaded = await db.getSettings();
        setSettings(loaded);
        setSiteName(loaded.siteName);
        setLogo(loaded.logo);
        setFavicon(loaded.favicon);
        setMetaTitleDefault(loaded.metaTitleDefault);
        setMetaDescriptionDefault(loaded.metaDescriptionDefault);
        setOpenGraphImage(loaded.openGraphImage);
        setLinkedin(loaded.linkedin);
        setInstagram(loaded.instagram);
        setTwitter(loaded.twitter);
        setYoutube(loaded.youtube);
        
        // Load stats fields (fall back to empty if undefined)
        setWritersCount(loaded.writersCount || '');
        setCountriesCount(loaded.countriesCount || '');
        setPartnershipsCount(loaded.partnershipsCount || '');
        setReadersCount(loaded.readersCount || '');
        setPapersCount(loaded.papersCount || '');
        setSectorsCount(loaded.sectorsCount || '');
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setErrorMsg('');

    try {
      const payload: Partial<SiteSettings> = {
        siteName,
        logo,
        favicon,
        metaTitleDefault,
        metaDescriptionDefault,
        openGraphImage,
        linkedin,
        instagram,
        twitter,
        youtube,
        writersCount,
        countriesCount,
        partnershipsCount,
        readersCount,
        papersCount,
        sectorsCount
      };
      await db.updateSettings(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: Error | unknown) {
      setErrorMsg((err as Error).message || 'Failed to update configurations.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Platform Configuration</h1>
          <p className="text-xs text-muted mt-1">Configure site details, metadata descriptors, and social linkages.</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-accent/90 shadow-md flex items-center space-x-1.5 disabled:opacity-50 transition-all"
        >
          {success ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Configurations</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs font-semibold">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border/80 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap flex items-center space-x-2 transition-colors ${
            activeTab === 'general' ? 'border-accent text-accent font-black' : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>General Defaults</span>
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap flex items-center space-x-2 transition-colors ${
            activeTab === 'seo' ? 'border-accent text-accent font-black' : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Search Engine Meta</span>
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap flex items-center space-x-2 transition-colors ${
            activeTab === 'social' ? 'border-accent text-accent font-black' : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social Linkages</span>
        </button>
      </div>

      {/* Forms Content Box */}
      <div className="bg-card-bg border border-border p-6 sm:p-8 rounded-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold border-b border-border/40 pb-2 text-accent">General Site Settings</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Site Name Label</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Typographic Logo Text</label>
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-serif font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Favicon Asset Path</label>
                  <input
                    type="text"
                    value={favicon}
                    onChange={(e) => setFavicon(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              <h2 className="font-serif text-lg font-bold border-b border-border/40 pb-2 text-accent mt-8">Homepage Statistics</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Writers Count</label>
                  <input
                    type="text"
                    value={writersCount}
                    onChange={(e) => setWritersCount(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
                    placeholder="e.g., 17+"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Countries Count</label>
                  <input
                    type="text"
                    value={countriesCount}
                    onChange={(e) => setCountriesCount(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
                    placeholder="e.g., 4"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Partnerships Count</label>
                  <input
                    type="text"
                    value={partnershipsCount}
                    onChange={(e) => setPartnershipsCount(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
                    placeholder="e.g., 3"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Monthly Readers Count</label>
                  <input
                    type="text"
                    value={readersCount}
                    onChange={(e) => setReadersCount(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
                    placeholder="e.g., 24k+"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Papers Count (Board Widget)</label>
                  <input
                    type="text"
                    value={papersCount}
                    onChange={(e) => setPapersCount(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
                    placeholder="e.g., 50+"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Sectors Count (Board Widget)</label>
                  <input
                    type="text"
                    value={sectorsCount}
                    onChange={(e) => setSectorsCount(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
                    placeholder="e.g., 12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold border-b border-border/40 pb-2 text-accent">Search Engine Indexing Defaults</h2>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Global Meta Title Template</label>
                  <input
                    type="text"
                    value={metaTitleDefault}
                    onChange={(e) => setMetaTitleDefault(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Default Meta Description</label>
                  <textarea
                    value={metaDescriptionDefault}
                    onChange={(e) => setMetaDescriptionDefault(e.target.value)}
                    rows={4}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Default Open Graph Image URL</label>
                  <input
                    type="text"
                    value={openGraphImage}
                    onChange={(e) => setOpenGraphImage(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SOCIAL TAB */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold border-b border-border/40 pb-2 text-accent">Social Links</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">X (Twitter) Channel</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">LinkedIn Page</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Instagram Account</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">YouTube Channel</label>
                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="w-full bg-background border border-border text-foreground px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}

        </form>
      </div>

    </div>
  );
}
