import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/actions/auth.actions';

// Force dynamic rendering - this page requires authentication check
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard | Placify',
  description: 'Your personalized placement preparation dashboard',
};

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-background p-8">
      <div className="max-w-2xl space-y-6 text-center">
        <h1 className="bg-gradient-primary bg-clip-text text-4xl font-bold text-transparent">
          Welcome to Placify!
        </h1>
        <p className="text-body-lg text-text-secondary">
          You&apos;re successfully authenticated as{' '}
          <span className="font-medium text-text-primary">{user.email}</span>
        </p>
        <div className="rounded-lg bg-glass-background p-6 backdrop-blur-md">
          <p className="text-body-md text-text-secondary">
            Dashboard content coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
