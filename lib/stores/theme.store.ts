/**
 * Theme state store
 * Infrastructure foundation for theme management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ThemeMode } from '@/lib/config/theme';

interface ThemeState {
  mode: ThemeMode;
  systemTheme: 'light' | 'dark';
}

interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  setSystemTheme: (theme: 'light' | 'dark') => void;
  toggleMode: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

const initialState: ThemeState = {
  mode: 'dark',
  systemTheme: 'dark',
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
    }),
    {
      name: 'placify-theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
      }),
    }
  )
);
