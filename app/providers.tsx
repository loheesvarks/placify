'use client';

import React from 'react';
import { ToastProvider } from '@/lib/hooks';
import { AuthProvider } from '@/components/auth/auth-provider';

/**
 * Client-side providers wrapper
 * Ensures providers are only rendered on the client
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
