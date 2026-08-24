/**
 * Project Actions - Phase 4B
 * 
 * Server actions for project management
 * Integrated with skill evidence system
 */

'use server';

import { projectService } from '@/lib/services/project.service';
import type {
  Project,
  ProjectInsert,
  ProjectUpdate,
  ProjectWithDetails,
  ProjectFormData,
  ProjectSkillFormData,
  ProjectTechnologyFormData,
  ProjectStatistics,
  ProjectEvidenceGenerationResult,
} from '@/lib/types/project.types';

/**
 * Action response type
 */
export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get all projects for current user
 */
export async function getUserProjects(): Promise<ActionResponse<Project[]>> {
  try {
    const projects = await projectService.getUserProjects();
    return { success: true, data: projects };
  } catch (error) {
    console.error('[ProjectActions] Error in getUserProjects:', error);
    return { success: false, error: 'Failed to fetch projects' };
  }
}

/**
 * Get single project with full details
 */
export async function getProjectWithDetails(
  projectId: string
): Promise<ActionResponse<ProjectWithDetails>> {
  try {
    if (!projectId || projectId.trim().length === 0) {
      return { success: false, error: 'Project ID is required' };
    }

    const project = await projectService.getProjectWithDetails(projectId);

    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    return { success: true, data: project };
  } catch (error) {
    console.error('[ProjectActions] Error in getProjectWithDetails:', error);
    return { success: false, error: 'Failed to fetch project details' };
  }
}

/**
 * Create new project
 */
export async function createProject(
  formData: ProjectFormData
): Promise<ActionResponse<Project>> {
  try {
    // Validate required fields
    if (!formData.title || formData.title.trim().length === 0) {
      return { success: false, error: 'Project title is required' };
    }

    // Validate status
    const validStatuses = ['planning', 'in_progress', 'completed', 'archived'];
    if (!validStatuses.includes(formData.status)) {
      return { success: false, error: 'Invalid project status' };
    }

    // Validate dates if provided
    if (formData.start_date && formData.completion_date) {
      const startDate = new Date(formData.start_date);
      const completionDate = new Date(formData.completion_date);
      if (completionDate < startDate) {
        return { success: false, error: 'Completion date cannot be before start date' };
      }
    }

    // Validate URLs if provided
    if (formData.repository_url && !isValidUrl(formData.repository_url)) {
      return { success: false, error: 'Invalid repository URL' };
    }
    if (formData.demo_url && !isValidUrl(formData.demo_url)) {
      return { success: false, error: 'Invalid demo URL' };
    }

    const projectData: ProjectInsert = {
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
      status: formData.status,
      contribution_role: formData.contribution_role?.trim() || null,
      team_size: formData.team_size || null,
      repository_url: formData.repository_url?.trim() || null,
      demo_url: formData.demo_url?.trim() || null,
      outcomes: formData.outcomes?.trim() || null,
      start_date: formData.start_date || null,
      completion_date: formData.completion_date || null,
      is_public: formData.is_public || false,
      user_id: '', // Will be set by service
    };

    const project = await projectService.createProject(projectData);

    if (!project) {
      return { success: false, error: 'Failed to create project' };
    }

    return { success: true, data: project };
  } catch (error) {
    console.error('[ProjectActions] Error in createProject:', error);
    return { success: false, error: 'Unexpected error creating project' };
  }
}

/**
 * Update existing project
 */
