/**
 * Project Service - Phase 4B
 * 
 * Manages projects and their relationship to the skill evidence system
 * 
 * CRITICAL RULES:
 * - Projects are NOT automatic proof of mastery
 * - Evidence is only generated when sufficient project information exists
 * - Evidence follows the existing trust intelligence rules
 * - All data is user-scoped and secured via RLS
 * - Historical evidence is preserved (immutable)
 */

import { createClient } from '@/lib/supabase/server';
import type {
  Project,
  ProjectInsert,
  ProjectUpdate,
  ProjectWithDetails,
  ProjectSkill,
  ProjectSkillInsert,
  ProjectTechnology,
  ProjectTechnologyInsert,
  ProjectStatistics,
  ProjectEvidenceGenerationResult,
} from '@/lib/types/project.types';
import { skillEvidenceService, type ProjectMetadata } from './skill-evidence.service';

/**
 * Project Service
 * Handles project CRUD and evidence integration
 */
class ProjectService {
  /**
   * Get all projects for current user
   */
  async getUserProjects(): Promise<Project[]> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[ProjectService] Not authenticated');
        return [];
      }

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('[ProjectService] Error fetching projects:', error);
        return [];
      }

      return projects || [];
    } catch (error) {
      console.error('[ProjectService] Unexpected error in getUserProjects:', error);
      return [];
    }
  }

  /**
   * Get single project with full details (skills + technologies)
   */
  async getProjectWithDetails(projectId: string): Promise<ProjectWithDetails | null> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[ProjectService] Not authenticated');
        return null;
      }

      // Get project (RLS ensures user owns it)
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (projectError || !project) {
        console.error('[ProjectService] Project not found:', projectError);
        return null;
      }

      // Get project skills with skill names
      const { data: projectSkills } = await supabase
        .from('project_skills')
        .select(`
          *,
          skills:skill_id (
            skill_name,
            category
          )
        `)
        .eq('project_id', projectId);

      // Get project technologies
      const { data: projectTechnologies } = await supabase
        .from('project_technologies')
        .select('*')
        .eq('project_id', projectId);

      // Map skills with proper typing
      const skills = (projectSkills || []).map(ps => ({
        ...ps,
        skill_name: (ps.skills as Record<string, unknown>)?.skill_name as string || 'Unknown',
        skill_category: (ps.skills as Record<string, unknown>)?.category as string | undefined,
      }));

      return {
        ...project,
        skills,
        technologies: projectTechnologies || [],
      };
    } catch (error) {
      console.error('[ProjectService] Unexpected error in getProjectWithDetails:', error);
      return null;
    }
  }

  /**
   * Create new project
   */
  async createProject(projectData: ProjectInsert): Promise<Project | null> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[ProjectService] Not authenticated');
        return null;
      }

      // Ensure user_id is set
      const dataWithUser: ProjectInsert = {
        ...projectData,
        user_id: user.id,
      };

      const { data: project, error } = await supabase
        .from('projects')
        .insert(dataWithUser)
        .select()
        .single();

      if (error) {
        console.error('[ProjectService] Error creating project:', error);
        return null;
      }

      return project;
    } catch (error) {
      console.error('[ProjectService] Unexpected error in createProject:', error);
      return null;
    }
  }

  /**
   * Update existing project
   */
  async updateProject(projectId: string, updates: ProjectUpdate): Promise<Project | null> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[ProjectService] Not authenticated');
        return null;
      }

      const { data: project, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .eq('user_id', user.id) // RLS will enforce this, but explicit is better
        .select()
        .single();

      if (error) {
        console.error('[ProjectService] Error updating project:', error);
        return null;
      }

      return project;
    } catch (error) {
      console.error('[ProjectService] Unexpected error in updateProject:', error);
      return null;
    }
  }

  /**
   * Delete project
   * IMPORTANT: This preserves historical skill_evidence records
   * The CASCADE delete only removes project_skills and project_technologies
   */
  async deleteProject(projectId: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[ProjectService] Not authenticated');
        return false;
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) {
        console.error('[ProjectService] Error deleting project:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[ProjectService] Unexpected error in deleteProject:', error);
      return false;
    }
  }

  /**
   * Add skill to project
   */
  async addSkillToProject(projectSkillData: ProjectSkillInsert): Promise<ProjectSkill | null> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[ProjectService] Not authenticated');
        return null;
      }

      // Verify project belongs to user
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, user_id')
        .eq('id', projectSkillData.project_id)
        .eq('user_id', user.id)
        .single();

      if (projectError || !project) {
        console.error('[ProjectService] Project not found or access denied');
        return null;
      }

      // Verify skill belongs to user
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .select('id, user_id')
        .eq('id', projectSkillData.skill_id)
        .eq('user_id', user.id)
        .single();

      if (skillError || !skill) {
        console.error('[ProjectService] Skill not found or access denied');
        return null;
      }

      const { data: projectSkill, error } = await supabase
        .from('project_skills')
        .insert(projectSkillData)
        .select()
        .single();

      if (error) {
        console.error('[ProjectService] Error adding skill to project:', error);
        return null;
      }

      return projectSkill;
    } catch (error) {
      console.error('[ProjectService] Unexpected error in addSkillToProject:', error);
      return null;
    }
  }

  /**
   * Remove skill from project
   * IMPORTANT: This does NOT delete skill_evidence records
   */
  async removeSkillFromProject(projectId: string, skillId: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[ProjectService] Not authenticated');
        return false;
      }

      const { error } = await supabase
        .from('project_skills')
        .delete()
        .eq('project_id', projectId)
        .eq('skill_id', skillId);

      if (error) {
        console.error('[ProjectService] Error removing skill from project:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[ProjectService] Unexpected error in removeSkillFromProject:', error);
      return false;
    }
  }

  /**
   * Update project skill (mainly for skill_level_demonstrated)
   */
  async updateProjectSkill(
    projectId: string,
    skillId: string,
    updates: { skill_level_demonstrated?: string; usage_notes?: string }
  ): Promise<ProjectSkill | null> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[ProjectService] Not authenticated');
        return null;
      }

      const { data: projectSkill, error } = await supabase
        .from('project_skills')
        .update(updates)
        .eq('project_id', projectId)
        .eq('skill_id', skillId)
        .select()
        .single();

      if (error) {
        console.error('[ProjectService] Error updating project skill:', error);
        return null;
      }

      return projectSkill;
    } catch (error) {
      console.error('[ProjectService] Unexpected error in updateProjectSkill:', error);
      return null;
    }
  }

  /**
   * Add technology to project
   */
  async addTechnologyToProject(techData: ProjectTechnologyInsert): Promise<ProjectTechnology | null> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[ProjectService] Not authenticated');
        return null;
      }

      // Verify project belongs to user
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, user_id')
        .eq('id', techData.project_id)
        .eq('user_id', user.id)
        .single();

      if (projectError || !project) {
        console.error('[ProjectService] Project not found or access denied');
        return null;
      }

      const { data: technology, error } = await supabase
        .from('project_technologies')
        .insert(techData)
        .select()
        .single();

      if (error) {
        console.error('[ProjectService] Error adding technology to project:', error);
        return null;
      }

      return technology;
    } catch (error) {
      console.error('[ProjectService] Unexpected error in addTechnologyToProject:', error);
      return null;
    }
  }

  /**
   * Remove technology from project
   */
  async removeTechnologyFromProject(projectId: string, technologyId: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[ProjectService] Not authenticated');
        return false;
      }

      const { error } = await supabase
        .from('project_technologies')
        .delete()
        .eq('id', technologyId)
        .eq('project_id', projectId);

      if (error) {
        console.error('[ProjectService] Error removing technology from project:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[ProjectService] Unexpected error in removeTechnologyFromProject:', error);
      return false;
    }
  }

  /**
   * Generate skill evidence for a completed project
   * 
   * CRITICAL: Evidence is only generated when:
   * 1. Project has sufficient information
   * 2. Project status is 'completed'
   * 3. Skills are explicitly associated
   * 4. Skill level is specified
   * 
   * This does NOT fabricate evidence or automatically assign mastery
   */
  async generateProjectEvidence(projectId: string): Promise<ProjectEvidenceGenerationResult> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return {
          success: false,
          project_id: projectId,
          evidence_generated: 0,
          skills_processed: 0,
          errors: ['Not authenticated'],
        };
      }

      // Get project with details
      const projectWithDetails = await this.getProjectWithDetails(projectId);

      if (!projectWithDetails) {
        return {
          success: false,
          project_id: projectId,
          evidence_generated: 0,
          skills_processed: 0,
          errors: ['Project not found'],
        };
      }

      // Validate project has sufficient information for evidence
      const errors: string[] = [];

      if (!projectWithDetails.title || projectWithDetails.title.trim().length === 0) {
        errors.push('Project title is required');
      }

      if (projectWithDetails.status !== 'completed') {
        errors.push('Project must be completed to generate evidence');
      }

      if (projectWithDetails.skills.length === 0) {
        errors.push('Project must have associated skills');
      }

      if (errors.length > 0) {
        return {
          success: false,
          project_id: projectId,
          evidence_generated: 0,
          skills_processed: 0,
          errors,
        };
      }

      // Generate evidence for each skill
      let evidenceGenerated = 0;
      const skillsProcessed = projectWithDetails.skills.length;

      for (const projectSkill of projectWithDetails.skills) {
        // Skip skills without demonstrated level
        if (!projectSkill.skill_level_demonstrated) {
          errors.push(`Skill ${projectSkill.skill_name} has no demonstrated level`);
          continue;
        }

        // Check if evidence already exists for this project-skill combination (idempotency)
        const { data: existingEvidence } = await supabase
          .from('skill_evidence')
          .select('id')
          .eq('user_id', user.id)
          .eq('skill_id', projectSkill.skill_id)
          .eq('evidence_type', 'project')
          .eq('evidence_source_table', 'projects')
          .eq('evidence_source_id', projectId)
          .limit(1);

        if (existingEvidence && existingEvidence.length > 0) {
          errors.push(`Evidence already exists for ${projectSkill.skill_name}`);
          continue;
        }

        // Prepare project metadata for evidence
        const projectMetadata: ProjectMetadata = {
          projectId: projectWithDetails.id,
          projectTitle: projectWithDetails.title,
          description: projectWithDetails.description || undefined,
          technologies: projectWithDetails.technologies.map(t => t.technology_name),
          completedAt: projectWithDetails.completion_date || projectWithDetails.updated_at || new Date().toISOString(),
          githubUrl: projectWithDetails.repository_url || undefined,
          demoUrl: projectWithDetails.demo_url || undefined,
        };

        // Generate evidence using existing skill evidence service
        const result = await skillEvidenceService.captureProject(
          projectSkill.skill_id,
          projectMetadata,
          projectSkill.skill_level_demonstrated as 'beginner' | 'intermediate' | 'advanced' | 'expert'
        );

        if (result.success) {
          evidenceGenerated++;
        } else {
          errors.push(`Failed to generate evidence for ${projectSkill.skill_name}: ${result.error}`);
        }
      }

      return {
        success: evidenceGenerated > 0,
        project_id: projectId,
        evidence_generated: evidenceGenerated,
        skills_processed: skillsProcessed,
        errors,
      };
    } catch (error) {
      console.error('[ProjectService] Unexpected error in generateProjectEvidence:', error);
      return {
        success: false,
        project_id: projectId,
        evidence_generated: 0,
        skills_processed: 0,
        errors: ['Unexpected error generating evidence'],
      };
    }
  }

  /**
   * Get project statistics for current user
   */
  async getProjectStatistics(): Promise<ProjectStatistics> {
    try {
      const projects = await this.getUserProjects();

      const totalProjects = projects.length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;

      // Get unique skills and technologies across all projects
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return {
          total_projects: totalProjects,
          completed_projects: completedProjects,
          in_progress_projects: inProgressProjects,
          total_skills_demonstrated: 0,
          total_technologies_used: 0,
          projects_with_evidence: 0,
        };
      }

      // Get all project skills for user's projects
      const { data: projectSkills } = await supabase
        .from('project_skills')
        .select('skill_id, project_id')
        .in(
          'project_id',
          projects.map(p => p.id)
        );

      const uniqueSkills = new Set(projectSkills?.map(ps => ps.skill_id) || []);

      // Get all project technologies
      const { data: projectTechnologies } = await supabase
        .from('project_technologies')
        .select('technology_name, project_id')
        .in(
          'project_id',
          projects.map(p => p.id)
        );

      const uniqueTechnologies = new Set(projectTechnologies?.map(pt => pt.technology_name) || []);

      // Count projects with evidence (projects that have evidence in skill_evidence table)
      const { data: evidenceRecords } = await supabase
        .from('skill_evidence')
        .select('evidence_source_id')
        .eq('evidence_type', 'project')
        .eq('evidence_source_table', 'projects')
        .eq('user_id', user.id);

      const projectsWithEvidence = new Set(evidenceRecords?.map(e => e.evidence_source_id) || []).size;

      return {
        total_projects: totalProjects,
        completed_projects: completedProjects,
        in_progress_projects: inProgressProjects,
        total_skills_demonstrated: uniqueSkills.size,
        total_technologies_used: uniqueTechnologies.size,
        projects_with_evidence: projectsWithEvidence,
      };
    } catch (error) {
      console.error('[ProjectService] Unexpected error in getProjectStatistics:', error);
      return {
        total_projects: 0,
        completed_projects: 0,
        in_progress_projects: 0,
        total_skills_demonstrated: 0,
        total_technologies_used: 0,
        projects_with_evidence: 0,
      };
    }
  }
}

export const projectService = new ProjectService();
