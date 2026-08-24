/**
 * Project Types - Phase 4B
 * 
 * Types for project/portfolio intelligence system
 * Projects feed into skill evidence but are NOT automatic proof of mastery
 */

import type { Database } from './database.types';

// Database types
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type ProjectSkill = Database['public']['Tables']['project_skills']['Row'];
export type ProjectSkillInsert = Database['public']['Tables']['project_skills']['Insert'];
export type ProjectSkillUpdate = Database['public']['Tables']['project_skills']['Update'];

export type ProjectTechnology = Database['public']['Tables']['project_technologies']['Row'];
export type ProjectTechnologyInsert = Database['public']['Tables']['project_technologies']['Insert'];
export type ProjectTechnologyUpdate = Database['public']['Tables']['project_technologies']['Update'];

// Project status
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'archived';

// Skill level demonstrated in project
export type SkillLevelDemonstrated = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Technology category
export type TechnologyCategory = 
  | 'Frontend' 
  | 'Backend' 
  | 'Database' 
  | 'DevOps' 
  | 'Cloud' 
  | 'Mobile' 
  | 'Testing'
  | 'Other';

/**
 * Project with related data
 * Used for display and evidence generation
 */
export interface ProjectWithDetails extends Project {
  skills: Array<ProjectSkill & {
    skill_name: string;
    skill_category?: string;
  }>;
  technologies: ProjectTechnology[];
}

/**
 * Project form data
 * Used for creating/updating projects
 */
export interface ProjectFormData {
  title: string;
  description?: string;
  status: ProjectStatus;
  contribution_role?: string;
  team_size?: number;
  repository_url?: string;
  demo_url?: string;
  outcomes?: string;
  start_date?: string;
  completion_date?: string;
  is_public?: boolean;
}

/**
 * Project skill association form data
 */
export interface ProjectSkillFormData {
  skill_id: string;
  skill_level_demonstrated?: SkillLevelDemonstrated;
  usage_notes?: string;
}

/**
 * Project technology form data
 */
export interface ProjectTechnologyFormData {
  technology_name: string;
  category?: TechnologyCategory;
}

/**
 * Project evidence summary
 * Shows evidence status for project skills
 */
export interface ProjectEvidenceSummary {
  project_id: string;
  project_title: string;
  skill_id: string;
  skill_name: string;
  has_evidence: boolean;
  evidence_count: number;
  demonstrated_level?: string;
  assessment_confidence?: string;
}

/**
 * Project statistics
 * Aggregated data for dashboard/overview
 */
export interface ProjectStatistics {
  total_projects: number;
  completed_projects: number;
  in_progress_projects: number;
  total_skills_demonstrated: number;
  total_technologies_used: number;
  projects_with_evidence: number;
}

/**
 * Project evidence generation result
 * Result from generating evidence for project skills
 */
export interface ProjectEvidenceGenerationResult {
  success: boolean;
  project_id: string;
  evidence_generated: number;
  skills_processed: number;
  errors: string[];
}
