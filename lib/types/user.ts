/**
 * User-related types
 * Shared user data types across the application
 */

/**
 * User role enumeration
 */
export type UserRole = 'student' | 'admin';

/**
 * User status enumeration
 */
export type UserStatus = 'active' | 'inactive' | 'suspended';

/**
 * Extended user preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}
