/**
 * Skill Gap Service
 * Phase 3E: Skill gap analysis engine
 * 
 * Compares ROLE REQUIREMENTS vs DEMONSTRATED SKILLS to identify gaps.
 * 
 * Gap Analysis:
 * - Required level (from role_requirements)
 * - Current level (from skill_assessments.demonstrated_level)
 * - Gap size (none, small, medium, large)
 * - Importance (essential, recommended, optional)
 * - Priority score (0-100)
 * - Urgency (low, medium, high, critical)
 * - Is prerequisite
 * 
 * Priority Calculation Principles:
 * - Essential skills > Recommended > Optional
 * - Larger gaps get higher priority
 * - Prerequisites can override gap size
 * - Timeline pressure increases urgency
 * - Available time affects urgency
 * 
 * CRITICAL: Do NOT simply sort by percentage gap
 * A prerequisite essential skill with small gap > non-prerequisite with large gap
 * 
 * CALCULATION VERSION: v1.0.0
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database.types';
import { findMatchingUserSkills, type SkillMatchResult } from './skill-normalization.service';

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
type DemonstratedLevel = 'unknown' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
type Importance = 'essential' | 'recommended' | 'optional';
type Confidence = 'low' | 'medium' | 'high';
type VerificationStatus = 'verified' | 'framework' | 'inferred';
import { targetRoleService } from './target-role.service';
import { skillAssessmentService } from './skill-assessment.service';

type SkillGapInsert = Database['public']['Tables']['skill_gaps']['Insert'];
type SkillGap = Database['public']['Tables']['skill_gaps']['Row'];
type RoleRequirement = Database['public']['Tables']['role_requirements']['Row'];
type SkillAssessment = Database['public']['Tables']['skill_assessments']['Row'];

const CALCULATION_VERSION = 'v1.0.0';

/**
 * Gap size categories
 */
export type GapSize = 'none' | 'small' | 'medium' | 'large';

/**
 * Urgency levels
 */
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Gap calculation result
 */
export interface GapCalculation {
  skillName: string;
  requiredLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  currentLevel: 'unknown' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  gapSize: GapSize;
  importance: 'essential' | 'recommended' | 'optional';
  priorityScore: number; // 0-100
  isPrerequisite: boolean;
  urgency: UrgencyLevel;
  confidence: 'low' | 'medium' | 'high';
  explanation: string;
  verificationStatus: 'verified' | 'framework' | 'inferred';
}

/**
 * Level ordering for comparison
 */
