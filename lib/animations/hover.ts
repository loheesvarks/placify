/**
 * Hover Animation Presets
 * 
 * Reusable hover and tap animations for interactive elements.
 * Designed for buttons, cards, and clickable components.
 * 
 * @module hover
 */

import { TargetAndTransition } from 'framer-motion';
import { duration, easing } from './transition';

/**
 * Lift hover effect
 * Subtle upward movement with shadow
 * 
 * @example
 * ```tsx
 * <motion.button
 *   whileHover={hoverLift}
 *   whileTap={tapScale}
 * >
 *   Click me
 * </motion.button>
 * ```
 */
export const hoverLift: TargetAndTransition = {
  y: -2,
  scale: 1.02,
  transition: {
    duration: duration.immediate,
    ease: easing.easeOut,
  },
};

/**
 * Scale hover effect
 * Simple scale up on hover
 */
export const hoverScale: TargetAndTransition = {
  scale: 1.05,
  transition: {
    duration: duration.immediate,
    ease: easing.easeOut,
  },
};

/**
 * Glow hover effect
 * Add glow shadow on hover
 */
export const hoverGlow: TargetAndTransition = {
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
  transition: {
    duration: duration.fast,
    ease: easing.easeOut,
  },
};

/**
 * Rotate hover effect
 * Slight rotation for playful interactions
 */
export const hoverRotate: TargetAndTransition = {
  rotate: 3,
  transition: {
    duration: duration.immediate,
    ease: easing.easeOut,
  },
};

/**
 * Expand hover effect
 * Expand width or height
 */
export const hoverExpand: TargetAndTransition = {
  scale: 1.03,
  transition: {
    duration: duration.immediate,
    ease: easing.easeOut,
  },
};

/**
 * Brighten hover effect
 * Increase brightness
 */
export const hoverBrighten: TargetAndTransition = {
  filter: 'brightness(1.1)',
  transition: {
    duration: duration.immediate,
    ease: easing.easeOut,
  },
};

/**
 * Card hover effect
 * Complete card hover animation
 * 
 * @example
 * ```tsx
 * <motion.div
 *   whileHover={hoverCard}
 *   whileTap={tapCard}
 * />
 * ```
 */
export const hoverCard: TargetAndTransition = {
  y: -4,
  scale: 1.01,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)',
  transition: {
    duration: duration.normal,
    ease: easing.easeSmooth,
  },
};

/**
 * Icon button hover
 * Scale and color shift for icon buttons
 */
export const hoverIconButton: TargetAndTransition = {
  scale: 1.1,
  transition: {
    duration: duration.immediate,
    ease: easing.easeOut,
  },
};

/**
 * Link hover effect
 * Underline or color change
 */
export const hoverLink: TargetAndTransition = {
  x: 2,
  transition: {
    duration: duration.immediate,
    ease: easing.easeOut,
  },
};

/**
 * Tap scale down
 * Press feedback for buttons
 * 
 * @example
 * ```tsx
 * <motion.button
 *   whileTap={tapScale}
 * />
 * ```
 */
export const tapScale: TargetAndTransition = {
  scale: 0.95,
  transition: {
    duration: duration.immediate,
    ease: easing.easeOut,
  },
};

/**
 * Tap press
 * Button press with Y movement
 */
export const tapPress: TargetAndTransition = {
  y: 2,
  scale: 0.98,
  transition: {
    duration: duration.immediate,
    ease: easing.easeSnappy,
  },
};

/**
 * Tap card
 * Card tap feedback
 */
export const tapCard: TargetAndTransition = {
  scale: 0.98,
  transition: {
    duration: duration.immediate,
    ease: easing.easeOut,
  },
};

/**
 * Tap bounce
 * Bouncy tap feedback
 */
export const tapBounce: TargetAndTransition = {
  scale: 0.9,
  transition: {
    type: 'spring',
    stiffness: 500,
    damping: 15,
  },
};

/**
 * Hover pulse glow
 * Pulsing glow effect
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={hoverPulseGlow}
 * />
 * ```
 */
export const hoverPulseGlow: TargetAndTransition = {
  boxShadow: [
    '0 0 20px rgba(59, 130, 246, 0.4)',
    '0 0 30px rgba(59, 130, 246, 0.6)',
    '0 0 20px rgba(59, 130, 246, 0.4)',
  ],
  transition: {
    duration: 2,
    ease: easing.easeInOut,
    repeat: Infinity,
  },
};

/**
 * Hover float
 * Gentle floating animation
 */
export const hoverFloat: TargetAndTransition = {
  y: [-2, -6, -2],
  transition: {
    duration: 3,
    ease: easing.easeInOut,
    repeat: Infinity,
  },
};

/**
 * Button variants object
 * Combined hover and tap states for buttons
 * 
 * @example
 * ```tsx
 * <motion.button
 *   whileHover={buttonVariants.hover}
 *   whileTap={buttonVariants.tap}
 * />
 * ```
 */
export const buttonVariants = {
  hover: hoverLift,
  tap: tapScale,
};

/**
 * Card variants object
 * Combined hover and tap states for cards
 */
export const cardVariants = {
  hover: hoverCard,
  tap: tapCard,
};

/**
 * Icon variants object
 * Combined hover and tap states for icons
 */
export const iconVariants = {
  hover: hoverIconButton,
  tap: tapScale,
};
