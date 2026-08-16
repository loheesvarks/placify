/**
 * Dashboard hook
 * Provides access to dashboard state and actions
 * IMPORTANT: Foundation only - actual dashboard data integration is a future task
 */

import { useDashboardStore } from '@/lib/stores';

export interface UseDashboardReturn {
  isLoading: boolean;
  lastRefresh: Date | null;
  refresh: () => void;
}

/**
 * Hook to access dashboard state and actions
 * Foundation for future dashboard data management
 */
export function useDashboard(): UseDashboardReturn {
  const isLoading = useDashboardStore((state) => state.isLoading);
  const lastRefresh = useDashboardStore((state) => state.lastRefresh);
  const refresh = useDashboardStore((state) => state.refresh);

  return {
    isLoading,
    lastRefresh,
    refresh,
  };
}
