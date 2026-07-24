import React from 'react';
import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/auth-card';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

// Force dynamic rendering to prevent build-time errors with Supabase client
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Reset Password | Placify',
  description: 'Create a new password for your account',
};

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Reset your password">
      <ResetPasswordForm />
    </AuthCard>
  );
}
