'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { AuthResponse } from '@/lib/types';

/**
 * Sign up a new user with email and password
 */
export async function signUp(formData: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> {
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
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');

  return {
    success: true,
    data: {
      user: data.user ?? undefined,
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
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(formData: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const supabase = await createClient();

  console.log('Attempting sign in for:', formData.email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    console.error('Sign in error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }

  if (!data.session) {
    console.error('Sign in failed: No session created');
    return {
      success: false,
      error: 'No session created',
    };
  }

  console.log('Sign in successful for:', data.user.email);

  // Revalidate the root layout to update auth state
  revalidatePath('/', 'layout');
  
  return {
    success: true,
    data: {
      user: data.user,
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
export async function signInWithOAuth(provider: 'google' | 'github') {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  if (data.url) {
    redirect(data.url);
  }

  return {
    success: false,
    error: 'Unable to generate OAuth URL',
  };
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
  redirect('/login');
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
  const supabase = await createClient();

  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=recovery`;
  console.log('Sending password reset email to:', email);
  console.log('Redirect URL:', redirectUrl);

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: error.message,
    };
  }

  console.log('Password reset response:', data);

  return {
    success: true,
  };
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
      user: data.user,
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
