import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface VisuallyHiddenProps {
  /**
   * Content to hide visually but keep accessible to screen readers
   */
  children: React.ReactNode;
  /**
   * HTML element to render
   * @default 'span'
   */
  as?: 'span' | 'div';
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * VisuallyHidden component
 * 
 * Hides content visually while keeping it accessible to screen readers.
 * Follows WCAG 2.1 best practices for screen reader-only content.
 * 
 * Use cases:
 * - Descriptive text for icon-only buttons
 * - Additional context for complex interactions
 * - Skip navigation links
 * - Form field descriptions
 * 
 * @example
 * <button>
 *   <SearchIcon />
 *   <VisuallyHidden>Search</VisuallyHidden>
 * </button>
 */
export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  className,
  children,
  as: Component = 'span',
}) => {
  return (
    <Component
      className={cn(
          // Position content off-screen
          'absolute',
          // Make it take no space
          'w-px h-px p-0 m-[-1px]',
          // Hide it visually
          'overflow-hidden',
          // Prevent wrapping issues
          'whitespace-nowrap',
          // Clip to prevent painting
          'border-0',
          // Additional classNames
          className
        )}
    >
      {children}
    </Component>
  );
};
