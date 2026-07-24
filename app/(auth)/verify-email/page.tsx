import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/ui/button';

// Force dynamic rendering to prevent build-time errors with Supabase client
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Verify Email | Placify',
  description: 'Verify your email address',
};

export default function VerifyEmailPage() {
  return (
    <AuthCard title="Verify your email">
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10">
          <Mail className="h-8 w-8 text-primary-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-h5 font-semibold text-text-primary">
            Check your inbox
          </h2>
          <p className="text-body-md text-text-secondary">
            We&apos;ve sent a verification email to your inbox. Click the link in the
            email to verify your account and get started.
          </p>
        </div>

        <div className="space-y-3 rounded-lg bg-glass-background p-4 text-left">
          <p className="text-body-sm font-medium text-text-primary">
            Didn&apos;t receive the email?
          </p>
          <ul className="space-y-2 text-body-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-text-tertiary" />
              <span>Check your spam or junk folder</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-text-tertiary" />
              <span>Make sure you entered the correct email address</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-text-tertiary" />
              <span>Wait a few minutes and check again</span>
            </li>
          </ul>
        </div>

        <div className="pt-4">
          <Link href="/dashboard">
            <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>
              Continue to Dashboard
            </Button>
          </Link>
        </div>

        <p className="text-body-sm text-text-tertiary">
          You can verify your email later from your account settings
        </p>
      </div>
    </AuthCard>
  );
}
