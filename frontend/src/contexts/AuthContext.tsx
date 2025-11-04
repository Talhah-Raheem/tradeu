'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string; university: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from custom users table
  const fetchUserProfile = async (sessionUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', sessionUser.id)
        .single();

      if (error) {
        const errorCode = (error as any)?.code;
        if (errorCode === 'PGRST116' || (error as any)?.message?.includes('No rows')) {
          const profilePayload = {
            user_id: sessionUser.id,
            email: sessionUser.email ?? '',
            first_name:
              sessionUser.user_metadata?.first_name ??
              sessionUser.user_metadata?.firstName ??
              sessionUser.user_metadata?.given_name ??
              '',
            last_name:
              sessionUser.user_metadata?.last_name ??
              sessionUser.user_metadata?.lastName ??
              sessionUser.user_metadata?.family_name ??
              '',
            university: sessionUser.user_metadata?.university ?? 'Unknown University',
            profile_image_url:
              sessionUser.user_metadata?.profile_image_url ??
              sessionUser.user_metadata?.avatar_url ??
              null,
          };

          const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert(profilePayload)
            .select()
            .single();

          if (insertError) throw insertError;

          setUserProfile(newProfile);
          return newProfile;
        }

        throw error;
      }

      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUserProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string; university: string }) => {
    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            university: userData.university,
          },
        },
      });

      if (signUpError) return { error: signUpError };

      // The database trigger will automatically create the user in the users table
      // using the metadata we provided

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        setUser(data.user);
        await fetchUserProfile(data.user);
        setLoading(false);
      }

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) return { error: new Error('No user logged in') };

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('user_id', user.id);

      if (error) return { error };

      // Refresh profile
      await fetchUserProfile(user);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
