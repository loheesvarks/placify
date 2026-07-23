/**
 * Scale Animation Variants
 * 
 * Transform-based scaling animations for emphasis and interactive feedback.
 * GPU-accelerated with proper transform-origin handling.
 * 
 * @module scale
 */

import { Variants } from 'framer-motion';
import { duration, easing, spring } from './transition';

/**
 * Basic scale variants
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={scaleVariants}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const scaleVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Scale from center with smooth easing
 * Used for modals, dialogs, and centered content
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={scaleIn}
 *   initial="hidden"
 *   animate="visible"
 *   style={{ transformOrigin: 'center' }}
 * />
 * ```
 */
export const scaleIn: Variants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Scale out animation
 * Used for dismissing elements
 */
export const scaleOut: Variants = {
  visible: {
    scale: 1,
    opacity: 1,
  },
  hidden: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

/**
 * Bouncy scale entrance
 * Playful, attention-grabbing animation
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={scaleInBounce}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const scaleInBounce: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      ...spring.bouncy,
    },
  },
};

/**
 * Scale with rotation
 * Dynamic, eye-catching entrance
 */
export const scaleInRotate: Variants = {
  hidden: {
    scale: 0,
    rotate: -180,
    opacity: 0,
  },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      duration: duration.moderate,
      ease: easing.easeBounce,
    },
  },
};

/**
 * Pulse scale animation
 * Subtle emphasis for notifications and badges
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={scalePulse}
 *   initial="normal"
 *   animate="pulse"
 * />
 * ```
 */
export const scalePulse: Variants = {
  normal: {
    scale: 1,
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      ease: easing.easeInOut,
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

/**
 * Scale hover effect
 * Interactive feedback for clickable elements
 */
export const scaleHover: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: duration.immediate,
      ease: easing.easeOut,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: duration.immediate,
      ease: easing.easeOut,
    },
  },
};

/**
 * Scale from top
 * Dropdown menu style animation
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={scaleFromTop}
 *   initial="hidden"
 *   animate="visible"
 *   style={{ transformOrigin: 'top' }}
 * />
 * ```
 */
export const scaleFromTop: Variants = {
  hidden: {
    scaleY: 0,
    opacity: 0,
  },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Scale from bottom
 * Slide-up sheet style animation
 */
export const scaleFromBottom: Variants = {
  hidden: {
    scaleY: 0,
    opacity: 0,
  },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Elastic scale with spring physics
 * Natural, physics-based scaling
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={scaleElastic}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const scaleElastic: Variants = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
    transition: {
      ...spring.elastic,
    },
  },
};

/**
 * Scale with fade and blur
 * Premium modal entrance
 */
export const scaleInBlur: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
    },
  },
};

/**
 * Scale and rotate success animation
 * Checkmark or success indicator animation
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={scaleSuccess}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const scaleSuccess: Variants = {
  hidden: {
    scale: 0,
    rotate: -90,
    opacity: 0,
  },
  visible: {
    scale: [0, 1.2, 1],
    rotate: 0,
    opacity: 1,
    transition: {
      duration: duration.moderate,
      ease: easing.easeBounce,
      times: [0, 0.6, 1],
    },
  },
};
