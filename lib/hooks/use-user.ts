/**
 * User data hook
 * Provides access to authenticated user data and profile
 * Integrates with authService for data operations
 */

import { useCallback } from 'react';
import { useAuthStore } from '@/lib/stores';
import { authService } from '@/lib/services/auth.service';
import { signOut as signOutAction } from '@/lib/actions/auth.actions';
import type { AuthUser, AuthSession } from '@/lib/types';

export interface UseUserReturn {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Hook to access current user data
 * Provides clean interface: Component → Hook → Service → Server Action → Supabase
 */
export function useUser(): UseUserReturn {
  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const setLoading = useAuthStore((state) => state.setLoading);
  const signOut = useAuthStore((state) => state.signOut);

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
      console.error('[useUser] Refetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser, setSession]);

  /**
   * Logout the current user
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      signOut(); // Clear store immediately
      await signOutAction(); // Perform server-side logout
    } catch (error) {
      console.error('[useUser] Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, signOut]);

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    refetch,
    logout,
  };
}
