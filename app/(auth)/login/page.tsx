import React from 'react';
import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

// Force dynamic rendering to prevent build-time errors with Supabase client
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Sign In | Placify',
  description: 'Sign in to your Placify account',
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to continue your placement preparation journey"
    >
      <LoginForm />
    </AuthCard>
  );
}
