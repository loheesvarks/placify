export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          onboarding_completed: boolean;
          theme_preference: 'dark' | 'light';
          notification_preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          onboarding_completed?: boolean;
          theme_preference?: 'dark' | 'light';
          notification_preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          onboarding_completed?: boolean;
          theme_preference?: 'dark' | 'light';
          notification_preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      target_profiles: {
        Row: {
          id: string;
          user_id: string;
          target_role: string;
          target_package_min: number | null;
          target_package_max: number | null;
          currency: string;
          target_companies: string[];
          available_hours_per_day: number | null;
          timeline_weeks: number | null;
          start_date: string | null;
          expected_end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_role: string;
          target_package_min?: number | null;
          target_package_max?: number | null;
          currency?: string;
          target_companies?: string[];
          available_hours_per_day?: number | null;
          timeline_weeks?: number | null;
          start_date?: string | null;
          expected_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          target_role?: string;
          target_package_min?: number | null;
          target_package_max?: number | null;
          currency?: string;
          target_companies?: string[];
          available_hours_per_day?: number | null;
          timeline_weeks?: number | null;
          start_date?: string | null;
          expected_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          skill_name: string;
          proficiency_level: number | null;
          category: 'technical' | 'soft' | 'domain' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_name: string;
          proficiency_level?: number | null;
          category?: 'technical' | 'soft' | 'domain' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_name?: string;
          proficiency_level?: number | null;
          category?: 'technical' | 'soft' | 'domain' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
