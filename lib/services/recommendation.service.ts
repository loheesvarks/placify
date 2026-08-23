/**
 * Recommendation Service
 * Phase 3F: Recommendation engine
 * 
 * Answers: "WHAT SHOULD THIS STUDENT DO NEXT?"
 * 
 * Recommendations are:
 * - Deterministic (v1.0.0 - no AI yet)
 * - Evidence-based
 * - Auditable (reason, priority, evidence stored)
 * - Transparent (context preserved)
 * 
 * Recommendation types:
 * - next_action: Immediate next step
 * - daily_plan: Suggested daily activities
 * - skill_focus: Which skill to prioritize
 * - course_suggestion: Specific course/lesson to take
 * - practice_suggestion: Coding problem or project idea
 * 
 * Priority considers:
 * - Skill gaps (from skill_gap_service)
 * - Prerequisites
 * - Timeline pressure
 * - Recent activity
 * - Available time
 * 
 * CALCULATION VERSION: v1.0.0
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database.types';
import { skillGapService } from './skill-gap.service';
import { placifyContextService } from './placify-context.service';
import { findMatchingUserSkill } from './skill-normalization.service';

type RecommendationInsert = Database['public']['Tables']['recommendations']['Insert'];
type Recommendation = Database['public']['Tables']['recommendations']['Row'];

const CALCULATION_VERSION = 'v1.0.0';

/**
 * Recommendation types
 */
export type RecommendationType = 
  | 'next_action'
  | 'daily_plan'
  | 'skill_focus'
  | 'course_suggestion'
  | 'practice_suggestion';

/**
 * Recommendation priority
 */
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Recommendation generation result
 */
export interface RecommendationGeneration {
  type: RecommendationType;
  action: string;
  reason: string;
  targetSkillName: string | null;
  expectedBenefit: string;
  priority: RecommendationPriority;
  evidenceUsed: {
    gapCount?: number;
    topGaps?: string[];
    targetRole?: string;
    timeline?: number;
    hoursPerDay?: number;
    recentActivity?: string[];
  };
  context: {
    calculationVersion: string;
    calculatedAt: string;
    userHasTarget: boolean;
    assessedSkillCount: number;
  };
}

/**
 * Recommendation Service
 * Generates intelligent next-best-action recommendations
 */
