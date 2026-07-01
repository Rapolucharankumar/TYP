'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase, db } from '../lib/db';
import { Profile, UserRole } from '../types';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  hasPermission: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile details (role, suspended) from the database or mock
  const syncProfile = async (id: string, email: string, fallbackRole: UserRole, createdAt: string) => {
    try {
      const users = await db.getUsers();
      const profile = users.find(u => u.id === id || u.email === email);
      if (profile) {
        if (profile.suspended) {
          localStorage.removeItem('typ_admin_session');
          setUser(null);
          return null;
        }
        const updatedUser = {
          id,
          email,
          role: profile.role,
          suspended: profile.suspended,
          created_at: createdAt
        };
        setUser(updatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('typ_admin_session', JSON.stringify(updatedUser));
        }
        return updatedUser;
      }
    } catch (err) {
      console.warn('Failed to sync profile status:', err);
    }
    
    const defaultUser: Profile = {
      id,
      email,
      role: fallbackRole,
      suspended: false,
      created_at: createdAt
    };
    setUser(defaultUser);
    return defaultUser;
  };

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Set up Supabase auth listener
      supabase.auth.getSession().then(async ({ data: { session } }: any) => {
        if (session?.user) {
          await syncProfile(
            session.user.id,
            session.user.email || '',
            'writer',
            session.user.created_at
          );
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
        if (session?.user) {
          await syncProfile(
            session.user.id,
            session.user.email || '',
            'writer',
            session.user.created_at
          );
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Mock session from localStorage
      const mockSession = localStorage.getItem('typ_admin_session');
      if (mockSession) {
        try {
          const parsed = JSON.parse(mockSession);
          // Sync profile to get current roles or suspension
          syncProfile(parsed.id, parsed.email, parsed.role, parsed.created_at);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return true;
      } else {
        // Mock Logins based on local_db/localStorage definitions
        const users = await db.getUsers();
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        // Support standard defaults or database values
        if (foundUser) {
          if (foundUser.suspended) {
            throw new Error('Your account has been suspended.');
          }
          if (password === 'admin123') {
            const mockUser: Profile = {
              id: foundUser.id,
              email: foundUser.email,
              role: foundUser.role,
              suspended: foundUser.suspended,
              created_at: foundUser.created_at
            };
            localStorage.setItem('typ_admin_session', JSON.stringify(mockUser));
            setUser(mockUser);
            return true;
          }
        } else if (email === 'admin@youthprism.com' && password === 'admin123') {
          const mockUser: Profile = {
            id: 'mock-admin-id',
            email: 'admin@youthprism.com',
            role: 'super_admin',
            suspended: false,
            created_at: new Date().toISOString()
          };
          localStorage.setItem('typ_admin_session', JSON.stringify(mockUser));
          setUser(mockUser);
          return true;
        }
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      } else {
        localStorage.removeItem('typ_admin_session');
      }
      setUser(null);
    } catch (err) {
      console.error('Sign-out error:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (action: string): boolean => {
    if (!user) return false;
    const role = user.role;
    if (role === 'super_admin') return true;

    switch (action) {
      case 'manage_users':
      case 'manage_roles':
      case 'view_audit_logs':
        return false; // super_admin was already handled above
      case 'manage_settings':
      case 'manage_homepage':
      case 'manage_globe':
        return role === 'admin';
      case 'manage_publications':
        return (['admin', 'senior_editor'] as string[]).includes(role);
      case 'publish_articles':
      case 'delete_articles':
        return (['admin', 'senior_editor', 'editor'] as string[]).includes(role);
      case 'edit_articles':
        return (['admin', 'senior_editor', 'editor', 'writer', 'researcher', 'contributor'] as string[]).includes(role);
      case 'view_dashboard':
        return true;
      default:
        return false;
    }
  };

  const isAdmin = user ? ['super_admin', 'admin', 'senior_editor', 'editor', 'writer', 'researcher', 'contributor', 'moderator'].includes(user.role) : false;

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAdmin, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
