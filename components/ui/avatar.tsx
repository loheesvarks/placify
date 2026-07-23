import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-primary text-white font-medium',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-label-sm',
        md: 'h-10 w-10 text-label-md',
        lg: 'h-12 w-12 text-label-lg',
        xl: 'h-16 w-16 text-h6',
        '2xl': 'h-20 w-20 text-h5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /**
   * Image URL for the avatar
   */
  src?: string | null;
  /**
   * Alt text for the image
   */
  alt?: string;
  /**
   * Fallback text (usually initials) when image is not available
   */
  fallback?: string;
  /**
   * Whether to show an online/offline indicator
   */
  status?: 'online' | 'offline' | 'away' | 'busy' | null;
  /**
   * Custom status indicator color
   */
  statusColor?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size,
      src,
      alt,
      fallback,
      status,
      statusColor,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);

    // Reset error state when src changes
    React.useEffect(() => {
      setImageError(false);
      setImageLoaded(false);
    }, [src]);

    // Generate initials from fallback text
    const getInitials = (text: string | undefined): string => {
      if (!text) return '';
      const words = text.trim().split(/\s+/);
      if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
      }
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    const initials = getInitials(fallback);
    const showImage = src && !imageError;
    const showInitials = !showImage && initials;
    const showIcon = !showImage && !initials;

    // Determine icon size based on avatar size
    const iconSize = {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
      '2xl': 40,
    }[size || 'md'];

    // Status indicator size based on avatar size
    const statusSize = {
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
      '2xl': 'h-5 w-5',
    }[size || 'md'];

    // Status indicator position based on avatar size
    const statusPosition = {
      sm: 'bottom-0 right-0',
      md: 'bottom-0 right-0',
      lg: 'bottom-0.5 right-0.5',
      xl: 'bottom-1 right-1',
      '2xl': 'bottom-1 right-1',
    }[size || 'md'];

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        role="img"
        aria-label={alt || fallback || 'Avatar'}
        {...props}
      >
        {showImage && (
          <>
            <Image
              src={src!}
              alt={alt || fallback || 'Avatar'}
              fill
              className={cn(
                'object-cover',
                !imageLoaded && 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100px, (max-width: 1200px) 80px, 80px"
            />
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
            )}
          </>
        )}

        {showInitials && (
          <span className="select-none" aria-hidden="true">
            {initials}
          </span>
        )}

        {showIcon && (
          <User
            className="text-white/80"
            size={iconSize}
            aria-hidden="true"
          />
        )}

        {/* Status indicator */}
        {status && (
          <span
            className={cn(
              'absolute rounded-full border-2 border-surface-background',
              statusSize,
              statusPosition,
              !statusColor && status === 'online' && 'bg-success-500',
              !statusColor && status === 'offline' && 'bg-neutral-500',
              !statusColor && status === 'away' && 'bg-warning-500',
              !statusColor && status === 'busy' && 'bg-error-500'
            )}
            style={statusColor ? { backgroundColor: statusColor } : undefined}
            aria-label={`Status: ${status}`}
            role="status"
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar Group - For displaying multiple avatars
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum number of avatars to display before showing count
   */
  max?: number;
  /**
   * Size of the avatars
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Array of avatar data
   */
  avatars?: Array<{
    src?: string | null;
    alt?: string;
    fallback?: string;
  }>;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 5, size = 'md', avatars = [], children, ...props }, ref) => {
    const displayAvatars = avatars.slice(0, max);
    const remainingCount = Math.max(0, avatars.length - max);

    // Overlap offset based on size
    const overlapOffset = {
      sm: '-ml-2',
      md: '-ml-2.5',
      lg: '-ml-3',
      xl: '-ml-4',
      '2xl': '-ml-5',
    }[size];

    return (
      <div
        ref={ref}
        className={cn('flex items-center', className)}
        role="group"
        aria-label="Avatar group"
        {...props}
      >
        {displayAvatars.map((avatar, index) => (
          <div
            key={index}
            className={cn(
              'ring-2 ring-surface-background rounded-full',
              index > 0 && overlapOffset
            )}
            style={{ zIndex: displayAvatars.length - index }}
          >
            <Avatar
              size={size}
              src={avatar.src}
              alt={avatar.alt}
              fallback={avatar.fallback}
            />
          </div>
        ))}

        {remainingCount > 0 && (
          <div
            className={cn(
              avatarVariants({ size }),
              overlapOffset,
              'bg-neutral-800 ring-2 ring-surface-background'
            )}
            style={{ zIndex: 0 }}
            aria-label={`${remainingCount} more`}
          >
            <span className="text-text-secondary">+{remainingCount}</span>
          </div>
        )}

        {children}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup, avatarVariants };