class RecommendationService {
  /**
   * Generate next-best-action recommendation
   * This is the main recommendation function
   */
  async generateNextAction(): Promise<RecommendationGeneration | null> {
    try {
      const context = await placifyContextService.getContext();
      if (!context) {
        return null;
      }

      // Check if user has target
      if (!context.target) {
        return {
          type: 'next_action',
          action: 'Set your target role and career goal',
          reason: 'Before we can recommend learning paths, you need to define your target role and career aspirations. This helps us tailor recommendations to your specific goals.',
          targetSkillName: null,
          expectedBenefit: 'Enables personalized learning recommendations aligned with your career goals',
          priority: 'critical',
          evidenceUsed: {},
          context: {
            calculationVersion: CALCULATION_VERSION,
            calculatedAt: new Date().toISOString(),
            userHasTarget: false,
            assessedSkillCount: context.skillAssessments.length,
          },
        };
      }

      // Get skill gaps
      const gaps = await skillGapService.getAllGaps();

      // If no gaps calculated yet
      if (gaps.length === 0) {
        return {
          type: 'next_action',
          action: 'Complete your skill assessment',
          reason: 'We need to assess your current skills against your target role requirements to identify learning priorities.',
          targetSkillName: null,
          expectedBenefit: 'Identifies your skill gaps and learning priorities',
          priority: 'high',
          evidenceUsed: {
            targetRole: context.target.target_role,
          },
          context: {
            calculationVersion: CALCULATION_VERSION,
            calculatedAt: new Date().toISOString(),
            userHasTarget: true,
            assessedSkillCount: context.skillAssessments.length,
          },
        };
      }

      // Get top gaps
      const topGaps = gaps.slice(0, 5);
      const topGap = topGaps[0];

      // Check if top gap is prerequisite
      if (topGap.is_prerequisite && topGap.gap_size !== 'none') {
        return {
          type: 'skill_focus',
          action: `Focus on ${topGap.skill_name} fundamentals`,
          reason: `${topGap.skill_name} is a prerequisite skill for your target role. Current level: ${topGap.current_level}, Required: ${topGap.required_level}. Mastering this ${topGap.importance} skill will unlock learning paths for dependent skills.`,
          targetSkillName: topGap.skill_name,
          expectedBenefit: `Build foundation for dependent skills, progress toward ${context.target.target_role} role`,
          priority: topGap.urgency as RecommendationPriority,
          evidenceUsed: {
            gapCount: gaps.length,
            topGaps: topGaps.map(g => g.skill_name),
            targetRole: context.target.target_role,
            timeline: context.target.timeline_weeks || undefined,
            hoursPerDay: context.target.available_hours_per_day || undefined,
          },
          context: {
            calculationVersion: CALCULATION_VERSION,
            calculatedAt: new Date().toISOString(),
            userHasTarget: true,
            assessedSkillCount: context.skillAssessments.length,
          },
        };
      }

      // Essential skill with large gap
      if (topGap.importance === 'essential' && topGap.gap_size === 'large') {
        return {
          type: 'skill_focus',
          action: `Begin ${topGap.skill_name} learning path`,
          reason: `${topGap.skill_name} is an essential skill for ${context.target.target_role} with a ${topGap.gap_size} gap. Current level: ${topGap.current_level}, Required: ${topGap.required_level}. This is a high-priority skill for your target role.`,
          targetSkillName: topGap.skill_name,
          expectedBenefit: `Build essential competency for ${context.target.target_role}, close critical skill gap`,
          priority: topGap.urgency as RecommendationPriority,
          evidenceUsed: {
            gapCount: gaps.length,
            topGaps: topGaps.map(g => g.skill_name),
            targetRole: context.target.target_role,
            timeline: context.target.timeline_weeks || undefined,
            hoursPerDay: context.target.available_hours_per_day || undefined,
          },
          context: {
            calculationVersion: CALCULATION_VERSION,
            calculatedAt: new Date().toISOString(),
            userHasTarget: true,
            assessedSkillCount: context.skillAssessments.length,
          },
        };
      }

      // General recommendation based on top gap
      let actionVerb = 'Continue learning';
      if (topGap.current_level === 'unknown') {
        actionVerb = 'Start learning';
      } else if (topGap.current_level === 'beginner') {
        actionVerb = 'Build proficiency in';
      } else if (topGap.current_level === 'intermediate') {
        actionVerb = 'Advance your';
      }

      return {
        type: 'skill_focus',
        action: `${actionVerb} ${topGap.skill_name}`,
        reason: `${topGap.skill_name} is ${topGap.importance === 'essential' ? 'an essential' : topGap.importance === 'recommended' ? 'a recommended' : 'an optional'} skill for ${context.target.target_role}. Current level: ${topGap.current_level}, Required: ${topGap.required_level}. Gap: ${topGap.gap_size}.`,
        targetSkillName: topGap.skill_name,
        expectedBenefit: `Progress toward ${topGap.required_level} level in ${topGap.skill_name}, align with ${context.target.target_role} requirements`,
        priority: topGap.urgency as RecommendationPriority,
        evidenceUsed: {
          gapCount: gaps.length,
          topGaps: topGaps.map(g => g.skill_name),
          targetRole: context.target.target_role,
          timeline: context.target.timeline_weeks || undefined,
          hoursPerDay: context.target.available_hours_per_day || undefined,
        },
        context: {
          calculationVersion: CALCULATION_VERSION,
          calculatedAt: new Date().toISOString(),
          userHasTarget: true,
          assessedSkillCount: context.skillAssessments.length,
        },
      };
    } catch (error) {
      console.error('[Recommendation] Unexpected error in generateNextAction:', error);
      return null;
    }
  }

  /**
   * Generate daily plan recommendations
   * Considers available time and timeline pressure
   */
  async generateDailyPlan(): Promise<RecommendationGeneration[]> {
    try {
      const context = await placifyContextService.getContext();
      if (!context || !context.target) {
        return [];
      }

      const hoursAvailable = context.target.available_hours_per_day || 2;
      const gaps = await skillGapService.getTopGaps(3); // Top 3 gaps

      if (gaps.length === 0) {
        return [];
      }

      const recommendations: RecommendationGeneration[] = [];

      // Allocate time based on priority
      let remainingHours = hoursAvailable;
      for (const gap of gaps) {
        if (remainingHours <= 0) break;

        const allocatedHours = Math.min(
          remainingHours,
          gap.importance === 'essential' ? 1.5 : gap.importance === 'recommended' ? 1.0 : 0.5
        );

        const activities: string[] = [];
        if (gap.gap_size === 'large' || gap.current_level === 'unknown') {
          activities.push('foundational lessons');
        }
        if (gap.gap_size === 'medium' || gap.current_level === 'beginner') {
          activities.push('practice exercises');
        }
        if (gap.gap_size === 'small' || gap.current_level === 'intermediate') {
          activities.push('advanced challenges');
        }

        recommendations.push({
          type: 'daily_plan',
          action: `Spend ${allocatedHours.toFixed(1)} hours on ${gap.skill_name}`,
          reason: `${gap.skill_name} is ${gap.importance} with ${gap.gap_size} gap. Suggested activities: ${activities.join(', ')}.`,
          targetSkillName: gap.skill_name,
          expectedBenefit: `Close ${gap.skill_name} gap through focused practice`,
          priority: gap.urgency as RecommendationPriority,
          evidenceUsed: {
            hoursPerDay: hoursAvailable,
            targetRole: context.target.target_role,
          },
          context: {
            calculationVersion: CALCULATION_VERSION,
            calculatedAt: new Date().toISOString(),
            userHasTarget: true,
            assessedSkillCount: context.skillAssessments.length,
          },
        });

        remainingHours -= allocatedHours;
      }

      return recommendations;
    } catch (error) {
      console.error('[Recommendation] Unexpected error in generateDailyPlan:', error);
      return [];
    }
  }

