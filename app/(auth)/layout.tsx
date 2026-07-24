import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Placify',
  description: 'Sign in to your Placify account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-surface-background">
      {/* Background ambient gradient */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute -bottom-1/2 right-1/2 h-[800px] w-[800px] translate-x-1/2 rounded-full bg-secondary-500/5 blur-3xl" />
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shadow-glow-md">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="bg-gradient-primary bg-clip-text text-2xl font-bold text-transparent">
            Placify
          </h1>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 w-full max-w-md px-4">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 text-center text-body-sm text-text-tertiary">
        <p>
          &copy; {new Date().getFullYear()} Placify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
