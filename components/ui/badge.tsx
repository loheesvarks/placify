import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-neutral-700 text-text-secondary',
        primary:
          'border-primary-500/20 bg-primary-500/10 text-primary-400',
        secondary:
          'border-secondary-500/20 bg-secondary-500/10 text-secondary-400',
        success:
          'border-success-500/20 bg-success-500/10 text-success-400',
        warning:
          'border-warning-500/20 bg-warning-500/10 text-warning-400',
        error:
          'border-error-500/20 bg-error-500/10 text-error-400',
        outline:
          'border-surface-border bg-transparent text-text-secondary',
      },
      size: {
        sm: 'px-2 py-0.5 text-label-xs',
        md: 'px-2.5 py-0.5 text-label-sm',
        lg: 'px-3 py-1 text-label-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
