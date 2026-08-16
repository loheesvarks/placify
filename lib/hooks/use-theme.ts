/**
 * Theme hook
 * Provides access to theme state and controls
 */

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/stores';
import type { ThemeMode } from '@/lib/config/theme';

export interface UseThemeReturn {
  mode: ThemeMode;
  systemTheme: 'light' | 'dark';
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

/**
 * Hook to access theme state and actions
 * Handles system theme detection and resolution
 */
export function useTheme(): UseThemeReturn {
  const mode = useThemeStore((state) => state.mode);
  const systemTheme = useThemeStore((state) => state.systemTheme);
  const setMode = useThemeStore((state) => state.setMode);
  const setSystemTheme = useThemeStore((state) => state.setSystemTheme);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  // Detect system theme changes
  useEffect(() => {
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

  // Resolve theme based on mode and system preference
  const resolvedTheme = mode === 'system' ? systemTheme : mode;

  return {
    mode,
    systemTheme,
    resolvedTheme,
    setMode,
    toggleMode,
  };
}
