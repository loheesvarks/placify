/**
 * Skill Evidence Service
 * Phase 3C: Evidence capture from real student actions
 * 
 * This service captures REAL evidence of skill demonstration:
 * - Lesson completion
 * - Quiz scores
 * - Coding problem solutions
 * - Projects
 * - Interviews
 * - Self-reported skills
 * 
 * CRITICAL RULES:
 * - Evidence is NEVER fabricated
 * - Evidence is NEVER silently overwritten
 * - Historical evidence remains available
 * - All evidence is immutable (no DELETE operations)
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database.types';

type SkillEvidence = Database['public']['Tables']['skill_evidence']['Row'];
type SkillEvidenceInsert = Database['public']['Tables']['skill_evidence']['Insert'];

/**
 * Evidence types with their metadata structures
 */
export type EvidenceType = 
  | 'self_reported'
  | 'lesson_completion'
  | 'quiz_score'
  | 'coding_problem'
  | 'project'
  | 'assessment'
  | 'interview';

/**
 * Lesson completion evidence metadata
 */
export interface LessonCompletionMetadata {
  lessonId: string;
  lessonTitle: string;
  category?: string;
  duration?: number; // minutes spent
  completedAt: string;
}

/**
 * Quiz score evidence metadata
 */
export interface QuizScoreMetadata {
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent?: number; // seconds
  attemptNumber: number;
  completedAt: string;
}

/**
 * Coding problem evidence metadata
 */
export interface CodingProblemMetadata {
  problemId: string;
  problemTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
  attemptCount: number;
  solvedAt: string;
  timeSpent?: number; // minutes
  testsPassed?: number;
  totalTests?: number;
}

/**
 * Project evidence metadata
 */
export interface ProjectMetadata {
  projectId: string;
  projectTitle: string;
  description?: string;
  technologies: string[];
  completedAt: string;
  githubUrl?: string;
  demoUrl?: string;
}

/**
 * Interview evidence metadata
 */
export interface InterviewMetadata {
  interviewId: string;
  interviewType: 'technical' | 'behavioral' | 'system_design' | 'coding';
  company?: string;
  duration?: number; // minutes
  performanceRating?: number; // 0-100
  feedback?: string;
  completedAt: string;
}

/**
 * Self-reported evidence metadata
 */
export interface SelfReportedMetadata {
  source: 'onboarding' | 'profile_update' | 'manual_entry';
  reportedAt: string;
  confidence?: 'low' | 'medium' | 'high';
  notes?: string;
}

/**
 * Evidence capture result
 */
export interface EvidenceCaptureResult {
  success: boolean;
  evidenceId?: string;
  error?: string;
}

/**
 * Skill Evidence Service
 * Captures real evidence from student actions
 */
class SkillEvidenceService {
  /**
   * Capture lesson completion evidence
   * Called when student completes a lesson
   */
  async captureLessonCompletion(
    skillId: string,
    lessonData: LessonCompletionMetadata,
    skillLevelDemonstrated?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): Promise<EvidenceCaptureResult> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Verify skill belongs to user
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .select('id, user_id')
        .eq('id', skillId)
        .eq('user_id', user.id)
        .single();

      if (skillError || !skill) {
        return { success: false, error: 'Skill not found or access denied' };
      }

      // Create evidence record
      const evidenceData: SkillEvidenceInsert = {
        user_id: user.id,
        skill_id: skillId,
        evidence_type: 'lesson_completion',
        evidence_source_table: 'user_progress',
        evidence_source_id: lessonData.lessonId,
        skill_level_demonstrated: skillLevelDemonstrated || null,
        score: null, // Lessons don't have scores
        difficulty: null,
        weight: 1.0, // Standard weight for lesson completion
        metadata: lessonData as unknown as Database['public']['Tables']['skill_evidence']['Insert']['metadata'],
        recorded_at: lessonData.completedAt,
      };

      const { data: evidence, error: insertError } = await supabase
        .from('skill_evidence')
        .insert(evidenceData)
        .select('id')
        .single();

      if (insertError) {
        console.error('[SkillEvidence] Insert error:', insertError);
        return { success: false, error: 'Failed to capture evidence' };
      }

