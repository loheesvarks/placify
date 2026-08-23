'use server';

/**
 * Coding Practice Actions
 * Phase 3H: Coding practice integration with evidence capture
 * 
 * Server actions for coding problems and practice.
 * 
 * When a problem is solved:
 * 1. Persist problem progress
 * 2. Create coding-problem evidence
 * 3. Recalculate affected skill assessment
 * 4. Recalculate gaps and recommendations
 * 
 * IMPORTANT: One solved problem ≠ mastery
 * Consider difficulty, consistency, success rate
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database.types';
import { skillEvidenceService, type CodingProblemMetadata } from '@/lib/services/skill-evidence.service';
import { skillAssessmentService } from '@/lib/services/skill-assessment.service';
import { skillGapService } from '@/lib/services/skill-gap.service';
import { recommendationService } from '@/lib/services/recommendation.service';

type Problem = Database['public']['Tables']['coding_problems']['Row'];
type ProblemProgress = Database['public']['Tables']['problem_progress']['Row'];

interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Get all problems (optionally filtered)
 */
export async function getProblems(filters?: {
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}): Promise<ActionResponse<Problem[]>> {
  try {
    const supabase = await createClient();

    let query = supabase.from('coding_problems').select('*').order('title');

    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    const { data: problems, error } = await query;

    if (error) {
      return { success: false, error: 'Failed to fetch problems' };
    }

    return { success: true, data: problems || [] };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get a single problem by ID
 */
export async function getProblem(problemId: string): Promise<ActionResponse<Problem>> {
  try {
    const supabase = await createClient();

    const { data: problem, error } = await supabase
      .from('coding_problems')
      .select('*')
      .eq('id', problemId)
      .single();

    if (error || !problem) {
      return { success: false, error: 'Problem not found' };
    }

    return { success: true, data: problem };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get problem progress for current user
 */
export async function getProblemProgress(
  problemId: string
): Promise<ActionResponse<ProblemProgress | null>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: progress, error } = await supabase
      .from('problem_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('problem_id', problemId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { success: false, error: 'Failed to check progress' };
    }

    return { success: true, data: progress || null };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Record a problem attempt
 */
export async function recordAttempt(
  problemId: string,
  passed: boolean
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get or create progress
    const { data: progressData } = await supabase
      .from('problem_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('problem_id', problemId)
      .single();

    const progress = progressData as ProblemProgress | null;

    if (progress) {
      // Update existing progress
      const updateData = {
        attempts: (progress.attempts || 0) + 1,
        status: (progress.status === 'solved' || passed) ? ('solved' as const) : ('attempted' as const),
        solved_at: passed ? new Date().toISOString() : progress.solved_at,
        last_attempted_at: new Date().toISOString(),
      };
      
      const { error: updateError } = await supabase
        .from('problem_progress')
        .update(updateData)
        .eq('id', progress.id);

      if (updateError) {
        return { success: false, error: 'Failed to update progress' };
      }
    } else {
      // Create new progress
      const { error: insertError } = await supabase
        .from('problem_progress')
        .insert({
          user_id: user.id,
          problem_id: problemId,
          attempts: 1,
          status: passed ? 'solved' : 'attempted',
          solved_at: passed ? new Date().toISOString() : null,
          last_attempted_at: new Date().toISOString(),
        });

      if (insertError) {
        return { success: false, error: 'Failed to save progress' };
      }
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Mark problem as solved
 * This triggers evidence capture and recalculations
 */
export async function markSolved(
  problemId: string,
  skillId: string,
  timeSpentMinutes?: number,
  testsPassed?: number,
  totalTests?: number
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get problem details
    const { data: problem, error: problemError } = await supabase
      .from('coding_problems')
      .select('*')
      .eq('id', problemId)
      .single();

    if (problemError || !problem) {
      return { success: false, error: 'Problem not found' };
    }

    // Get current attempts count
    const { data: progressData2 } = await supabase
      .from('problem_progress')
      .select('attempts')
      .eq('user_id', user.id)
      .eq('problem_id', problemId)
      .single();

    const attemptCount = ((progressData2 as {attempts: number} | null)?.attempts || 0) + 1;
    const solvedAt = new Date().toISOString();

    // 1. Update problem progress
    const { error: progressError } = await supabase
      .from('problem_progress')
      .upsert({
        user_id: user.id,
        problem_id: problemId,
        attempts: attemptCount,
        status: 'solved' as const,
        solved_at: solvedAt,
        last_attempted_at: solvedAt,
      }, {
        onConflict: 'user_id,problem_id',
      });

    if (progressError) {
      console.error('[Coding] Progress error:', progressError);
      return { success: false, error: 'Failed to save progress' };
    }

    // 2. Create coding-problem evidence
    const evidenceMetadata: CodingProblemMetadata = {
      problemId,
      problemTitle: problem.title,
      difficulty: problem.difficulty as 'easy' | 'medium' | 'hard',
      topic: problem.category,
      attemptCount,
      solvedAt,
      timeSpent: timeSpentMinutes,
      testsPassed,
      totalTests,
    };

    const evidenceResult = await skillEvidenceService.captureCodingProblem(
      skillId,
      evidenceMetadata
    );

    if (!evidenceResult.success) {
      console.error('[Coding] Evidence capture failed:', evidenceResult.error);
      // Don't fail the solve, just log
    }

    // 3. Recalculate skill assessment
    await skillAssessmentService.calculateAndSave(skillId);

    // 4. Recalculate gaps and recommendations
    await skillGapService.calculateAndSaveAll();
    await recommendationService.refreshRecommendations();

    return { success: true };
  } catch (error) {
    console.error('[Coding] Unexpected error:', error);
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get user's solved problems
 */
export async function getSolvedProblems(): Promise<ActionResponse<ProblemProgress[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: progress, error } = await supabase
      .from('problem_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'solved')
      .order('last_attempted_at', { ascending: false });

    if (error) {
      return { success: false, error: 'Failed to fetch solved problems' };
    }

    return { success: true, data: progress || [] };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get coding practice statistics
 */
export async function getCodingStats(): Promise<ActionResponse<{
  totalAttempted: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  successRate: number;
}>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: progress } = await supabase
      .from('problem_progress')
      .select('*, problems(difficulty)')
      .eq('user_id', user.id);

    if (!progress) {
      return {
        success: true,
        data: {
          totalAttempted: 0,
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          successRate: 0,
        },
      };
    }

    const totalAttempted = progress.length;
    const solved = progress.filter(p => p.status === 'solved');
    const totalSolved = solved.length;

    // Count by difficulty (need to join with problems)
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    for (const p of solved) {
      // Get problem difficulty
      const { data: problem } = await supabase
        .from('coding_problems')
        .select('difficulty')
        .eq('id', p.problem_id)
        .single();

      if (problem) {
        if (problem.difficulty === 'easy') easySolved++;
        else if (problem.difficulty === 'medium') mediumSolved++;
        else if (problem.difficulty === 'hard') hardSolved++;
      }
    }

    const successRate = totalAttempted > 0 ? (totalSolved / totalAttempted) * 100 : 0;

    return {
      success: true,
      data: {
        totalAttempted,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        successRate: Math.round(successRate),
      },
    };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