export async function updateProject(
  projectId: string,
  formData: Partial<ProjectFormData>
): Promise<ActionResponse<Project>> {
  try {
    if (!projectId || projectId.trim().length === 0) {
      return { success: false, error: 'Project ID is required' };
    }

    // Validate title if provided
    if (formData.title !== undefined && formData.title.trim().length === 0) {
      return { success: false, error: 'Project title cannot be empty' };
    }

    // Validate status if provided
    if (formData.status) {
      const validStatuses = ['planning', 'in_progress', 'completed', 'archived'];
      if (!validStatuses.includes(formData.status)) {
        return { success: false, error: 'Invalid project status' };
      }
    }

    // Validate URLs if provided
    if (formData.repository_url && !isValidUrl(formData.repository_url)) {
      return { success: false, error: 'Invalid repository URL' };
    }
    if (formData.demo_url && !isValidUrl(formData.demo_url)) {
      return { success: false, error: 'Invalid demo URL' };
    }

    const updates: ProjectUpdate = {};

    if (formData.title !== undefined) updates.title = formData.title.trim();
    if (formData.description !== undefined) updates.description = formData.description?.trim() || null;
    if (formData.status !== undefined) updates.status = formData.status;
    if (formData.contribution_role !== undefined)
      updates.contribution_role = formData.contribution_role?.trim() || null;
    if (formData.team_size !== undefined) updates.team_size = formData.team_size || null;
    if (formData.repository_url !== undefined)
      updates.repository_url = formData.repository_url?.trim() || null;
    if (formData.demo_url !== undefined) updates.demo_url = formData.demo_url?.trim() || null;
    if (formData.outcomes !== undefined) updates.outcomes = formData.outcomes?.trim() || null;
    if (formData.start_date !== undefined) updates.start_date = formData.start_date || null;
    if (formData.completion_date !== undefined)
      updates.completion_date = formData.completion_date || null;
    if (formData.is_public !== undefined) updates.is_public = formData.is_public;

    const project = await projectService.updateProject(projectId, updates);

    if (!project) {
      return { success: false, error: 'Failed to update project' };
    }

    return { success: true, data: project };
  } catch (error) {
    console.error('[ProjectActions] Error in updateProject:', error);
    return { success: false, error: 'Unexpected error updating project' };
  }
}

/**
 * Delete project
 */
export async function deleteProject(projectId: string): Promise<ActionResponse<void>> {
  try {
    if (!projectId || projectId.trim().length === 0) {
      return { success: false, error: 'Project ID is required' };
    }

    const success = await projectService.deleteProject(projectId);

    if (!success) {
      return { success: false, error: 'Failed to delete project' };
    }

    return { success: true };
  } catch (error) {
    console.error('[ProjectActions] Error in deleteProject:', error);
    return { success: false, error: 'Unexpected error deleting project' };
  }
}

/**
 * Add skill to project
 */
export async function addSkillToProject(
  projectId: string,
  skillData: ProjectSkillFormData
): Promise<ActionResponse<void>> {
  try {
    if (!projectId || projectId.trim().length === 0) {
      return { success: false, error: 'Project ID is required' };
    }

    if (!skillData.skill_id || skillData.skill_id.trim().length === 0) {
      return { success: false, error: 'Skill ID is required' };
    }

    // Validate skill_level_demonstrated if provided
    if (skillData.skill_level_demonstrated) {
      const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
      if (!validLevels.includes(skillData.skill_level_demonstrated)) {
        return { success: false, error: 'Invalid skill level' };
      }
    }

    const projectSkill = await projectService.addSkillToProject({
      project_id: projectId,
      skill_id: skillData.skill_id,
      skill_level_demonstrated: skillData.skill_level_demonstrated || null,
      usage_notes: skillData.usage_notes?.trim() || null,
    });

    if (!projectSkill) {
      return { success: false, error: 'Failed to add skill to project' };
    }

    return { success: true };
  } catch (error) {
    console.error('[ProjectActions] Error in addSkillToProject:', error);
    return { success: false, error: 'Unexpected error adding skill' };
  }
}

/**
 * Remove skill from project
 */
export async function removeSkillFromProject(
  projectId: string,
  skillId: string
): Promise<ActionResponse<void>> {
  try {
    if (!projectId || projectId.trim().length === 0) {
      return { success: false, error: 'Project ID is required' };
    }

    if (!skillId || skillId.trim().length === 0) {
      return { success: false, error: 'Skill ID is required' };
    }

    const success = await projectService.removeSkillFromProject(projectId, skillId);

    if (!success) {
      return { success: false, error: 'Failed to remove skill from project' };
    }

    return { success: true };
  } catch (error) {
    console.error('[ProjectActions] Error in removeSkillFromProject:', error);
    return { success: false, error: 'Unexpected error removing skill' };
  }
}

