/**
 * Fade Animation Variants
 * 
 * Opacity-based animations for content appearance and disappearance.
 * GPU-accelerated and accessible.
 * 
 * @module fade
 */

import { Variants } from 'framer-motion';
import { duration, easing } from './transition';

/**
 * Simple fade in/out variants
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={fadeVariants}
 *   initial="hidden"
 *   animate="visible"
 *   exit="hidden"
 * />
 * ```
 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Fade in with upward movement
 * Commonly used for content reveals and card appearances
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={fadeInUp}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Fade in with downward movement
 * Used for dropdowns and top-to-bottom reveals
 */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Fade in from left
 * Used for side panel reveals and left-to-right content
 */
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Fade in from right
 * Used for drawers and right-to-left content
 */
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Fade with scale (zoom in effect)
 * Premium feel for modal and card appearances
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={fadeInScale}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Fade with scale and blur
 * Elegant entrance for modals and important content
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={fadeInScaleBlur}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const fadeInScaleBlur: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
    },
  },
};

/**
 * Quick fade for micro-interactions
 * Used for tooltips, badges, and immediate feedback
 */
export const fadeFast: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
};

/**
 * Slow, dramatic fade
 * Used for achievement reveals and celebrations
 */
export const fadeSlow: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.slow,
      ease: easing.easeElegant,
    },
  },
};

/**
 * Fade out with scale down
 * Used for dismissing modals and removing items
 */
export const fadeOutScale: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
  },
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Cross-fade for content transitions
 * Smooth replacement of one element with another
 * 
 * @example
 * ```tsx
 * <AnimatePresence mode="wait">
 *   <motion.div
 *     key={currentPage}
 *     variants={crossFade}
 *     initial="hidden"
 *     animate="visible"
 *     exit="exit"
 *   />
 * </AnimatePresence>
 * ```
 */
export const crossFade: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeInOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};
