'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/db';
import { useAuth } from '../../../context/auth-context';
import { HomepageLayout } from '../../../types';
import { 
  Sliders, ShieldAlert, Sparkles, Check, AlertCircle, 
  ArrowUp, ArrowDown, Eye, EyeOff, LayoutGrid, RotateCcw 
} from 'lucide-react';

const ALL_SECTIONS = [
  { id: 'Hero', name: 'Editorial Masthead & Hero Grid', desc: 'Above the fold typographic grid containing despatches, trending essays, and the hero centerpiece.' },
  { id: 'Newsroom', name: 'Living Newsroom Marquee', desc: 'Marquee ribbon containing real-time simulated update briefs.' },
  { id: 'Globe', name: 'Global Intelligence Center (WebGL Globe)', desc: 'The flagship interactive 3D WebGL globe mapping correspondents and policy centers.' },
  { id: 'Despatches', name: 'Despatches Feed & Board Widget', desc: 'Latest articles filtered dynamically by globe focus selection and board stats widget.' },
  { id: 'Node Graph', name: 'Focus Area Intersections (Ecosystem Map)', desc: 'Interactive node graph illustrating intersections between policy sectors.' },
  { id: 'Pathways', name: 'Guided Learning Journeys', desc: 'Curated pathways showing thematic reading guide modules.' },
  { id: 'Reports', name: 'Special Reports & Booklet Shelf', desc: 'Grid displaying digital bookshelf quarterly magazine blueprints.' },
  { id: 'Voice', name: 'Voice of the Week Quote Spread', desc: 'Full editorial quote spread displaying select quote of the week.' },
  { id: 'Opportunities', name: 'Opportunities Desk & Desks Directory', desc: 'Active fellowship openings list alongside sector directories.' },
  { id: 'Archive', name: 'Editorial Archive & Editor Picks', desc: 'Historical despatches feed combined with editors hand-picked articles.' }
];

