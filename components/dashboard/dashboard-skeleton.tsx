/**
 * Dashboard Skeleton Loader
 * Loading state for dashboard while data is being fetched
 */

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';

export function DashboardSkeleton() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="relative -mt-6 mb-8">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(420px,0.9fr)_minmax(500px,1.1fr)] gap-8 items-center">
            {/* Left side */}
            <div className="py-8 space-y-4">
              <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-14 w-full max-w-md bg-white/10 rounded animate-pulse" />
                <div className="h-14 w-3/4 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="h-12 w-full max-w-sm bg-white/10 rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-14 w-48 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-14 w-14 bg-white/10 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Right side - Orbit skeleton */}
            <div className="h-[500px] flex items-center justify-center">
              <div className="w-96 h-96 rounded-full border-2 border-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Skeleton */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <GlassCard key={i} variant="elevated" padding="none" className="p-6">
              <div className="space-y-4">
                <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-10 w-24 bg-white/10 rounded animate-pulse" />
                <div className="h-2 w-full bg-white/10 rounded animate-pulse" />
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Content Grid Skeleton */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <GlassCard key={i} variant="elevated" padding="lg">
                <div className="h-32 bg-white/10 rounded animate-pulse" />
              </GlassCard>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} variant="elevated" padding="lg">
                <div className="h-24 bg-white/10 rounded animate-pulse" />
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
