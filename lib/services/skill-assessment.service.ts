/**
 * Skill Assessment Service
 * Phase 3D: Skill assessment engine
 * 
 * Calculates a user's DEMONSTRATED skill level from evidence.
 * Distinguishes between CLAIMED level (self-reported) and DEMONSTRATED level (evidence-based).
 * 
 * CRITICAL PRINCIPLES:
 * - Self-reported ≠ Demonstrated
 * - Study time ≠ Mastery
 * - Lesson completion ≠ Skill mastery
 * - Multiple evidence points increase confidence
 * - Calculation is deterministic, explainable, versioned, testable
 * - NEVER fabricate mastery
 * 
 * CALCULATION VERSION: v1.0.0
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database.types';
import { skillEvidenceService } from './skill-evidence.service';

type Skill = Database['public']['Tables']['skills']['Row'];
type SkillEvidence = Database['public']['Tables']['skill_evidence']['Row'];
type SkillAssessment = Database['public']['Tables']['skill_assessments']['Row'];
type SkillAssessmentInsert = Database['public']['Tables']['skill_assessments']['Insert'];

const CALCULATION_VERSION = 'v1.0.0';

/**
 * Demonstrated skill levels
 */
export type DemonstratedLevel = 'unknown' | 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * Confidence levels
 */
export type ConfidenceLevel = 'low' | 'medium' | 'high';

/**
 * Assessment calculation result
 */
export interface AssessmentCalculation {
  skillId: string;
  skillName: string;
  claimedLevel: number | null; // From skills.proficiency_level (1-10)
  demonstratedLevel: DemonstratedLevel;
  confidence: ConfidenceLevel;
  evidenceCount: number;
  assessmentScoreAvg: number | null;
  practicePerformanceAvg: number | null;
  projectCount: number;
  interviewPerformance: number | null;
  calculationVersion: string;
  explanation: string; // Human-readable explanation of the assessment
}

/**
 * Skill Assessment Service
 * Calculates demonstrated skill level from evidence
 */
