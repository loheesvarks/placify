import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current progress value (0-100)
   */
  value?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Indeterminate state (loading animation)
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /**
   * Show percentage label
   * @default false
   */
  showLabel?: boolean;
  /**
   * Label text (overrides percentage)
   */
  label?: string;
  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;
}

const sizeConfig = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

const variantConfig = {
  primary: 'bg-gradient-primary',
  secondary: 'bg-gradient-secondary',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

/**
 * Progress bar component with determinate and indeterminate states
 * Supports animations and labels
 * Fully accessible with ARIA attributes
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      indeterminate = false,
      size = 'md',
      variant = 'primary',
      showLabel = false,
      label,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayLabel = label || (showLabel ? `${Math.round(percentage)}%` : undefined);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {displayLabel && (
          <div className="mb-2 flex items-center justify-between text-label-sm text-text-secondary">
            <span>{displayLabel}</span>
            {showLabel && !label && <span>{Math.round(percentage)}%</span>}
          </div>
        )}

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={indeterminate ? undefined : value}
          aria-label={ariaLabel || 'Progress'}
          aria-busy={indeterminate}
          aria-live={indeterminate ? 'polite' : 'off'}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-neutral-800',
            sizeConfig[size]
          )}
        >
          {indeterminate ? (
            // Indeterminate animation
            <motion.div
              className={cn('absolute inset-y-0 w-1/3 rounded-full', variantConfig[variant])}
              animate={{
                x: ['-100%', '400%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ) : (
            // Determinate progress bar
            <motion.div
              className={cn('h-full rounded-full', variantConfig[variant])}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{
                duration: 0.8,
                ease: [0, 0, 0.2, 1], // ease-out
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current progress value (0-100)
   */
  value?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Indeterminate state (loading animation)
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Size in pixels
   * @default 48
   */
  size?: number;
  /**
   * Stroke width in pixels
   * @default 4
   */
  strokeWidth?: number;
  /**
   * Color variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /**
   * Show percentage label in center
   * @default false
   */
  showLabel?: boolean;
  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;
}

const circularVariantConfig = {
  primary: '#3b82f6',
  secondary: '#a855f7',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

/**
 * Circular progress indicator
 * Supports both determinate and indeterminate states
 */
export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      indeterminate = false,
      size = 48,
      strokeWidth = 4,
      variant = 'primary',
      showLabel = false,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        aria-label={ariaLabel || 'Progress'}
        aria-busy={indeterminate}
        aria-live={indeterminate ? 'polite' : 'off'}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-neutral-800"
          />

          {/* Progress circle */}
          {indeterminate ? (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={circularVariantConfig[variant]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{
                strokeDashoffset: [circumference, 0],
                rotate: [0, 360],
              }}
              transition={{
                strokeDashoffset: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                },
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            />
          ) : (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={circularVariantConfig[variant]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1], // ease-elegant
              }}
            />
          )}
        </svg>

        {/* Center label */}
        {showLabel && !indeterminate && (
          <div className="absolute inset-0 flex items-center justify-center text-label-md font-semibold text-text-primary">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';
