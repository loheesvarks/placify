/**
 * Glass Card Component
 * Reusable glass morphism card matching reference design
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: 'default' | 'elevated' | 'bordered' | 'subtle';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Enable hover effect */
  hover?: boolean;
  /** Enable glow effect */
  glow?: 'none' | 'primary' | 'secondary' | 'success';
  /** Make card interactive (cursor pointer) */
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  glow = 'none',
  interactive = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        // Base glass styling
        'rounded-xl border backdrop-blur-xl transition-all duration-300',
        
        // Variants
        variant === 'default' && 'border-white/10 bg-white/5',
        variant === 'elevated' && 'border-white/[0.15] bg-white/[0.08]',
        variant === 'bordered' && 'border-white/20 bg-white/[0.03]',
        variant === 'subtle' && 'border-white/5 bg-white/[0.02]',
        
        // Padding
        padding === 'none' && 'p-0',
        padding === 'sm' && 'p-3',
        padding === 'md' && 'p-4',
        padding === 'lg' && 'p-6',
        padding === 'xl' && 'p-8',
        
        // Hover effect
        hover && 'hover:bg-white/10 hover:border-primary-500/30',
        
        // Glow effect
        glow === 'primary' && 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
        glow === 'secondary' && 'shadow-[0_0_20px_rgba(147,51,234,0.15)]',
        glow === 'success' && 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
        
        // Interactive
        interactive && 'cursor-pointer hover:-translate-y-0.5',
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
