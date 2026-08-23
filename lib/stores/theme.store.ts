/**
 * Theme state store
 * Infrastructure foundation for theme management
 * Extended with color theme support (PLAC-014)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ThemeMode } from '@/lib/config/theme';
import type { ThemeName } from '@/lib/types/theme.types';

interface ThemeState {
  mode: ThemeMode;
  systemTheme: 'light' | 'dark';
  colorTheme: ThemeName;
}

interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  setSystemTheme: (theme: 'light' | 'dark') => void;
  toggleMode: () => void;
  setColorTheme: (theme: ThemeName) => void;
}

type ThemeStore = ThemeState & ThemeActions;

const initialState: ThemeState = {
  mode: 'dark',
  systemTheme: 'dark',
  colorTheme: 'cosmic',
};

/**
 * Zustand store for theme state
 * Persisted to localStorage for user preferences
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      ...initialState,

      setMode: (mode) =>
        set(() => ({
          mode,
        })),

      setSystemTheme: (systemTheme) =>
        set(() => ({
          systemTheme,
        })),

      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
      
      setColorTheme: (colorTheme) =>
        set(() => ({
          colorTheme,
        })),
    }),
    {
      name: 'placify-theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
        colorTheme: state.colorTheme,
      }),
    }
  )
);
