/**
 * Loading Animation Variants
 * 
 * Loading states, spinners, skeletons, and progress indicators.
 * Optimized for performance and accessibility.
 * 
 * @module loading
 */

import { Variants, TargetAndTransition } from 'framer-motion';
import { duration, easing } from './transition';

/**
 * Spinner rotation animation
 * Continuous spin for loading indicators
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={spinnerRotate}
 *   style={{ borderTopColor: 'currentColor' }}
 * />
 * ```
 */
export const spinnerRotate: TargetAndTransition = {
  rotate: 360,
  transition: {
    duration: 1,
    ease: 'linear',
    repeat: Infinity,
  },
};

/**
 * Pulse animation
 * Subtle pulsing for loading states
 * 
 * @example
 * ```tsx
 * <motion.div animate={loadingPulse} />
 * ```
 */
export const loadingPulse: TargetAndTransition = {
  scale: [1, 1.05, 1],
  opacity: [0.6, 1, 0.6],
  transition: {
    duration: 1.5,
    ease: easing.easeInOut,
    repeat: Infinity,
  },
};

/**
 * Skeleton shimmer animation
 * Animated gradient for skeleton screens
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={skeletonShimmer}
 *   style={{
 *     background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
 *   }}
 * />
 * ```
 */
export const skeletonShimmer: TargetAndTransition = {
  x: ['-100%', '100%'],
  transition: {
    duration: 1.5,
    ease: easing.easeInOut,
    repeat: Infinity,
  },
};

/**
 * Skeleton to content transition
 * Replace skeleton with real content
 * 
 * @example
 * ```tsx
 * <AnimatePresence mode="wait">
 *   {isLoading ? (
 *     <motion.div key="skeleton" exit="hidden" variants={skeletonFadeOut} />
 *   ) : (
 *     <motion.div key="content" variants={contentFadeIn} initial="hidden" animate="visible" />
 *   )}
 * </AnimatePresence>
 * ```
 */
export const skeletonFadeOut: Variants = {
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
};

export const contentFadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeElegant,
      delay: 0.1,
    },
  },
};

/**
 * Dots loading animation
 * Three dots bouncing loader
 * 
 * @example
 * ```tsx
 * {[0, 1, 2].map(i => (
 *   <motion.div
 *     key={i}
 *     animate={loadingDots}
 *     transition={{ delay: i * 0.2 }}
 *   />
 * ))}
 * ```
 */
export const loadingDots: TargetAndTransition = {
  y: [0, -10, 0],
  transition: {
    duration: 0.6,
    ease: easing.easeInOut,
    repeat: Infinity,
    repeatDelay: 0.2,
  },
};

/**
 * Progress bar fill animation
 * Smooth progress bar growth
 * 
 * @example
 * ```tsx
 * <motion.div
 *   initial={{ width: '0%' }}
 *   animate={{ width: `${progress}%` }}
 *   transition={progressBarTransition}
 * />
 * ```
 */
export const progressBarTransition = {
  duration: 0.8,
  ease: easing.easeOut,
};

/**
 * Circular progress animation
 * Smooth circular progress indicator
 */
export const circularProgressTransition = {
  duration: 1,
  ease: easing.easeElegant,
};

/**
 * Loading overlay fade in
 * Full-screen loading overlay
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={loadingOverlay}
 *   initial="hidden"
 *   animate="visible"
 *   exit="hidden"
 * />
 * ```
 */
export const loadingOverlay: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(4px)',
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Floating animation
 * Gentle floating motion for loading states
 * 
 * @example
 * ```tsx
 * <motion.div animate={floatingAnimation} />
 * ```
 */
export const floatingAnimation: TargetAndTransition = {
  y: [-10, 10, -10],
  transition: {
    duration: 3,
    ease: easing.easeInOut,
    repeat: Infinity,
  },
};

/**
 * Bounce animation
 * Bouncing loader
 */
export const bounceAnimation: TargetAndTransition = {
  y: [0, -20, 0],
  transition: {
    duration: 0.6,
    ease: easing.easeOut,
    repeat: Infinity,
  },
};

/**
 * Wave animation
 * Sequential wave effect for multiple elements
 * 
 * @example
 * ```tsx
 * {[0, 1, 2, 3, 4].map(i => (
 *   <motion.div
 *     key={i}
 *     animate={waveAnimation}
 *     style={{ animationDelay: `${i * 0.1}s` }}
 *   />
 * ))}
 * ```
 */
export const waveAnimation: TargetAndTransition = {
  scaleY: [1, 1.5, 1],
  transition: {
    duration: 1,
    ease: easing.easeInOut,
    repeat: Infinity,
  },
};

/**
 * Indeterminate progress bar
 * Sweeping progress bar animation
 */
export const indeterminateProgress: TargetAndTransition = {
  x: ['-100%', '400%'],
  transition: {
    duration: 1.5,
    ease: 'linear',
    repeat: Infinity,
  },
};

/**
 * Glow pulse for loading
 * Pulsing glow effect during loading
 */
export const loadingGlowPulse: TargetAndTransition = {
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
 * Loading state variants
 * Complete loading to loaded transition
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={loadingState}
 *   initial="loading"
 *   animate={isLoaded ? "loaded" : "loading"}
 * />
 * ```
 */
export const loadingState: Variants = {
  loading: {
    opacity: 0.6,
    scale: 0.98,
  },
  loaded: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};
