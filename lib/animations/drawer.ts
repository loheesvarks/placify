/**
 * Drawer Animation Variants
 * 
 * Slide-in panel animations for side drawers and navigation panels.
 * Optimized for mobile and desktop drawer patterns.
 * 
 * @module drawer
 */

import { Variants } from 'framer-motion';
import { duration, easing, spring, stagger } from './transition';

/**
 * Drawer slide from right
 * Standard drawer entrance from right side
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={drawerRight}
 *   initial="closed"
 *   animate="open"
 *   exit="closed"
 * />
 * ```
 */
export const drawerRight: Variants = {
  closed: {
    x: '100%',
    opacity: 0,
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      ...spring.responsive,
    },
  },
};

/**
 * Drawer slide from left
 * Navigation panel from left side
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={drawerLeft}
 *   initial="closed"
 *   animate="open"
 *   exit="closed"
 * />
 * ```
 */
export const drawerLeft: Variants = {
  closed: {
    x: '-100%',
    opacity: 0,
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
    },
  },
};

/**
 * Drawer slide from top
 * Top notification drawer or search panel
 */
export const drawerTop: Variants = {
  closed: {
    y: '-100%',
    opacity: 0,
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
    },
  },
};

/**
 * Drawer slide from bottom
 * Mobile sheet or bottom action panel
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={drawerBottom}
 *   initial="closed"
 *   animate="open"
 *   exit="closed"
 * />
 * ```
 */
export const drawerBottom: Variants = {
  closed: {
    y: '100%',
    opacity: 0,
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      ...spring.responsive,
    },
  },
};

/**
 * Drawer backdrop animation
 * Background overlay for drawer
 */
export const drawerBackdrop: Variants = {
  closed: {
    opacity: 0,
  },
  open: {
    opacity: 0.5,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Drawer content stagger
 * Sequential reveal of drawer items
 * 
 * @example
 * ```tsx
 * <motion.div variants={drawerContainer}>
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={drawerItem}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const drawerContainer: Variants = {
  closed: {},
  open: {
    transition: {
      staggerChildren: stagger.xs,
      delayChildren: 0.1,
    },
  },
};

export const drawerItem: Variants = {
  closed: {
    opacity: 0,
    y: 10,
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Settings drawer with fade
 * Elegant settings panel animation
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={drawerSettings}
 *   initial="closed"
 *   animate="open"
 *   exit="closed"
 * />
 * ```
 */
export const drawerSettings: Variants = {
  closed: {
    x: '100%',
    opacity: 0,
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeSmooth,
    },
  },
};

/**
 * Mobile menu drawer
 * Full-screen mobile navigation
 */
export const drawerMobile: Variants = {
  closed: {
    x: '-100%',
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
  open: {
    x: 0,
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
    },
  },
};

/**
 * Filter drawer
 * Quick slide-in for filters and options
 */
export const drawerFilter: Variants = {
  closed: {
    x: '100%',
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.5,
    },
  },
};

/**
 * Notification drawer
 * Slide down from top for notifications
 */
export const drawerNotification: Variants = {
  closed: {
    y: '-100%',
    opacity: 0,
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: duration.moderate,
      ease: easing.easeOut,
    },
  },
};
