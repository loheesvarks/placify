/**
 * Placify Animation System
 * 
 * Global animation library following the Placify Motion Design System specification.
 * All animations are GPU-accelerated, accessible, and respect user motion preferences.
 * 
 * @module animations
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { fadeInUp, transitions, useReducedMotion } from '@/lib/animations';
 * 
 * function MyComponent() {
 *   const shouldReduce = useReducedMotion();
 *   
 *   return (
 *     <motion.div
 *       variants={fadeInUp}
 *       initial="hidden"
 *       animate="visible"
 *       transition={shouldReduce ? { duration: 0.01 } : undefined}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */

// ============================================================================
// CORE CONFIGURATION
// ============================================================================

/**
 * Transition timings, easings, and spring configurations
 */
export {
  duration,
  stagger,
  easing,
  spring,
  createTransition,
  transitions,
} from './transition';

/**
 * Reduced motion utilities for accessibility
 */
export {
  prefersReducedMotion,
  useReducedMotion,
  respectReducedMotion,
  respectReducedMotionVariant,
  createMotionAwareVariants,
  disableAnimation,
  shouldDisableAnimation,
  safeAnimation,
} from './reduced-motion';

// ============================================================================
// BASIC ANIMATIONS
// ============================================================================

/**
 * Fade animations - opacity-based transitions
 */
export {
  fadeVariants,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeInScale,
  fadeInScaleBlur,
  fadeFast,
  fadeSlow,
  fadeOutScale,
  crossFade,
} from './fade';

/**
 * Slide animations - transform-based sliding
 */
export {
  slideInRight,
  slideInLeft,
  slideInTop,
  slideInBottom,
  slideInRightFade,
  slideInLeftFade,
  slideInUpFade,
  slideInDownFade,
  slideOutRight,
  slideOutLeft,
  pageSlideLeft,
  pageSlideRight,
  slideInRightElastic,
  slideInQuick,
} from './slide';

/**
 * Scale animations - transform-based scaling
 */
export {
  scaleVariants,
  scaleIn,
  scaleOut,
  scaleInBounce,
  scaleInRotate,
  scalePulse,
  scaleHover,
  scaleFromTop,
  scaleFromBottom,
  scaleElastic,
  scaleInBlur,
  scaleSuccess,
} from './scale';

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

/**
 * Full-page navigation animations
 */
export {
  pageTransition,
  pageDeepNav,
  pageBackNav,
  pageDashboardToRoadmap,
  pageSlideFromRight,
  pageLoginToDashboard,
  pageFast,
  pageFadeThrough,
  pageScale,
} from './page';

// ============================================================================
// COMPONENT ANIMATIONS
// ============================================================================

/**
 * Modal dialog animations
 */
export {
  modalBackdrop,
  modalContent,
  modalVariants,
  modalContentTransition,
  modalSlideFromBottom,
  modalConfirmation,
  modalLarge,
  modalFullscreen,
  modalGlow,
} from './modal';

/**
 * Drawer panel animations
 */
export {
  drawerRight,
  drawerLeft,
  drawerTop,
  drawerBottom,
  drawerBackdrop,
  drawerContainer,
  drawerItem,
  drawerSettings,
  drawerMobile,
  drawerFilter,
  drawerNotification,
} from './drawer';

/**
 * Toast notification animations
 */
export {
  toastSlideTop,
  toastSlideBottom,
  toastSlideRight,
  toastFadeScale,
  toastProgress,
  toastStackTransition,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  toastGlow,
} from './toast';

// ============================================================================
// INTERACTIVE ANIMATIONS
// ============================================================================

/**
 * Hover and tap animations for interactive elements
 */
export {
  hoverLift,
  hoverScale,
  hoverGlow,
  hoverRotate,
  hoverExpand,
  hoverBrighten,
  hoverCard,
  hoverIconButton,
  hoverLink,
  tapScale,
  tapPress,
  tapCard,
  tapBounce,
  hoverPulseGlow,
  hoverFloat,
  buttonVariants,
  cardVariants,
  iconVariants,
} from './hover';

// ============================================================================
// SEQUENTIAL ANIMATIONS
// ============================================================================

/**
 * Stagger animations for lists and grids
 */
