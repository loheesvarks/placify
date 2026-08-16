/**
 * Sidebar hook
 * Provides access to sidebar state and controls
 * Manages sidebar visibility, collapse state, and persistence
 */

import { useCallback } from 'react';
import { useSidebarStore } from '@/lib/stores';

export interface UseSidebarReturn {
  /** Desktop sidebar open/close state */
  isOpen: boolean;
  /** Sidebar collapsed state (narrow mode) */
  isCollapsed: boolean;
  /** Sidebar pinned state */
  isPinned: boolean;
  /** Mobile sidebar open state */
  isMobileOpen: boolean;
  /** Toggle sidebar open/close */
  toggle: () => void;
  /** Open sidebar */
  open: () => void;
  /** Close sidebar */
  close: () => void;
  /** Collapse sidebar (narrow mode) */
  collapse: () => void;
  /** Expand sidebar (full width) */
  expand: () => void;
  /** Set collapsed state */
  setCollapsed: (collapsed: boolean) => void;
  /** Set pinned state */
  setPinned: (pinned: boolean) => void;
  /** Toggle mobile sidebar */
  toggleMobile: () => void;
  /** Close mobile sidebar */
  closeMobile: () => void;
}

/**
 * Hook to access sidebar state and actions
 * Provides clean interface for sidebar management with localStorage persistence
 * Handles both desktop and mobile sidebar states
 */
export function useSidebar(): UseSidebarReturn {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const isPinned = useSidebarStore((state) => state.isPinned);
  const storeToggle = useSidebarStore((state) => state.toggle);
  const storeOpen = useSidebarStore((state) => state.open);
  const storeClose = useSidebarStore((state) => state.close);
  const setCollapsed = useSidebarStore((state) => state.setCollapsed);
  const setPinned = useSidebarStore((state) => state.setPinned);

  // Mobile state (for responsive behavior - simplified for now)
  // In a real implementation, this would track window width via useMediaQuery
  const isMobileOpen = typeof window !== 'undefined' && window.innerWidth < 768 ? isOpen : false;

  /**
   * Toggle sidebar open/close
   */
  const toggle = useCallback(() => {
    storeToggle();
  }, [storeToggle]);

  /**
   * Open sidebar
   */
  const open = useCallback(() => {
    storeOpen();
  }, [storeOpen]);

  /**
   * Close sidebar
   */
  const close = useCallback(() => {
    storeClose();
  }, [storeClose]);

  /**
   * Collapse sidebar to narrow mode
   */
  const collapse = useCallback(() => {
    setCollapsed(true);
  }, [setCollapsed]);

  /**
   * Expand sidebar to full width
   */
  const expand = useCallback(() => {
    setCollapsed(false);
  }, [setCollapsed]);

  /**
   * Toggle mobile sidebar
   */
  const toggleMobile = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      storeToggle();
    }
  }, [storeToggle]);

  /**
   * Close mobile sidebar
   */
  const closeMobile = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      storeClose();
    }
  }, [storeClose]);

  return {
    isOpen,
    isCollapsed,
    isPinned,
    isMobileOpen,
    toggle,
    open,
    close,
    collapse,
    expand,
    setCollapsed,
    setPinned,
    toggleMobile,
    closeMobile,
  };
}
