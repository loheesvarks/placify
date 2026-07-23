import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const cardVariants = cva(
  'rounded-lg bg-glass-background backdrop-blur-md backdrop-saturate-glass border border-glass-border transition-all duration-normal',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        elevated: 'bg-glass-background-light shadow-md backdrop-blur-lg',
        compact: 'shadow-none',
        feature:
          'bg-gradient-primary-soft border-primary-500/20 shadow-lg shadow-glow-md overflow-hidden relative',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hoverable: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        hoverable: true,
        className:
          'hover:bg-glass-background-hover hover:border-primary-500/30 hover:shadow-md hover:shadow-glow-sm hover:-translate-y-1 cursor-pointer',
      },
      {
        variant: 'elevated',
        hoverable: true,
        className:
          'hover:shadow-lg hover:shadow-glow-sm hover:-translate-y-1 cursor-pointer',
      },
      {
        variant: 'compact',
        hoverable: true,
        className:
          'hover:border-primary-500/30 hover:shadow-sm cursor-pointer',
      },
    ],
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hoverable: false,
    },
  }
);

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'>,
    VariantProps<typeof cardVariants> {
  /**
   * Whether the card should have hover animations
   */
  hoverable?: boolean;
  /**
   * Whether to use Framer Motion for animations
   * Note: When true, certain HTML event handlers (onDrag, onAnimationStart) are filtered to avoid conflicts
   */
  animated?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      hoverable = false,
      animated = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const cardClassName = cn(cardVariants({ variant, padding, hoverable }), className);

    const sharedProps = {
      className: cardClassName,
      onClick,
      role: onClick ? ('button' as const) : undefined,
      tabIndex: onClick ? 0 : undefined,
      onKeyDown: onClick
        ? (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }
        : undefined,
    };

    const content = (
      <>
        {variant === 'feature' && (
          <div
            className="absolute inset-x-0 top-0 h-0.5 bg-gradient-primary"
            aria-hidden="true"
          />
        )}
        {children}
      </>
    );

    if (animated) {
      // Filter out HTML event props that conflict with Framer Motion
      const {
        onDrag: _onDrag,
        onDragStart: _onDragStart,
        onDragEnd: _onDragEnd,
        onDragCapture: _onDragCapture,
        onDragStartCapture: _onDragStartCapture,
        onDragEndCapture: _onDragEndCapture,
        onAnimationStart: _onAnimationStart,
        onAnimationEnd: _onAnimationEnd,
        onAnimationIteration: _onAnimationIteration,
        onAnimationStartCapture: _onAnimationStartCapture,
        onAnimationEndCapture: _onAnimationEndCapture,
        onAnimationIterationCapture: _onAnimationIterationCapture,
        ...safeProps
      } = props;

      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          {...sharedProps}
          {...safeProps}
        >
          {content}
        </motion.div>
      );
    }

    return (
      <div ref={ref} {...sharedProps} {...props}>
        {content}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional actions to display on the right side
   */
  actions?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between gap-4 mb-4',
          className
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn('text-h5 font-semibold text-text-primary', className)}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-body-sm text-text-secondary', className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('', className)} {...props} />;
});

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-4 mt-6', className)}
      {...props}
    />
  );
});

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
