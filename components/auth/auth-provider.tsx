'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth.store';
import type { AuthSession } from '@/lib/types';

/**
 * Convert Supabase Session to AuthSession
 */
function convertToAuthSession(session: Session | null): AuthSession | null {
  if (!session) return null;
  
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: {
      id: session.user.id,
      email: session.user.email,
      ...session.user.user_metadata,
    },
  };
}

/**
 * Auth provider component that syncs Supabase auth state with Zustand store
 * Listens to auth state changes and updates the store accordingly
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser, setSession, setLoading, signOut } = useAuthStore();
  const supabase = createClient();

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authSession = convertToAuthSession(session);
      setSession(authSession);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authSession = convertToAuthSession(session);
      setSession(authSession);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          router.refresh();
          break;
        case 'SIGNED_OUT':
          signOut();
          router.push('/login');
          router.refresh();
          break;
        case 'TOKEN_REFRESHED':
          // Session was refreshed
          break;
        case 'USER_UPDATED':
          // User metadata was updated
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setUser, setSession, setLoading, signOut, router]);

  return <>{children}</>;
}
