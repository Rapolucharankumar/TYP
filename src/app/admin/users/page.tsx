'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/db';
import { useAuth } from '../../../context/auth-context';
import { Profile, UserRole } from '../../../types';
import { 
  ShieldAlert, Shield, UserX, UserCheck, Trash2, Search, 
  UserPlus, Mail, ShieldCheck, AlertCircle 
} from 'lucide-react';

export default function UsersManagementPage() {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Invitation Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('writer');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isSuperAdmin = currentUser?.role === 'super_admin';

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await db.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setFeedback(null);
    setActionLoading('invite');
    
    try {
      // Create user profile
      const newUser = await db.createUser({
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
        suspended: false
      });
      
      // Update local state
      setUsers(prev => [newUser, ...prev]);
      setInviteEmail('');
      setInviteRole('writer');
      setFeedback({ type: 'success', message: `Successfully registered profile for ${newUser.email} as ${newUser.role}.` });
      
      // Create audit trail log
      await db.createActivityLog({
        user_email: currentUser?.email || 'system',
        role: currentUser?.role || 'super_admin',
        action: 'Invite User Profile',
        details: { target_email: newUser.email, target_role: newUser.role }
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to register profile.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    if (!isSuperAdmin) {
      alert('Only Super Administrators are authorized to execute role overrides.');
      return;
    }
    setActionLoading(userId);
    try {
      const targetUser = users.find(u => u.id === userId);
      const updated = await db.updateUser(userId, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      
      await db.createActivityLog({
        user_email: currentUser?.email || 'system',
        role: currentUser?.role || 'super_admin',
        action: 'Modify User Role',
        details: { target_email: updated.email, old_role: targetUser?.role, new_role: newRole }
      });
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Error updating user role.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleSuspend = async (userId: string, currentSuspension: boolean) => {
    setActionLoading(userId);
    try {
      const updated = await db.updateUser(userId, { suspended: !currentSuspension });
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      
      await db.createActivityLog({
        user_email: currentUser?.email || 'system',
        role: currentUser?.role || 'super_admin',
        action: currentSuspension ? 'Unsuspend User Account' : 'Suspend User Account',
        details: { target_email: updated.email }
      });
    } catch (err) {
      console.error('Failed to update suspension status:', err);
      alert('Error updating user suspension status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!isSuperAdmin) return;
    if (!confirm('Are you sure you want to permanently delete this administrative profile? This action is irreversible.')) return;
    
    setActionLoading(userId);
    try {
      const targetUser = users.find(u => u.id === userId);
      await db.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      
      await db.createActivityLog({
        user_email: currentUser?.email || 'system',
        role: currentUser?.role || 'super_admin',
        action: 'Delete User Profile',
        details: { target_email: targetUser?.email }
      });
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Error deleting user.');
    } finally {
      setActionLoading(null);
    }
  };

  // Gate check
  if (!hasPermission('manage_users')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red animate-pulse">
          <ShieldAlert className="w-16 h-16" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-serif text-2xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-muted text-xs sm:text-sm">
            Your security clearance level is insufficient to access the User & RBAC Management directory. 
            Please contact a System Administrator or Super Admin to request clearance elevation.
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="font-serif text-3xl font-black text-foreground">Users & RBAC Directory</h1>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Manage administrative profile access, override cryptographic roles, and suspend/unsuspend system access tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Invite Form */}
        <div className="xl:col-span-1 border border-card-border bg-background/30 p-6 rounded-[24px] shadow-sm space-y-6 h-fit">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-foreground">Register Profile</h3>
          </div>

          <form onSubmit={handleInvite} className="space-y-4">
            {feedback && (
              <div className={`flex items-center space-x-2 border p-3.5 rounded-2xl text-xs font-semibold ${
                feedback.type === 'success' 
                  ? 'text-brand-teal bg-brand-teal/10 border-brand-teal/20' 
                  : 'text-brand-red bg-brand-red/10 border-brand-red/20'
              }`}>
                {feedback.type === 'success' ? <ShieldCheck className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">User Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="editor@youthprism.com"
                  className="w-full bg-background border border-card-border text-foreground pl-10 pr-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-accent block">System Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="w-full bg-background border border-card-border text-foreground px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="super_admin">Super Admin (Full Root Access)</option>
                <option value="admin">Admin (Operational Control)</option>
                <option value="senior_editor">Senior Editor (Editorial Lead)</option>
                <option value="editor">Editor (Content Reviewer)</option>
                <option value="writer">Writer (Content Creator)</option>
                <option value="researcher">Researcher (Data Contributor)</option>
                <option value="contributor">Contributor (External Writer)</option>
                <option value="moderator">Moderator (Comments Reviewer)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={actionLoading === 'invite'}
              className="w-full btn-primary !rounded-full !py-3 flex items-center justify-center space-x-2"
            >
              {actionLoading === 'invite' ? (
                <div className="w-4 h-4 border-2 border-brand-midnight border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create User Profile</span>
                  <Shield className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Users Directory Table */}
        <div className="xl:col-span-2 border border-card-border bg-background/30 p-6 rounded-[24px] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">Administrative Registry</h3>
            </div>
            
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search user registry..."
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
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-card-border rounded-2xl text-muted text-xs font-semibold">
              No matching profiles located in the administrative registry.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-card-border/60 text-accent font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Profile Identity</th>
                    <th className="pb-3 font-semibold">Role Authority</th>
                    <th className="pb-3 font-semibold text-center">Security Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/40">
                  {filteredUsers.map((profile) => (
                    <tr key={profile.id} className={`group hover:bg-background/25 transition-colors ${profile.suspended ? 'opacity-60' : ''}`}>
                      <td className="py-4">
                        <div className="font-semibold text-foreground">{profile.email}</div>
                        <div className="text-[10px] text-muted font-mono mt-0.5">ID: {profile.id}</div>
                      </td>
                      <td className="py-4">
                        {isSuperAdmin && profile.id !== currentUser?.id ? (
                          <select
                            value={profile.role}
                            onChange={(e) => handleUpdateRole(profile.id, e.target.value as UserRole)}
                            className="bg-background border border-card-border text-foreground px-2.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] focus:outline-none focus:border-accent cursor-pointer"
                          >
                            <option value="super_admin">SUPER ADMIN</option>
                            <option value="admin">ADMIN</option>
                            <option value="senior_editor">SENIOR EDITOR</option>
                            <option value="editor">EDITOR</option>
                            <option value="writer">WRITER</option>
                            <option value="researcher">RESEARCHER</option>
                            <option value="contributor">CONTRIBUTOR</option>
                            <option value="moderator">MODERATOR</option>
                          </select>
                        ) : (
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                            profile.role === 'super_admin' 
                              ? 'bg-brand-red/10 text-brand-red border-brand-red/20'
                              : profile.role === 'admin'
                              ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'
                              : 'bg-accent/10 text-accent border-accent/20'
                          }`}>
                            {profile.role.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                          profile.suspended 
                            ? 'bg-brand-red/15 text-brand-red border border-brand-red/30' 
                            : 'bg-brand-teal/15 text-brand-teal border border-brand-teal/30'
                        }`}>
                          {profile.suspended ? 'Suspended' : 'Clear'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Suspension button */}
                          {profile.id !== currentUser?.id && (
                            <button
                              onClick={() => handleToggleSuspend(profile.id, !!profile.suspended)}
                              disabled={actionLoading === profile.id}
                              className={`p-2 border rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                                profile.suspended
                                  ? 'border-brand-teal/20 text-brand-teal hover:bg-brand-teal/10'
                                  : 'border-brand-red/20 text-brand-red hover:bg-brand-red/10'
                              }`}
                              title={profile.suspended ? 'Reactivate Profile access keys' : 'Revoke profile access tokens'}
                            >
                              {profile.suspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          
                          {/* Delete profile button */}
                          {isSuperAdmin && profile.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteUser(profile.id)}
                              disabled={actionLoading === profile.id}
                              className="p-2 border border-brand-red/20 text-brand-red hover:bg-brand-red/10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                              title="Revoke and delete database profile records"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
