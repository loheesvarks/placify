import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from './button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon to display
   */
  icon?: React.ReactNode;
  /**
   * Title text
   */
  title: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Action button configuration
   */
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  /**
   * Secondary action button
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: {
    container: 'min-h-[200px] py-8 px-4',
    icon: 'h-12 w-12 mb-4',
    title: 'text-h6',
    description: 'text-body-sm max-w-xs',
  },
  md: {
    container: 'min-h-[400px] py-16 px-8',
    icon: 'h-16 w-16 mb-6',
    title: 'text-h4',
    description: 'text-body-md max-w-md',
  },
  lg: {
    container: 'min-h-[500px] py-20 px-12',
    icon: 'h-20 w-20 mb-8',
    title: 'text-h3',
    description: 'text-body-lg max-w-lg',
  },
};

/**
 * Empty state component for displaying no data scenarios
 * Supports icon, title, description, and action buttons
 * Multiple size variants available
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon,
      title,
      description,
      action,
      secondaryAction,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          config.container,
          className
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        {icon && (
          <div
            className={cn(
              'inline-flex items-center justify-center text-text-tertiary opacity-60',
              config.icon
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        <h3
          className={cn(
            'font-semibold text-text-primary mb-3',
            config.title
          )}
        >
          {title}
        </h3>

        {description && (
          <p
            className={cn(
              'text-text-secondary leading-relaxed mb-8',
              config.description
            )}
          >
            {description}
          </p>
        )}

        {(action || secondaryAction) && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {action && (
              <Button
                onClick={action.onClick}
                leftIcon={action.icon}
                size={size === 'sm' ? 'sm' : 'md'}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant="secondary"
                size={size === 'sm' ? 'sm' : 'md'}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