const LEVEL_ORDER = {
  unknown: 0,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

/**
 * Prerequisite skills (known dependencies)
 * This should eventually come from a database table
 */
const PREREQUISITES: Record<string, string[]> = {
  'Machine Learning': ['Python', 'Statistics', 'NumPy', 'Pandas'],
  'Deep Learning': ['Machine Learning', 'Python', 'NumPy'],
  'System Design': ['Data Structures', 'Algorithms'],
  'MLOps': ['Machine Learning', 'Git'],
};

/**
 * Skill Gap Service
 * Calculates skill gaps by comparing requirements to assessments
 */
class SkillGapService {
  /**
   * Calculate all skill gaps for current user
   * This is the main gap analysis function
   * 
   * FIXED: Now uses skill_id-based mapping with proper normalization
   */
  async calculateAllGaps(): Promise<GapCalculation[]> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[SkillGap] Not authenticated');
        return [];
      }

      // Get target role with requirements
      const targetRoleData = await targetRoleService.getTargetRoleWithRequirements();
      if (!targetRoleData || targetRoleData.roleRequirements.length === 0) {
        // No target role set or no requirements
        return [];
      }

      const { targetProfile, roleRequirements } = targetRoleData;

      // Get all skill assessments
      const assessments = await skillAssessmentService.getAllAssessments();

      // FIXED: Fetch all user skills once (no N+1 query)
      const { data: userSkills, error: skillsError } = await supabase
        .from('skills')
        .select('id, skill_name')
        .eq('user_id', user.id);

      if (skillsError || !userSkills) {
        console.error('[SkillGap] Error fetching user skills:', skillsError);
        return [];
      }

      // FIXED: Build assessment map by skill_id (not skill_name)
      const assessmentMap = new Map<string, SkillAssessment>();
      for (const assessment of assessments) {
        assessmentMap.set(assessment.skill_id, assessment);
      }

      // FIXED: Use normalization service to match requirements → user skills
      const requirementSkillNames = roleRequirements.map(r => r.skill_name);
      const matchResults = findMatchingUserSkills(requirementSkillNames, userSkills);

      // Calculate gaps
      const gaps: GapCalculation[] = [];
      for (const requirement of roleRequirements) {
        const matchResult = matchResults.get(requirement.skill_name);
        
        const gap = this.calculateGap(
          requirement,
          matchResult,
          assessmentMap,
          targetProfile.timeline_weeks || 16,
          targetProfile.available_hours_per_day || 2
        );
        gaps.push(gap);
      }

      // Sort by priority score (descending)
      gaps.sort((a, b) => b.priorityScore - a.priorityScore);

      return gaps;
    } catch (error) {
      console.error('[SkillGap] Unexpected error in calculateAllGaps:', error);
      return [];
    }
  }

  /**
   * Calculate gap for a single requirement
   * 
   * FIXED: Now uses skill_id-based assessment lookup with match result
   */
  private calculateGap(
    requirement: RoleRequirement,
    matchResult: SkillMatchResult | undefined,
    assessmentMap: Map<string, SkillAssessment>,
    timelineWeeks: number,
    hoursPerDay: number
  ): GapCalculation {
    // FIXED: Use matched skill_id to look up assessment
    const assessment = matchResult?.skill 
      ? assessmentMap.get(matchResult.skill.id)
      : null;

    const currentLevel = assessment?.demonstrated_level || 'unknown';
    const confidence = assessment?.confidence || 'low';

    // Calculate gap size
    const gapSize = this.calculateGapSize(
      requirement.required_level as SkillLevel,
      currentLevel as DemonstratedLevel
    );

    // Check if prerequisite
    const isPrerequisite = this.isPrerequisiteSkill(requirement.skill_name);

    // Calculate priority score
    const priorityScore = this.calculatePriorityScore(
      gapSize,
      requirement.importance as Importance,
      isPrerequisite,
      confidence as Confidence
    );

    // Calculate urgency
    const urgency = this.calculateUrgency(
      gapSize,
      requirement.importance as Importance,
      isPrerequisite,
      timelineWeeks,
      hoursPerDay
    );

    // Generate explanation
    const explanation = this.generateGapExplanation(
      requirement.skill_name,
      requirement.required_level,
      currentLevel,
      gapSize,
      requirement.importance,
      isPrerequisite,
      confidence as Confidence
    );

    return {
      skillName: requirement.skill_name,
      requiredLevel: requirement.required_level as SkillLevel,
      currentLevel: currentLevel as DemonstratedLevel,
      gapSize,
      importance: requirement.importance as Importance,
      priorityScore,
      isPrerequisite,
      urgency,
      confidence: confidence as Confidence,
      explanation,
      verificationStatus: requirement.verification_status as VerificationStatus,
    };
  }

  /**
   * Calculate gap size between required and current level
   */
  private calculateGapSize(
    requiredLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    currentLevel: 'unknown' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): GapSize {
    const requiredOrder = LEVEL_ORDER[requiredLevel];
    const currentOrder = LEVEL_ORDER[currentLevel];
    const difference = requiredOrder - currentOrder;

    if (difference <= 0) return 'none'; // At or above required level
    if (difference === 1) return 'small'; // One level gap
    if (difference === 2) return 'medium'; // Two level gap
    return 'large'; // 3+ level gap
  }

  /**
   * Check if skill is a known prerequisite
   */
  private isPrerequisiteSkill(skillName: string): boolean {
    // Check if this skill is a prerequisite for any other skill
    for (const [, prereqs] of Object.entries(PREREQUISITES)) {
      if (prereqs.some(p => p.toLowerCase() === skillName.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  /**
   * Calculate priority score (0-100)
   * Algorithm v1.0.0:
   * - Essential skills: base 70-100
   * - Recommended skills: base 40-69
   * - Optional skills: base 10-39
   * - Prerequisites: +20 bonus
   * - Gap size modifies within range
   * - Low confidence: -10 penalty
   */
  private calculatePriorityScore(
    gapSize: GapSize,
    importance: 'essential' | 'recommended' | 'optional',
    isPrerequisite: boolean,
    confidence: 'low' | 'medium' | 'high'
  ): number {
    let score = 0;

    // Base score by importance
    if (importance === 'essential') {
      score = 70 + this.getGapModifier(gapSize, 30); // 70-100 range
    } else if (importance === 'recommended') {
      score = 40 + this.getGapModifier(gapSize, 29); // 40-69 range
    } else {
      score = 10 + this.getGapModifier(gapSize, 29); // 10-39 range
    }

    // Prerequisite bonus
    if (isPrerequisite) {
      score += 20;
    }

    // Confidence penalty for low confidence
    if (confidence === 'low') {
      score -= 10;
    }

    // Clamp to 0-100
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get gap size modifier for priority calculation
   */
  private getGapModifier(gapSize: GapSize, maxModifier: number): number {
    if (gapSize === 'none') return 0;
    if (gapSize === 'small') return Math.floor(maxModifier * 0.33);
    if (gapSize === 'medium') return Math.floor(maxModifier * 0.67);
    return maxModifier; // large
  }

  /**
   * Calculate urgency level
   * Considers timeline pressure and available time
   */
  private calculateUrgency(
    gapSize: GapSize,
    importance: 'essential' | 'recommended' | 'optional',
    isPrerequisite: boolean,
    timelineWeeks: number,
    _hoursPerDay: number // Reserved for future urgency calculation
  ): UrgencyLevel {
    // No gap = low urgency
    if (gapSize === 'none') return 'low';

    // Critical conditions
    if (isPrerequisite && gapSize !== 'small' && importance === 'essential') {
      return 'critical';
    }

    // Timeline pressure
    const isShortTimeline = timelineWeeks <= 8;
    // const isLimitedTime = hoursPerDay <= 1.5; // Reserved for future urgency calculation refinement

    // Essential skills
    if (importance === 'essential') {
      if (gapSize === 'large' || (isShortTimeline && gapSize === 'medium')) {
        return 'critical';
      }
      if (gapSize === 'medium' || (isShortTimeline && gapSize === 'small')) {
        return 'high';
      }
      return 'medium';
    }

    // Recommended skills
    if (importance === 'recommended') {
      if (gapSize === 'large' && isShortTimeline) {
        return 'high';
      }
      if (gapSize === 'large' || gapSize === 'medium') {
        return 'medium';
      }
      return 'low';
    }

    // Optional skills
    if (gapSize === 'large') return 'medium';
    return 'low';
  }

  /**
   * Generate human-readable gap explanation
   */
  private generateGapExplanation(
    skillName: string,
    requiredLevel: string,
    currentLevel: string,
    gapSize: GapSize,
    importance: string,
    isPrerequisite: boolean,
    confidence: 'low' | 'medium' | 'high'
  ): string {
    const parts: string[] = [];

    // Gap description
    if (gapSize === 'none') {
      parts.push(`${skillName}: Already at required ${requiredLevel} level.`);
      return parts.join(' ');
    }

    parts.push(`${skillName}: ${gapSize} gap.`);
    parts.push(`Required: ${requiredLevel}, Current: ${currentLevel}.`);

    // Importance
    parts.push(`Importance: ${importance}.`);

    // Prerequisite flag
    if (isPrerequisite) {
      parts.push('This is a prerequisite skill.');
    }

    // Confidence note
    if (confidence === 'low') {
      parts.push('Note: Current assessment has low confidence.');
    }

    return parts.join(' ');
  }

  /**
   * Calculate and save all gaps
   * Updates skill_gaps table
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

      // Calculate gaps
      const gaps = await this.calculateAllGaps();
      if (gaps.length === 0) {
        return 0;
      }

      // Get user's skills to map skill names to IDs
      const { data: skills } = await supabase
        .from('skills')
        .select('id, skill_name')
        .eq('user_id', user.id);

      const skillMap = new Map<string, string>();
      if (skills) {
        for (const skill of skills) {
          skillMap.set(skill.skill_name.toLowerCase(), skill.id);
        }
      }

      // Prepare gap records
      const gapRecords: SkillGapInsert[] = [];
      for (const gap of gaps) {
        let skillId = skillMap.get(gap.skillName.toLowerCase());

        // If skill doesn't exist in user's skills, create it
        if (!skillId) {
          const { data: newSkill, error: createError } = await supabase
            .from('skills')
            .insert({
              user_id: user.id,
              skill_name: gap.skillName,
              proficiency_level: null, // Not self-reported yet
              category: 'technical', // Default
            })
            .select('id')
            .single();

          if (createError) {
            console.error('[SkillGap] Error creating skill:', createError);
            continue;
          }

          skillId = newSkill.id;
          skillMap.set(gap.skillName.toLowerCase(), skillId);
        }

        const gapRecord: SkillGapInsert = {
          user_id: user.id,
          skill_id: skillId,
          skill_name: gap.skillName,
          required_level: gap.requiredLevel,
          current_level: gap.currentLevel,
          gap_size: gap.gapSize,
          importance: gap.importance,
          priority_score: gap.priorityScore,
          is_prerequisite: gap.isPrerequisite,
          urgency: gap.urgency,
          confidence: gap.confidence,
          calculation_version: CALCULATION_VERSION,
          calculated_at: new Date().toISOString(),
        };

        gapRecords.push(gapRecord);
      }

      // Delete old gaps and insert new ones (full refresh)
      // This ensures gaps are removed if requirements change or skills improve
      const { error: deleteError } = await supabase
        .from('skill_gaps')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('[SkillGap] Error deleting old gaps:', deleteError);
      }

      // Insert new gaps
      if (gapRecords.length > 0) {
        const { error: insertError } = await supabase
          .from('skill_gaps')
          .insert(gapRecords);

        if (insertError) {
          console.error('[SkillGap] Error inserting gaps:', insertError);
          return 0;
        }
      }

      return gapRecords.length;
    } catch (error) {
      console.error('[SkillGap] Unexpected error in calculateAndSaveAll:', error);
      return 0;
    }
  }

  /**
   * Get all gaps for current user (from database)
   */
  async getAllGaps(): Promise<SkillGap[]> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return [];
      }

      const { data: gaps, error } = await supabase
        .from('skill_gaps')
        .select('*')
        .eq('user_id', user.id)
        .order('priority_score', { ascending: false });

      if (error) {
        console.error('[SkillGap] Error fetching gaps:', error);
        return [];
      }

      return gaps || [];
    } catch (error) {
      console.error('[SkillGap] Unexpected error in getAllGaps:', error);
      return [];
    }
  }

  /**
   * Get top priority gaps (e.g., top 5)
   */
  async getTopGaps(limit: number = 5): Promise<SkillGap[]> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return [];
      }

      const { data: gaps, error } = await supabase
        .from('skill_gaps')
        .select('*')
        .eq('user_id', user.id)
        .order('priority_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[SkillGap] Error fetching top gaps:', error);
        return [];
      }

      return gaps || [];
    } catch (error) {
      console.error('[SkillGap] Unexpected error in getTopGaps:', error);
      return [];
    }
  }

  /**
   * Get essential skill gaps only
   */
  async getEssentialGaps(): Promise<SkillGap[]> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return [];
      }

      const { data: gaps, error } = await supabase
        .from('skill_gaps')
        .select('*')
        .eq('user_id', user.id)
        .eq('importance', 'essential')
        .order('priority_score', { ascending: false });

      if (error) {
        console.error('[SkillGap] Error fetching essential gaps:', error);
        return [];
      }

      return gaps || [];
    } catch (error) {
      console.error('[SkillGap] Unexpected error in getEssentialGaps:', error);
      return [];
    }
  }
}

export const skillGapService = new SkillGapService();

