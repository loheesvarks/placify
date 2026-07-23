import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Portal } from './portal';

export interface PopoverProps {
  /**
   * Controls whether popover is open
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
   * Popover content
   */
  children: React.ReactNode;
  /**
   * Trigger element
   */
  trigger: React.ReactElement;
  /**
   * Side to position popover
   * @default 'bottom'
   */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Alignment relative to trigger
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Offset from trigger in pixels
   * @default 8
   */
  sideOffset?: number;
  /**
   * Close on click outside
   * @default true
   */
  closeOnClickOutside?: boolean;
  /**
   * Close on ESC key
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Additional className for content
   */
  className?: string;
}

/**
 * Popover component with click trigger
 * Supports outside click handling and ESC close
 * Portal-rendered with positioning
 */
export const Popover: React.FC<PopoverProps> = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
  trigger,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  closeOnClickOutside = true,
  closeOnEscape = true,
  className,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const triggerRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    let x = 0;
    let y = 0;

    // Calculate position based on side and alignment
    switch (side) {
      case 'top':
        y = rect.top - sideOffset;
        break;
      case 'bottom':
        y = rect.bottom + sideOffset;
        break;
      case 'left':
        x = rect.left - sideOffset;
        break;
      case 'right':
        x = rect.right + sideOffset;
        break;
    }

    // Apply alignment
    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          x = rect.left;
          break;
        case 'center':
          x = rect.left + rect.width / 2;
          break;
        case 'end':
          x = rect.right;
          break;
      }
    } else {
      switch (align) {
        case 'start':
          y = rect.top;
          break;
        case 'center':
          y = rect.top + rect.height / 2;
          break;
        case 'end':
          y = rect.bottom;
          break;
      }
    }

    setPosition({ x, y });
  }, [side, align, sideOffset]);

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnClickOutside, handleOpenChange]);

  // Close on ESC key
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleOpenChange(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, handleOpenChange]);

  // Update position when open or on scroll/resize
  React.useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isOpen, updatePosition]);

  const clonedTrigger = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      trigger.props.onClick?.(e);
      handleOpenChange(!isOpen);
    },
    'aria-expanded': isOpen,
    'aria-haspopup': 'dialog',
  });

  const transformOrigin = {
    top: 'origin-bottom',
    bottom: 'origin-top',
    left: 'origin-right',
    right: 'origin-left',
  }[side];

  const transformValue = (() => {
    const baseTransform = `translate(${position.x}px, ${position.y}px)`;

    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          return baseTransform;
        case 'center':
          return `${baseTransform} translateX(-50%)`;
        case 'end':
          return `${baseTransform} translateX(-100%)`;
      }
    } else {
      switch (align) {
        case 'start':
          return baseTransform;
        case 'center':
          return `${baseTransform} translateY(-50%)`;
        case 'end':
          return `${baseTransform} translateY(-100%)`;
      }
    }

    return baseTransform;
  })();

  return (
    <>
      {clonedTrigger}
      <Portal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={contentRef}
              role="dialog"
              aria-modal="false"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              transition={{
                duration: 0.2,
                ease: [0, 0, 0.2, 1], // ease-out
              }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                transform: transformValue,
                zIndex: 50,
              }}
              className={cn(transformOrigin)}
            >
              <div
                className={cn(
                  'bg-surface-elevated-1 backdrop-blur-lg',
                  'border border-glass-border',
                  'rounded-lg shadow-lg',
                  'focus:outline-none',
                  className
                )}
              >
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

Popover.displayName = 'Popover';

export interface PopoverHeaderProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

export const PopoverHeader: React.FC<PopoverHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('px-4 pt-4 pb-2 border-b border-surface-border-soft', className)}
      {...props}
    >
      {children}
    </div>
  );
};

PopoverHeader.displayName = 'PopoverHeader';

export interface PopoverBodyProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

export const PopoverBody: React.FC<PopoverBodyProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  );
};

PopoverBody.displayName = 'PopoverBody';

export interface PopoverFooterProps {
  /**
   * Additional className
   */
  className?: string;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

export const PopoverFooter: React.FC<PopoverFooterProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-4 py-3 border-t border-surface-border-soft flex items-center justify-end gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

PopoverFooter.displayName = 'PopoverFooter';
