'use server';

/**
 * Learning Actions
 * Phase 3G: Learning integration with evidence capture
 * 
 * Server actions for courses, lessons, and learning progress.
 * 
 * When a lesson is completed:
 * 1. Persist lesson completion
 * 2. Create lesson-completion evidence
 * 3. Recalculate affected skill assessment
 * 4. Recalculate affected skill gaps
 * 5. Refresh recommendations
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database.types';
import { skillEvidenceService, type LessonCompletionMetadata } from '@/lib/services/skill-evidence.service';
import { skillAssessmentService } from '@/lib/services/skill-assessment.service';
import { skillGapService } from '@/lib/services/skill-gap.service';
import { recommendationService } from '@/lib/services/recommendation.service';

type Course = Database['public']['Tables']['courses']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type LessonCompletion = Database['public']['Tables']['lesson_completions']['Row'];

interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Get all published courses
 */
export async function getCourses(): Promise<ActionResponse<Course[]>> {
  try {
    const supabase = await createClient();

    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: 'Failed to fetch courses' };
    }

    return { success: true, data: courses || [] };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get a single course by ID
 */
export async function getCourse(courseId: string): Promise<ActionResponse<Course>> {
  try {
    const supabase = await createClient();

    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .eq('is_published', true)
      .single();

    if (error || !course) {
      return { success: false, error: 'Course not found' };
    }

    return { success: true, data: course };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get lessons for a course
 */
export async function getLessons(courseId: string): Promise<ActionResponse<Lesson[]>> {
  try {
    const supabase = await createClient();

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');

    if (error) {
      return { success: false, error: 'Failed to fetch lessons' };
    }

    return { success: true, data: lessons || [] };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get a single lesson by ID
 */
export async function getLesson(lessonId: string): Promise<ActionResponse<Lesson>> {
  try {
    const supabase = await createClient();

    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error || !lesson) {
      return { success: false, error: 'Lesson not found' };
    }

    return { success: true, data: lesson };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get lesson completion status for current user
 */
export async function getLessonCompletion(
  lessonId: string
): Promise<ActionResponse<LessonCompletion | null>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: completion, error } = await supabase
      .from('lesson_completions')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { success: false, error: 'Failed to check completion status' };
    }

    return { success: true, data: completion || null };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Complete a lesson
 * This is the main evidence capture function for learning
 */
export async function completeLesson(
  lessonId: string,
  skillId: string,
  timeSpentMinutes?: number
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

    // Get lesson details
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('title, course_id')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      return { success: false, error: 'Lesson not found' };
    }

    // Get course details for category
    const { data: course } = await supabase
      .from('courses')
      .select('category')
      .eq('id', lesson.course_id)
      .single();

    const completedAt = new Date().toISOString();

    // 1. Persist lesson completion
    const { error: completionError } = await supabase
      .from('lesson_completions')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed_at: completedAt,
        time_spent_minutes: timeSpentMinutes || null,
      }, {
        onConflict: 'user_id,lesson_id',
      });

    if (completionError) {
      console.error('[Learning] Completion error:', completionError);
      return { success: false, error: 'Failed to save completion' };
    }

    // 2. Create lesson-completion evidence
    const evidenceMetadata: LessonCompletionMetadata = {
      lessonId,
      lessonTitle: lesson.title,
      category: course?.category,
      duration: timeSpentMinutes,
      completedAt,
    };

    const evidenceResult = await skillEvidenceService.captureLessonCompletion(
      skillId,
      evidenceMetadata,
      'beginner' // Lessons demonstrate beginner-level engagement
    );

    if (!evidenceResult.success) {
      console.error('[Learning] Evidence capture failed:', evidenceResult.error);
      // Don't fail the completion, just log
    }

    // 3. Recalculate skill assessment
    await skillAssessmentService.calculateAndSave(skillId);

    // 4. Recalculate skill gaps
    await skillGapService.calculateAndSaveAll();

    // 5. Refresh recommendations
    await recommendationService.refreshRecommendations();

    return { success: true };
  } catch (error) {
    console.error('[Learning] Unexpected error:', error);
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get user's completed lessons
 */
export async function getCompletedLessons(): Promise<ActionResponse<LessonCompletion[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: completions, error } = await supabase
      .from('lesson_completions')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      return { success: false, error: 'Failed to fetch completed lessons' };
    }

    return { success: true, data: completions || [] };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get course progress summary
 */
export async function getCourseProgress(
  courseId: string
): Promise<ActionResponse<{ total: number; completed: number; percentage: number }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get all lessons in course
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId);

    if (lessonsError || !lessons) {
      return { success: false, error: 'Failed to fetch lessons' };
    }

    const total = lessons.length;

    if (total === 0) {
      return {
        success: true,
        data: { total: 0, completed: 0, percentage: 0 },
      };
    }

    // Get completed lessons
    const { data: completions, error: completionsError } = await supabase
      .from('lesson_completions')
      .select('id')
      .eq('user_id', user.id)
      .in('lesson_id', lessons.map(l => l.id));

    if (completionsError) {
      return { success: false, error: 'Failed to fetch completions' };
    }

    const completed = completions?.length || 0;
    const percentage = Math.round((completed / total) * 100);

    return {
      success: true,
      data: { total, completed, percentage },
    };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Start a lesson (optional tracking)
 */
export async function startLesson(lessonId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if lesson exists
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      return { success: false, error: 'Lesson not found' };
    }

    // For now, just validate. Future: track start time, update last_activity
    return { success: true };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

