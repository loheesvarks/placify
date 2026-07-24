import { useAuthStore } from '@/lib/stores/auth.store';
import { signOut as signOutAction } from '@/lib/actions/auth.actions';

/**
 * Custom hook to access authentication state and actions
 * Provides easy access to user data, session, and auth functions
 */
export function useAuth() {
  const { user, session, isLoading, isAuthenticated, setLoading, signOut: storeSignOut } = useAuthStore();

  const signOut = async () => {
    try {
      setLoading(true);
      storeSignOut();
      await signOutAction();
    } catch (error) {
      console.error('Sign out error:', error);
      setLoading(false);
    }
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    signOut,
  };
}
