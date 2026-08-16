/**
 * Application route constants
 * Centralized route definitions for type-safe navigation
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  ONBOARDING: '/onboarding',
  
  // API routes
  AUTH_CALLBACK: '/auth/callback',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];

/**
 * Check if a path matches a route
 */
export function isRoute(path: string, route: RouteValue): boolean {
  return path === route || path.startsWith(`${route}/`);
}

/**
 * Get route with query parameters
 */
export function getRouteWithParams(route: RouteValue, params?: Record<string, string>): string {
  if (!params) return route;
  
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${route}?${queryString}` : route;
}
