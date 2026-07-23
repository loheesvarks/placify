/**
 * Slide Animation Variants
 * 
 * Transform-based sliding animations for panels, drawers, and page transitions.
 * Uses translateX/Y for GPU-accelerated performance.
 * 
 * @module slide
 */

import { Variants } from 'framer-motion';
import { duration, easing } from './transition';

/**
 * Slide in from right (common for drawers)
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={slideInRight}
 *   initial="hidden"
 *   animate="visible"
 *   exit="hidden"
 * />
 * ```
 */
export const slideInRight: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
    },
  },
};

/**
 * Slide in from left (common for sidebars)
 */
export const slideInLeft: Variants = {
  hidden: {
    x: '-100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
    },
  },
};

/**
 * Slide in from top (common for notifications)
 */
export const slideInTop: Variants = {
  hidden: {
    y: '-100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: duration.moderate,
      ease: easing.easeOut,
    },
  },
};

/**
 * Slide in from bottom (common for sheets)
 */
export const slideInBottom: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: duration.moderate,
      ease: easing.easeOut,
    },
  },
};

/**
 * Slide with fade (smoother appearance)
 * Combines translation with opacity for elegant transitions
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={slideInRightFade}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const slideInRightFade: Variants = {
  hidden: {
    x: 30,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Slide in from left with fade
 */
export const slideInLeftFade: Variants = {
  hidden: {
    x: -30,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Slide up with fade (common for page content)
 */
export const slideInUpFade: Variants = {
  hidden: {
    y: 20,
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
};

/**
 * Slide down with fade (common for dropdowns)
 */
export const slideInDownFade: Variants = {
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
};

/**
 * Slide out to right (exit animation)
 */
export const slideOutRight: Variants = {
  visible: {
    x: 0,
    opacity: 1,
  },
  hidden: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Slide out to left (exit animation)
 */
export const slideOutLeft: Variants = {
  visible: {
    x: 0,
    opacity: 1,
  },
  hidden: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Smooth page slide transition (right to left)
 * Used for forward navigation
 * 
 * @example
 * ```tsx
 * <AnimatePresence mode="wait">
 *   <motion.div
 *     key={route}
 *     variants={pageSlideLeft}
 *     initial="hidden"
 *     animate="visible"
 *     exit="exit"
 *   />
 * </AnimatePresence>
 * ```
 */
export const pageSlideLeft: Variants = {
  hidden: {
    x: 30,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeElegant,
      delay: 0.1,
    },
  },
  exit: {
    x: -30,
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Smooth page slide transition (left to right)
 * Used for backward navigation
 */
export const pageSlideRight: Variants = {
  hidden: {
    x: -30,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeElegant,
      delay: 0.05,
    },
  },
  exit: {
    x: 30,
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Elastic slide with spring physics
 * Playful, natural-feeling motion for interactive elements
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={slideInRightElastic}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const slideInRightElastic: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  },
};

/**
 * Quick slide for micro-interactions
 * Fast, snappy feel for small UI elements
 */
export const slideInQuick: Variants = {
  hidden: {
    x: 10,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.fast,
      ease: easing.easeSnappy,
    },
  },
};
