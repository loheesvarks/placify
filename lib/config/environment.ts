/**
 * Environment configuration
 * Centralized environment variable access with type safety
 * IMPORTANT: Never expose private credentials
 */

/**
 * Public environment variables (safe to expose to client)
 */
export const PUBLIC_ENV = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return PUBLIC_ENV.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return PUBLIC_ENV.NODE_ENV === 'development';
}

/**
 * Check if running in test
 */
export function isTest(): boolean {
  return PUBLIC_ENV.NODE_ENV === 'test';
}

/**
 * Validate required environment variables
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
