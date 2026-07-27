'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { CompleteOnboardingData } from '@/lib/validations/onboarding';
import { completeOnboardingSchema } from '@/lib/validations/onboarding';
import type { Database } from '@/lib/types/database.types';

interface ActionResponse {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

/**
 * Complete the onboarding process
 * Saves all onboarding data and marks onboarding as completed
 */
export async function completeOnboarding(
  data: CompleteOnboardingData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Validate data
    const validationResult = completeOnboardingSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Invalid data: ' + validationResult.error.issues[0].message,
      };
    }

    const validData = validationResult.data;

    // Start transaction-like operations
    // 1. Update profile with personal info and mark onboarding as complete
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .update({
        full_name: validData.fullName,
        onboarding_completed: true,
      })
      .eq('id', user.id);

    if (profileError) {
      return {
        success: false,
        error: 'Failed to update profile',
      };
    }

    // 2. Create or update target profile
    const targetProfileData: Database['public']['Tables']['target_profiles']['Insert'] = {
      user_id: user.id,
      target_role: validData.preferredRole,
      target_package_min: validData.targetPackageMin,
      target_package_max: validData.targetPackageMax,
      currency: validData.currency,
      target_companies: [], // Will be updated later
      available_hours_per_day: validData.weeklyStudyHours / 7, // Convert weekly to daily
      timeline_weeks: 16, // Default 16 weeks
      start_date: new Date().toISOString().split('T')[0],
      expected_end_date: new Date(Date.now() + 16 * 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: targetProfileError } = await (supabase as any)
      .from('target_profiles')
      .upsert(targetProfileData);

    if (targetProfileError) {
      return {
        success: false,
        error: 'Failed to save career goals',
      };
    }

    // 3. Save skills
    if (validData.currentSkills.length > 0) {
      const skillsToInsert: Database['public']['Tables']['skills']['Insert'][] = 
        validData.currentSkills.map((skill) => ({
          user_id: user.id,
          skill_name: skill.name,
          proficiency_level: skill.proficiency,
          category: skill.category,
        }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: skillsError } = await (supabase as any)
        .from('skills')
        .upsert(skillsToInsert, {
          onConflict: 'user_id,skill_name',
        });

      if (skillsError) {
        return {
          success: false,
          error: 'Failed to save skills',
        };
      }
    }

    // 4. Store additional onboarding metadata in profiles as JSONB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('profiles')
      .update({
        notification_preferences: {
          email: true,
          inApp: true,
          reminders: true,
          weeklyReview: true,
          milestones: true,
          onboarding_metadata: {
            college: validData.college,
            degree: validData.degree,
            department: validData.department,
            currentYear: validData.currentYear,
            graduationYear: validData.graduationYear,
            preferredTechStack: validData.preferredTechStack,
            learningGoals: validData.learningGoals,
            weeklyStudyHours: validData.weeklyStudyHours,
            completedAt: new Date().toISOString(),
          },
        },
      })
      .eq('id', user.id);

    revalidatePath('/', 'layout');

    return {
      success: true,
      data: {
        message: 'Onboarding completed successfully',
      },
    };
  } catch {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Check if user has completed onboarding
 */
export async function checkOnboardingStatus(): Promise<{
  completed: boolean;
  profile?: Record<string, unknown>;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { completed: false };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError} = await (supabase as any)
      .from('profiles')
      .select('onboarding_completed, full_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { completed: false };
    }

    return {
      completed: profile.onboarding_completed,
      profile,
    };
  } catch {
    return { completed: false };
  }
}

/**
 * Skip onboarding (not recommended, but available)
 */
export async function skipOnboarding(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .update({
        onboarding_completed: true,
      })
      .eq('id', user.id);

    if (profileError) {
      return {
        success: false,
        error: 'Failed to update profile',
      };
    }

    revalidatePath('/', 'layout');

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
