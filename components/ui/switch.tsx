import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * Label for the switch
   */
  label?: React.ReactNode;
  /**
   * Helper text displayed below switch
   */
  helperText?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Label position relative to switch
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';
  /**
   * Container className
   */
  containerClassName?: string;
  /**
   * Label className
   */
  labelClassName?: string;
  /**
   * Size of the switch
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'translate-x-7',
  },
};

/**
 * Switch component with animated thumb
 * Fully accessible and keyboard navigable
 * Supports label, helper text, and error states
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      label,
      helperText,
      error,
      labelPosition = 'right',
      disabled,
      checked,
      size = 'md',
      id,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const generatedId = React.useId();
    const switchId = id || generatedId;

    React.useImperativeHandle(ref, () => inputRef.current!);

    const config = sizeConfig[size];

    const switchElement = (
      <div className="relative inline-block">
        <input
          ref={inputRef}
          type="checkbox"
          id={switchId}
          className="peer sr-only"
          disabled={disabled}
          checked={checked}
          role="switch"
          aria-checked={checked}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${switchId}-error`
              : helperText
                ? `${switchId}-helper`
                : undefined
          }
          {...props}
        />
        <div
          className={cn(
            'relative rounded-full transition-colors duration-fast',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-background',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            error
              ? 'bg-error-500/20 peer-checked:bg-error-500'
              : 'bg-neutral-700 peer-checked:bg-primary-500',
            'cursor-pointer',
            config.track,
            className
          )}
        >
          <motion.div
            className={cn(
              'absolute left-0.5 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm',
              config.thumb
            )}
            animate={{
              x: checked ? `calc(100% + 2px)` : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
          />
        </div>
      </div>
    );

    const labelElement = label && (
      <label
        htmlFor={switchId}
        className={cn(
          'cursor-pointer text-body-sm text-text-primary select-none',
          disabled && 'cursor-not-allowed opacity-50',
          labelClassName
        )}
      >
        {label}
      </label>
    );

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        <div
          className={cn(
            'flex items-center gap-3',
            labelPosition === 'left' && 'flex-row-reverse justify-end'
          )}
        >
          {labelElement}
          {switchElement}
        </div>

        {error && (
          <p
            className="text-body-xs text-error-500 animate-slide-down"
            id={`${switchId}-error`}
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-body-xs text-text-tertiary" id={`${switchId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