export default function HomepageBuilderPage() {
  const { user: currentUser, hasPermission } = useAuth();
  const [layout, setLayout] = useState<HomepageLayout | null>(null);
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([]);
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadLayout();
  }, []);

  async function loadLayout() {
    setLoading(true);
    try {
      const data = await db.getHomepageLayout();
      setLayout(data);
      
      const order = data?.config?.order || ALL_SECTIONS.map(s => s.id);
      
      // Merge with any new sections that might not be in saved config
      const completeOrder = [...order];
      ALL_SECTIONS.forEach(s => {
        if (!completeOrder.includes(s.id)) {
          completeOrder.push(s.id);
        }
      });
      
      setSectionsOrder(completeOrder);
      
      const visible = { ...data?.config?.visible };
      ALL_SECTIONS.forEach(s => {
        if (visible[s.id] === undefined) {
          visible[s.id] = true;
        }
      });
      setVisibleMap(visible);
    } catch (err) {
      console.error('Failed to load homepage layout config:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionsOrder];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (swapIndex < 0 || swapIndex >= newOrder.length) return;
    
    // Swap
    const temp = newOrder[index];
    newOrder[index] = newOrder[swapIndex];
    newOrder[swapIndex] = temp;
    
    setSectionsOrder(newOrder);
  };

  const handleToggleVisibility = (sectionId: string) => {
    setVisibleMap(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSave = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const updated = await db.updateHomepageLayout({
        config: {
          order: sectionsOrder,
          visible: visibleMap
        }
      });
      setLayout(updated);
      setFeedback({ type: 'success', message: 'Homepage blueprint saved and deployed successfully.' });
      
      await db.createActivityLog({
        user_email: currentUser?.email || 'system',
        role: currentUser?.role || 'editor',
        action: 'Reorder Homepage Layout',
        details: { sections_order: sectionsOrder }
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save homepage layout.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to restore the default homepage section layout blueprint?')) return;
    const defaultOrder = ALL_SECTIONS.map(s => s.id);
    const defaultVisible: Record<string, boolean> = {};
    ALL_SECTIONS.forEach(s => {
      defaultVisible[s.id] = true;
    });
    
    setSectionsOrder(defaultOrder);
    setVisibleMap(defaultVisible);
    
    setFeedback({ type: 'success', message: 'Homepage blue prints reset to factory default (unsaved).' });
  };

  // Gate access check
  if (!hasPermission('manage_homepage')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red animate-pulse">
          <ShieldAlert className="w-16 h-16" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-serif text-2xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-muted text-xs sm:text-sm">
            Your security clearance level is insufficient to access the Homepage Layout Builder desk.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Masthead Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-card-border/60 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-black text-foreground">Homepage Sections Manager</h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Toggle visibility and reorder entire homepage modules dynamically to emphasize publications or opportunities.
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleReset}
            disabled={loading || actionLoading}
            className="btn-secondary !rounded-full flex items-center space-x-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={loading || actionLoading}
            className="btn-primary !rounded-full flex items-center space-x-2 shadow-lg hover:shadow-brand-gold/15"
          >
            {actionLoading ? (
              <div className="w-4 h-4 border-2 border-brand-midnight border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save & Deploy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`flex items-center space-x-2 border p-4 rounded-2xl text-xs font-semibold max-w-md ${
          feedback.type === 'success' 
            ? 'text-brand-teal bg-brand-teal/10 border-brand-teal/20' 
            : 'text-brand-red bg-brand-red/10 border-brand-red/20'
        }`}>
          {feedback.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center space-x-2.5 text-accent text-xs font-black uppercase tracking-wider pl-1 pb-1">
            <LayoutGrid className="w-4 h-4" />
            <span>Homepage Blueprint Nodes Stack</span>
          </div>

          <div className="space-y-3">
            {sectionsOrder.map((sectionId, index) => {
              const info = ALL_SECTIONS.find(s => s.id === sectionId) || { id: sectionId, name: sectionId, desc: 'Custom Homepage Module' };
              const isVisible = visibleMap[sectionId] !== false;

              return (
                <div 
                  key={sectionId}
                  className={`border transition-all rounded-[20px] p-5 flex items-center justify-between gap-6 ${
                    isVisible 
                      ? 'bg-card-bg border-card-border/80 shadow-sm' 
                      : 'bg-card-bg/25 border-dashed border-card-border/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-grow min-w-0">
                    <span className="font-serif text-xl font-bold text-accent/30 w-8 text-center">{index + 1}</span>
                    <div className="min-w-0 space-y-1">
                      <h4 className="font-serif text-sm sm:text-base font-bold text-foreground truncate">
                        {info.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-muted leading-relaxed truncate max-w-2xl">
                        {info.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {/* Move Controls */}
                    <div className="flex border border-card-border/80 rounded-full overflow-hidden bg-background">
                      <button
                        onClick={() => handleMoveSection(index, 'up')}
                        disabled={index === 0}
                        className="p-2 text-muted hover:text-accent disabled:opacity-30 disabled:hover:text-muted transition-colors cursor-pointer"
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-[1px] bg-card-border/60" />
                      <button
                        onClick={() => handleMoveSection(index, 'down')}
                        disabled={index === sectionsOrder.length - 1}
                        className="p-2 text-muted hover:text-accent disabled:opacity-30 disabled:hover:text-muted transition-colors cursor-pointer"
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => handleToggleVisibility(sectionId)}
                      className={`p-2 border rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                        isVisible 
                          ? 'border-brand-teal/20 text-brand-teal hover:bg-brand-teal/10 bg-brand-teal/5' 
                          : 'border-card-border text-muted hover:bg-card-bg/40'
                      }`}
                      title={isVisible ? 'Hide section on Homepage' : 'Display section on Homepage'}
                    >
                      {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={actionLoading}
              className="btn-primary !rounded-full flex items-center space-x-2 shadow-lg hover:shadow-brand-gold/15"
            >
              {actionLoading ? (
                <div className="w-4 h-4 border-2 border-brand-midnight border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save & Deploy Blueprint</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
