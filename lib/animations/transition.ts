/**
 * Transition Configuration Module
 * 
 * Centralized transition timings and easing functions for Framer Motion animations.
 * All values follow the Placify Motion Design System specification.
 * 
 * @module transitions
 */

import { Transition } from 'framer-motion';

/**
 * Duration scale (milliseconds)
 * 
 * Standard duration values used throughout the application.
 * Use these exact values—no custom durations.
 */
export const duration = {
  /** 0ms - Disabled state, critical feedback */
  instant: 0,
  /** 50ms - Micro-interactions, hover states */
  immediate: 0.05,
  /** 150ms - Button press, input focus */
  fast: 0.15,
  /** 250ms - Card hover, simple transitions (default) */
  normal: 0.25,
  /** 350ms - Modal open, drawer slide */
  moderate: 0.35,
  /** 500ms - Page transitions, complex reveals */
  comfortable: 0.5,
  /** 700ms - Dramatic reveals, achievements */
  slow: 0.7,
  /** 1000ms - Multi-step animations, celebrations */
  deliberate: 1.0,
} as const;

/**
 * Stagger delay scale (seconds)
 * 
 * Delays for sequential animations.
 */
export const stagger = {
  /** 20ms - Tight sequential items (list items) */
  xs: 0.02,
  /** 40ms - Standard sequential items */
  sm: 0.04,
  /** 60ms - Relaxed sequential items */
  md: 0.06,
  /** 100ms - Emphasized sequential items */
  lg: 0.1,
  /** 150ms - Dramatic sequential items */
  xl: 0.15,
} as const;

/**
 * Easing curves
 * 
 * Named easing functions following industry standards.
 * Values are cubic-bezier coordinates [x1, y1, x2, y2].
 */
export const easing = {
  /** Standard linear easing */
  linear: [0, 0, 1, 1],
  /** Ease in - accelerate from zero */
  easeIn: [0.4, 0, 1, 1],
  /** Ease out - decelerate to zero (most common, default) */
  easeOut: [0, 0, 0.2, 1],
  /** Ease in-out - accelerate then decelerate */
  easeInOut: [0.4, 0, 0.2, 1],
  /** Smooth, subtle motion */
  easeSmooth: [0.25, 0.1, 0.25, 1],
  /** Playful overshoot */
  easeBounce: [0.68, -0.55, 0.265, 1.55],
  /** Quick start, smooth end */
  easeSnappy: [0.4, 0, 0, 1],
  /** Premium feel */
  easeElegant: [0.16, 1, 0.3, 1],
  /** Strong emphasis */
  easeDramatic: [0.87, 0, 0.13, 1],
} as const;

/**
 * Spring configurations for Framer Motion
 * 
 * Springs feel more natural than easing curves for interactive elements.
 */
export const spring = {
  /** Smooth, gentle spring - for modals/drawers */
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
  /** Responsive spring - for drag and drop */
  responsive: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
    mass: 0.5,
  },
  /** Snappy spring - for button feedback */
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 30,
    mass: 0.5,
  },
  /** Bouncy spring - for playful interactions */
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 15,
    mass: 0.8,
  },
  /** Elastic spring - for floating elements */
  elastic: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 12,
    mass: 1.2,
  },
} as const;

/**
 * Create a transition configuration
 * 
 * @param config - Partial transition configuration
 * @returns Complete transition configuration
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={createTransition({ duration: duration.fast })}
 * />
 * ```
 */
export const createTransition = (config: Partial<Transition> = {}): Transition => ({
  duration: duration.normal,
  ease: easing.easeOut,
  ...config,
});

/**
 * Pre-configured transition presets
 */
export const transitions = {
  /** Quick hover transitions */
  hover: createTransition({
    duration: duration.immediate,
    ease: easing.easeOut,
  }),
  
  /** Button press transitions */
  press: createTransition({
    duration: duration.fast,
    ease: easing.easeSnappy,
  }),
  
  /** Input focus transitions */
  focus: createTransition({
    duration: duration.normal,
    ease: easing.easeOut,
  }),
  
  /** Card hover transitions */
  cardHover: createTransition({
    duration: duration.normal,
    ease: easing.easeSmooth,
  }),
  
  /** Modal open/close */
  modal: createTransition({
    duration: duration.moderate,
    ease: easing.easeSmooth,
  }),
  
  /** Page transitions */
  page: createTransition({
    duration: duration.comfortable,
    ease: easing.easeElegant,
  }),
  
  /** Achievement animations */
  achievement: createTransition({
    duration: duration.slow,
    ease: easing.easeBounce,
  }),
  
  /** Spring transitions */
  springGentle: spring.gentle,
  springResponsive: spring.responsive,
  springSnappy: spring.snappy,
  springBouncy: spring.bouncy,
  springElastic: spring.elastic,
} as const;
