import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-fast',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500/10 text-primary-400 border border-primary-500/20',
        secondary:
          'bg-secondary-500/10 text-secondary-400 border border-secondary-500/20',
        success:
          'bg-success-500/10 text-success-400 border border-success-500/20',
        warning:
          'bg-warning-500/10 text-warning-400 border border-warning-500/20',
        error:
          'bg-error-500/10 text-error-400 border border-error-500/20',
        neutral:
          'bg-neutral-700 text-text-secondary border border-surface-border',
      },
      size: {
        sm: 'px-2 py-0.5 text-label-xs',
        md: 'px-3 py-1 text-label-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Optional icon or element to display before the text
   */
  icon?: React.ReactNode;
  /**
   * Optional dot indicator
   */
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              variant === 'primary' && 'bg-primary-400',
              variant === 'secondary' && 'bg-secondary-400',
              variant === 'success' && 'bg-success-400',
              variant === 'warning' && 'bg-warning-400',
              variant === 'error' && 'bg-error-400',
              variant === 'neutral' && 'bg-text-secondary'
            )}
            aria-hidden="true"
          />
        )}
        {icon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Count Badge - For notification counts
const countBadgeVariants = cva(
  'flex items-center justify-center rounded-full bg-primary-500 text-white font-medium',
  {
    variants: {
      size: {
        sm: 'h-4 min-w-4 px-1 text-[10px]',
        md: 'h-5 min-w-5 px-1.5 text-[11px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface CountBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof countBadgeVariants> {
  /**
   * The count to display
   */
  count: number;
  /**
   * Maximum count to display before showing "99+"
   */
  max?: number;
}

const CountBadge = React.forwardRef<HTMLSpanElement, CountBadgeProps>(
  ({ className, size, count, max = 99, ...props }, ref) => {
    const displayCount = count > max ? `${max}+` : count;

    return (
      <span
        ref={ref}
        className={cn(countBadgeVariants({ size }), className)}
        aria-label={`${count} notifications`}
        {...props}
      >
        {displayCount}
      </span>
    );
  }
);

CountBadge.displayName = 'CountBadge';

// Dot Badge - Minimal status indicator
const dotBadgeVariants = cva('h-2 w-2 rounded-full', {
  variants: {
    variant: {
      active: 'bg-success-500',
      warning: 'bg-warning-500',
      error: 'bg-error-500',
      offline: 'bg-neutral-500',
      primary: 'bg-primary-500',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface DotBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof dotBadgeVariants> {
  /**
   * Optional accessible label
   */
  label?: string;
}

const DotBadge = React.forwardRef<HTMLSpanElement, DotBadgeProps>(
  ({ className, variant, label, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(dotBadgeVariants({ variant }), className)}
        aria-label={label}
        role={label ? 'status' : undefined}
        {...props}
      />
    );
  }
);

DotBadge.displayName = 'DotBadge';

export { Badge, CountBadge, DotBadge, badgeVariants, countBadgeVariants, dotBadgeVariants };
