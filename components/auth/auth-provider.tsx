'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/auth.store';

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
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
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
