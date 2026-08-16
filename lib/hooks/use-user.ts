/**
 * User data hook
 * Provides access to authenticated user data and profile
 */

import { useAuthStore } from '@/lib/stores';
import type { AuthUser } from '@/lib/types';

export interface UseUserReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Hook to access current user data
 * Abstracts the authentication store for clean component usage
 */
export function useUser(): UseUserReturn {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}
