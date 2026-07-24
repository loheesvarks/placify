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

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Forgot password?">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
