/**
 * Domain models and types
 */

import type { Database } from './database.types';

// User Profile
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Notification Preferences
export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  reminders: boolean;
  weeklyReview: boolean;
  milestones: boolean;
}

// Auth types
export interface AuthUser {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
  user: {
    id: string;
    email?: string;
    [key: string]: unknown;
  };
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: {
    user?: AuthUser;
    session?: AuthSession;
  };
}
