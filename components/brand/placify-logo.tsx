/**
 * Placify Logo Component
 * Centralized branding component matching reference image
 * PLAC-013C - Global Visual Reconstruction
 */

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PlacifyLogoProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export function PlacifyLogo({ variant = 'full', className }: PlacifyLogoProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('relative', className)}>
        <Image
          src="/logos/placify-logo.svg"
          alt="Placify"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Logo Mark */}
      <div className="relative flex-shrink-0">
        <Image
          src="/logos/placify-logo.svg"
          alt="Placify Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </div>

      {/* Wordmark and Subtitle */}
      <div className="flex flex-col">
        <span className="bg-gradient-to-r from-white via-white to-white/95 bg-clip-text text-lg font-bold leading-tight text-transparent">
          Placify
        </span>
        <span className="text-[10px] leading-tight text-white/50">
          AI-Powered Placement Prep
        </span>
      </div>
    </div>
  );
}
