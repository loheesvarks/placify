/**
 * Page Transition Variants
 * 
 * Full-page navigation animations for route changes and major section transitions.
 * Optimized for performance and user experience.
 * 
 * @module page
 */

import { Variants } from 'framer-motion';
import { duration, easing, spring } from './transition';

/**
 * Standard page transition
 * Navigate between dashboard pages with fade and slide
 * 
 * @example
 * ```tsx
 * <AnimatePresence mode="wait">
 *   <motion.div
 *     key={route}
 *     variants={pageTransition}
 *     initial="initial"
 *     animate="animate"
 *     exit="exit"
 *   />
 * </AnimatePresence>
 * ```
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: duration.comfortable,
      ease: easing.easeElegant,
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0.4,
    y: -10,
    scale: 0.98,
    filter: 'blur(4px)',
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Deep navigation transition
 * Navigate to child/detail page with directional motion
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={pageDeepNav}
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 * />
 * ```
 */
export const pageDeepNav: Variants = {
  initial: {
    opacity: 0,
    x: 30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeSmooth,
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(8px)',
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

/**
 * Back navigation transition
 * Return to previous page with reverse motion
 */
export const pageBackNav: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeSnappy,
      delay: 0.05,
    },
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Dashboard to roadmap transition
 * Special transition for major feature navigation
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={pageDashboardToRoadmap}
 *   initial="initial"
 *   animate="animate"
 * />
 * ```
 */
export const pageDashboardToRoadmap: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easing.easeElegant,
      delay: 0.15,
      ...spring.gentle,
    },
  },
};

/**
 * Settings page slide in
 * Slide from right for settings/options
 */
export const pageSlideFromRight: Variants = {
  initial: {
    x: '100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeSmooth,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: duration.moderate,
      ease: easing.easeIn,
    },
  },
};

/**
 * Login to dashboard transition
 * Celebratory first-time login transition
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={pageLoginToDashboard}
 *   initial="initial"
 *   animate="animate"
 * />
 * ```
 */
export const pageLoginToDashboard: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeElegant,
      delay: 0.3, // Wait for success animation
    },
  },
};

/**
 * Fast page transition
 * Quick transitions for frequently accessed pages
 */
export const pageFast: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.immediate,
      ease: easing.easeIn,
    },
  },
};

/**
 * Fade through page transition
 * Smooth cross-fade between pages
 * 
 * @example
 * ```tsx
 * <AnimatePresence mode="wait">
 *   <motion.div
 *     key={route}
 *     variants={pageFadeThrough}
 *     initial="initial"
 *     animate="animate"
 *     exit="exit"
 *   />
 * </AnimatePresence>
 * ```
 */
export const pageFadeThrough: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeInOut,
      delay: 0.15,
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

/**
 * Scale page transition
 * Zoom effect for emphasis
 */
export const pageScale: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: duration.comfortable,
      ease: easing.easeElegant,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    filter: 'blur(10px)',
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};
