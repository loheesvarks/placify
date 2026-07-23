import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Portal } from './portal';
import { useToast, type Toast, type ToastVariant } from '@/lib/hooks/use-toast';

const variantConfig: Record<
  ToastVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    className: string;
    progressClassName: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    className: 'bg-success-500/10 border-success-500/20 text-success-400',
    progressClassName: 'bg-success-500',
  },
  error: {
    icon: XCircle,
    className: 'bg-error-500/10 border-error-500/20 text-error-400',
    progressClassName: 'bg-error-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-warning-500/10 border-warning-500/20 text-warning-400',
    progressClassName: 'bg-warning-500',
  },
  info: {
    icon: Info,
    className: 'bg-info-500/10 border-info-500/20 text-info-400',
    progressClassName: 'bg-info-500',
  },
  loading: {
    icon: Loader2,
    className: 'bg-primary-500/10 border-primary-500/20 text-primary-400',
    progressClassName: 'bg-primary-500',
  },
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [progress, setProgress] = React.useState(100);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = React.useRef<number>(Date.now());
  const remainingTimeRef = React.useRef<number>(toast.duration || 0);

  const config = variantConfig[toast.variant];
  const Icon = config.icon;

  const startTimer = React.useCallback(() => {
    if (!toast.duration || toast.duration === 0) return;

    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, remainingTimeRef.current - elapsed);
      const newProgress = (remaining / (toast.duration || 1)) * 100;

      setProgress(newProgress);

      if (remaining === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        onRemove(toast.id);
      }
    }, 16); // ~60fps
  }, [toast.duration, toast.id, onRemove]);

  const pauseTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }
  }, []);

  React.useEffect(() => {
    if (!toast.duration || toast.duration === 0) return;

    remainingTimeRef.current = toast.duration;
    startTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [toast.duration, startTimer]);

  const handleMouseEnter = () => {
    pauseTimer();
  };

  const handleMouseLeave = () => {
    startTimer();
  };

  const handleDismiss = () => {
    onRemove(toast.id);
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: '100%', opacity: 0, scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.5,
      }}
      layout
      className={cn(
        'relative flex w-full items-start gap-3 overflow-hidden',
        'rounded-lg border backdrop-blur-md',
        'px-4 py-3',
        'shadow-lg',
        'pointer-events-auto',
        config.className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live={toast.variant === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon
          className={cn(
            'h-5 w-5',
            toast.variant === 'loading' && 'animate-spin'
          )}
          aria-hidden="true"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-medium text-text-primary">
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-1 text-body-xs text-text-secondary">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-body-xs font-medium hover:underline focus:outline-none focus:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className={cn(
          'flex-shrink-0 rounded p-1',
          'text-text-secondary hover:text-text-primary',
          'hover:bg-glass-background-hover',
          'transition-colors duration-fast',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
        )}
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      {toast.duration && toast.duration > 0 && (
        <motion.div
          className={cn(
            'absolute bottom-0 left-0 h-1',
            config.progressClassName
          )}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

export interface ToastContainerProps {
  /**
   * Position of toast container
   * @default 'top-right'
   */
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}

const positionClasses = {
  'top-left': 'top-0 left-0 sm:top-6 sm:left-6',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 sm:top-6',
  'top-right': 'top-0 right-0 sm:top-6 sm:right-6',
  'bottom-left': 'bottom-0 left-0 sm:bottom-6 sm:left-6',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 sm:bottom-6',
  'bottom-right': 'bottom-0 right-0 sm:bottom-6 sm:right-6',
};

/**
 * Toast container component that renders all active toasts
 * Must be rendered once in your app, typically in a layout
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
}) => {
  const { toasts, dismiss } = useToast();

  const handleRemove = React.useCallback(
    (id: string) => {
      dismiss(id);
      // Remove after exit animation completes
      setTimeout(() => {
        // Final cleanup handled by reducer
      }, 300);
    },
    [dismiss]
  );

  return (
    <Portal>
      <div
        className={cn(
          'fixed z-[999] flex flex-col gap-2',
          'w-full max-w-md p-4 sm:p-0',
          'pointer-events-none',
          positionClasses[position]
        )}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={handleRemove} />
          ))}
        </AnimatePresence>
      </div>
    </Portal>
  );
};

ToastContainer.displayName = 'ToastContainer';

// Export provider for convenience
export { ToastProvider } from '@/lib/hooks/use-toast';
