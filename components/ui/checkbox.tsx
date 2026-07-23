import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * Label for the checkbox
   */
  label?: React.ReactNode;
  /**
   * Helper text displayed below checkbox
   */
  helperText?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Indeterminate state
   */
  indeterminate?: boolean;
  /**
   * Container className
   */
  containerClassName?: string;
  /**
   * Label className
   */
  labelClassName?: string;
}

/**
 * Checkbox component with indeterminate state support
 * Fully accessible and keyboard navigable
 * Supports label, helper text, and error states
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      label,
      helperText,
      error,
      indeterminate = false,
      disabled,
      checked,
      id,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    React.useImperativeHandle(ref, () => inputRef.current!);

    // Set indeterminate state
    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        <div className="flex items-start gap-3">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="checkbox"
              id={checkboxId}
              className="peer sr-only"
              disabled={disabled}
              checked={checked}
              aria-invalid={!!error}
              aria-describedby={
                error
                  ? `${checkboxId}-error`
                  : helperText
                    ? `${checkboxId}-helper`
                    : undefined
              }
              {...props}
            />
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-fast',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-background',
                error
                  ? 'border-error-500 bg-surface-elevated-1'
                  : 'border-surface-border bg-surface-elevated-1',
                'peer-checked:border-primary-500 peer-checked:bg-primary-500',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                'hover:border-primary-400 peer-checked:hover:bg-primary-600',
                className
              )}
            >
              {indeterminate ? (
                <Minus
                  className="h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  aria-hidden="true"
                />
              ) : (
                <Check
                  className="h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'flex-1 cursor-pointer text-body-sm text-text-primary',
                'select-none',
                disabled && 'cursor-not-allowed opacity-50',
                labelClassName
              )}
            >
              {label}
            </label>
          )}
        </div>

        {error && (
          <p
            className="text-body-xs text-error-500 animate-slide-down ml-8"
            id={`${checkboxId}-error`}
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            className="text-body-xs text-text-tertiary ml-8"
            id={`${checkboxId}-helper`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
