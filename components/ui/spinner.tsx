import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the spinner
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Variant style
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'white' | 'current';
  /**
   * Label for screen readers
   */
  'aria-label'?: string;
}

const sizeConfig = {
  xs: 'h-3 w-3 border-2',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
  xl: 'h-12 w-12 border-[3px]',
};

const variantConfig = {
  primary: 'border-neutral-800 border-t-primary-500',
  secondary: 'border-neutral-800 border-t-secondary-500',
  white: 'border-white/20 border-t-white',
  current: 'border-current/20 border-t-current',
};

/**
 * Spinner component for loading states
 * Multiple size and color variants
 * Accessible with ARIA labels
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size = 'md',
      variant = 'primary',
      'aria-label': ariaLabel = 'Loading',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
        className={cn('inline-block', className)}
        {...props}
      >
        <motion.div
          className={cn(
            'rounded-full',
            sizeConfig[size],
            variantConfig[variant]
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export interface SpinnerOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the overlay is visible
   */
  show: boolean;
  /**
   * Loading message to display
   */
  message?: string;
  /**
   * Size of the spinner
   * @default 'lg'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Whether to blur the background
   * @default true
   */
  blur?: boolean;
}

/**
 * Full-screen spinner overlay for page-level loading states
 * Includes optional loading message
 */
export const SpinnerOverlay = React.forwardRef<HTMLDivElement, SpinnerOverlayProps>(
  (
    {
      className,
      show,
      message,
      size = 'lg',
      blur = true,
      ...props
    },
    ref
  ) => {
    if (!show) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-[9999] flex flex-col items-center justify-center',
          'bg-surface-background/80',
          blur && 'backdrop-blur-sm',
          className
        )}
        {...props}
      >
        <Spinner size={size} variant="primary" aria-label={message || 'Loading'} />
        {message && (
          <p className="mt-4 text-body-md text-text-secondary animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }
);

SpinnerOverlay.displayName = 'SpinnerOverlay';

export interface DotsSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the dots
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Variant style
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'white' | 'current';
  /**
   * Label for screen readers
   */
  'aria-label'?: string;
}

const dotsSizeConfig = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
};

const dotsVariantConfig = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  white: 'bg-white',
  current: 'bg-current',
};

/**
 * Dots spinner animation
 * Alternative loading indicator style
 */
export const DotsSpinner = React.forwardRef<HTMLDivElement, DotsSpinnerProps>(
  (
    {
      className,
      size = 'md',
      variant = 'primary',
      'aria-label': ariaLabel = 'Loading',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
        className={cn('inline-flex items-center gap-1.5', className)}
        {...props}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn(
              'rounded-full',
              dotsSizeConfig[size],
              dotsVariantConfig[variant]
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);

DotsSpinner.displayName = 'DotsSpinner';

export interface PulseSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the pulse
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Variant style
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
  /**
   * Label for screen readers
   */
  'aria-label'?: string;
}

const pulseSizeConfig = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

const pulseVariantConfig = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
};

/**
 * Pulse spinner animation
 * Expanding circle effect
 */
export const PulseSpinner = React.forwardRef<HTMLDivElement, PulseSpinnerProps>(
  (
    {
      className,
      size = 'md',
      variant = 'primary',
      'aria-label': ariaLabel = 'Loading',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
        className={cn(
          'relative inline-flex items-center justify-center',
          pulseSizeConfig[size],
          className
        )}
        {...props}
      >
        {[0, 1].map((index) => (
          <motion.div
            key={index}
            className={cn(
              'absolute inset-0 rounded-full opacity-75',
              pulseVariantConfig[variant]
            )}
            animate={{
              scale: [1, 2],
              opacity: [0.75, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 1,
              ease: 'easeOut',
            }}
          />
        ))}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);

PulseSpinner.displayName = 'PulseSpinner';
