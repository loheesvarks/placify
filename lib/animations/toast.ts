/**
 * Toast Animation Variants
 * 
 * Notification toast animations for success, error, warning, and info messages.
 * Supports stacking and automatic dismissal.
 * 
 * @module toast
 */

import { Variants } from 'framer-motion';
import { duration, easing, spring } from './transition';

/**
 * Toast slide in from top
 * Standard notification entrance
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={toastSlideTop}
 *   initial="hidden"
 *   animate="visible"
 *   exit="exit"
 * />
 * ```
 */
export const toastSlideTop: Variants = {
  hidden: {
    y: '-100%',
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      ...spring.responsive,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Toast slide in from bottom
 * Bottom-positioned notifications
 */
export const toastSlideBottom: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      ...spring.responsive,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Toast slide in from right
 * Side-positioned notifications
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={toastSlideRight}
 *   initial="hidden"
 *   animate="visible"
 *   exit="exit"
 * />
 * ```
 */
export const toastSlideRight: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      ...spring.responsive,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Toast fade and scale
 * Subtle appearance for less critical notifications
 */
export const toastFadeScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

/**
 * Toast progress bar animation
 * Auto-dismiss countdown indicator
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={toastProgress}
 *   initial="full"
 *   animate="empty"
 *   custom={duration}
 * />
 * ```
 */
export const toastProgress: Variants = {
  full: {
    width: '100%',
  },
  empty: (duration: number) => ({
    width: '0%',
    transition: {
      duration: duration / 1000, // Convert ms to seconds
      ease: 'linear',
    },
  }),
};

/**
 * Toast stack shuffle
 * Reposition toasts when one is removed
 * 
 * @example
 * ```tsx
 * <motion.div
 *   layout
 *   transition={toastStackTransition}
 * />
 * ```
 */
export const toastStackTransition = {
  duration: duration.normal,
  ease: easing.easeSmooth,
};

/**
 * Success toast with bounce
 * Celebratory success notification
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={toastSuccess}
 *   initial="hidden"
 *   animate="visible"
 *   exit="exit"
 * />
 * ```
 */
export const toastSuccess: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      ...spring.bouncy,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Error toast with shake
 * Attention-grabbing error notification
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={toastError}
 *   initial="hidden"
 *   animate="visible"
 *   exit="exit"
 * />
 * ```
 */
export const toastError: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    x: [0, -4, 4, -4, 4, 0],
    transition: {
      duration: duration.comfortable,
      ease: easing.easeOut,
      x: {
        duration: 0.4,
        ease: easing.easeInOut,
      },
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Warning toast
 * Standard warning notification
 */
export const toastWarning: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Info toast
 * Standard informational notification
 */
export const toastInfo: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Toast with glow
 * Premium notification with glow effect
 */
export const toastGlow: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
    scale: 0.95,
    boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    scale: 0.9,
    boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};
