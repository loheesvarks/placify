import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser, AuthSession } from '@/lib/types';

interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void;
  setSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
  refreshSession: (session: AuthSession | null) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
};

/**
 * Zustand store for authentication state
 * Persisted to localStorage for session continuity
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setUser: (user) =>
        set(() => ({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        })),

      setSession: (session) =>
        set(() => ({
          session,
          isAuthenticated: !!session,
          isLoading: false,
        })),

      setLoading: (loading) =>
        set(() => ({
          isLoading: loading,
        })),

      signOut: () =>
        set(() => ({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        })),

      refreshSession: (session) =>
        set((state) => ({
          session,
          isAuthenticated: !!session,
          // Keep existing user if session is valid
          user: session ? state.user : null,
        })),
    }),
    {
      name: 'placify-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential auth data
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
