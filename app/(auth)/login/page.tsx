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

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to continue your placement preparation journey"
    >
      {searchParams.error && (
        <div className="mb-4 rounded-lg border border-error-500/20 bg-error-500/10 p-4">
          <p className="text-body-sm text-error-500">{searchParams.error}</p>
        </div>
      )}
      <LoginForm />
    </AuthCard>
  );
}
