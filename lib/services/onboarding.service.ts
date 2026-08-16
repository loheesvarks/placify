/**
 * Onboarding service
 * Service layer that wraps existing onboarding server actions
 * Provides a clean abstraction for onboarding operations
 */

import type { CompleteOnboardingData } from '@/lib/validations/onboarding';
import * as onboardingActions from '@/lib/actions/onboarding.actions';

export interface OnboardingStatusResponse {
  completed: boolean;
  profile?: Record<string, unknown>;
}

export interface OnboardingResponse {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

/**
 * Onboarding service interface
 * Defines the contract for onboarding operations
 */
export interface IOnboardingService {
  checkOnboardingStatus(): Promise<OnboardingStatusResponse>;
  completeOnboarding(data: CompleteOnboardingData): Promise<OnboardingResponse>;
  skipOnboarding(): Promise<OnboardingResponse>;
}

/**
 * Onboarding service implementation
 * Wraps existing server actions to provide a consistent service interface
 */
class OnboardingService implements IOnboardingService {
  /**
   * Check if user has completed onboarding
   */
  async checkOnboardingStatus(): Promise<OnboardingStatusResponse> {
    try {
      return await onboardingActions.checkOnboardingStatus();
    } catch (error) {
      console.error('[OnboardingService] Check status error:', error);
      return { completed: false };
    }
  }

  /**
   * Complete the onboarding process
   * Saves all onboarding data and marks onboarding as completed
   */
  async completeOnboarding(data: CompleteOnboardingData): Promise<OnboardingResponse> {
    try {
      return await onboardingActions.completeOnboarding(data);
    } catch (error) {
      console.error('[OnboardingService] Complete onboarding error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while completing onboarding',
      };
    }
  }

  /**
   * Skip onboarding (not recommended, but available)
   */
  async skipOnboarding(): Promise<OnboardingResponse> {
    try {
      return await onboardingActions.skipOnboarding();
    } catch (error) {
      console.error('[OnboardingService] Skip onboarding error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while skipping onboarding',
      };
    }
  }
}

export const onboardingService = new OnboardingService();
