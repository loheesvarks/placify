/**
 * Onboarding service
 * Service layer boundary for onboarding operations
 * IMPORTANT: This establishes the service boundary only
 * Actual implementation delegates to existing server actions
 * Full migration will happen in a later task
 */

import type { OnboardingData } from '@/lib/types/onboarding';

/**
 * Onboarding service interface
 * Defines the contract for onboarding operations
 */
export interface IOnboardingService {
  saveOnboardingData(_data: OnboardingData): Promise<{ success: boolean; error?: string }>;
  getOnboardingStatus(_userId: string): Promise<{ completed: boolean; data?: Partial<OnboardingData> }>;
}

/**
 * Onboarding service implementation
 * Future integration point - will connect to existing server actions
 */
class OnboardingService implements IOnboardingService {
  async saveOnboardingData(_data: OnboardingData): Promise<{ success: boolean; error?: string }> {
    // TODO: Connect to existing onboarding.actions.ts in future task
    throw new Error('Service integration pending - use existing onboarding actions');
  }

  async getOnboardingStatus(_userId: string): Promise<{ completed: boolean; data?: Partial<OnboardingData> }> {
    // TODO: Connect to existing onboarding.actions.ts in future task
    throw new Error('Service integration pending - use existing onboarding actions');
  }
}

export const onboardingService = new OnboardingService();
