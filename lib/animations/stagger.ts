/**
 * Stagger Animation Helpers
 * 
 * Container and item variants for sequential animations.
 * Creates coordinated, orchestrated motion for lists and grids.
 * 
 * @module stagger
 */

import { Variants } from 'framer-motion';
import { stagger, duration, easing } from './transition';

/**
 * Basic stagger container
 * Controls timing of child animations
 * 
 * @example
 * ```tsx
 * <motion.div variants={staggerContainer}>
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={staggerItem}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.sm,
      delayChildren: 0,
    },
  },
};

/**
 * Basic stagger item
 * Individual item animation
 */
export const staggerItem: Variants = {
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
 * Fast stagger for list items
 * Tight sequential animation
 * 
 * @example
 * ```tsx
 * <motion.ul variants={staggerContainerFast}>
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={staggerItemFast}>
 *       {item.content}
 *     </motion.li>
 *   ))}
 * </motion.ul>
 * ```
 */
export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.xs,
      delayChildren: 0,
    },
  },
};

export const staggerItemFast: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
};

/**
 * Relaxed stagger for cards
 * Slower, more deliberate animation
 * 
 * @example
 * ```tsx
 * <motion.div variants={staggerContainerRelaxed}>
 *   {cards.map(card => (
 *     <motion.div key={card.id} variants={staggerItemRelaxed}>
 *       <Card {...card} />
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const staggerContainerRelaxed: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.md,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemRelaxed: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeElegant,
    },
  },
};

/**
 * Dramatic stagger for features
 * Emphasized sequential reveal
 */
export const staggerContainerDramatic: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.lg,
      delayChildren: 0.2,
    },
  },
};

export const staggerItemDramatic: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: duration.slow,
      ease: easing.easeElegant,
    },
  },
};

/**
 * Stagger from left
 * Slide in sequentially from left
 * 
 * @example
 * ```tsx
 * <motion.div variants={staggerContainerLeft}>
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={staggerItemLeft}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const staggerContainerLeft: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.sm,
      delayChildren: 0,
    },
  },
};

export const staggerItemLeft: Variants = {
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
 * Stagger from right
 * Slide in sequentially from right
 */
export const staggerContainerRight: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.sm,
      delayChildren: 0,
    },
  },
};

export const staggerItemRight: Variants = {
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
 * Stagger with scale
 * Pop in effect for grid items
 * 
 * @example
 * ```tsx
 * <motion.div variants={staggerContainerScale}>
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={staggerItemScale}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const staggerContainerScale: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.sm,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      mass: 0.5,
    },
  },
};

/**
 * Reverse stagger (bottom to top)
 * Items appear in reverse order
 * 
 * @example
 * ```tsx
 * <motion.div variants={staggerContainerReverse}>
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={staggerItemReverse}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const staggerContainerReverse: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.sm,
      staggerDirection: -1, // Reverse order
      delayChildren: 0,
    },
  },
};

export const staggerItemReverse: Variants = {
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
 * Dashboard widgets stagger
 * Specialized for dashboard cards
 * 
 * @example
 * ```tsx
 * <motion.div variants={staggerContainerDashboard}>
 *   {widgets.map(widget => (
 *     <motion.div key={widget.id} variants={staggerItemDashboard}>
 *       <Widget {...widget} />
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const staggerContainerDashboard: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.md,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemDashboard: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: duration.comfortable,
      ease: easing.easeElegant,
    },
  },
};

/**
 * Create custom stagger configuration
 * 
 * @param delayChildren - Initial delay before children animate
 * @param staggerChildren - Delay between each child
 * @returns Custom stagger container variants
 * 
 * @example
 * ```tsx
 * const customStagger = createStaggerContainer(0.2, 0.1);
 * 
 * <motion.div variants={customStagger}>
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={staggerItem}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const createStaggerContainer = (
  delayChildren = 0,
  staggerChildren = stagger.sm
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});
