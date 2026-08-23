/**
 * Placify Context Service
 * Phase 3A: Complete user context retrieval
 * 
 * This service provides the authenticated user's complete Placify context:
 * - Profile
 * - Target (role, package, companies, timeline)
 * - Skills (with assessments)
 * - Evidence
 * - Skill Gaps
 * - Learning Progress
 * - Coding Progress
 * - Study History
 * - Recent Activity
 * - Recommendations
 * 
 * IMPORTANT: Never exposes another user's information
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type TargetProfile = Database['public']['Tables']['target_profiles']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];
type SkillEvidence = Database['public']['Tables']['skill_evidence']['Row'];
type SkillAssessment = Database['public']['Tables']['skill_assessments']['Row'];
type SkillGap = Database['public']['Tables']['skill_gaps']['Row'];
type Recommendation = Database['public']['Tables']['recommendations']['Row'];
type UserProgress = Database['public']['Tables']['user_progress']['Row'];
type ProblemProgress = Database['public']['Tables']['problem_progress']['Row'];

/**
 * Complete Placify context for a user
 */
export interface PlacifyContext {
  userId: string;
  profile: Profile | null;
  target: TargetProfile | null;
  skills: Skill[];
  skillEvidence: SkillEvidence[];
  skillAssessments: SkillAssessment[];
  skillGaps: SkillGap[];
  recommendations: Recommendation[];
  learningProgress: UserProgress[];
  codingProgress: ProblemProgress[];
  // Study sessions will be added in Phase 3J
  // studySessions: StudySession[];
  // Activity will be added when activity table is created
  // recentActivity: Activity[];
}

/**
 * Simplified context for quick operations
 */
export interface PlacifyContextSummary {
  userId: string;
  hasProfile: boolean;
  hasTarget: boolean;
  targetRole: string | null;
  skillCount: number;
  assessedSkillCount: number;
  gapCount: number;
  recommendationCount: number;
}

/**
 * Placify Context Service
 * Retrieves complete user context for intelligence operations
 */
class PlacifyContextService {
  /**
   * Get complete Placify context for authenticated user
   * Returns null if user is not authenticated
   */
  async getContext(): Promise<PlacifyContext | null> {
    try {
      const supabase = await createClient();

      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[PlacifyContext] Not authenticated:', authError);
        return null;
      }

      const userId = user.id;

      // Fetch all context data in parallel for performance
      const [
        profileResult,
        targetResult,
        skillsResult,
        evidenceResult,
        assessmentsResult,
        gapsResult,
        recommendationsResult,
        learningProgressResult,
        codingProgressResult,
      ] = await Promise.all([
        // Profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single(),

        // Target profile
        supabase
          .from('target_profiles')
          .select('*')
          .eq('user_id', userId)
          .single(),

        // Skills
        supabase
          .from('skills')
          .select('*')
          .eq('user_id', userId)
          .order('skill_name'),

        // Skill evidence
        supabase
          .from('skill_evidence')
          .select('*')
          .eq('user_id', userId)
          .order('recorded_at', { ascending: false }),

        // Skill assessments
        supabase
          .from('skill_assessments')
          .select('*')
          .eq('user_id', userId),

        // Skill gaps
        supabase
          .from('skill_gaps')
          .select('*')
          .eq('user_id', userId)
          .order('priority_score', { ascending: false }),

        // Recommendations
        supabase
          .from('recommendations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),

        // Learning progress
        supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId),

        // Coding progress
        supabase
          .from('problem_progress')
          .select('*')
          .eq('user_id', userId),
      ]);

      // Log errors but continue - some data may not exist yet
      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        console.error('[PlacifyContext] Profile error:', profileResult.error);
      }
      if (targetResult.error && targetResult.error.code !== 'PGRST116') {
        console.error('[PlacifyContext] Target error:', targetResult.error);
      }
      if (skillsResult.error) {
        console.error('[PlacifyContext] Skills error:', skillsResult.error);
      }
      if (evidenceResult.error) {
        console.error('[PlacifyContext] Evidence error:', evidenceResult.error);
      }

