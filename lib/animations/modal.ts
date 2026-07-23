/**
 * Modal Animation Variants
 * 
 * Specialized animations for modal dialogs, including backdrop and content.
 * Optimized for overlay interactions with proper z-index handling.
 * 
 * @module modal
 */

import { Variants } from 'framer-motion';
import { duration, easing } from './transition';

/**
 * Modal backdrop animation
 * Frosted glass effect with blur
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={modalBackdrop}
 *   initial="hidden"
 *   animate="visible"
 *   exit="hidden"
 * />
 * ```
 */
export const modalBackdrop: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(20px)',
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Modal content animation
 * Scale and fade entrance from center
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={modalContent}
 *   initial="hidden"
 *   animate="visible"
 *   exit="hidden"
 * />
 * ```
 */
export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
      delay: 0.05,
    },
  },
};

/**
 * Complete modal animation (backdrop + content)
 * Use for simple modal implementations
 * 
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isOpen && (
 *     <motion.div
 *       variants={modalVariants}
 *       initial="closed"
 *       animate="open"
 *       exit="closed"
 *     />
 *   )}
 * </AnimatePresence>
 * ```
 */
export const modalVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
    },
  },
};

/**
 * Modal content transition for multi-step forms
 * Smooth horizontal slide between steps
 * 
 * @example
 * ```tsx
 * <AnimatePresence mode="wait">
 *   <motion.div
 *     key={step}
 *     variants={modalContentTransition}
 *     initial="enter"
 *     animate="center"
 *     exit="exit"
 *     custom={direction}
 *   />
 * </AnimatePresence>
 * ```
 */
export const modalContentTransition: Variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    };
  },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeElegant,
      delay: 0.15,
    },
  },
  exit: (direction: number) => {
    return {
      x: direction > 0 ? -30 : 30,
      opacity: 0,
      transition: {
        duration: duration.fast,
        ease: easing.easeIn,
      },
    };
  },
};

/**
 * Modal slide from bottom (mobile sheet style)
 * Sheet-like modal for mobile devices
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={modalSlideFromBottom}
 *   initial="hidden"
 *   animate="visible"
 *   exit="hidden"
 * />
 * ```
 */
export const modalSlideFromBottom: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.5,
    },
  },
};

/**
 * Confirmation modal animation
 * Attention-grabbing with slight bounce
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={modalConfirmation}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const modalConfirmation: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
      mass: 0.8,
    },
  },
};

/**
 * Large modal animation
 * Slower, more deliberate for complex content
 */
export const modalLarge: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: duration.comfortable,
      ease: easing.easeElegant,
    },
  },
};

/**
 * Fullscreen modal transition
 * Expand from center to fullscreen
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={modalFullscreen}
 *   initial="hidden"
 *   animate="visible"
 * />
 * ```
 */
export const modalFullscreen: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    borderRadius: '16px',
  },
  visible: {
    opacity: 1,
    scale: 1,
    borderRadius: '0px',
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
    },
  },
};

/**
 * Modal with glow effect
 * Premium feel with animated glow
 */
export const modalGlow: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)',
    transition: {
      duration: duration.moderate,
      ease: easing.easeSmooth,
    },
  },
};
