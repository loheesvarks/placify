/**
 * Reduced Motion Support Module
 * 
 * Utilities for respecting user's motion preferences and providing accessible animations.
 * Implements WCAG 2.1 Level AA compliance for motion sensitivity.
 * 
 * @module reduced-motion
 */

import { Transition, Variant } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Check if user prefers reduced motion
 * 
 * @returns true if user has requested reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

/**
 * Hook to detect reduced motion preference
 * 
 * @returns true if user prefers reduced motion, updates on preference change
 * 
 * @example
 * ```tsx
 * const shouldReduce = useReducedMotion();
 * 
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: shouldReduce ? 0.01 : 0.3 }}
 * />
 * ```
 */
export const useReducedMotion = (): boolean => {
  const [shouldReduce, setShouldReduce] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduce(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Legacy browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return shouldReduce;
};

/**
 * Modify transition to respect reduced motion preference
 * 
 * @param transition - Original transition configuration
 * @param shouldReduce - Whether to apply reduced motion (defaults to prefersReducedMotion())
 * @returns Modified transition that respects motion preferences
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={respectReducedMotion({ duration: 0.5 })}
 * />
 * ```
 */
export const respectReducedMotion = (
  transition: Transition,
  shouldReduce = prefersReducedMotion()
): Transition => {
  if (!shouldReduce) return transition;

  // Make animations nearly instant for reduced motion users
  return {
    ...transition,
    duration: 0.01,
    delay: 0,
    // Preserve spring type but make it instant
    ...(transition.type === 'spring' && {
      stiffness: 10000,
      damping: 100,
    }),
  };
};

/**
 * Modify variant to respect reduced motion preference
 * 
 * @param variant - Original variant object
 * @param shouldReduce - Whether to apply reduced motion
 * @returns Modified variant with adjusted transition
 * 
 * @example
 * ```tsx
 * const variants = {
 *   hidden: { opacity: 0 },
 *   visible: respectReducedMotionVariant({ 
 *     opacity: 1,
 *     transition: { duration: 0.5 }
 *   })
 * };
 * ```
 */
export const respectReducedMotionVariant = (
  variant: Variant,
  shouldReduce = prefersReducedMotion()
): Variant => {
  // If variant is a function or shouldn't reduce motion, return as-is
  if (!shouldReduce || typeof variant === 'function') return variant;

  // Check if variant has transition property
  if (!('transition' in variant) || !variant.transition) return variant;

  return {
    ...variant,
    transition: respectReducedMotion(variant.transition as Transition, shouldReduce),
  };
};

/**
 * Higher-order function to create motion-aware variants
 * 
 * @param variants - Object containing animation variants
 * @returns Function that returns variants respecting motion preferences
 * 
 * @example
 * ```tsx
 * const getVariants = createMotionAwareVariants({
 *   hidden: { opacity: 0, y: 20 },
 *   visible: { 
 *     opacity: 1, 
 *     y: 0,
 *     transition: { duration: 0.5 }
 *   }
 * });
 * 
 * const shouldReduce = useReducedMotion();
 * const variants = getVariants(shouldReduce);
 * ```
 */
export const createMotionAwareVariants = <T extends Record<string, Variant>>(
  variants: T
) => {
  return (shouldReduce = prefersReducedMotion()): T => {
    if (!shouldReduce) return variants;

    const reducedVariants = {} as T;
    
    Object.keys(variants).forEach((key) => {
      reducedVariants[key as keyof T] = respectReducedMotionVariant(
        variants[key],
        shouldReduce
      ) as T[keyof T];
    });

    return reducedVariants;
  };
};

/**
 * Disable animations globally for critical operations
 * 
 * Use sparingly for operations like:
 * - Password entry
 * - Payment processing
 * - Data deletion confirmations
 * 
 * @param transition - Original transition
 * @returns Instant transition
 */
export const disableAnimation = (transition: Transition): Transition => ({
  ...transition,
  duration: 0,
  delay: 0,
});

/**
 * Check if animations should be disabled based on context
 * 
 * @param context - Context object with performance and preference flags
 * @returns true if animations should be disabled
 * 
 * @example
 * ```tsx
 * const shouldDisable = shouldDisableAnimation({
 *   isLowPerformance: false,
 *   isCriticalOperation: true,
 *   userPreference: 'reduce'
 * });
 * ```
 */
export const shouldDisableAnimation = (context: {
  isLowPerformance?: boolean;
  isCriticalOperation?: boolean;
  userPreference?: 'reduce' | 'no-preference';
  frameRate?: number;
}): boolean => {
  // Critical operations always disable animation
  if (context.isCriticalOperation) return true;

  // User explicitly wants reduced motion
  if (context.userPreference === 'reduce') return true;

  // Performance is too poor (< 45fps)
  if (context.frameRate && context.frameRate < 45) return true;

  // Device indicates low performance
  if (context.isLowPerformance) return true;

  return false;
};

/**
 * Safe animation wrapper that respects all motion preferences
 * 
 * @param transition - Original transition
 * @param context - Animation context
 * @returns Safe transition configuration
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={safeAnimation({ duration: 0.5 }, {
 *     isCriticalOperation: false
 *   })}
 * />
 * ```
 */
export const safeAnimation = (
  transition: Transition,
  context: Parameters<typeof shouldDisableAnimation>[0] = {}
): Transition => {
  if (shouldDisableAnimation(context)) {
    return disableAnimation(transition);
  }

  return respectReducedMotion(transition);
};
