import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface TabsProps {
  /**
   * Default active tab key (uncontrolled mode)
   */
  defaultValue?: string;
  /**
   * Active tab key (controlled mode)
   */
  value?: string;
  /**
   * Callback when active tab changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Tabs content
   */
  children: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Orientation of the tabs
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
}

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs');
  }
  return context;
};

/**
 * Tabs component with keyboard navigation and animated indicator
 * Supports both controlled and uncontrolled modes
 * WCAG 2.1 AA compliant
 */
export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
  orientation = 'horizontal',
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
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

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, orientation }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * ARIA label for the tab list
   */
  'aria-label': string;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, 'aria-label': ariaLabel, ...props }, ref) => {
    const { orientation } = useTabsContext();

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={cn(
          'relative inline-flex gap-1',
          orientation === 'horizontal'
            ? 'flex-row border-b border-surface-border'
            : 'flex-col border-r border-surface-border',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Unique value for this tab
   */
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value: tabValue, disabled, children, ...props }, ref) => {
    const { value, onValueChange, orientation } = useTabsContext();
    const isActive = value === tabValue;
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(ref, () => triggerRef.current!);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const tablist = triggerRef.current?.parentElement;
      if (!tablist) return;

      const triggers = Array.from(
        tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
      );
      const currentIndex = triggers.indexOf(triggerRef.current!);

      let nextIndex = currentIndex;

      if (orientation === 'horizontal') {
        if (event.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
          event.preventDefault();
        } else if (event.key === 'ArrowRight') {
          nextIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
          event.preventDefault();
        }
      } else {
        if (event.key === 'ArrowUp') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
          event.preventDefault();
        } else if (event.key === 'ArrowDown') {
          nextIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
          event.preventDefault();
        }
      }

      if (nextIndex !== currentIndex) {
        const nextTrigger = triggers[nextIndex];
        nextTrigger.focus();
        onValueChange(nextTrigger.getAttribute('data-value') || '');
      }
    };

    return (
      <button
        ref={triggerRef}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-controls={`tabpanel-${tabValue}`}
        data-value={tabValue}
        data-state={isActive ? 'active' : 'inactive'}
        disabled={disabled}
        tabIndex={isActive ? 0 : -1}
        className={cn(
          'relative inline-flex items-center justify-center whitespace-nowrap',
          'px-5 py-3 text-body-sm font-medium transition-colors duration-fast',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isActive
            ? 'text-primary-400'
            : 'text-text-secondary hover:text-text-primary hover:bg-glass-background',
          className
        )}
        onClick={() => !disabled && onValueChange(tabValue)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
        {isActive && (
          <motion.div
            layoutId="tab-indicator"
            className={cn(
              'absolute bg-primary-500',
              orientation === 'horizontal'
                ? 'bottom-0 left-0 right-0 h-0.5'
                : 'right-0 top-0 bottom-0 w-0.5'
            )}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
          />
        )}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value that corresponds to the TabsTrigger
   */
  value: string;
  /**
   * Force mount content (for animations)
   */
  forceMount?: boolean;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value: tabValue, forceMount, children }, ref) => {
    const { value } = useTabsContext();
    const isActive = value === tabValue;

    if (!isActive && !forceMount) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${tabValue}`}
        aria-labelledby={`tab-${tabValue}`}
        tabIndex={0}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
        transition={{
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1], // ease-smooth
        }}
        style={!isActive ? { display: 'none' } : undefined}
        className={cn(
          'mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          className
        )}
      >
        {children}
      </motion.div>
    );
  }
);

TabsContent.displayName = 'TabsContent';
