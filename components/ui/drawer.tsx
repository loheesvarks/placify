import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Portal } from './portal';
import { Backdrop } from './backdrop';

export interface DrawerProps {
  /**
   * Controls whether drawer is open
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Default open state (for uncontrolled mode)
   */
  defaultOpen?: boolean;
  /**
   * Drawer content
   */
  children: React.ReactNode;
  /**
   * Drawer position
   * @default 'right'
   */
  side?: 'left' | 'right' | 'bottom';
  /**
   * Whether clicking outside closes the drawer
   * @default true
   */
  closeOnClickOutside?: boolean;
  /**
   * Whether ESC key closes the drawer
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Whether to show close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Additional className for drawer container
   */
  className?: string;
  /**
   * Callback when drawer closes
   */
  onClose?: () => void;
  /**
   * Prevent background scroll when drawer is open
   * @default true
   */
  preventScroll?: boolean;
  /**
   * Drawer width (for left/right) or height (for bottom)
   * @default '400px' for left/right, '80vh' for bottom
   */
  size?: string;
}

const getMotionProps = (side: 'left' | 'right' | 'bottom') => {
  switch (side) {
    case 'left':
      return {
        initial: { x: '-100%' },
        animate: { x: 0 },
        exit: { x: '-100%' },
      };
    case 'right':
      return {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
      };
    case 'bottom':
      return {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
      };
  }
};

const getSideClasses = (side: 'left' | 'right' | 'bottom', size?: string) => {
  const baseClasses = 'fixed flex flex-col';
  
  switch (side) {
    case 'left':
      return cn(
        baseClasses,
        'left-0 top-0 bottom-0',
        size ? '' : 'w-full max-w-md sm:w-[400px]'
      );
    case 'right':
      return cn(
        baseClasses,
        'right-0 top-0 bottom-0',
        size ? '' : 'w-full max-w-md sm:w-[400px]'
      );
    case 'bottom':
      return cn(
        baseClasses,
        'left-0 right-0 bottom-0',
        size ? '' : 'h-[80vh] max-h-[80vh]'
      );
  }
};

/**
 * Drawer component for side panels and bottom sheets
 * Mobile-friendly with smooth slide animations
 */
export const Drawer: React.FC<DrawerProps> = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
  side = 'right',
  closeOnClickOutside = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  onClose,
  preventScroll = true,
  size,
}) => {
  // Handle controlled vs uncontrolled state
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const drawerRef = React.useRef<HTMLDivElement>(null);

  const handleClose = React.useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setUncontrolledOpen(false);
    }
    onClose?.();
  }, [isControlled, onOpenChange, onClose]);

  // Handle ESC key
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, handleClose]);

  // Prevent background scroll
  React.useEffect(() => {
    if (!isOpen || !preventScroll) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen, preventScroll]);

  // Focus drawer when opened
  React.useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      drawerRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Focus trap
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  const handleBackdropClick = () => {
    if (closeOnClickOutside) {
      handleClose();
    }
  };

  const motionProps = getMotionProps(side);
  const sideClasses = getSideClasses(side, size);

  return (
    <Portal>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <Backdrop show={isOpen} onClick={handleBackdropClick} opacity={0.5} />

            <motion.div
              ref={drawerRef}
              {...motionProps}
              transition={{
                duration: side === 'bottom' ? 0.3 : 0.35,
                ease: [0.25, 0.1, 0.25, 1], // ease-smooth
              }}
              className={cn(
                sideClasses,
                'z-[100]',
                'bg-surface-background',
                'border',
                side === 'left' && 'border-r border-surface-border',
                side === 'right' && 'border-l border-surface-border',
                side === 'bottom' && 'border-t border-surface-border rounded-t-2xl',
                'shadow-2xl',
                'focus:outline-none',
                className
              )}
              style={size ? (side === 'bottom' ? { height: size } : { width: size }) : undefined}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              onKeyDown={handleKeyDown}
            >
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className={cn(
                    'absolute top-4 right-4 z-10',
                    'rounded-md p-2',
                    'text-text-secondary hover:text-text-primary',
                    'hover:bg-glass-background-hover',
                    'transition-colors duration-fast',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                  )}
                  aria-label="Close drawer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              )}

              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
};

Drawer.displayName = 'Drawer';

// Sub-components for semantic structure
export const DrawerHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-6 pt-6 pb-4',
        'border-b border-surface-border-soft',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

DrawerHeader.displayName = 'DrawerHeader';

export const DrawerTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h2
      className={cn('text-h4 font-semibold text-text-primary pr-8', className)}
      {...props}
    >
      {children}
    </h2>
  );
};

DrawerTitle.displayName = 'DrawerTitle';

export const DrawerDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p
      className={cn('mt-2 text-body-sm text-text-secondary', className)}
      {...props}
    >
      {children}
    </p>
  );
};

DrawerDescription.displayName = 'DrawerDescription';

export const DrawerBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
};

DrawerBody.displayName = 'DrawerBody';

export const DrawerFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-6 py-4',
        'border-t border-surface-border-soft',
        'flex items-center justify-end gap-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

DrawerFooter.displayName = 'DrawerFooter';