      return { success: true, evidenceId: evidence.id };
    } catch (error) {
      console.error('[SkillEvidence] Unexpected error in captureLessonCompletion:', error);
      return { success: false, error: 'Unexpected error' };
    }
  }

  /**
   * Capture quiz score evidence
   * Called when student completes a quiz
   */
  async captureQuizScore(
    skillId: string,
    quizData: QuizScoreMetadata
  ): Promise<EvidenceCaptureResult> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Verify skill belongs to user
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .select('id, user_id')
        .eq('id', skillId)
        .eq('user_id', user.id)
        .single();

      if (skillError || !skill) {
        return { success: false, error: 'Skill not found or access denied' };
      }

      // Calculate score percentage
      const scorePercentage = (quizData.correctAnswers / quizData.totalQuestions) * 100;

      // Infer skill level from score
      let skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null = null;
      if (scorePercentage >= 90) {
        skillLevel = 'expert';
      } else if (scorePercentage >= 75) {
        skillLevel = 'advanced';
      } else if (scorePercentage >= 60) {
        skillLevel = 'intermediate';
      } else if (scorePercentage >= 40) {
        skillLevel = 'beginner';
      }

      // Create evidence record
      const evidenceData: SkillEvidenceInsert = {
        user_id: user.id,
        skill_id: skillId,
        evidence_type: 'quiz_score',
        evidence_source_table: 'quiz_attempts',
        evidence_source_id: quizData.quizId,
        skill_level_demonstrated: skillLevel,
        score: scorePercentage,
        difficulty: null, // Quizzes don't have difficulty levels currently
        weight: 1.5, // Quizzes have higher weight than lessons
        metadata: quizData as unknown as Database['public']['Tables']['skill_evidence']['Insert']['metadata'],
        recorded_at: quizData.completedAt,
      };

      const { data: evidence, error: insertError } = await supabase
        .from('skill_evidence')
        .insert(evidenceData)
        .select('id')
        .single();

      if (insertError) {
        console.error('[SkillEvidence] Insert error:', insertError);
        return { success: false, error: 'Failed to capture evidence' };
      }

      return { success: true, evidenceId: evidence.id };
    } catch (error) {
      console.error('[SkillEvidence] Unexpected error in captureQuizScore:', error);
      return { success: false, error: 'Unexpected error' };
    }
  }

  /**
   * Capture coding problem solution evidence
   * Called when student solves a coding problem
   */
  async captureCodingProblem(
    skillId: string,
    problemData: CodingProblemMetadata
  ): Promise<EvidenceCaptureResult> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Verify skill belongs to user
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .select('id, user_id')
        .eq('id', skillId)
        .eq('user_id', user.id)
        .single();

      if (skillError || !skill) {
        return { success: false, error: 'Skill not found or access denied' };
      }

      // Calculate score if test data available
      let score: number | null = null;
      if (problemData.testsPassed !== undefined && problemData.totalTests !== undefined && problemData.totalTests > 0) {
        score = (problemData.testsPassed / problemData.totalTests) * 100;
      }

      // Infer skill level from difficulty and attempts
      let skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null = null;
      if (problemData.difficulty === 'hard' && problemData.attemptCount <= 2) {
        skillLevel = 'expert';
      } else if (problemData.difficulty === 'hard' || (problemData.difficulty === 'medium' && problemData.attemptCount === 1)) {
        skillLevel = 'advanced';
      } else if (problemData.difficulty === 'medium') {
        skillLevel = 'intermediate';
      } else {
        skillLevel = 'beginner';
      }

      // Weight based on difficulty
      const weight = problemData.difficulty === 'hard' ? 2.0 : problemData.difficulty === 'medium' ? 1.5 : 1.0;

      // Create evidence record
      const evidenceData: SkillEvidenceInsert = {
        user_id: user.id,
        skill_id: skillId,
        evidence_type: 'coding_problem',
        evidence_source_table: 'problem_progress',
        evidence_source_id: problemData.problemId,
        skill_level_demonstrated: skillLevel,
        score,
        difficulty: problemData.difficulty,
        weight,
        metadata: problemData as unknown as Database['public']['Tables']['skill_evidence']['Insert']['metadata'],
        recorded_at: problemData.solvedAt,
      };

      const { data: evidence, error: insertError } = await supabase
        .from('skill_evidence')
        .insert(evidenceData)
        .select('id')
        .single();

      if (insertError) {
        console.error('[SkillEvidence] Insert error:', insertError);
        return { success: false, error: 'Failed to capture evidence' };
      }

      return { success: true, evidenceId: evidence.id };
    } catch (error) {
      console.error('[SkillEvidence] Unexpected error in captureCodingProblem:', error);
      return { success: false, error: 'Unexpected error' };
    }
  }

  /**
   * Capture project completion evidence
   * Called when student completes a project
   */
  async captureProject(
    skillId: string,
    projectData: ProjectMetadata,
    skillLevelDemonstrated: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): Promise<EvidenceCaptureResult> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Verify skill belongs to user
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .select('id, user_id')
        .eq('id', skillId)
        .eq('user_id', user.id)
        .single();

      if (skillError || !skill) {
        return { success: false, error: 'Skill not found or access denied' };
      }

      // Projects have high weight as they demonstrate practical application
      const evidenceData: SkillEvidenceInsert = {
        user_id: user.id,
        skill_id: skillId,
        evidence_type: 'project',
        evidence_source_table: 'projects', // Assuming projects table exists or will be created
        evidence_source_id: projectData.projectId,
        skill_level_demonstrated: skillLevelDemonstrated,
        score: null,
        difficulty: null,
        weight: 3.0, // High weight for projects
        metadata: projectData as unknown as Database['public']['Tables']['skill_evidence']['Insert']['metadata'],
        recorded_at: projectData.completedAt,
      };

      const { data: evidence, error: insertError } = await supabase
        .from('skill_evidence')
        .insert(evidenceData)
        .select('id')
        .single();

      if (insertError) {
        console.error('[SkillEvidence] Insert error:', insertError);
        return { success: false, error: 'Failed to capture evidence' };
      }

      return { success: true, evidenceId: evidence.id };
    } catch (error) {
      console.error('[SkillEvidence] Unexpected error in captureProject:', error);
      return { success: false, error: 'Unexpected error' };
    }
  }

  /**
   * Capture interview evidence
   * Called when student completes a mock interview
   */
  async captureInterview(
    skillId: string,
    interviewData: InterviewMetadata
  ): Promise<EvidenceCaptureResult> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Verify skill belongs to user
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .select('id, user_id')
        .eq('id', skillId)
        .eq('user_id', user.id)
        .single();

      if (skillError || !skill) {
        return { success: false, error: 'Skill not found or access denied' };
      }

      // Infer skill level from performance rating
      let skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null = null;
      if (interviewData.performanceRating !== undefined) {
        if (interviewData.performanceRating >= 90) {
          skillLevel = 'expert';
        } else if (interviewData.performanceRating >= 75) {
          skillLevel = 'advanced';
        } else if (interviewData.performanceRating >= 60) {
          skillLevel = 'intermediate';
        } else {
          skillLevel = 'beginner';
        }
      }

      // Interviews have very high weight
      const evidenceData: SkillEvidenceInsert = {
        user_id: user.id,
        skill_id: skillId,
        evidence_type: 'interview',
        evidence_source_table: 'interviews', // Assuming interviews table exists or will be created
        evidence_source_id: interviewData.interviewId,
        skill_level_demonstrated: skillLevel,
        score: interviewData.performanceRating || null,
        difficulty: null,
        weight: 4.0, // Very high weight for interviews
        metadata: interviewData as unknown as Database['public']['Tables']['skill_evidence']['Insert']['metadata'],
        recorded_at: interviewData.completedAt,
      };

      const { data: evidence, error: insertError } = await supabase
        .from('skill_evidence')
        .insert(evidenceData)
        .select('id')
        .single();

      if (insertError) {
        console.error('[SkillEvidence] Insert error:', insertError);
        return { success: false, error: 'Failed to capture evidence' };
      }

      return { success: true, evidenceId: evidence.id };
    } catch (error) {
      console.error('[SkillEvidence] Unexpected error in captureInterview:', error);
      return { success: false, error: 'Unexpected error' };
    }
  }

  /**
   * Capture self-reported skill evidence
   * Called during onboarding or profile updates
   * IMPORTANT: Has lowest weight as it's self-reported, not demonstrated
   */
  async captureSelfReported(
    skillId: string,
    selfReportedData: SelfReportedMetadata,
    claimedLevel?: number // 1-10 proficiency
  ): Promise<EvidenceCaptureResult> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Verify skill belongs to user
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .select('id, user_id, proficiency_level')
        .eq('id', skillId)
        .eq('user_id', user.id)
        .single();

      if (skillError || !skill) {
        return { success: false, error: 'Skill not found or access denied' };
      }

      // Map claimed level (1-10) to skill level category
      let skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null = null;
      const level = claimedLevel || skill.proficiency_level;
      if (level) {
        if (level >= 9) {
          skillLevel = 'expert';
        } else if (level >= 7) {
          skillLevel = 'advanced';
        } else if (level >= 5) {
          skillLevel = 'intermediate';
        } else {
          skillLevel = 'beginner';
        }
      }

      // Self-reported has LOW weight - it's a claim, not demonstrated
      const evidenceData: SkillEvidenceInsert = {
        user_id: user.id,
        skill_id: skillId,
        evidence_type: 'self_reported',
        evidence_source_table: null,
        evidence_source_id: null,
        skill_level_demonstrated: skillLevel,
        score: claimedLevel ? claimedLevel * 10 : null, // Convert 1-10 to 0-100 scale
        difficulty: null,
        weight: 0.5, // LOW weight for self-reported
        metadata: selfReportedData as unknown as Database['public']['Tables']['skill_evidence']['Insert']['metadata'],
        recorded_at: selfReportedData.reportedAt,
      };

      const { data: evidence, error: insertError } = await supabase
        .from('skill_evidence')
        .insert(evidenceData)
        .select('id')
        .single();

      if (insertError) {
        console.error('[SkillEvidence] Insert error:', insertError);
        return { success: false, error: 'Failed to capture evidence' };
      }

      return { success: true, evidenceId: evidence.id };
    } catch (error) {
      console.error('[SkillEvidence] Unexpected error in captureSelfReported:', error);
      return { success: false, error: 'Unexpected error' };
    }
  }

  /**
   * Get all evidence for a skill
   * Returns historical evidence ordered by date (newest first)
   */
  async getEvidenceForSkill(skillId: string): Promise<SkillEvidence[]> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[SkillEvidence] Not authenticated');
        return [];
      }

      // Get evidence for this skill (RLS ensures only user's own evidence)
      const { data: evidence, error } = await supabase
        .from('skill_evidence')
        .select('*')
        .eq('skill_id', skillId)
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (error) {
        console.error('[SkillEvidence] Error fetching evidence:', error);
        return [];
      }

      return evidence || [];
    } catch (error) {
      console.error('[SkillEvidence] Unexpected error in getEvidenceForSkill:', error);
      return [];
    }
  }

  /**
   * Get all evidence for current user
   * Useful for dashboard and assessment calculations
   */
  async getAllEvidence(): Promise<SkillEvidence[]> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[SkillEvidence] Not authenticated');
        return [];
      }

      const { data: evidence, error } = await supabase
        .from('skill_evidence')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (error) {
        console.error('[SkillEvidence] Error fetching all evidence:', error);
        return [];
      }

      return evidence || [];
    } catch (error) {
      console.error('[SkillEvidence] Unexpected error in getAllEvidence:', error);
      return [];
    }
  }

  /**
   * Count evidence by type for a skill
   * Useful for understanding evidence mix
   */
  async countEvidenceByType(skillId: string): Promise<Record<EvidenceType, number>> {
    try {
      const evidence = await this.getEvidenceForSkill(skillId);

      const counts: Record<EvidenceType, number> = {
        self_reported: 0,
        lesson_completion: 0,
        quiz_score: 0,
        coding_problem: 0,
        project: 0,
        assessment: 0,
        interview: 0,
      };

      for (const e of evidence) {
        counts[e.evidence_type as EvidenceType]++;
      }

      return counts;
    } catch (error) {
      console.error('[SkillEvidence] Error in countEvidenceByType:', error);
      return {
        self_reported: 0,
        lesson_completion: 0,
        quiz_score: 0,
        coding_problem: 0,
        project: 0,
        assessment: 0,
        interview: 0,
      };
    }
  }
}

export const skillEvidenceService = new SkillEvidenceService();

