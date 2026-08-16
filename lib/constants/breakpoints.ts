/**
 * Responsive breakpoint constants
 * Aligned with Tailwind CSS default breakpoints
 */

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type BreakpointValue = typeof BREAKPOINTS[Breakpoint];

/**
 * Media query helpers
 */
export const MEDIA_QUERIES = {
  SM: `(min-width: ${BREAKPOINTS.SM}px)`,
  MD: `(min-width: ${BREAKPOINTS.MD}px)`,
  LG: `(min-width: ${BREAKPOINTS.LG}px)`,
  XL: `(min-width: ${BREAKPOINTS.XL}px)`,
  '2XL': `(min-width: ${BREAKPOINTS['2XL']}px)`,
  
  // Max-width variants
  MAX_SM: `(max-width: ${BREAKPOINTS.SM - 1}px)`,
  MAX_MD: `(max-width: ${BREAKPOINTS.MD - 1}px)`,
  MAX_LG: `(max-width: ${BREAKPOINTS.LG - 1}px)`,
  MAX_XL: `(max-width: ${BREAKPOINTS.XL - 1}px)`,
  MAX_2XL: `(max-width: ${BREAKPOINTS['2XL'] - 1}px)`,
  
  // Special queries
  MOBILE: `(max-width: ${BREAKPOINTS.MD - 1}px)`,
  TABLET: `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`,
  DESKTOP: `(min-width: ${BREAKPOINTS.LG}px)`,
  
  PREFERS_REDUCED_MOTION: '(prefers-reduced-motion: reduce)',
  PREFERS_DARK_SCHEME: '(prefers-color-scheme: dark)',
} as const;
