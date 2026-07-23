import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Portal } from './portal';

export interface TooltipProps {
  /**
   * Content to display in tooltip
   */
  content: React.ReactNode;
  /**
   * Element that triggers the tooltip
   */
  children: React.ReactElement;
  /**
   * Side to position tooltip
   * @default 'top'
   */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Alignment relative to trigger
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Delay before showing tooltip (ms)
   * @default 500
   */
  delayDuration?: number;
  /**
   * Whether tooltip is disabled
   */
  disabled?: boolean;
  /**
   * Additional className for tooltip content
   */
  className?: string;
}

/**
 * Tooltip component with hover and focus triggers
 * Supports multiple positioning options
 * Respects prefers-reduced-motion
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  delayDuration = 500,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const triggerRef = React.useRef<HTMLElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
      updatePosition();
    }, delayDuration);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
  };

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const offset = 8; // Distance from trigger
    let x = 0;
    let y = 0;

    // Calculate position based on side
    switch (side) {
      case 'top':
        x = rect.left + rect.width / 2;
        y = rect.top - offset;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2;
        y = rect.bottom + offset;
        break;
      case 'left':
        x = rect.left - offset;
        y = rect.top + rect.height / 2;
        break;
      case 'right':
        x = rect.right + offset;
        y = rect.top + rect.height / 2;
        break;
    }

    setPosition({ x, y });
  }, [side]);

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update position on scroll/resize
  React.useEffect(() => {
    if (!isOpen) return;

    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isOpen, updatePosition]);

  const trigger = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e);
      showTooltip();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e);
      hideTooltip();
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e);
      showTooltip();
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e);
      hideTooltip();
    },
    'aria-describedby': isOpen ? 'tooltip' : undefined,
  });

  const transformOrigin = {
    top: 'origin-bottom',
    bottom: 'origin-top',
    left: 'origin-right',
    right: 'origin-left',
  }[side];

  const translateY = {
    top: 5,
    bottom: -5,
    left: 0,
    right: 0,
  }[side];

  const translateX = {
    top: 0,
    bottom: 0,
    left: 5,
    right: -5,
  }[side];

  return (
    <>
      {trigger}
      <Portal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="tooltip"
              role="tooltip"
              initial={{
                opacity: 0,
                scale: 0.9,
                x: position.x,
                y: position.y,
                translateX: translateX,
                translateY: translateY,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: position.x,
                y: position.y,
                translateX: 0,
                translateY: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                duration: 0.15,
                ease: [0, 0, 0.2, 1], // ease-out
              }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: 9999,
              }}
              className={cn(transformOrigin)}
            >
              <div
                className={cn(
                  'max-w-xs px-3 py-2 text-body-xs text-white',
                  'bg-neutral-900 rounded-md shadow-lg',
                  'border border-neutral-700',
                  'pointer-events-none',
                  className
                )}
              >
                {content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

Tooltip.displayName = 'Tooltip';
