import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  onboarding_completed: boolean;
  theme_preference: 'dark' | 'light';
  notification_preferences: NotificationPreferences;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  reminders: boolean;
  weeklyReview: boolean;
  milestones: boolean;
}

export type AuthUser = User;

export type AuthSession = Session;

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: {
    user?: AuthUser;
    session?: AuthSession;
  };
}
