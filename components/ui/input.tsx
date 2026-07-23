import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const inputVariants = cva(
  'flex w-full rounded-md border bg-surface-elevated-1 text-text-primary transition-colors duration-fast file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        default:
          'border-surface-border hover:border-surface-border-bold focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/10',
        error:
          'border-error-500 focus-visible:border-error-500 focus-visible:ring-2 focus-visible:ring-error-500/10',
        success:
          'border-success-500 focus-visible:border-success-500 focus-visible:ring-2 focus-visible:ring-success-500/10',
      },
      size: {
        sm: 'h-8 px-3 text-body-sm',
        md: 'h-10 px-4 text-body-md',
        lg: 'h-12 px-5 text-body-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>,
    VariantProps<typeof inputVariants> {
  /**
   * Label text for the input
   */
  label?: string;
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  /**
   * Error message displayed below the input
   */
  error?: string;
  /**
   * Success message displayed below the input
   */
  success?: string;
  /**
   * Icon or element to display on the left side
   */
  prefix?: React.ReactNode;
  /**
   * Icon or element to display on the right side
   */
  suffix?: React.ReactNode;
  /**
   * Container className for the full input wrapper
   */
  containerClassName?: string;
  /**
   * Makes the label visually hidden but accessible to screen readers
   */
  hiddenLabel?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      variant: variantProp,
      size,
      type = 'text',
      label,
      helperText,
      error,
      success,
      prefix,
      suffix,
      disabled,
      hiddenLabel = false,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;

    // Determine variant based on error/success states
    const variant = error ? 'error' : success ? 'success' : variantProp;

    // Toggle password visibility for password inputs
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;

    return (
      <div className={cn('flex w-full flex-col gap-2', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-label-sm font-medium text-text-secondary',
              hiddenLabel && 'sr-only'
            )}
          >
            {label}
            {props.required && (
              <span className="ml-1 text-error-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex w-full items-center">
          {prefix && (
            <div
              className="absolute left-3 flex items-center text-text-tertiary"
              aria-hidden="true"
            >
              {prefix}
            </div>
          )}

          <input
            type={inputType}
            className={cn(
              inputVariants({ variant, size }),
              prefix && 'pl-10',
              (suffix || isPasswordType) && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : success
                  ? `${inputId}-success`
                  : helperText
                    ? `${inputId}-helper`
                    : undefined
            }
            {...props}
          />

          {(suffix || isPasswordType) && (
            <div className="absolute right-3 flex items-center">
              {isPasswordType ? (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="rounded text-text-tertiary transition-colors hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              ) : (
                <div className="text-text-tertiary" aria-hidden="true">
                  {suffix}
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p
            className="text-body-xs text-error-500 animate-slide-down"
            id={`${inputId}-error`}
            role="alert"
          >
            {error}
          </p>
        )}

        {success && !error && (
          <p
            className="text-body-xs text-success-500 animate-slide-down"
            id={`${inputId}-success`}
            role="status"
          >
            {success}
          </p>
        )}

        {helperText && !error && !success && (
          <p className="text-body-xs text-text-tertiary" id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
