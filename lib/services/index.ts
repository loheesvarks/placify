/**
 * Services barrel exports
 * Centralized service layer access
 */

export { authService } from './auth.service';
export type { IAuthService } from './auth.service';

export { dashboardService } from './dashboard.service';
export type { IDashboardService } from './dashboard.service';

export { onboardingService } from './onboarding.service';
export type { IOnboardingService, OnboardingStatusResponse, OnboardingResponse } from './onboarding.service';
