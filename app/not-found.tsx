import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-background p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-h3 font-semibold text-text-primary">
          Page not found
        </h2>
        <p className="text-body-md text-text-secondary max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back home
        </Link>
      </div>
    </div>
  );
}
