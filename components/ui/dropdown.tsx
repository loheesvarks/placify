import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Portal } from './portal';

export interface DropdownProps {
  /**
   * Controls whether dropdown is open
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Default open state (uncontrolled mode)
   */
  defaultOpen?: boolean;
  /**
   * Dropdown content
   */
  children: React.ReactNode;
}

interface DropdownContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

const useDropdownContext = () => {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within Dropdown');
  }
  return context;
};

/**
 * Dropdown menu with keyboard navigation and positioning
 * Supports outside click handling and ESC key
 * WCAG 2.1 AA compliant
 */
export const Dropdown: React.FC<DropdownProps> = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DropdownContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

Dropdown.displayName = 'Dropdown';

export interface DropdownTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Make trigger take full width
   */
  fullWidth?: boolean;
}

export const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ className, fullWidth, children, ...props }, ref) => {
    const { open, onOpenChange } = useDropdownContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(fullWidth && 'w-full', className)}
        onClick={() => onOpenChange(!open)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownTrigger.displayName = 'DropdownTrigger';

export interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Alignment relative to trigger
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Side to position content
   * @default 'bottom'
   */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Offset from trigger in pixels
   * @default 8
   */
  sideOffset?: number;
  /**
   * Minimum width setting
   */
  minWidth?: number | 'trigger';
}

export const DropdownContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(
  (
    {
      className,
      align = 'start',
      side = 'bottom',
      sideOffset = 8,
      minWidth,
      children,
    },
    ref
  ) => {
    const { open, onOpenChange } = useDropdownContext();
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [triggerWidth, setTriggerWidth] = React.useState(0);

    React.useImperativeHandle(ref, () => contentRef.current!);

    // Close on outside click
    React.useEffect(() => {
      if (!open) return;

      const handleClickOutside = (event: MouseEvent) => {
        const trigger = contentRef.current?.parentElement?.querySelector(
          '[aria-haspopup]'
        );
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          trigger &&
          !trigger.contains(event.target as Node)
        ) {
          onOpenChange(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onOpenChange]);

    // Close on ESC key
    React.useEffect(() => {
      if (!open) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onOpenChange(false);
          // Return focus to trigger
          const trigger = contentRef.current?.parentElement?.querySelector<HTMLElement>(
            '[aria-haspopup]'
          );
          trigger?.focus();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, onOpenChange]);

    // Get trigger width for minWidth="trigger"
    React.useEffect(() => {
      if (minWidth !== 'trigger') return;

      const trigger = contentRef.current?.parentElement?.querySelector('[aria-haspopup]');
      if (trigger) {
        setTriggerWidth(trigger.getBoundingClientRect().width);
      }
    }, [minWidth]);

    const alignmentClass = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    }[align];

    const sideClass = {
      top: 'bottom-full',
      bottom: 'top-full',
      left: 'right-full top-0',
      right: 'left-full top-0',
    }[side];

    const originClass = {
      top: 'origin-bottom',
      bottom: 'origin-top',
      left: 'origin-right',
      right: 'origin-left',
    }[side];

    return (
      <AnimatePresence>
        {open && (
          <Portal>
            <motion.div
              ref={contentRef}
              role="menu"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              transition={{
                duration: 0.2,
                ease: [0, 0, 0.2, 1], // ease-out
              }}
              style={{
                marginTop: side === 'bottom' ? sideOffset : undefined,
                marginBottom: side === 'top' ? sideOffset : undefined,
                marginLeft: side === 'right' ? sideOffset : undefined,
                marginRight: side === 'left' ? sideOffset : undefined,
                minWidth: minWidth === 'trigger' ? triggerWidth : minWidth,
              } as React.CSSProperties}
              className={cn(
                'absolute z-50',
                'bg-surface-elevated-1 backdrop-blur-lg',
                'border border-glass-border',
                'rounded-lg shadow-lg',
                'py-1',
                'focus:outline-none',
                sideClass,
                alignmentClass,
                originClass,
                className
              )}
            >
              {children}
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    );
  }
);

DropdownContent.displayName = 'DropdownContent';

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether the item is selected
   */
  selected?: boolean;
  /**
   * Icon to display before label
   */
  icon?: React.ReactNode;
  /**
   * Shortcut text to display
   */
  shortcut?: string;
}

export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  (
    { className, selected, icon, shortcut, disabled, children, onClick, ...props },
    ref
  ) => {
    const { onOpenChange } = useDropdownContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onClick?.(event);
        onOpenChange(false);
      }
    };

    return (
      <button
        ref={ref}
        role="menuitem"
        type="button"
        disabled={disabled}
        className={cn(
          'relative flex w-full items-center gap-3 px-3 py-2 text-left',
          'text-body-sm text-text-primary',
          'transition-colors duration-fast',
          'hover:bg-glass-background hover:text-text-primary',
          'focus-visible:bg-glass-background focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          selected && 'text-primary-400',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {icon && (
          <span className="inline-flex shrink-0 text-text-secondary" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="flex-1">{children}</span>
        {selected && (
          <Check className="h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
        )}
        {shortcut && (
          <span
            className="ml-auto text-label-xs text-text-tertiary"
            aria-label={`Shortcut: ${shortcut}`}
          >
            {shortcut}
          </span>
        )}
      </button>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';

export interface DropdownSeparatorProps {
  /**
   * Additional className
   */
  className?: string;
}

export const DropdownSeparator = React.forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn('my-1 h-px bg-surface-border-soft', className)}
        {...props}
      />
    );
  }
);

DropdownSeparator.displayName = 'DropdownSeparator';

export interface DropdownLabelProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

export const DropdownLabel = React.forwardRef<HTMLDivElement, DropdownLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-3 py-2 text-label-xs font-medium text-text-tertiary uppercase tracking-wider',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownLabel.displayName = 'DropdownLabel';
