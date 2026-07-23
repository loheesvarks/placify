import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /**
   * Radio options
   */
  options: RadioOption[];
  /**
   * Selected value (controlled mode)
   */
  value?: string;
  /**
   * Default value (uncontrolled mode)
   */
  defaultValue?: string;
  /**
   * Callback when value changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Label for the radio group
   */
  label?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Whether the group is disabled
   */
  disabled?: boolean;
  /**
   * Layout orientation
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Name attribute for form submission
   */
  name?: string;
  /**
   * Required field
   */
  required?: boolean;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Container className
   */
  containerClassName?: string;
}

/**
 * RadioGroup component with keyboard navigation
 * Fully accessible with ARIA attributes
 * Supports validation and error states
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onValueChange,
      label,
      helperText,
      error,
      disabled,
      orientation = 'vertical',
      name,
      required,
      className,
      containerClassName,
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
    const generatedId = React.useId();
    const groupId = `radio-group-${generatedId}`;

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    const handleKeyDown = (event: React.KeyboardEvent, currentValue: string) => {
      const enabledOptions = options.filter((opt) => !opt.disabled);
      const currentIndex = enabledOptions.findIndex((opt) => opt.value === currentValue);

      let nextIndex = currentIndex;

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
        event.preventDefault();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
        event.preventDefault();
      }

      if (nextIndex !== currentIndex) {
        handleValueChange(enabledOptions[nextIndex].value);
        // Focus the next radio button
        const nextRadio = document.getElementById(
          `${groupId}-${enabledOptions[nextIndex].value}`
        );
        nextRadio?.focus();
      }
    };

    return (
      <div ref={ref} className={cn('flex flex-col gap-2', containerClassName)}>
        {label && (
          <label className="text-label-sm font-medium text-text-secondary">
            {label}
            {required && (
              <span className="ml-1 text-error-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div
          role="radiogroup"
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${groupId}-error`
              : helperText
                ? `${groupId}-helper`
                : undefined
          }
          className={cn(
            'flex gap-4',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
            className
          )}
        >
          {options.map((option) => {
            const radioId = `${groupId}-${option.value}`;
            const isSelected = value === option.value;
            const isDisabled = disabled || option.disabled;

            return (
              <div
                key={option.value}
                className={cn(
                  'flex items-start gap-3',
                  isDisabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <div className="relative flex items-center pt-0.5">
                  <input
                    type="radio"
                    id={radioId}
                    name={name || groupId}
                    value={option.value}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => handleValueChange(option.value)}
                    onKeyDown={(e) => handleKeyDown(e, option.value)}
                    className="peer sr-only"
                    tabIndex={isSelected ? 0 : -1}
                  />
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-fast',
                      'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-background',
                      error
                        ? 'border-error-500'
                        : 'border-surface-border',
                      'peer-checked:border-primary-500',
                      !isDisabled && 'hover:border-primary-400'
                    )}
                  >
                    <div
                      className={cn(
                        'h-2.5 w-2.5 rounded-full bg-primary-500 transition-transform duration-fast',
                        isSelected ? 'scale-100' : 'scale-0'
                      )}
                    />
                  </div>
                </div>

                <label
                  htmlFor={radioId}
                  className={cn(
                    'flex flex-1 cursor-pointer select-none flex-col gap-0.5',
                    isDisabled && 'cursor-not-allowed'
                  )}
                >
                  <span className="text-body-sm text-text-primary">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-body-xs text-text-tertiary">
                      {option.description}
                    </span>
                  )}
                </label>
              </div>
            );
          })}
        </div>

        {error && (
          <p
            className="text-body-xs text-error-500 animate-slide-down"
            id={`${groupId}-error`}
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-body-xs text-text-tertiary" id={`${groupId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