  /**
   * Generate and save next-best-action recommendation
   */
  async generateAndSave(): Promise<boolean> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return false;
      }

      const recommendation = await this.generateNextAction();
      if (!recommendation) {
        return false;
      }

      // FIXED: Use normalization service for safe skill matching
      let targetSkillId: string | null = null;
      if (recommendation.targetSkillName) {
        const { data: userSkills } = await supabase
          .from('skills')
          .select('id, skill_name')
          .eq('user_id', user.id);

        if (userSkills && userSkills.length > 0) {
          const matchResult = findMatchingUserSkill(
            recommendation.targetSkillName,
            userSkills
          );

          if (matchResult.skill && matchResult.matchType !== 'none') {
            targetSkillId = matchResult.skill.id;
          } else if (matchResult.matchType === 'ambiguous') {
            console.warn('[Recommendation] Ambiguous skill match:', matchResult.explanation);
            // Still save recommendation but without skill_id link
          }
        }
      }

      // Prepare recommendation record
      const recData: RecommendationInsert = {
        user_id: user.id,
        recommendation_type: recommendation.type,
        action: recommendation.action,
        reason: recommendation.reason,
        target_skill_id: targetSkillId,
        target_skill_name: recommendation.targetSkillName,
        expected_benefit: recommendation.expectedBenefit,
        priority: recommendation.priority,
        evidence_used: recommendation.evidenceUsed as Database['public']['Tables']['recommendations']['Insert']['evidence_used'],
        context: recommendation.context as Database['public']['Tables']['recommendations']['Insert']['context'],
        calculation_version: CALCULATION_VERSION,
        accepted: null,
        acted_upon_at: null,
      };

      const { error: insertError } = await supabase
        .from('recommendations')
        .insert(recData);

      if (insertError) {
        console.error('[Recommendation] Insert error:', insertError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[Recommendation] Unexpected error in generateAndSave:', error);
      return false;
    }
  }

  /**
   * Get recent recommendations
   */
  async getRecentRecommendations(limit: number = 10): Promise<Recommendation[]> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return [];
      }

      const { data: recommendations, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[Recommendation] Error fetching recommendations:', error);
        return [];
      }

      return recommendations || [];
    } catch (error) {
      console.error('[Recommendation] Unexpected error in getRecentRecommendations:', error);
      return [];
    }
  }

  /**
   * Mark recommendation as accepted
   */
  async acceptRecommendation(recommendationId: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return false;
      }

      const { error: updateError } = await supabase
        .from('recommendations')
        .update({ accepted: true })
        .eq('id', recommendationId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('[Recommendation] Error accepting recommendation:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[Recommendation] Unexpected error in acceptRecommendation:', error);
      return false;
    }
  }

  /**
   * Mark recommendation as acted upon
   */
  async markActedUpon(recommendationId: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return false;
      }

      const { error: updateError } = await supabase
        .from('recommendations')
        .update({ 
          acted_upon_at: new Date().toISOString(),
          accepted: true, // Implicitly accepted if acted upon
        })
        .eq('id', recommendationId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('[Recommendation] Error marking acted upon:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[Recommendation] Unexpected error in markActedUpon:', error);
      return false;
    }
  }

  /**
   * Refresh recommendations (recalculate and save new ones)
   * Called after significant evidence changes
   */
  async refreshRecommendations(): Promise<number> {
    try {
      const success = await this.generateAndSave();
      return success ? 1 : 0;
    } catch (error) {
      console.error('[Recommendation] Error in refreshRecommendations:', error);
      return 0;
    }
  }
}

export const recommendationService = new RecommendationService();

