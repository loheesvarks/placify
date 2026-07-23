import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface AccordionProps {
  /**
   * Accordion type
   * - 'single': Only one item can be open at a time
   * - 'multiple': Multiple items can be open
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /**
   * Default open items (uncontrolled mode)
   */
  defaultValue?: string | string[];
  /**
   * Open items (controlled mode)
   */
  value?: string | string[];
  /**
   * Callback when value changes
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * Whether items can be collapsed (single mode only)
   * @default true
   */
  collapsible?: boolean;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Children accordion items
   */
  children: React.ReactNode;
}

interface AccordionContextValue {
  type: 'single' | 'multiple';
  value: string | string[];
  onValueChange: (value: string) => void;
  collapsible: boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within Accordion');
  }
  return context;
};

/**
 * Accordion component with smooth expand/collapse animations
 * Supports single and multiple selection modes
 * Fully keyboard accessible
 */
export const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange,
  collapsible = true,
  className,
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[]>(
    defaultValue || (type === 'single' ? '' : [])
  );

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (itemValue: string) => {
      let newValue: string | string[];

      if (type === 'single') {
        // Single mode
        const currentValue = Array.isArray(value) ? '' : value;
        newValue = currentValue === itemValue && collapsible ? '' : itemValue;
      } else {
        // Multiple mode
        const currentValue = Array.isArray(value) ? value : [];
        newValue = currentValue.includes(itemValue)
          ? currentValue.filter((v) => v !== itemValue)
          : [...currentValue, itemValue];
      }

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [type, value, collapsible, isControlled, onValueChange]
  );

  return (
    <AccordionContext.Provider
      value={{
        type,
        value,
        onValueChange: handleValueChange,
        collapsible,
      }}
    >
      <div className={cn('w-full', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Unique value for this accordion item
   */
  value: string;
  /**
   * Whether this item is disabled
   */
  disabled?: boolean;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value: itemValue, disabled, children, ...props }, ref) => {
    const { value } = useAccordionContext();
    const isOpen = Array.isArray(value)
      ? value.includes(itemValue)
      : value === itemValue;

    return (
      <div
        ref={ref}
        data-state={isOpen ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        data-value={itemValue}
        className={cn(
          'border-b border-surface-border-soft last:border-0',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Icon to display (defaults to ChevronDown)
   */
  icon?: React.ReactNode;
  /**
   * Whether to hide the icon
   */
  hideIcon?: boolean;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, icon, hideIcon = false, children, disabled, ...props }, ref) => {
    // Get parent AccordionItem to determine value
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    React.useImperativeHandle(ref, () => triggerRef.current!);

    const { value, onValueChange } = useAccordionContext();
    const itemElement = triggerRef.current?.closest('[data-state]') as HTMLElement;
    const itemValue = itemElement?.getAttribute('data-value') || '';
    const isDisabled = disabled || itemElement?.hasAttribute('data-disabled');

    const isOpen = Array.isArray(value)
      ? value.includes(itemValue)
      : value === itemValue;

    const handleClick = () => {
      if (!isDisabled && itemValue) {
        onValueChange(itemValue);
      }
    };

    return (
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${itemValue}`}
        disabled={isDisabled}
        className={cn(
          'flex w-full items-center justify-between py-4 text-left',
          'text-body-md font-medium text-text-primary',
          'transition-colors duration-fast',
          'hover:text-primary-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
        {!hideIcon && (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{
              duration: 0.25,
              ease: [0.25, 0.1, 0.25, 1], // ease-smooth
            }}
            className="ml-2 shrink-0 text-text-secondary"
            aria-hidden="true"
          >
            {icon || <ChevronDown className="h-5 w-5" />}
          </motion.span>
        )}
      </button>
    );
  }
);

AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => contentRef.current!);

    const { value } = useAccordionContext();
    const itemElement = contentRef.current?.closest('[data-state]') as HTMLElement;
    const itemValue = itemElement?.getAttribute('data-value') || '';

    const isOpen = Array.isArray(value)
      ? value.includes(itemValue)
      : value === itemValue;

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={contentRef}
            id={`accordion-content-${itemValue}`}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: {
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1], // ease-smooth
              },
              opacity: {
                duration: 0.25,
                ease: [0.25, 0.1, 0.25, 1],
              },
            }}
            className="overflow-hidden"
          >
            <div className={cn('pb-4 text-body-sm text-text-secondary', className)} {...props}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

AccordionContent.displayName = 'AccordionContent';