export {
  staggerContainer,
  staggerItem,
  staggerContainerFast,
  staggerItemFast,
  staggerContainerRelaxed,
  staggerItemRelaxed,
  staggerContainerDramatic,
  staggerItemDramatic,
  staggerContainerLeft,
  staggerItemLeft,
  staggerContainerRight,
  staggerItemRight,
  staggerContainerScale,
  staggerItemScale,
  staggerContainerReverse,
  staggerItemReverse,
  staggerContainerDashboard,
  staggerItemDashboard,
  createStaggerContainer,
} from './stagger';

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * Loading, skeleton, and progress animations
 */
export {
  spinnerRotate,
  loadingPulse,
  skeletonShimmer,
  skeletonFadeOut,
  contentFadeIn,
  loadingDots,
  progressBarTransition,
  circularProgressTransition,
  loadingOverlay,
  floatingAnimation,
  bounceAnimation,
  waveAnimation,
  indeterminateProgress,
  loadingGlowPulse,
  loadingState,
} from './loading';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Re-export Framer Motion types for convenience
 */
export type {
  Variants,
  Transition,
  TargetAndTransition,
} from 'framer-motion';

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * @example Basic fade animation
 * ```tsx
 * import { motion } from 'framer-motion';
 * import { fadeInUp } from '@/lib/animations';
 * 
 * function MyComponent() {
 *   return (
 *     <motion.div
 *       variants={fadeInUp}
 *       initial="hidden"
 *       animate="visible"
 *     >
 *       Content fades in and moves up
 *     </motion.div>
 *   );
 * }
 * ```
 * 
 * @example Stagger animation
 * ```tsx
 * import { motion } from 'framer-motion';
 * import { staggerContainer, staggerItem } from '@/lib/animations';
 * 
 * function List({ items }) {
 *   return (
 *     <motion.ul
 *       variants={staggerContainer}
 *       initial="hidden"
 *       animate="visible"
 *     >
 *       {items.map(item => (
 *         <motion.li key={item.id} variants={staggerItem}>
 *           {item.content}
 *         </motion.li>
 *       ))}
 *     </motion.ul>
 *   );
 * }
 * ```
 * 
 * @example Page transition
 * ```tsx
 * import { motion, AnimatePresence } from 'framer-motion';
 * import { pageTransition } from '@/lib/animations';
 * 
 * function PageWrapper({ children, route }) {
 *   return (
 *     <AnimatePresence mode="wait">
 *       <motion.div
 *         key={route}
 *         variants={pageTransition}
 *         initial="initial"
 *         animate="animate"
 *         exit="exit"
 *       >
 *         {children}
 *       </motion.div>
 *     </AnimatePresence>
 *   );
 * }
 * ```
 * 
 * @example Modal animation
 * ```tsx
 * import { motion, AnimatePresence } from 'framer-motion';
 * import { modalBackdrop, modalContent } from '@/lib/animations';
 * 
 * function Modal({ isOpen, onClose, children }) {
 *   return (
 *     <AnimatePresence>
 *       {isOpen && (
 *         <>
 *           <motion.div
 *             variants={modalBackdrop}
 *             initial="hidden"
 *             animate="visible"
 *             exit="hidden"
 *             onClick={onClose}
 *           />
 *           <motion.div
 *             variants={modalContent}
 *             initial="hidden"
 *             animate="visible"
 *             exit="hidden"
 *           >
 *             {children}
 *           </motion.div>
 *         </>
 *       )}
 *     </AnimatePresence>
 *   );
 * }
 * ```
 * 
 * @example Hover animation
 * ```tsx
 * import { motion } from 'framer-motion';
 * import { hoverLift, tapScale } from '@/lib/animations';
 * 
 * function Button({ children, onClick }) {
 *   return (
 *     <motion.button
 *       whileHover={hoverLift}
 *       whileTap={tapScale}
 *       onClick={onClick}
 *     >
 *       {children}
 *     </motion.button>
 *   );
 * }
 * ```
 * 
 * @example Reduced motion support
 * ```tsx
 * import { motion } from 'framer-motion';
 * import { fadeInUp, useReducedMotion, transitions } from '@/lib/animations';
 * 
 * function AccessibleComponent() {
 *   const shouldReduce = useReducedMotion();
 *   
 *   return (
 *     <motion.div
 *       variants={fadeInUp}
 *       initial="hidden"
 *       animate="visible"
 *       transition={shouldReduce ? { duration: 0.01 } : transitions.page}
 *     >
 *       Content respects user preferences
 *     </motion.div>
 *   );
 * }
 * ```
 */
