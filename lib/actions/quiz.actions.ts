'use server';

/**
 * Quiz Actions
 * Phase 3I: Quiz integration with evidence capture
 * 
 * Server actions for quizzes and assessments.
 * 
 * When a quiz is completed:
 * 1. Persist quiz attempt
 * 2. Create quiz-score evidence
 * 3. Recalculate affected skill assessment
 * 4. Recalculate gaps and recommendations
 * 
 * Historical attempts remain available for progress tracking
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database.types';
import { skillEvidenceService, type QuizScoreMetadata } from '@/lib/services/skill-evidence.service';
import { skillAssessmentService } from '@/lib/services/skill-assessment.service';
import { skillGapService } from '@/lib/services/skill-gap.service';
import { recommendationService } from '@/lib/services/recommendation.service';

type Quiz = Database['public']['Tables']['quizzes']['Row'];
type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row'];
type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];

interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Get all quizzes
 */
export async function getQuizzes(): Promise<ActionResponse<Quiz[]>> {
  try {
    const supabase = await createClient();

    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('title');

    if (error) {
      return { success: false, error: 'Failed to fetch quizzes' };
    }

    return { success: true, data: quizzes || [] };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get a single quiz by ID
 */
export async function getQuiz(quizId: string): Promise<ActionResponse<Quiz>> {
  try {
    const supabase = await createClient();

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (error || !quiz) {
      return { success: false, error: 'Quiz not found' };
    }

    return { success: true, data: quiz };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get quiz questions
 */
export async function getQuizQuestions(quizId: string): Promise<ActionResponse<QuizQuestion[]>> {
  try {
    const supabase = await createClient();

    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index');

    if (error) {
      return { success: false, error: 'Failed to fetch questions' };
    }

    return { success: true, data: questions || [] };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Submit quiz and record attempt
 * This triggers evidence capture and recalculations
 */
export async function submitQuiz(
  quizId: string,
  skillId: string,
  correctAnswers: number,
  totalQuestions: number,
  timeSpentSeconds?: number
): Promise<ActionResponse<{ attemptId: string; score: number }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get quiz details
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('title')
      .eq('id', quizId)
      .single();

    if (quizError || !quiz) {
      return { success: false, error: 'Quiz not found' };
    }

    // Calculate score
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const completedAt = new Date().toISOString();

    // Get attempt number for this user/quiz
    const { data: previousAttempts } = await supabase
      .from('quiz_attempts')
      .select('id')
      .eq('user_id', user.id)
      .eq('quiz_id', quizId);

    const attemptNumber = (previousAttempts?.length || 0) + 1;

    // 1. Persist quiz attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        score,
        total_questions: totalQuestions,
        completed_at: completedAt,
      })
      .select('id')
      .single();

    if (attemptError || !attempt) {
      console.error('[Quiz] Attempt error:', attemptError);
      return { success: false, error: 'Failed to save attempt' };
    }

    // 2. Create quiz-score evidence
    const evidenceMetadata: QuizScoreMetadata = {
      quizId,
      quizTitle: quiz.title,
      totalQuestions,
      correctAnswers,
      timeSpent: timeSpentSeconds,
      attemptNumber,
      completedAt,
    };

    const evidenceResult = await skillEvidenceService.captureQuizScore(
      skillId,
      evidenceMetadata
    );

    if (!evidenceResult.success) {
      console.error('[Quiz] Evidence capture failed:', evidenceResult.error);
      // Don't fail the submission, just log
    }

    // 3. Recalculate skill assessment
    await skillAssessmentService.calculateAndSave(skillId);

    // 4. Recalculate gaps and recommendations
    await skillGapService.calculateAndSaveAll();
    await recommendationService.refreshRecommendations();

    return {
      success: true,
      data: {
        attemptId: attempt.id,
        score,
      },
    };
  } catch (error) {
    console.error('[Quiz] Unexpected error:', error);
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get user's quiz attempts
 */
export async function getQuizAttempts(quizId?: string): Promise<ActionResponse<QuizAttempt[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    let query = supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (quizId) {
      query = query.eq('quiz_id', quizId);
    }

    const { data: attempts, error } = await query;

    if (error) {
      return { success: false, error: 'Failed to fetch attempts' };
    }

    return { success: true, data: attempts || [] };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get quiz statistics for user
 */
export async function getQuizStats(): Promise<ActionResponse<{
  totalAttempts: number;
  uniqueQuizzes: number;
  averageScore: number;
  bestScore: number;
  recentAttempts: QuizAttempt[];
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

    const { data: attempts, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error || !attempts) {
      return {
        success: true,
        data: {
          totalAttempts: 0,
          uniqueQuizzes: 0,
          averageScore: 0,
          bestScore: 0,
          recentAttempts: [],
        },
      };
    }

    const totalAttempts = attempts.length;
    const uniqueQuizzes = new Set(attempts.map(a => a.quiz_id)).size;
    const averageScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0;
    const bestScore = attempts.length > 0
      ? Math.max(...attempts.map(a => a.score))
      : 0;
    const recentAttempts = attempts.slice(0, 5);

    return {
      success: true,
      data: {
        totalAttempts,
        uniqueQuizzes,
        averageScore,
        bestScore,
        recentAttempts,
      },
    };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get best attempt for a quiz
 */
export async function getBestAttempt(quizId: string): Promise<ActionResponse<QuizAttempt | null>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('quiz_id', quizId)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { success: false, error: 'Failed to fetch best attempt' };
    }

    return { success: true, data: attempt || null };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

