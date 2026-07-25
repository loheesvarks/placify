import React from 'react';
import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/auth-card';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

// Force dynamic rendering to prevent build-time errors with Supabase client
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Forgot Password | Placify',
  description: 'Reset your Placify password',
};

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <AuthCard title="Forgot password?">
      {searchParams.error && (
        <div className="mb-4 rounded-lg border border-error-500/20 bg-error-500/10 p-4">
          <p className="text-body-sm text-error-500">{searchParams.error}</p>
        </div>
      )}
      <ForgotPasswordForm />
    </AuthCard>
  );
}
