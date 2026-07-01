'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/db';
import { NewsletterSubscriber, Campaign } from '../../../types';
import { Mail, Send, Download, Trash2, Check, AlertCircle, History, Sparkles } from 'lucide-react';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  // UI Status
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'subscribers' | 'logs'>('subscribers');

  const loadNewsletterData = async () => {
    setLoading(true);
    try {
      const [subs, camps] = await Promise.all([
        db.getSubscribers(),
        db.getCampaigns()
      ]);
      setSubscribers(subs);
      setCampaigns(camps);
    } catch (err: Error | unknown) {
      console.error('Failed to load newsletter data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect -- async data loading within effect
     loadNewsletterData();
  }, []);

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!subject.trim() || !content.trim()) {
      setErrorMsg('Subject and campaign content are required.');
      return;
    }

    if (subscribers.length === 0) {
      setErrorMsg('Cannot transmit campaign: zero active subscribers.');
      return;
    }

    setSending(true);
    try {
      await db.sendNewsletterCampaign(subject, content);
      setSuccessMsg('Newsletter campaign sent and logged successfully.');
      setSubject('');
      setContent('');
      loadNewsletterData();
    } catch (err: Error | unknown) {
      setErrorMsg((err as Error).message || 'Failed to dispatch campaign.');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      // Direct call on local database fallback or supabase router
      await db.deleteSubscriber(id);
      loadNewsletterData();
    } catch (err) {
      console.error('Failed to delete subscriber:', err);
    }
  };

  // Generate CSV download link
  const handleExportCSV = () => {
    const csvHeaders = 'ID,Email,Created_At\n';
    const csvRows = subscribers.map(sub => `"${sub.id}","${sub.email}","${sub.created_at}"`).join('\n');
    const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `youth_prism_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Newsletter Briefings</h1>
          <p className="text-xs text-muted mt-1">Dispatch campaigns to subscribers and manage the email list.</p>
        </div>
        
        {subscribers.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="border border-border bg-card-bg hover:bg-foreground/5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Subscribers (CSV)</span>
          </button>
        )}
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Campaign Creator (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-card-bg border border-border p-6 rounded-2xl h-fit">
          <h2 className="font-serif text-lg font-bold border-b border-border/60 pb-2 text-accent mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Create Campaign
          </h2>

          <form onSubmit={handleSendCampaign} className="space-y-4">
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
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Campaign Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="E.g., The Youth Prism Weekly: issue #24"
                className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">HTML/Markdown Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="<h1>Issue Briefing</h1><p>Write your newsletter body here...</p>"
                className="w-full bg-background border border-border text-foreground px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-accent font-mono leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-accent text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-accent/90 shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send to {subscribers.length} Subscribers</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Subscribers / History Logs (lg:col-span-7) */}
        <div className="lg:col-span-7 border border-border bg-card-bg rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            {/* Tabs */}
            <div className="bg-foreground/5 border-b border-border flex">
              <button
                onClick={() => setActiveTab('subscribers')}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider border-r border-border transition-colors ${
                  activeTab === 'subscribers' 
                    ? 'bg-card-bg text-accent font-black' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Subscribers ({subscribers.length})
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider border-r border-border transition-colors ${
                  activeTab === 'logs' 
                    ? 'bg-card-bg text-accent font-black' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Campaign Logs ({campaigns.length})
              </button>
            </div>

            {/* Tab content */}
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : activeTab === 'subscribers' ? (
              subscribers.length === 0 ? (
                <div className="text-center py-12 text-muted">
                  <p className="text-xs">No active subscribers in the registry.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-border text-left text-xs">
                  <thead className="bg-foreground/5 text-accent font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Email Address</th>
                      <th className="px-6 py-3">Date Joined</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-foreground/80 font-medium">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-foreground">
                          {sub.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-muted">
                          {new Date(sub.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(sub.id)}
                            className="p-1.5 border border-border hover:border-red-500 hover:text-red-500 rounded bg-background transition-colors text-muted"
                            title="Remove Subscriber"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              campaigns.length === 0 ? (
                <div className="text-center py-12 text-muted">
                  <p className="text-xs">No campaign dispatches logged.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="p-4 flex justify-between items-center hover:bg-foreground/[0.02] transition-colors">
                      <div className="space-y-1">
                        <h4 className="font-serif text-sm font-bold text-foreground">{camp.subject}</h4>
                        <div className="flex items-center space-x-2 text-[10px] text-muted font-bold uppercase tracking-wider">
                          <History className="w-3 h-3 text-muted" />
                          <span>Sent: {new Date(camp.sent_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block text-[10px] font-bold text-accent border border-accent/20 bg-accent/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {camp.recipients_count} Recipients
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
