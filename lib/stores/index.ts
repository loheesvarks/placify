/**
 * Stores barrel exports
 * Centralized state management
 */

export { useAuthStore } from './auth.store';
export type { AuthState, AuthActions, AuthStore } from './auth.store';

export { useOnboardingStore } from './onboarding.store';
export type { OnboardingState, OnboardingActions, OnboardingStore } from './onboarding.store';

export { useSidebarStore } from './sidebar.store';
export { useThemeStore } from './theme.store';
export { useDashboardStore } from './dashboard.store';
