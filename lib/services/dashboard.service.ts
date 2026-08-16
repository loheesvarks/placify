/**
 * Dashboard service
 * Service layer for dashboard data operations
 * IMPORTANT: Dashboard features not yet implemented - this is a foundation
 */

import type { AuthUser } from '@/lib/types';
import { getUser } from '@/lib/actions/auth.actions';

/**
 * Dashboard service interface
 * Defines the contract for dashboard data operations
 */
export interface IDashboardService {
  /**
   * Get user profile data
   * Currently wraps auth.getUser() until proper dashboard actions exist
   */
  getUserProfile(): Promise<AuthUser | null>;
  
  // Future methods (will be implemented when dashboard actions are created):
  // getDashboardData(): Promise<DashboardData>;
  // getRecentActivity(): Promise<Activity[]>;
  // getStatistics(): Promise<Statistics>;
  // getSkills(): Promise<Skill[]>;
}

/**
 * Dashboard service implementation
 * Foundation for future dashboard data management
 */
class DashboardService implements IDashboardService {
  /**
   * Get user profile data
   * Wraps existing auth action until proper dashboard actions exist
   */
  async getUserProfile(): Promise<AuthUser | null> {
    try {
      const user = await getUser();
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
      };
    } catch (error) {
      console.error('[DashboardService] Get user profile error:', error);
      return null;
    }
  }

  /**
   * Future: Get dashboard data
   * Will be implemented when dashboard actions are created
   */
  // async getDashboardData(): Promise<DashboardData> {
  //   // TODO: Implement when dashboard actions exist
  //   throw new Error('Dashboard data fetching not yet implemented');
  // }

  /**
   * Future: Get recent activity
   * Will be implemented when dashboard actions are created
   */
  // async getRecentActivity(): Promise<Activity[]> {
  //   // TODO: Implement when dashboard actions exist
  //   throw new Error('Recent activity fetching not yet implemented');
  // }

  /**
   * Future: Get user statistics
   * Will be implemented when dashboard actions are created
   */
  // async getStatistics(): Promise<Statistics> {
  //   // TODO: Implement when dashboard actions exist
  //   throw new Error('Statistics fetching not yet implemented');
  // }

  /**
   * Future: Get user skills
   * Will be implemented when dashboard actions are created
   */
  // async getSkills(): Promise<Skill[]> {
  //   // TODO: Implement when dashboard actions exist
  //   throw new Error('Skills fetching not yet implemented');
  // }
}

export const dashboardService = new DashboardService();
