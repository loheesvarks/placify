/**
 * Theme configuration
 * Centralized theme settings and defaults
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_CONFIG = {
  defaultMode: 'dark' as ThemeMode,
  storageKey: 'placify-theme',
  
  // CSS custom property names
  cssVariables: {
    background: '--background',
    foreground: '--foreground',
    primary: '--primary',
    secondary: '--secondary',
    accent: '--accent',
    muted: '--muted',
    border: '--border',
  },
  
  // Animation preferences
  animations: {
    enabled: true,
    respectReducedMotion: true,
  },
} as const;

/**
 * Theme mode options for UI
 */
export const THEME_OPTIONS: Array<{ value: ThemeMode; label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];
