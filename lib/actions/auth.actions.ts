'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/constants';
import type { AuthResponse } from '@/lib/types';

/**
 * Sign up a new user with email and password
 */
export async function signUp(formData: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('[signUp] Supabase error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath('/', 'layout');

    return {
      success: true,
      data: {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
        } : undefined,
        session: data.session ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          expires_in: data.session.expires_in,
          token_type: data.session.token_type,
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
            ...data.session.user.user_metadata,
          },
        } : undefined,
      },
    };
  } catch (err) {
    console.error('[signUp] Unexpected error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred during registration',
    };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(formData: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  if (!data.session) {
    return {
      success: false,
      error: 'No session created',
    };
  }

  // Revalidate the root layout to update auth state
  revalidatePath('/', 'layout');
  
  return {
    success: true,
    data: {
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
        avatar_url: data.user.user_metadata?.avatar_url,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          ...data.session.user.user_metadata,
        },
      },
    },
  };
}

/**
 * Sign in with OAuth provider (Google or GitHub)
 */
export async function signInWithOAuth(provider: 'google' | 'github'): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error('[signInWithOAuth] Error:', error);
    return { error: error.message };
  }

  if (data.url) {
    return { url: data.url };
  }

  return { error: 'Unable to generate OAuth URL' };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect(ROUTES.LOGIN);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const supabase = await createClient();
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=recovery`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error('[resetPassword] Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('[resetPassword] Unexpected error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Update password (after reset)
 */
export async function updatePassword(newPassword: string): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');

  return {
    success: true,
    data: {
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
        avatar_url: data.user.user_metadata?.avatar_url,
      },
    },
  };
}

/**
 * Get the current user session
 */
export async function getSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user
 */
export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
