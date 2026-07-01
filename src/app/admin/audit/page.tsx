'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/db';
import { useAuth } from '../../../context/auth-context';
import { ActivityLog } from '../../../types';
import { 
  ShieldAlert, History, Search, RefreshCw, Calendar, Server, 
  ChevronDown, ChevronUp, FileText, Filter
} from 'lucide-react';

export default function AuditLogsPage() {
  const { user: currentUser, hasPermission } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await db.getActivityLogs();
      // Sort logs by date descending (most recent first)
      const sorted = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setLogs(sorted);
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  }

  // Gate check - only super_admin can view audit logs
  if (!hasPermission('view_audit_logs')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red animate-pulse">
          <ShieldAlert className="w-16 h-16" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-serif text-2xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-muted text-xs sm:text-sm">
            Your security clearance level is insufficient to access the platform security audit logs. 
            Only Super Administrators can review structural audit logs and administrative mutations.
          </p>
        </div>
      </div>
    );
  }

  // Get unique actions and roles for filter dropdowns
  const uniqueActions = Array.from(new Set(logs.map(l => l.action))).filter(Boolean);
  const uniqueRoles = Array.from(new Set(logs.map(l => l.role))).filter(Boolean);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.details || {}).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesRole = selectedRole === 'all' || log.role === selectedRole;

    return matchesSearch && matchesAction && matchesRole;
  });

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-black text-foreground">Security Audit Trail</h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Real-time security log of all administrative actions, database mutations, and role modifications.
          </p>
        </div>
        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 border border-card-border hover:border-accent hover:text-accent rounded-full bg-background/50 text-foreground text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Filters Card */}
      <div className="border border-card-border bg-background/30 p-6 rounded-[24px] shadow-sm space-y-4">
        <div className="flex items-center space-x-3 pb-2 border-b border-card-border/60">
          <div className="p-2 bg-accent/10 text-accent rounded-xl">
            <Filter className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-sm font-bold text-foreground">Filter Audit Trail</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Search Operator or Details</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-card-border text-foreground pl-10 pr-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Action Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Filter by Action</label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">Filter by Authority Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="border border-card-border bg-background/30 p-6 rounded-[24px] shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-card-border rounded-2xl text-muted text-xs font-semibold">
            No audit records match your selected filtering rules.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-card-border/60 text-accent font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Operator / Authority</th>
                  <th className="pb-3 font-semibold">Action Executed</th>
                  <th className="pb-3 font-semibold">IP Address</th>
                  <th className="pb-3 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/40">
                {filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  const dateObj = new Date(log.created_at);
                  const isInvalidDate = isNaN(dateObj.getTime());
                  const formattedDate = isInvalidDate 
                    ? log.created_at 
                    : dateObj.toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                      });
                  
                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        className={`hover:bg-background/20 transition-colors cursor-pointer ${isExpanded ? 'bg-background/10' : ''}`}
                        onClick={() => toggleExpand(log.id)}
                      >
                        <td className="py-4 pr-3 font-mono text-[10px] text-muted flex items-center space-x-2">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formattedDate}</span>
                        </td>
                        <td className="py-4 pr-3">
                          <div className="font-semibold text-foreground">{log.user_email}</div>
                          <span className={`inline-block text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider mt-0.5 border ${
                            log.role === 'super_admin' 
                              ? 'bg-brand-red/10 text-brand-red border-brand-red/20'
                              : log.role === 'admin' 
                              ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'
                              : 'bg-accent/10 text-accent border-accent/20'
                          }`}>
                            {log.role?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 pr-3 font-semibold text-foreground">
                          <span className="bg-foreground/5 px-2 py-1 rounded-lg border border-card-border/40">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 pr-3 font-mono text-[10px] text-muted">
                          <div className="flex items-center space-x-1.5">
                            <Server className="w-3 h-3 text-muted" />
                            <span>{log.ip_address || 'unknown'}</span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(log.id);
                            }}
                            className="p-1.5 border border-card-border hover:border-accent hover:text-accent rounded-full bg-background text-muted transition-colors inline-flex items-center cursor-pointer"
                            title="Toggle details payload"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="bg-background/10 p-4 border-t border-b border-card-border/40">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2 text-[10px] text-accent font-bold uppercase tracking-wider">
                                <FileText className="w-3.5 h-3.5" />
                                <span>Event Payload Details</span>
                              </div>
                              <pre className="text-[10px] bg-background/80 p-4 rounded-2xl border border-card-border text-left font-mono text-foreground mt-2 overflow-x-auto max-w-full whitespace-pre-wrap break-all shadow-inner">
                                {JSON.stringify(log.details || {}, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