/**
 * Update project skill
 */
export async function updateProjectSkill(
  projectId: string,
  skillId: string,
  updates: { skill_level_demonstrated?: string; usage_notes?: string }
): Promise<ActionResponse<void>> {
  try {
    if (!projectId || projectId.trim().length === 0) {
      return { success: false, error: 'Project ID is required' };
    }

    if (!skillId || skillId.trim().length === 0) {
      return { success: false, error: 'Skill ID is required' };
    }

    // Validate skill_level_demonstrated if provided
    if (updates.skill_level_demonstrated) {
      const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
      if (!validLevels.includes(updates.skill_level_demonstrated)) {
        return { success: false, error: 'Invalid skill level' };
      }
    }

    const projectSkill = await projectService.updateProjectSkill(projectId, skillId, updates);

    if (!projectSkill) {
      return { success: false, error: 'Failed to update project skill' };
    }

    return { success: true };
  } catch (error) {
    console.error('[ProjectActions] Error in updateProjectSkill:', error);
    return { success: false, error: 'Unexpected error updating project skill' };
  }
}

/**
 * Add technology to project
 */
export async function addTechnologyToProject(
  projectId: string,
  techData: ProjectTechnologyFormData
): Promise<ActionResponse<void>> {
  try {
    if (!projectId || projectId.trim().length === 0) {
      return { success: false, error: 'Project ID is required' };
    }

    if (!techData.technology_name || techData.technology_name.trim().length === 0) {
      return { success: false, error: 'Technology name is required' };
    }

    const technology = await projectService.addTechnologyToProject({
      project_id: projectId,
      technology_name: techData.technology_name.trim(),
      category: techData.category || null,
    });

    if (!technology) {
      return { success: false, error: 'Failed to add technology to project' };
    }

    return { success: true };
  } catch (error) {
    console.error('[ProjectActions] Error in addTechnologyToProject:', error);
    return { success: false, error: 'Unexpected error adding technology' };
  }
}

/**
 * Remove technology from project
 */
export async function removeTechnologyFromProject(
  projectId: string,
  technologyId: string
): Promise<ActionResponse<void>> {
  try {
    if (!projectId || projectId.trim().length === 0) {
      return { success: false, error: 'Project ID is required' };
    }

    if (!technologyId || technologyId.trim().length === 0) {
      return { success: false, error: 'Technology ID is required' };
    }

    const success = await projectService.removeTechnologyFromProject(projectId, technologyId);

    if (!success) {
      return { success: false, error: 'Failed to remove technology from project' };
    }

    return { success: true };
  } catch (error) {
    console.error('[ProjectActions] Error in removeTechnologyFromProject:', error);
    return { success: false, error: 'Unexpected error removing technology' };
  }
}

/**
 * Generate skill evidence for completed project
 */
export async function generateProjectEvidence(
  projectId: string
): Promise<ActionResponse<ProjectEvidenceGenerationResult>> {
  try {
    if (!projectId || projectId.trim().length === 0) {
      return { success: false, error: 'Project ID is required' };
    }

    const result = await projectService.generateProjectEvidence(projectId);

    return { success: result.success, data: result };
  } catch (error) {
    console.error('[ProjectActions] Error in generateProjectEvidence:', error);
    return { success: false, error: 'Unexpected error generating evidence' };
  }
}

/**
 * Get project statistics
 */
export async function getProjectStatistics(): Promise<ActionResponse<ProjectStatistics>> {
  try {
    const stats = await projectService.getProjectStatistics();
    return { success: true, data: stats };
  } catch (error) {
    console.error('[ProjectActions] Error in getProjectStatistics:', error);
    return { success: false, error: 'Failed to fetch project statistics' };
  }
}

/**
 * Helper: Validate URL format
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
