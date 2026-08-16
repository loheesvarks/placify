/**
 * Z-index constants
 * Centralized z-index scale for consistent stacking context
 */

export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1100,
  FIXED: 1200,
  OVERLAY: 1300,
  MODAL: 1400,
  POPOVER: 1500,
  TOOLTIP: 1600,
  TOAST: 1700,
  PRIORITY: 1800,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;
export type ZIndexValue = typeof Z_INDEX[ZIndexKey];

/**
 * Get z-index value with optional offset
 */
export function getZIndex(key: ZIndexKey, offset: number = 0): number {
  return Z_INDEX[key] + offset;
}
