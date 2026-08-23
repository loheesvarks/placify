/**
 * Stat Card Component
 * Displays metrics with icons, progress bars, and supplementary info
 * Matches reference design stat cards
 */

import React from 'react';
import { 
  LucideIcon, 
  Clock, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Flame 
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon | 'clock' | 'trending-up' | 'target' | 'sparkles' | 'flame';
  iconColor?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  progress?: number;
  progressLabel?: string;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
  chart?: boolean;
  className?: string;
}

const iconMap = {
  clock: Clock,
  'trending-up': TrendingUp,
  target: Target,
  sparkles: Sparkles,
  flame: Flame,
};

export function StatCard({
  icon,
  iconColor = 'text-primary-400',
  title,
  value,
  subtitle,
  description,
  progress,
  progressLabel,
  trend,
  chart,
  className,
}: StatCardProps) {
  const Icon = typeof icon === 'string' ? iconMap[icon] : icon;

  return (
    <GlassCard
      variant="elevated"
      padding="none"
      hover
      className={cn('group p-6', className)}
    >
      {/* Header with Icon and Title */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              'bg-white/5 transition-colors group-hover:bg-white/10'
            )}
          >
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
          <span className="text-sm font-medium text-white/70">{title}</span>
        </div>
      </div>

      {/* Main Value */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white tabular-nums">{value}</span>
          {subtitle && (
            <span className="text-base text-white/50">{subtitle}</span>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-white/50 mb-3">{description}</p>
      )}

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

      {/* Mini Chart */}
      {chart && (
        <div className="mt-3 h-12 relative">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`chart-gradient-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path
              d="M 0 30 L 20 25 L 40 28 L 60 20 L 80 22 L 100 15"
              fill="none"
              stroke={`url(#chart-gradient-${title})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </GlassCard>
  );
}