      return {
        userId,
        profile: profileResult.data || null,
        target: targetResult.data || null,
        skills: skillsResult.data || [],
        skillEvidence: evidenceResult.data || [],
        skillAssessments: assessmentsResult.data || [],
        skillGaps: gapsResult.data || [],
        recommendations: recommendationsResult.data || [],
        learningProgress: learningProgressResult.data || [],
        codingProgress: codingProgressResult.data || [],
      };
    } catch (error) {
      console.error('[PlacifyContext] Unexpected error:', error);
      return null;
    }
  }

  /**
   * Get context summary (lightweight version)
   */
  async getContextSummary(): Promise<PlacifyContextSummary | null> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return null;
      }

      const userId = user.id;

      const [
        profileResult,
        targetResult,
        skillsCount,
        assessmentsCount,
        gapsCount,
        recommendationsCount,
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single(),

        supabase
          .from('target_profiles')
          .select('target_role')
          .eq('user_id', userId)
          .single(),

        supabase
          .from('skills')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),

        supabase
          .from('skill_assessments')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),

        supabase
          .from('skill_gaps')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),

        supabase
          .from('recommendations')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
      ]);

      return {
        userId,
        hasProfile: !profileResult.error,
        hasTarget: !targetResult.error,
        targetRole: targetResult.data?.target_role || null,
        skillCount: skillsCount.count || 0,
        assessedSkillCount: assessmentsCount.count || 0,
        gapCount: gapsCount.count || 0,
        recommendationCount: recommendationsCount.count || 0,
      };
    } catch (error) {
      console.error('[PlacifyContext] Summary error:', error);
      return null;
    }
  }

  /**
   * Get context for specific user (admin/debug only)
   * WARNING: Use only for authorized operations
   */
  async getContextForUser(userId: string): Promise<PlacifyContext | null> {
    try {
      const supabase = await createClient();

      // Verify current user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[PlacifyContext] Not authenticated for getContextForUser');
        return null;
      }

      // For now, only allow getting own context
      // TODO: Add admin role check when admin functionality is needed
      if (user.id !== userId) {
        console.error('[PlacifyContext] Unauthorized access attempt to user:', userId);
        return null;
      }

      // Fetch data (same as getContext but with explicit userId)
      const [
        profileResult,
        targetResult,
        skillsResult,
        evidenceResult,
        assessmentsResult,
        gapsResult,
        recommendationsResult,
        learningProgressResult,
        codingProgressResult,
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('target_profiles').select('*').eq('user_id', userId).single(),
        supabase.from('skills').select('*').eq('user_id', userId).order('skill_name'),
        supabase.from('skill_evidence').select('*').eq('user_id', userId).order('recorded_at', { ascending: false }),
        supabase.from('skill_assessments').select('*').eq('user_id', userId),
        supabase.from('skill_gaps').select('*').eq('user_id', userId).order('priority_score', { ascending: false }),
        supabase.from('recommendations').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('user_progress').select('*').eq('user_id', userId),
        supabase.from('problem_progress').select('*').eq('user_id', userId),
      ]);

      return {
        userId,
        profile: profileResult.data || null,
        target: targetResult.data || null,
        skills: skillsResult.data || [],
        skillEvidence: evidenceResult.data || [],
        skillAssessments: assessmentsResult.data || [],
        skillGaps: gapsResult.data || [],
        recommendations: recommendationsResult.data || [],
        learningProgress: learningProgressResult.data || [],
        codingProgress: codingProgressResult.data || [],
      };
    } catch (error) {
      console.error('[PlacifyContext] Unexpected error in getContextForUser:', error);
      return null;
    }
  }
}

export const placifyContextService = new PlacifyContextService();

