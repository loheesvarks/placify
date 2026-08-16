/**
 * Dashboard state store
 * Infrastructure foundation for dashboard data management
 * IMPORTANT: Minimal foundation only - does not contain actual dashboard implementation
 */

import { create } from 'zustand';

interface DashboardState {
  isLoading: boolean;
  lastRefresh: Date | null;
}

interface DashboardActions {
  setLoading: (loading: boolean) => void;
  refresh: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
  isLoading: false,
  lastRefresh: null,
};

/**
 * Zustand store for dashboard state
 * Foundation for future dashboard data management
 */
export const useDashboardStore = create<DashboardStore>()((set) => ({
  ...initialState,

  setLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),

  refresh: () =>
    set(() => ({
      lastRefresh: new Date(),
    })),
}));
