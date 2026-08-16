/**
 * Authentication service
 * Service layer that wraps existing auth server actions
 * Provides a clean abstraction for authentication operations
 */

import type { AuthResponse, AuthUser, AuthSession } from '@/lib/types';
import * as authActions from '@/lib/actions/auth.actions';

/**
 * Auth service interface
 * Defines the contract for authentication operations
 */
export interface IAuthService {
  signIn(email: string, password: string): Promise<AuthResponse>;
  signUp(email: string, password: string, fullName: string): Promise<AuthResponse>;
  signOut(): Promise<AuthResponse>;
  resetPassword(email: string): Promise<AuthResponse>;
  updatePassword(newPassword: string): Promise<AuthResponse>;
  getSession(): Promise<AuthSession | null>;
  getCurrentUser(): Promise<AuthUser | null>;
  isAuthenticated(): Promise<boolean>;
}

/**
 * Authentication service implementation
 * Wraps existing server actions to provide a consistent service interface
 */
class AuthService implements IAuthService {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      return await authActions.signIn({ email, password });
    } catch (error) {
      console.error('[AuthService] Sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign in',
      };
    }
  }

  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      return await authActions.signUp({ email, password, fullName });
    } catch (error) {
      console.error('[AuthService] Sign up error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign up',
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResponse> {
    try {
      return await authActions.signOut();
    } catch (error) {
      console.error('[AuthService] Sign out error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign out',
      };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      return await authActions.resetPassword(email);
    } catch (error) {
      console.error('[AuthService] Reset password error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while sending reset email',
      };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      return await authActions.updatePassword(newPassword);
    } catch (error) {
      console.error('[AuthService] Update password error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while updating password',
      };
    }
  }

  /**
   * Get current user session
   */
  async getSession(): Promise<AuthSession | null> {
    try {
      const session = await authActions.getSession();
      if (!session) return null;
      
      // Transform Supabase session to AuthSession
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
    } catch (error) {
      console.error('[AuthService] Get session error:', error);
      return null;
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await authActions.getUser();
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
      };
    } catch (error) {
      console.error('[AuthService] Get current user error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await authActions.getUser();
      return user !== null;
    } catch (error) {
      console.error('[AuthService] Is authenticated error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
