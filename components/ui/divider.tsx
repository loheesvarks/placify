import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Optional text to display in the center
   */
  text?: string;
  /**
   * Text alignment when text is present
   * @default 'center'
   */
  textAlign?: 'left' | 'center' | 'right';
  /**
   * Whether to add spacing around divider
   * @default true
   */
  spacing?: boolean;
}

/**
 * Divider component for visual separation
 * Supports horizontal and vertical orientations
 * Optional centered text
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = 'horizontal',
      text,
      textAlign = 'center',
      spacing = true,
      ...props
    },
    ref
  ) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn(
            'inline-block h-full w-px bg-surface-border-soft',
            spacing && 'mx-4',
            className
          )}
          {...props}
        />
      );
    }

    // Horizontal divider
    if (text) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn(
            'relative flex items-center',
            spacing && 'my-6',
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'h-px bg-surface-border-soft',
              textAlign === 'left' && 'w-12',
              textAlign === 'center' && 'flex-1',
              textAlign === 'right' && 'flex-1'
            )}
          />
          <span
            className={cn(
              'text-label-sm text-text-tertiary uppercase tracking-wider',
              textAlign === 'left' && 'ml-4 mr-auto',
              textAlign === 'center' && 'mx-4',
              textAlign === 'right' && 'mr-4 ml-auto'
            )}
          >
            {text}
          </span>
          <div
            className={cn(
              'h-px bg-surface-border-soft',
              textAlign === 'left' && 'flex-1',
              textAlign === 'center' && 'flex-1',
              textAlign === 'right' && 'w-12'
            )}
          />
        </div>
      );
    }

    return (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        role="separator"
        aria-orientation="horizontal"
        className={cn(
          'border-0 h-px bg-surface-border-soft',
          spacing && 'my-6',
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
