import React from 'react';
import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';

// Force dynamic rendering to prevent build-time errors with Supabase client
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Sign Up | Placify',
  description: 'Create your Placify account',
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Start your journey to landing your dream job"
    >
      <RegisterForm />
    </AuthCard>
  );
}
