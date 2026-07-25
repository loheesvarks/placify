import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogoutButton } from '@/components/auth/logout-button';
import { ArrowLeft } from 'lucide-react';

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
    <div className="flex min-h-screen flex-col bg-surface-background">
      {/* Header with Logout */}
      <header className="border-b border-surface-border bg-surface-elevated-1 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Placify Logo" 
                className="h-full w-full rounded-xl"
              />
            </div>
            <h1 className="bg-gradient-primary bg-clip-text text-xl font-bold text-transparent">
              Placify
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-body-sm font-medium text-text-primary">
                {user.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-body-xs text-text-tertiary">{user.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-2xl space-y-6 text-center">
          <h1 className="bg-gradient-primary bg-clip-text text-4xl font-bold text-transparent">
            Welcome to Placify!
          </h1>
          <p className="text-body-lg text-text-secondary">
            You&apos;re successfully authenticated as{' '}
            <span className="font-medium text-text-primary">{user.email}</span>
          </p>

          <Card variant="elevated" padding="lg" className="mx-auto max-w-lg">
            <div className="space-y-4">
              <div className="rounded-lg bg-success-500/10 p-4">
                <p className="text-body-md font-medium text-success-500">
                  ✓ Authentication System Complete
                </p>
              </div>

              <div className="space-y-2 text-left text-body-sm text-text-secondary">
                <p className="font-semibold text-text-primary">What&apos;s Working:</p>
                <ul className="space-y-1 pl-5">
                  <li>✓ Email/Password Authentication</li>
                  <li>✓ Session Management</li>
                  <li>✓ Protected Routes</li>
                  <li>✓ User Profile Data</li>
                  <li>✓ Logout Functionality</li>
                </ul>
              </div>

              <div className="rounded-lg border border-primary-500/20 bg-primary-500/5 p-4">
                <p className="text-body-sm text-text-secondary">
                  Dashboard features (PLAC-010) are not implemented yet as per requirements.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Link href="/login" className="flex-1">
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border px-6 py-4 text-center">
        <p className="text-body-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} Placify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