class SkillAssessmentService {
  /**
   * Calculate assessment for a single skill
   * This is the core intelligence function
   */
  async calculateAssessment(skillId: string): Promise<AssessmentCalculation | null> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[SkillAssessment] Not authenticated');
        return null;
      }

      // Get skill
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .select('*')
        .eq('id', skillId)
        .eq('user_id', user.id)
        .single();

      if (skillError || !skill) {
        console.error('[SkillAssessment] Skill not found');
        return null;
      }

      // Get all evidence for this skill
      const evidence = await skillEvidenceService.getEvidenceForSkill(skillId);

      // Calculate assessment from evidence
      return this.calculateFromEvidence(skill, evidence);
    } catch (error) {
      console.error('[SkillAssessment] Unexpected error:', error);
      return null;
    }
  }

  /**
   * Calculate assessment from evidence (internal logic)
   * DETERMINISTIC: Same evidence → same assessment
   */
  private calculateFromEvidence(
    skill: Skill,
    evidence: SkillEvidence[]
  ): AssessmentCalculation {
    // Separate evidence by type
    const selfReported = evidence.filter(e => e.evidence_type === 'self_reported');
    const lessons = evidence.filter(e => e.evidence_type === 'lesson_completion');
    const quizzes = evidence.filter(e => e.evidence_type === 'quiz_score');
    const problems = evidence.filter(e => e.evidence_type === 'coding_problem');
    const projects = evidence.filter(e => e.evidence_type === 'project');
    const assessments = evidence.filter(e => e.evidence_type === 'assessment');
    const interviews = evidence.filter(e => e.evidence_type === 'interview');

    // Calculate weighted average of scores
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const e of evidence) {
      if (e.score !== null && e.weight !== null) {
        totalWeightedScore += e.score * e.weight;
        totalWeight += e.weight;
      }
    }

    const weightedAvgScore = totalWeight > 0 ? totalWeightedScore / totalWeight : null;

    // Calculate assessment scores average (quizzes + formal assessments)
    const assessmentEvidence = [...quizzes, ...assessments];
    const assessmentScores = assessmentEvidence
      .map(e => e.score)
      .filter((s): s is number => s !== null);
    const assessmentScoreAvg = assessmentScores.length > 0
      ? assessmentScores.reduce((a, b) => a + b, 0) / assessmentScores.length
      : null;

    // Calculate practice performance average (problems only)
    const problemScores = problems
      .map(e => e.score)
      .filter((s): s is number => s !== null);
    const practicePerformanceAvg = problemScores.length > 0
      ? problemScores.reduce((a, b) => a + b, 0) / problemScores.length
      : null;

    // Interview performance (most recent)
    const interviewPerformance = interviews.length > 0 && interviews[0].score !== null
      ? interviews[0].score
      : null;

    // Count projects
    const projectCount = projects.length;

    // Determine demonstrated level
    const demonstratedLevel = this.determineDemonstratedLevel(
      evidence,
      weightedAvgScore,
      selfReported.length,
      lessons.length,
      quizzes.length,
      problems.length,
      projects.length,
      interviews.length
    );

    // Determine confidence
    const confidence = this.determineConfidence(
      evidence.length,
      selfReported.length,
      quizzes.length + assessments.length,
      problems.length,
      projects.length,
      interviews.length
    );

    // Generate explanation
    const explanation = this.generateExplanation(
      skill.skill_name,
      demonstratedLevel,
      confidence,
      evidence.length,
      selfReported.length,
      lessons.length,
      quizzes.length,
      problems.length,
      projects.length,
      interviews.length,
      weightedAvgScore
    );

    return {
      skillId: skill.id,
      skillName: skill.skill_name,
      claimedLevel: skill.proficiency_level,
      demonstratedLevel,
      confidence,
      evidenceCount: evidence.length,
      assessmentScoreAvg,
      practicePerformanceAvg,
      projectCount,
      interviewPerformance,
      calculationVersion: CALCULATION_VERSION,
      explanation,
    };
  }

  /**
   * Determine demonstrated level from evidence
   * Algorithm v1.0.0:
   * - Prioritizes objective evidence (quizzes, problems, projects, interviews)
   * - De-prioritizes self-reported evidence
   * - Considers evidence mix and consistency
   */
  private determineDemonstratedLevel(
    allEvidence: SkillEvidence[],
    weightedAvgScore: number | null,
    selfReportedCount: number,
    lessonsCount: number,
    quizzesCount: number,
    problemsCount: number,
    projectsCount: number,
    interviewsCount: number
  ): DemonstratedLevel {
    // If only self-reported evidence, return unknown
    if (allEvidence.length === selfReportedCount && selfReportedCount > 0) {
      return 'unknown'; // Self-reported alone is not demonstration
    }

    // If no evidence at all
    if (allEvidence.length === 0) {
      return 'unknown';
    }

    // If only lessons and no assessments/problems
    if (lessonsCount > 0 && quizzesCount === 0 && problemsCount === 0 && projectsCount === 0 && interviewsCount === 0) {
      // Lessons alone show beginner-level engagement, not mastery
      return lessonsCount >= 10 ? 'beginner' : 'unknown';
    }

    // Strong evidence (interviews, projects) can override scores
    if (interviewsCount > 0 || projectsCount > 0) {
      // Get recent interview/project skill levels
      const strongEvidence = allEvidence.filter(
        e => (e.evidence_type === 'interview' || e.evidence_type === 'project') && e.skill_level_demonstrated
      );

      if (strongEvidence.length > 0) {
        // Use the most recent strong evidence as baseline
        const recentLevel = strongEvidence[0].skill_level_demonstrated as DemonstratedLevel;

        // If we also have good scores, potentially upgrade
        if (weightedAvgScore !== null && weightedAvgScore >= 85) {
          return this.upgradeLevel(recentLevel);
        }

        return recentLevel;
      }
    }

    // Primarily use weighted score if available
    if (weightedAvgScore !== null) {
      if (weightedAvgScore >= 90) return 'expert';
      if (weightedAvgScore >= 75) return 'advanced';
      if (weightedAvgScore >= 60) return 'intermediate';
      if (weightedAvgScore >= 40) return 'beginner';
      return 'beginner'; // Score < 40 but has attempted
    }

    // Fallback: Count objective evidence pieces
    const objectiveCount = quizzesCount + problemsCount + projectsCount + interviewsCount;
    if (objectiveCount >= 10) return 'intermediate';
    if (objectiveCount >= 5) return 'beginner';
    if (objectiveCount >= 1) return 'beginner';

    // Has lessons but insufficient objective evidence
    if (lessonsCount > 0) return 'beginner';

    return 'unknown';
  }

  /**
   * Upgrade a demonstrated level by one tier (helper)
   */
  private upgradeLevel(level: DemonstratedLevel): DemonstratedLevel {
    if (level === 'advanced') return 'expert';
    if (level === 'intermediate') return 'advanced';
    if (level === 'beginner') return 'intermediate';
    return level;
  }

  /**
   * Determine confidence level
   * High confidence: Diverse, multiple objective evidence points
   * Medium confidence: Some objective evidence
   * Low confidence: Mostly self-reported or very little evidence
   */
  private determineConfidence(
    totalCount: number,
    selfReportedCount: number,
    assessmentCount: number,
    problemCount: number,
    projectCount: number,
    interviewCount: number
  ): ConfidenceLevel {
    const objectiveCount = assessmentCount + problemCount + projectCount + interviewCount;
    const evidenceTypes = [
      assessmentCount > 0,
      problemCount > 0,
      projectCount > 0,
      interviewCount > 0
    ].filter(Boolean).length;

    // High confidence: Multiple types of objective evidence
    if (objectiveCount >= 15 && evidenceTypes >= 3) return 'high';
    if (objectiveCount >= 10 && evidenceTypes >= 2) return 'high';
    if (interviewCount >= 2 || projectCount >= 2) return 'high';

    // Medium confidence: Some objective evidence
    if (objectiveCount >= 5) return 'medium';
    if (assessmentCount >= 3) return 'medium';
    if (problemCount >= 5) return 'medium';

    // Low confidence: Mostly self-reported or very little evidence
    if (totalCount === selfReportedCount) return 'low';
    if (objectiveCount < 3) return 'low';

    return 'medium';
  }

  /**
   * Generate human-readable explanation
   */
  private generateExplanation(
    skillName: string,
    level: DemonstratedLevel,
    confidence: ConfidenceLevel,
    totalEvidence: number,
    selfReportedCount: number,
    lessonsCount: number,
    quizzesCount: number,
    problemsCount: number,
    projectsCount: number,
    interviewsCount: number,
    avgScore: number | null
  ): string {
    const parts: string[] = [];

    // Level explanation
    if (level === 'unknown') {
      parts.push(`${skillName}: No demonstrated evidence yet.`);
    } else {
      parts.push(`${skillName} assessed as ${level} level.`);
    }

    // Evidence summary
    const objectiveEvidence: string[] = [];
    if (quizzesCount > 0) objectiveEvidence.push(`${quizzesCount} quiz${quizzesCount > 1 ? 'zes' : ''}`);
    if (problemsCount > 0) objectiveEvidence.push(`${problemsCount} coding problem${problemsCount > 1 ? 's' : ''}`);
    if (projectsCount > 0) objectiveEvidence.push(`${projectsCount} project${projectsCount > 1 ? 's' : ''}`);
    if (interviewsCount > 0) objectiveEvidence.push(`${interviewsCount} interview${interviewsCount > 1 ? 's' : ''}`);
    if (lessonsCount > 0) objectiveEvidence.push(`${lessonsCount} lesson${lessonsCount > 1 ? 's' : ''}`);

    if (objectiveEvidence.length > 0) {
      parts.push(`Based on ${objectiveEvidence.join(', ')}.`);
    }

    // Score if available
    if (avgScore !== null) {
      parts.push(`Average performance: ${avgScore.toFixed(0)}%.`);
    }

    // Confidence explanation
    if (confidence === 'low') {
      if (selfReportedCount === totalEvidence && totalEvidence > 0) {
        parts.push('Confidence: Low (only self-reported, not demonstrated).');
      } else {
        parts.push('Confidence: Low (insufficient objective evidence).');
      }
    } else if (confidence === 'medium') {
      parts.push('Confidence: Medium (some objective evidence).');
    } else {
      parts.push('Confidence: High (diverse objective evidence).');
    }

    return parts.join(' ');
  }

  /**
   * Calculate and persist assessment for a skill
   * This updates the skill_assessments table
   */
  async calculateAndSave(skillId: string): Promise<boolean> {
    try {
      const calculation = await this.calculateAssessment(skillId);
      if (!calculation) {
        return false;
      }

      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return false;
      }

      // Prepare assessment record
      const assessmentData: SkillAssessmentInsert = {
        user_id: user.id,
        skill_id: skillId,
        claimed_level: calculation.claimedLevel,
        demonstrated_level: calculation.demonstratedLevel,
        confidence: calculation.confidence,
        evidence_count: calculation.evidenceCount,
        assessment_score_avg: calculation.assessmentScoreAvg,
        practice_performance_avg: calculation.practicePerformanceAvg,
        project_count: calculation.projectCount,
        interview_performance: calculation.interviewPerformance,
        calculation_version: CALCULATION_VERSION,
        last_calculated_at: new Date().toISOString(),
      };

      // Upsert (insert or update)
      const { error: upsertError } = await supabase
        .from('skill_assessments')
        .upsert(assessmentData, {
          onConflict: 'user_id,skill_id',
        });

      if (upsertError) {
        console.error('[SkillAssessment] Upsert error:', upsertError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[SkillAssessment] Unexpected error in calculateAndSave:', error);
      return false;
    }
  }

  /**
   * Calculate and save assessments for all user's skills
   * Useful after onboarding or bulk evidence capture
   */
  async calculateAndSaveAll(): Promise<number> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return 0;
      }

      // Get all user skills
      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('id')
        .eq('user_id', user.id);

      if (skillsError || !skills) {
        return 0;
      }

      // Calculate for each skill
      let successCount = 0;
      for (const skill of skills) {
        const success = await this.calculateAndSave(skill.id);
        if (success) successCount++;
      }

      return successCount;
    } catch (error) {
      console.error('[SkillAssessment] Error in calculateAndSaveAll:', error);
      return 0;
    }
  }

  /**
   * Get stored assessment for a skill
   */
  async getAssessment(skillId: string): Promise<SkillAssessment | null> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return null;
      }

      const { data: assessment, error } = await supabase
        .from('skill_assessments')
        .select('*')
        .eq('skill_id', skillId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[SkillAssessment] Error fetching assessment:', error);
      }

      return assessment || null;
    } catch (error) {
      console.error('[SkillAssessment] Unexpected error in getAssessment:', error);
      return null;
    }
  }

  /**
   * Get all assessments for current user
   */
  async getAllAssessments(): Promise<SkillAssessment[]> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return [];
      }

      const { data: assessments, error } = await supabase
        .from('skill_assessments')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('[SkillAssessment] Error fetching assessments:', error);
        return [];
      }

      return assessments || [];
    } catch (error) {
      console.error('[SkillAssessment] Unexpected error in getAllAssessments:', error);
      return [];
    }
  }
}

export const skillAssessmentService = new SkillAssessmentService();

