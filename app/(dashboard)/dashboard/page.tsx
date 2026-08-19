import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/actions/auth.actions';
import { DashboardContent } from './dashboard-content';
import { ROUTES } from '@/lib/constants';

// Force dynamic rendering - this page requires authentication check
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard | Placify',
  description: 'Your personalized placement preparation dashboard',
};

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <DashboardContent
      user={{
        name: user.user_metadata?.full_name || 'User',
        email: user.email || '',
        role: 'ML Engineer',
      }}
    />
  );
}
