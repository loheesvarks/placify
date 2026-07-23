import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-primary text-white shadow-glow-sm hover:shadow-glow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-glow-sm',
        secondary:
          'bg-glass-background backdrop-blur-md text-text-primary border border-glass-border hover:bg-glass-background-hover hover:border-primary-500/30 hover:shadow-glow-sm active:bg-glass-background-light',
        ghost:
          'bg-transparent text-text-secondary hover:bg-glass-background hover:text-text-primary active:bg-glass-background-hover',
        danger:
          'bg-error-500 text-white hover:bg-error-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] active:bg-error-700',
      },
      size: {
        sm: 'h-8 px-4 text-body-sm',
        md: 'h-10 px-6 text-body-md',
        lg: 'h-12 px-7 text-body-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Loading state - shows spinner and disables interaction
   */
  loading?: boolean;
  /**
   * Icon to display on the left side
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display on the right side
   */
  rightIcon?: React.ReactNode;
  /**
   * Makes the button take full width of parent
   */
  fullWidth?: boolean;
  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Warn in development if icon-only button lacks aria-label
    if (process.env.NODE_ENV === 'development') {
      if ((leftIcon || rightIcon) && !children && !ariaLabel) {
        console.warn(
          'Button: Icon-only buttons should have an aria-label for accessibility.'
        );
      }
    }

    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        type={type}
        aria-busy={loading}
        aria-label={ariaLabel}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon && (
            <span className="inline-flex shrink-0" aria-hidden="true">
              {leftIcon}
            </span>
          )
        )}
        {children}
        {!loading && rightIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
