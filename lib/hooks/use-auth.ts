/**
 * Authentication hook
 * Provides access to authentication state and operations
 * Integrates with authService for authentication operations
 */

import { useCallback } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { authService } from '@/lib/services/auth.service';
import type { AuthUser, AuthSession } from '@/lib/types';

export interface UseAuthReturn {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook to access authentication state and actions
 * Provides clean interface: Component → Hook → Service → Server Action → Supabase
 */
export function useAuth(): UseAuthReturn {
  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const storeSignOut = useAuthStore((state) => state.signOut);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      storeSignOut(); // Clear store immediately for instant UI feedback
      await authService.signOut();
    } catch (error) {
      console.error('[useAuth] Sign out error:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, storeSignOut]);

  /**
   * Refetch user and session data from the server
   */
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const [userData, sessionData] = await Promise.all([
        authService.getCurrentUser(),
        authService.getSession(),
      ]);
      
      setUser(userData);
      setSession(sessionData);
    } catch (error) {
      console.error('[useAuth] Refetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser, setSession]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    signOut,
    refetch,
  };
}
