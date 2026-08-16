/**
 * Theme hook
 * Provides access to theme state and controls
 * Manages theme mode and system preference detection
 */

import { useEffect, useCallback } from 'react';
import { useThemeStore } from '@/lib/stores';
import type { ThemeMode } from '@/lib/config/theme';

export interface UseThemeReturn {
  /** Current theme mode setting (light, dark, or system) */
  mode: ThemeMode;
  /** Detected system theme preference */
  systemTheme: 'light' | 'dark';
  /** Resolved theme (accounts for system preference when mode is 'system') */
  resolvedTheme: 'light' | 'dark';
  /** Convenience: is resolved theme dark */
  isDark: boolean;
  /** Convenience: is resolved theme light */
  isLight: boolean;
  /** Convenience: is mode set to system */
  isSystem: boolean;
  /** Set theme mode */
  setTheme: (mode: ThemeMode) => void;
  /** Toggle between light and dark */
  toggleTheme: () => void;
}

/**
 * Hook to access theme state and actions
 * Handles system theme detection and resolution with localStorage persistence
 */
export function useTheme(): UseThemeReturn {
  const mode = useThemeStore((state) => state.mode);
  const systemTheme = useThemeStore((state) => state.systemTheme);
  const setMode = useThemeStore((state) => state.setMode);
  const setSystemTheme = useThemeStore((state) => state.setSystemTheme);
  const storeToggleMode = useThemeStore((state) => state.toggleMode);

  /**
   * Detect system theme changes
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial value
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setSystemTheme]);

  /**
   * Resolve theme based on mode and system preference
   */
  const resolvedTheme = mode === 'system' ? systemTheme : mode;

  /**
   * Set theme mode
   */
  const setTheme = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, [setMode]);

  /**
   * Toggle between light and dark
   * If currently system, switch to opposite of current resolved theme
   */
  const toggleTheme = useCallback(() => {
    if (mode === 'system') {
      // If system mode, switch to opposite of current system theme
      setMode(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      // Otherwise use store's toggle (light ↔ dark)
      storeToggleMode();
    }
  }, [mode, systemTheme, setMode, storeToggleMode]);

  return {
    mode,
    systemTheme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: mode === 'system',
    setTheme,
    toggleTheme,
  };
}
