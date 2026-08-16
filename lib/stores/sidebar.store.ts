/**
 * Sidebar state store
 * Infrastructure foundation for sidebar management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  isPinned: boolean;
}

interface SidebarActions {
  toggle: () => void;
  open: () => void;
  close: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setPinned: (pinned: boolean) => void;
}

type SidebarStore = SidebarState & SidebarActions;

const initialState: SidebarState = {
  isOpen: true,
  isCollapsed: false,
  isPinned: true,
};

/**
 * Zustand store for sidebar state
 * Persisted to localStorage for user preferences
 */
export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      ...initialState,

      toggle: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),

      open: () =>
        set(() => ({
          isOpen: true,
        })),

      close: () =>
        set(() => ({
          isOpen: false,
        })),

      setCollapsed: (collapsed) =>
        set(() => ({
          isCollapsed: collapsed,
        })),

      setPinned: (pinned) =>
        set(() => ({
          isPinned: pinned,
        })),
    }),
    {
      name: 'placify-sidebar-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
