/**
 * Sidebar hook
 * Provides access to sidebar state and controls
 */

import { useSidebarStore } from '@/lib/stores';

export interface UseSidebarReturn {
  isOpen: boolean;
  isCollapsed: boolean;
  isPinned: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setPinned: (pinned: boolean) => void;
}

/**
 * Hook to access sidebar state and actions
 * Foundation for future sidebar component integration
 */
export function useSidebar(): UseSidebarReturn {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const isPinned = useSidebarStore((state) => state.isPinned);
  const toggle = useSidebarStore((state) => state.toggle);
  const open = useSidebarStore((state) => state.open);
  const close = useSidebarStore((state) => state.close);
  const setCollapsed = useSidebarStore((state) => state.setCollapsed);
  const setPinned = useSidebarStore((state) => state.setPinned);

  return {
    isOpen,
    isCollapsed,
    isPinned,
    toggle,
    open,
    close,
    setCollapsed,
    setPinned,
  };
}
