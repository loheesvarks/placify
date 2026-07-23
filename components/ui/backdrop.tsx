import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface BackdropProps {
  /**
   * Whether the backdrop is visible
   */
  show: boolean;
  /**
   * Click handler for backdrop clicks
   */
  onClick?: () => void;
  /**
   * Additional className for styling
   */
  className?: string;
  /**
   * Blur amount in pixels
   * @default 20
   */
  blur?: number;
  /**
   * Background opacity
   * @default 0.5
   */
  opacity?: number;
  /**
   * Z-index for stacking
   * @default 90
   */
  zIndex?: number;
  /**
   * Children to render (optional, for custom backdrop content)
   */
  children?: React.ReactNode;
}

/**
 * Backdrop component for overlays with blur and fade animation
 * Supports click outside to close functionality
 */
export const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  (
    {
      show,
      onClick,
      className,
      blur = 20,
      opacity = 0.5,
      zIndex = 90,
      children,
    },
    ref
  ) => {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{
              opacity: 1,
              backdropFilter: `blur(${blur}px)`,
            }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={onClick}
            className={cn(
              'fixed inset-0',
              'bg-black',
              className
            )}
            style={{
              zIndex,
              backgroundColor: `rgba(0, 0, 0, ${opacity})`,
            }}
            aria-hidden="true"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Backdrop.displayName = 'Backdrop';
