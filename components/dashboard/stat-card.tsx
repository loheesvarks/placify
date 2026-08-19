/**
 * Stat Card Component
 * Displays metrics with icons, progress bars, and supplementary info
 * Matches reference design stat cards
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  progressLabel?: string;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
  className?: string;
}

export function StatCard({
  icon: Icon,
  iconColor = 'text-primary-400',
  title,
  value,
  subtitle,
  progress,
  progressLabel,
  trend,
  className,
}: StatCardProps) {
  return (
    <GlassCard
      variant="elevated"
      padding="lg"
      hover
      className={cn('group', className)}
    >
      {/* Header with Icon */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              'bg-white/5 transition-colors group-hover:bg-white/10'
            )}
          >
            <Icon className={cn('h-4 w-4', iconColor)} />
          </div>
          <span className="text-sm font-medium text-white/70">{title}</span>
        </div>
      </div>

      {/* Main Value */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {subtitle && (
            <span className="text-sm text-white/50">{subtitle}</span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progressLabel && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">{progressLabel}</span>
              <span className="font-medium text-white/70">{progress}%</span>
            </div>
          )}
        </div>
      )}

      {/* Trend Indicator */}
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              'text-xs font-medium',
              trend.direction === 'up' ? 'text-success-500' : 'text-error-500'
            )}
          >
            {trend.direction === 'up' ? '↗' : '↘'} {trend.value}%
          </span>
          <span className="text-xs text-white/50">{trend.label}</span>
        </div>
      )}
    </GlassCard>
  );
}
