/**
 * Dashboard hook
 * Provides access to dashboard state and actions
 * Integrates with dashboardService for data operations
 * 
 * IMPORTANT: Foundation only - full dashboard data integration is a future task
 * Currently only provides getUserProfile() via service layer
 */

import { useCallback, useEffect, useState } from 'react';
import { useDashboardStore } from '@/lib/stores';
import { dashboardService } from '@/lib/services/dashboard.service';
import type { AuthUser } from '@/lib/types';

export interface UseDashboardReturn {
  /** User profile data (currently available via getUserProfile) */
  userProfile: AuthUser | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
  /** Last refresh timestamp */
  lastRefresh: Date | null;
  /** Refetch dashboard data */
  refetch: () => Promise<void>;
  
  // Future properties (not yet implemented):
  // data: DashboardData | null;
  // activities: Activity[];
}

/**
 * Hook to access dashboard state and actions
 * Provides clean interface: Component → Hook → Service → Server Action → Supabase
 * 
 * Foundation for future dashboard data management.
 * Current limitation: Only getUserProfile() is implemented.
 * Full dashboard data (activities, statistics, skills) requires future implementation.
 */
export function useDashboard(): UseDashboardReturn {
  const isLoading = useDashboardStore((state) => state.isLoading);
  const lastRefresh = useDashboardStore((state) => state.lastRefresh);
  const setLoading = useDashboardStore((state) => state.setLoading);
  const refresh = useDashboardStore((state) => state.refresh);

  const [userProfile, setUserProfile] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch dashboard data
   * Currently only fetches user profile as that's all that's implemented
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile (only implemented service method)
      const profile = await dashboardService.getUserProfile();
      setUserProfile(profile);
      
      // Future: Fetch complete dashboard data when available
      // const [profile, activities, statistics, skills] = await Promise.all([
      //   dashboardService.getUserProfile(),
      //   dashboardService.getRecentActivity(),
      //   dashboardService.getStatistics(),
      //   dashboardService.getSkills(),
      // ]);
      
      refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      console.error('[useDashboard] Fetch error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, refresh]);

  /**
   * Refetch dashboard data
   */
  const refetch = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  // Initial fetch on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    userProfile,
    isLoading,
    error,
    lastRefresh,
    refetch,
  };
}
