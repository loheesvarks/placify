/**
 * Animation constants
 * Centralized animation timing and easing definitions
 */

export const ANIMATION_DURATION = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
  SLOWER: 600,
} as const;

export const ANIMATION_EASING = {
  LINEAR: 'linear',
  EASE: 'ease',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const ANIMATION_DELAY = {
  NONE: 0,
  SHORT: 100,
  MEDIUM: 200,
  LONG: 300,
} as const;

export const STAGGER_DELAY = {
  FAST: 0.05,
  NORMAL: 0.1,
  SLOW: 0.2,
} as const;

export type AnimationDuration = typeof ANIMATION_DURATION[keyof typeof ANIMATION_DURATION];
export type AnimationEasing = typeof ANIMATION_EASING[keyof typeof ANIMATION_EASING];
export type AnimationDelay = typeof ANIMATION_DELAY[keyof typeof ANIMATION_DELAY];
export type StaggerDelay = typeof STAGGER_DELAY[keyof typeof STAGGER_DELAY];
