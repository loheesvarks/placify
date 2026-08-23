'use server';

/**
 * Dashboard Actions
 * Phase 3K: Dashboard real data integration
 * 
 * Replaces mock/static values with real calculations from intelligence engine.
 * Shows "Not assessed" / "No data yet" when appropriate instead of fake values.
 */

import { placifyContextService } from '@/lib/services/placify-context.service';
import { skillAssessmentService } from '@/lib/services/skill-assessment.service';
import { skillGapService } from '@/lib/services/skill-gap.service';
import { recommendationService } from '@/lib/services/recommendation.service';
import { getTodayStudyTime, getWeeklyStudyTime } from './study.actions';
import { getCompletedLessons } from './learning.actions';
import { getSolvedProblems } from './coding.actions';
import { createClient } from '@/lib/supabase/server';

interface DashboardData {
  studyTime: {
    today: number; // minutes
    thisWeek: number; // minutes
  };
  streak: {
    current: number;
    longest: number;
    lastActivityDate: string | null;
  };
  progress: {
    completedLessons: number;
    solvedProblems: number;
    quizzesTaken: number;
    skillsAssessed: number;
    skillsTotal: number;
  };
  recommendations: Array<{
    id: string;
    action: string;
    reason: string;
    priority: string;
    targetSkill: string | null;
  }>;
  topGaps: Array<{
    skillName: string;
    gapSize: string;
    importance: string;
    urgency: string;
    currentLevel: string;
    requiredLevel: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    claimedLevel: number | null;
    demonstratedLevel: string;
    confidence: string;
    evidenceCount: number;
  }>;
  hasTarget: boolean;
  targetRole: string | null;
}

/**
 * Get complete dashboard data with real calculations
 */
export async function getDashboardData(): Promise<{
  success: boolean;
  error?: string;
  data?: DashboardData;
}> {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get context
    const context = await placifyContextService.getContext();
    if (!context) {
      return { success: false, error: 'Failed to load context' };
    }

    // Get study time
    const todayTime = await getTodayStudyTime();
    const weekTime = await getWeeklyStudyTime();

    // Get user progress for streak
    const { data: userProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get completed lessons
    const completedLessonsResult = await getCompletedLessons();
    const completedLessons = completedLessonsResult.success ? completedLessonsResult.data?.length || 0 : 0;

    // Get solved problems
    const solvedProblemsResult = await getSolvedProblems();
    const solvedProblems = solvedProblemsResult.success ? solvedProblemsResult.data?.length || 0 : 0;

    // Get quiz attempts count
    const { count: quizAttemptsCount } = await supabase
      .from('quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get recommendations
    const recentRecs = await recommendationService.getRecentRecommendations(5);
    const recommendations = recentRecs.map(r => ({
      id: r.id,
      action: r.action,
      reason: r.reason,
      priority: r.priority,
      targetSkill: r.target_skill_name,
    }));

    // Get top gaps
    const gaps = await skillGapService.getTopGaps(5);
    const topGaps = gaps.map(g => ({
      skillName: g.skill_name,
      gapSize: g.gap_size,
      importance: g.importance,
      urgency: g.urgency,
      currentLevel: g.current_level,
      requiredLevel: g.required_level,
    }));

    // Get skill assessments with skill names
    const assessments = await skillAssessmentService.getAllAssessments();
    const skillsWithAssessments = await Promise.all(
      assessments.map(async (a) => {
        const { data: skill } = await supabase
          .from('skills')
          .select('skill_name, proficiency_level')
          .eq('id', a.skill_id)
          .single();

        return {
          id: a.skill_id,
          name: skill?.skill_name || 'Unknown',
          claimedLevel: skill?.proficiency_level || null,
          demonstratedLevel: a.demonstrated_level,
          confidence: a.confidence,
          evidenceCount: a.evidence_count,
        };
      })
    );

    return {
      success: true,
      data: {
        studyTime: {
          today: todayTime.data?.minutes || 0,
          thisWeek: weekTime.data?.minutes || 0,
        },
        streak: {
          current: userProgress?.current_streak || 0,
          longest: userProgress?.longest_streak || 0,
          lastActivityDate: userProgress?.last_activity_date || null,
        },
        progress: {
          completedLessons,
          solvedProblems,
          quizzesTaken: quizAttemptsCount || 0,
          skillsAssessed: assessments.length,
          skillsTotal: context.skills.length,
        },
        recommendations,
        topGaps,
        skills: skillsWithAssessments,
        hasTarget: !!context.target,
        targetRole: context.target?.target_role || null,
      },
    };
  } catch (error) {
    console.error('[Dashboard] Error:', error);
    return { success: false, error: 'Failed to load dashboard data' };
  }
}

/**
 * Get next best action
 */
export async function getNextBestAction(): Promise<{
  success: boolean;
  error?: string;
  data?: {
    action: string;
    reason: string;
    priority: string;
    targetSkill: string | null;
    expectedBenefit: string;
  };
}> {
  try {
    const recommendation = await recommendationService.generateNextAction();
    
    if (!recommendation) {
      return { success: false, error: 'No recommendation available' };
    }

    return {
      success: true,
      data: {
        action: recommendation.action,
        reason: recommendation.reason,
        priority: recommendation.priority,
        targetSkill: recommendation.targetSkillName,
        expectedBenefit: recommendation.expectedBenefit,
      },
    };
  } catch (error) {
    console.error('[Dashboard] Next action error:', error);
    return { success: false, error: 'Failed to generate recommendation' };
  }
}

/**
 * Trigger intelligence engine recalculation
 * Call this after significant data changes
 */
export async function recalculateIntelligence(): Promise<{
  success: boolean;
  error?: string;
  data?: {
    assessmentsCalculated: number;
    gapsCalculated: number;
    recommendationsGenerated: number;
  };
}> {
  try {
    // Recalculate all assessments
    const assessmentsCalculated = await skillAssessmentService.calculateAndSaveAll();

    // Recalculate gaps
    const gapsCalculated = await skillGapService.calculateAndSaveAll();

    // Generate fresh recommendation
    const recommendationsGenerated = await recommendationService.refreshRecommendations();

    return {
      success: true,
      data: {
        assessmentsCalculated,
        gapsCalculated,
        recommendationsGenerated,
      },
    };
  } catch (error) {
    console.error('[Dashboard] Recalculation error:', error);
    return { success: false, error: 'Failed to recalculate' };
  }
}

