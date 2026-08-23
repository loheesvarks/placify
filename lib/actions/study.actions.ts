'use server';

/**
 * Study Session Actions
 * Phase 3J: Study session tracking for Focus Timer
 * 
 * IMPORTANT: Study time ≠ Skill mastery
 * Sessions contribute to activity tracking but don't directly affect assessments
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database.types';

type StudySession = Database['public']['Tables']['study_sessions']['Row'];

interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Complete a study session (from Focus Timer)
 */
export async function completeStudySession(
  durationMinutes: number,
  _skillId?: string | null, // Reserved for future
  _focusType?: 'general' | 'learning' | 'practice' | 'project' | 'review', // Reserved for future
  _notes?: string // Reserved for future
): Promise<ActionResponse<{ sessionId: string }>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const completedAt = new Date().toISOString();
    const startedAt = new Date(Date.now() - durationMinutes * 60 * 1000).toISOString();

    const { data: session, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: user.id,
        duration_minutes: durationMinutes,
        session_type: 'focus_session',
        completed: true,
        started_at: startedAt,
        ended_at: completedAt,
      })
      .select('id')
      .single();

    if (error || !session) {
      return { success: false, error: 'Failed to save session' };
    }

    return { success: true, data: { sessionId: session.id } };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get today's study time
 */
export async function getTodayStudyTime(): Promise<ActionResponse<{ minutes: number }>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const today = new Date().toISOString().split('T')[0];

    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', user.id)
      .gte('started_at', `${today}T00:00:00`)
      .lt('started_at', `${today}T23:59:59`);

    if (error) {
      return { success: false, error: 'Failed to fetch sessions' };
    }

    const minutes = (sessions || []).reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

    return { success: true, data: { minutes } };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get weekly study time
 */
export async function getWeeklyStudyTime(): Promise<ActionResponse<{ minutes: number }>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', user.id)
      .gte('started_at', weekAgo);

    if (error) {
      return { success: false, error: 'Failed to fetch sessions' };
    }

    const minutes = (sessions || []).reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

    return { success: true, data: { minutes } };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Get recent study sessions
 */
export async function getRecentSessions(limit: number = 10): Promise<ActionResponse<StudySession[]>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: 'Failed to fetch sessions' };
    }

    return { success: true, data: sessions || [] };
  } catch {
    return { success: false, error: 'Unexpected error' };
  }
}

