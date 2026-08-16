'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useToast } from '@/lib/hooks';

/**
 * Client-side logout button component
 * Integrated with useAuth hook for clean service layer usage
 */
export function LogoutButton() {
  const router = useRouter();
  const { signOut, isLoading } = useAuth();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      showSuccessToast('Signed Out', 'You have been successfully signed out.');
      router.push('/login');
    } catch (error) {
      console.error('[LogoutButton] Logout error:', error);
      showErrorToast('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleLogout}
      loading={isLoading}
      disabled={isLoading}
      leftIcon={<LogOut className="h-4 w-4" />}
    >
      Sign Out
    </Button>
  );
}
