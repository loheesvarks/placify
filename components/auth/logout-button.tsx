'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/actions/auth.actions';
import { useToast } from '@/lib/hooks';

/**
 * Client-side logout button component
 */
export function LogoutButton() {
  const router = useRouter();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      showSuccessToast('Signed Out', 'You have been successfully signed out.');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      showErrorToast('Error', 'Failed to sign out. Please try again.');
      setIsLoading(false);
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
