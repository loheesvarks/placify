import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Portal } from './portal';
import { Backdrop } from './backdrop';

// Context for passing IDs to title and description
const ModalContext = React.createContext<{
  titleId: string;
  descriptionId: string;
} | null>(null);

export interface ModalProps {
  /**
   * Controls whether modal is open
   */
  open?: boolean;
  /**
   * Callback when open state changes (for controlled mode)
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Default open state (for uncontrolled mode)
   */
  defaultOpen?: boolean;
  /**
   * Modal content
   */
  children: React.ReactNode;
  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Whether clicking outside closes the modal
   * @default true
   */
  closeOnClickOutside?: boolean;
  /**
   * Whether ESC key closes the modal
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Whether to show close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Additional className for modal container
   */
  className?: string;
  /**
   * Callback when modal closes
   */
  onClose?: () => void;
  /**
   * Prevent background scroll when modal is open
   * @default true
   */
  preventScroll?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[95vh]',
};

/**
 * Modal component with focus trap, backdrop blur, and animations
 * Supports both controlled and uncontrolled modes
 */
export const Modal: React.FC<ModalProps> = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  onClose,
  preventScroll = true,
}) => {
  // Handle controlled vs uncontrolled state
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  // Store previous focus element
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

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

  // Focus trap and focus restoration
  React.useEffect(() => {
    if (!isOpen) return;

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus modal after animation
    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      // Restore focus to previous element only if it's still in the DOM
      if (previousFocusRef.current && document.body.contains(previousFocusRef.current)) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

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

  // Focus trap
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
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

  return (
    <Portal>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <Backdrop show={isOpen} onClick={handleBackdropClick} />

            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
              onClick={(e) => {
                // Prevent clicks inside modal from closing it
                if (e.target === e.currentTarget && closeOnClickOutside) {
                  handleClose();
                }
              }}
            >
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 0.1, 0.25, 1], // ease-smooth
                }}
                className={cn(
                  'relative w-full',
                  'bg-glass-background backdrop-blur-md backdrop-saturate-glass',
                  'border border-glass-border',
                  'rounded-xl shadow-2xl',
                  'max-h-[90vh] overflow-hidden',
                  'focus:outline-none',
                  sizeClasses[size],
                  className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
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
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}

                <div className="overflow-y-auto max-h-[calc(90vh-2rem)]">
                  <ModalContext.Provider value={{ titleId, descriptionId }}>
                    {children}
                  </ModalContext.Provider>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
};

Modal.displayName = 'Modal';

// Sub-components for semantic structure
export const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
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

ModalHeader.displayName = 'ModalHeader';

export const ModalTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  const context = React.useContext(ModalContext);
  return (
    <h2
      id={context?.titleId}
      className={cn('text-h4 font-semibold text-text-primary pr-8', className)}
      {...props}
    >
      {children}
    </h2>
  );
};

ModalTitle.displayName = 'ModalTitle';

export const ModalDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  const context = React.useContext(ModalContext);
  return (
    <p
      id={context?.descriptionId}
      className={cn('mt-2 text-body-sm text-text-secondary', className)}
      {...props}
    >
      {children}
    </p>
  );
};

ModalDescription.displayName = 'ModalDescription';

export const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
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

ModalBody.displayName = 'ModalBody';

export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
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

ModalFooter.displayName = 'ModalFooter';
