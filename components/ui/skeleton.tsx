import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const skeletonVariants = cva(
  'relative overflow-hidden bg-neutral-800 rounded',
  {
    variants: {
      variant: {
        default: 'animate-pulse',
        shimmer: 'animate-pulse after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent',
      },
      shape: {
        rectangle: '',
        circle: 'rounded-full',
        text: 'rounded',
      },
    },
    defaultVariants: {
      variant: 'shimmer',
      shape: 'rectangle',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /**
   * Width of the skeleton (can be any valid CSS width value)
   */
  width?: string | number;
  /**
   * Height of the skeleton (can be any valid CSS height value)
   */
  height?: string | number;
  /**
   * Whether the skeleton should be visible to screen readers
   */
  srOnly?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant,
      shape,
      width,
      height,
      srOnly = false,
      style,
      ...props
    },
    ref
  ) => {
    const inlineStyles: React.CSSProperties = {
      ...style,
      ...(width !== undefined && {
        width: typeof width === 'number' ? `${width}px` : width,
      }),
      ...(height !== undefined && {
        height: typeof height === 'number' ? `${height}px` : height,
      }),
    };

    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, shape }), className)}
        style={inlineStyles}
        role="status"
        aria-live="polite"
        aria-busy="true"
        {...props}
      >
        {srOnly && <span className="sr-only">Loading...</span>}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Preset skeleton components for common use cases
export interface SkeletonTextProps extends Omit<SkeletonProps, 'shape'> {
  /**
   * Number of lines to render
   */
  lines?: number;
  /**
   * Gap between lines
   */
  gap?: string;
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, gap = '0.5rem', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col', className)}
        style={{ gap }}
        role="status"
        aria-label="Loading text"
      >
        {Array.from({ length: lines }).map((_, index) => {
          // Last line is typically shorter
          const isLast = index === lines - 1;
          const width = isLast ? '60%' : '100%';

          return (
            <Skeleton
              key={index}
              shape="text"
              height={16}
              width={width}
              variant="shimmer"
              {...props}
            />
          );
        })}
      </div>
    );
  }
);

SkeletonText.displayName = 'SkeletonText';

export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'shape'> {
  /**
   * Size of the avatar skeleton
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ size = 'md', className, ...props }, ref) => {
    const sizeMap = {
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
      '2xl': 80,
    };

    const dimension = sizeMap[size];

    return (
      <Skeleton
        ref={ref}
        shape="circle"
        width={dimension}
        height={dimension}
        variant="shimmer"
        className={className}
        aria-label="Loading avatar"
        {...props}
      />
    );
  }
);

SkeletonAvatar.displayName = 'SkeletonAvatar';

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to include an avatar in the skeleton
   */
  avatar?: boolean;
  /**
   * Number of text lines to show
   */
  lines?: number;
  /**
   * Whether to include an image/thumbnail
   */
  image?: boolean;
  /**
   * Height of the image skeleton
   */
  imageHeight?: number;
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  (
    {
      avatar = false,
      lines = 3,
      image = false,
      imageHeight = 200,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-glass-border bg-glass-background p-6',
          className
        )}
        role="status"
        aria-label="Loading card"
        {...props}
      >
        {/* Image skeleton */}
        {image && (
          <Skeleton
            variant="shimmer"
            height={imageHeight}
            className="mb-4 w-full"
          />
        )}

        {/* Header with optional avatar */}
        {avatar && (
          <div className="mb-4 flex items-center gap-3">
            <SkeletonAvatar size="md" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="shimmer" height={16} width="40%" />
              <Skeleton variant="shimmer" height={12} width="30%" />
            </div>
          </div>
        )}

        {/* Title */}
        {!avatar && <Skeleton variant="shimmer" height={24} width="60%" className="mb-4" />}

        {/* Content lines */}
        <SkeletonText lines={lines} />

        {/* Optional footer actions */}
        <div className="mt-6 flex gap-3">
          <Skeleton variant="shimmer" height={36} width={100} />
          <Skeleton variant="shimmer" height={36} width={100} />
        </div>
      </div>
    );
  }
);

SkeletonCard.displayName = 'SkeletonCard';

export interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of rows to show
   */
  rows?: number;
  /**
   * Number of columns to show
   */
  columns?: number;
  /**
   * Whether to show a header row
   */
  header?: boolean;
}

const SkeletonTable = React.forwardRef<HTMLDivElement, SkeletonTableProps>(
  ({ rows = 5, columns = 4, header = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full space-y-3', className)}
        role="status"
        aria-label="Loading table"
        {...props}
      >
        {/* Header row */}
        {header && (
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton
                key={`header-${index}`}
                variant="shimmer"
                height={20}
                className="flex-1"
              />
            ))}
          </div>
        )}

        {/* Data rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                variant="shimmer"
                height={16}
                className="flex-1"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
);

SkeletonTable.displayName = 'SkeletonTable';

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
  skeletonVariants,
};
