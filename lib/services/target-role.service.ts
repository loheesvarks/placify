/**
 * Target Role Service
 * Phase 3B: Target role linkage to role_requirements
 * 
 * This service connects a user's target role (from target_profiles.target_role)
 * to the canonical role requirements (from role_requirements.role_name).
 * 
 * Schema design:
 * - target_profiles.target_role (TEXT) stores the user's selected role
 * - role_requirements.role_name (TEXT) stores canonical role names
 * - The linkage is by name matching (e.g., "Machine Learning Engineer")
 * 
 * IMPORTANT: Does not duplicate target-role data, uses existing schema
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database.types';

type TargetProfile = Database['public']['Tables']['target_profiles']['Row'];
type RoleRequirement = Database['public']['Tables']['role_requirements']['Row'];

/**
 * Target role with requirements
 */
export interface TargetRoleWithRequirements {
  targetProfile: TargetProfile;
  roleRequirements: RoleRequirement[];
  requirementCount: number;
  essentialCount: number;
  recommendedCount: number;
  optionalCount: number;
}

/**
 * Available roles (from role_requirements)
 */
export interface AvailableRole {
  roleName: string;
  requirementCount: number;
  essentialSkills: string[];
  verificationStatus: 'verified' | 'framework' | 'inferred';
}

/**
 * Target Role Service
 * Links user's target role to canonical role requirements
 */
class TargetRoleService {
  /**
   * Get user's target role with linked requirements
   * Returns null if user has no target profile
   */
  async getTargetRoleWithRequirements(): Promise<TargetRoleWithRequirements | null> {
    try {
      const supabase = await createClient();

      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[TargetRole] Not authenticated:', authError);
        return null;
      }

      // Get user's target profile
      const { data: targetProfile, error: targetError } = await supabase
        .from('target_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (targetError || !targetProfile) {
        // User hasn't set a target yet
        return null;
      }

      // Get role requirements for the target role
      const { data: roleRequirements, error: reqError } = await supabase
        .from('role_requirements')
        .select('*')
        .eq('role_name', targetProfile.target_role)
        .order('importance'); // Essential first, then recommended, then optional

      if (reqError) {
        console.error('[TargetRole] Error fetching requirements:', reqError);
        return {
          targetProfile,
          roleRequirements: [],
          requirementCount: 0,
          essentialCount: 0,
          recommendedCount: 0,
          optionalCount: 0,
        };
      }

      const requirements = roleRequirements || [];

      // Count by importance
      const essentialCount = requirements.filter((r) => r.importance === 'essential').length;
      const recommendedCount = requirements.filter((r) => r.importance === 'recommended').length;
      const optionalCount = requirements.filter((r) => r.importance === 'optional').length;

      return {
        targetProfile,
        roleRequirements: requirements,
        requirementCount: requirements.length,
        essentialCount,
        recommendedCount,
        optionalCount,
      };
    } catch (error) {
      console.error('[TargetRole] Unexpected error:', error);
      return null;
    }
  }

  /**
   * Get all available roles (from role_requirements)
   * This helps users select valid target roles
   */
  async getAvailableRoles(): Promise<AvailableRole[]> {
    try {
      const supabase = await createClient();

      // Get all unique roles with their requirements
      const { data: requirements, error } = await supabase
        .from('role_requirements')
        .select('role_name, skill_name, importance, verification_status')
        .order('role_name');

      if (error || !requirements) {
        console.error('[TargetRole] Error fetching available roles:', error);
        return [];
      }

      // Group by role_name
      const roleMap = new Map<string, {
        requirements: typeof requirements;
        essentialSkills: string[];
        verificationStatus: 'verified' | 'framework' | 'inferred';
      }>();

      for (const req of requirements) {
        if (!roleMap.has(req.role_name)) {
          roleMap.set(req.role_name, {
            requirements: [],
            essentialSkills: [],
            verificationStatus: req.verification_status as 'verified' | 'framework' | 'inferred',
          });
        }

        const roleData = roleMap.get(req.role_name)!;
        roleData.requirements.push(req);

        if (req.importance === 'essential') {
          roleData.essentialSkills.push(req.skill_name);
        }
      }

      // Convert to array
      const availableRoles: AvailableRole[] = [];
      for (const [roleName, data] of roleMap.entries()) {
        availableRoles.push({
          roleName,
          requirementCount: data.requirements.length,
          essentialSkills: data.essentialSkills,
          verificationStatus: data.verificationStatus,
        });
      }

      return availableRoles.sort((a, b) => a.roleName.localeCompare(b.roleName));
    } catch (error) {
      console.error('[TargetRole] Unexpected error in getAvailableRoles:', error);
      return [];
    }
  }

  /**
   * Get requirements for a specific role (without user context)
   * Useful for role exploration before setting target
   */
  async getRoleRequirements(roleName: string): Promise<RoleRequirement[]> {
    try {
      const supabase = await createClient();

      const { data: requirements, error } = await supabase
        .from('role_requirements')
        .select('*')
        .eq('role_name', roleName)
        .order('importance'); // Essential first

      if (error) {
        console.error('[TargetRole] Error fetching role requirements:', error);
        return [];
      }

      return requirements || [];
    } catch (error) {
      console.error('[TargetRole] Unexpected error in getRoleRequirements:', error);
      return [];
    }
  }

  /**
   * Check if a target role has requirements defined
   * Returns false if role has no requirements (helps detect typos or unsupported roles)
   */
  async hasRequirementsDefined(roleName: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const { count, error } = await supabase
        .from('role_requirements')
        .select('id', { count: 'exact', head: true })
        .eq('role_name', roleName);

      if (error) {
        console.error('[TargetRole] Error checking requirements:', error);
        return false;
      }

      return (count || 0) > 0;
    } catch (error) {
      console.error('[TargetRole] Unexpected error in hasRequirementsDefined:', error);
      return false;
    }
  }

  /**
   * Update user's target role
   * Returns true if successful
   */
  async updateTargetRole(roleName: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('[TargetRole] Not authenticated:', authError);
        return false;
      }

      // Verify role has requirements
      const hasReqs = await this.hasRequirementsDefined(roleName);
      if (!hasReqs) {
        console.warn('[TargetRole] Role has no requirements defined:', roleName);
        // Allow it anyway - user might select a role before requirements are added
      }

      // Update target profile
      const { error: updateError } = await supabase
        .from('target_profiles')
        .update({ target_role: roleName })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('[TargetRole] Error updating target role:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[TargetRole] Unexpected error in updateTargetRole:', error);
      return false;
    }
  }
}

export const targetRoleService = new TargetRoleService();

