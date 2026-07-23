import * as React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from './dropdown';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /**
   * Select options
   */
  options: SelectOption[];
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
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether select is disabled
   */
  disabled?: boolean;
  /**
   * Error message
   */
  error?: string;
  /**
   * Label for the select
   */
  label?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Whether select can be cleared
   * @default true
   */
  clearable?: boolean;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Container className
   */
  containerClassName?: string;
  /**
   * Name attribute for forms
   */
  name?: string;
  /**
   * Required field
   */
  required?: boolean;
}

/**
 * Select component with keyboard navigation and search capability
 * Fully accessible and responsive
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onValueChange,
      placeholder = 'Select an option',
      disabled,
      error,
      label,
      helperText,
      clearable = true,
      className,
      containerClassName,
      name,
      required,
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const generatedId = React.useId();

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const selectedOption = options.find((opt) => opt.value === value);

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);
        setOpen(false);
        setSearchQuery('');
      },
      [isControlled, onValueChange]
    );

    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation();
      handleValueChange('');
    };

    // Filter options based on search query
    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      const query = searchQuery.toLowerCase();
      return options.filter((option) =>
        option.label.toLowerCase().includes(query)
      );
    }, [options, searchQuery]);

    // Focus search input when dropdown opens
    React.useEffect(() => {
      if (open) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else {
        setSearchQuery('');
      }
    }, [open]);

    return (
      <div className={cn('flex w-full flex-col gap-2', containerClassName)}>
        {label && (
          <label
            htmlFor={generatedId}
            className="text-label-sm font-medium text-text-secondary"
          >
            {label}
            {required && (
              <span className="ml-1 text-error-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <Dropdown open={open} onOpenChange={setOpen}>
          <DropdownTrigger
            ref={ref}
            disabled={disabled}
            fullWidth
            className={cn(
              'flex h-10 w-full items-center justify-between gap-2',
              'rounded-md border bg-surface-elevated-1 px-4 text-body-md',
              'transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background',
              error
                ? 'border-error-500 focus-visible:border-error-500 focus-visible:ring-error-500/10'
                : 'border-surface-border hover:border-surface-border-bold focus-visible:border-primary-500 focus-visible:ring-primary-500/10',
              disabled && 'cursor-not-allowed opacity-60',
              className
            )}
            aria-label={label}
            aria-required={required}
            aria-invalid={!!error}
          >
            <span
              className={cn(
                'flex-1 truncate text-left',
                !selectedOption && 'text-text-tertiary'
              )}
            >
              {selectedOption?.label || placeholder}
            </span>
            <div className="flex items-center gap-1">
              {clearable && value && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded p-0.5 text-text-tertiary hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
                  aria-label="Clear selection"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-text-tertiary transition-transform duration-fast',
                  open && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </div>
          </DropdownTrigger>

          <DropdownContent
            align="start"
            minWidth="trigger"
            className="max-h-[300px] overflow-auto"
          >
            {/* Search input */}
            <div className="sticky top-0 z-10 bg-surface-elevated-1 p-2 border-b border-surface-border-soft">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  // Prevent Tab from being trapped in search
                  if (e.key === 'Tab') {
                    e.stopPropagation();
                  }
                  // ESC to close and return focus
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    setOpen(false);
                  }
                }}
                className={cn(
                  'w-full rounded border border-surface-border bg-surface-elevated-2',
                  'px-3 py-1.5 text-body-sm text-text-primary',
                  'placeholder:text-text-tertiary',
                  'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20'
                )}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Options list */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <DropdownItem
                  key={option.value}
                  selected={value === option.value}
                  disabled={option.disabled}
                  onClick={() => handleValueChange(option.value)}
                >
                  {option.label}
                </DropdownItem>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-body-sm text-text-tertiary">
                No options found
              </div>
            )}
          </DropdownContent>
        </Dropdown>

        {/* Hidden input for form submission */}
        {name && (
          <input type="hidden" name={name} value={value} />
        )}

        {error && (
          <p
            className="text-body-xs text-error-500 animate-slide-down"
            id={`${generatedId}-error`}
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-body-xs text-text-tertiary" id={`${generatedId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
