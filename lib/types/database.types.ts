export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      coding_problems: {
        Row: {
          category: string
          created_at: string | null
          description: string
          difficulty: string
          external_url: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          difficulty: string
          external_url?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          external_url?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_requirements: {
        Row: {
          company_name: string
          created_at: string | null
          id: string
          importance: string
          last_reviewed_at: string | null
          notes: string | null
          required_level: string
          role_name: string
          skill_name: string
          source_id: string | null
          updated_at: string | null
          verification_status: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          id?: string
          importance: string
          last_reviewed_at?: string | null
          notes?: string | null
          required_level: string
          role_name: string
          skill_name: string
          source_id?: string | null
          updated_at?: string | null
          verification_status?: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          id?: string
          importance?: string
          last_reviewed_at?: string | null
          notes?: string | null
          required_level?: string
          role_name?: string
          skill_name?: string
          source_id?: string | null
          updated_at?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_requirements_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          difficulty: string
          estimated_minutes: number | null
          id: string
          is_published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          difficulty: string
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty?: string
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lesson_completions: {
        Row: {
          completed_at: string
          created_at: string | null
          id: string
          lesson_id: string
          time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string | null
          id?: string
          lesson_id: string
          time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string | null
          id?: string
          lesson_id?: string
          time_spent_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_completions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          lesson_id: string
          progress: number | null
          started_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          lesson_id: string
          progress?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          lesson_id?: string
          progress?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string | null
          description: string | null
          estimated_minutes: number | null
          id: string
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          order_index: number
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_progress: {
        Row: {
          attempts: number | null
          id: string
          last_attempted_at: string | null
          problem_id: string
          solved_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          id?: string
          last_attempted_at?: string | null
          problem_id: string
          solved_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          id?: string
          last_attempted_at?: string | null
          problem_id?: string
          solved_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_progress_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "coding_problems"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          theme_preference: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          completed_at: string | null
          id: string
          quiz_id: string
          score: number
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          quiz_id: string
          score: number
          total_questions: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          quiz_id?: string
          score?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          explanation: string | null
          id: string
          options: Json
          order_index: number
          question: string
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          explanation?: string | null
          id?: string
          options: Json
          order_index: number
          question: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          explanation?: string | null
          id?: string
          options?: Json
          order_index?: number
          question?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          difficulty: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          difficulty: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          accepted: boolean | null
          acted_upon_at: string | null
          action: string
          calculation_version: string
          context: Json | null
          created_at: string | null
          evidence_used: Json | null
          expected_benefit: string | null
          id: string
          priority: string
          reason: string
          recommendation_type: string
          target_skill_id: string | null
          target_skill_name: string | null
          user_id: string
        }
        Insert: {
          accepted?: boolean | null
          acted_upon_at?: string | null
          action: string
          calculation_version?: string
          context?: Json | null
          created_at?: string | null
          evidence_used?: Json | null
          expected_benefit?: string | null
          id?: string
          priority: string
          reason: string
          recommendation_type: string
          target_skill_id?: string | null
          target_skill_name?: string | null
          user_id: string
        }
        Update: {
          accepted?: boolean | null
          acted_upon_at?: string | null
          action?: string
          calculation_version?: string
          context?: Json | null
          created_at?: string | null
          evidence_used?: Json | null
          expected_benefit?: string | null
          id?: string
          priority?: string
          reason?: string
          recommendation_type?: string
          target_skill_id?: string | null
          target_skill_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_target_skill_id_fkey"
            columns: ["target_skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_skills: {
        Row: {
          created_at: string | null
          id: string
          importance: string | null
          order_index: number
          roadmap_id: string
          skill_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          importance?: string | null
          order_index: number
          roadmap_id: string
          skill_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          importance?: string | null
          order_index?: number
          roadmap_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_skills_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmap_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          target_role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          target_role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          target_role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      role_requirements: {
        Row: {
          created_at: string | null
          id: string
          importance: string
          last_reviewed_at: string | null
          notes: string | null
          required_level: string
          role_name: string
          skill_name: string
          source_id: string | null
          updated_at: string | null
          verification_status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          importance: string
          last_reviewed_at?: string | null
          notes?: string | null
          required_level: string
          role_name: string
          skill_name: string
          source_id?: string | null
          updated_at?: string | null
          verification_status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          importance?: string
          last_reviewed_at?: string | null
          notes?: string | null
          required_level?: string
          role_name?: string
          skill_name?: string
          source_id?: string | null
          updated_at?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_requirements_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_assessments: {
        Row: {
          assessment_score_avg: number | null
          calculation_version: string
          claimed_level: number | null
          confidence: string
          created_at: string | null
          demonstrated_level: string
          evidence_count: number
          id: string
          interview_performance: number | null
          last_calculated_at: string
          practice_performance_avg: number | null
          project_count: number | null
          skill_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assessment_score_avg?: number | null
          calculation_version?: string
          claimed_level?: number | null
          confidence?: string
          created_at?: string | null
          demonstrated_level?: string
          evidence_count?: number
          id?: string
          interview_performance?: number | null
          last_calculated_at?: string
          practice_performance_avg?: number | null
          project_count?: number | null
          skill_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assessment_score_avg?: number | null
          calculation_version?: string
          claimed_level?: number | null
          confidence?: string
          created_at?: string | null
          demonstrated_level?: string
          evidence_count?: number
          id?: string
          interview_performance?: number | null
          last_calculated_at?: string
          practice_performance_avg?: number | null
          project_count?: number | null
          skill_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_assessments_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_evidence: {
        Row: {
          created_at: string | null
          difficulty: string | null
          evidence_source_id: string | null
          evidence_source_table: string | null
          evidence_type: string
          id: string
          metadata: Json | null
          recorded_at: string
          score: number | null
          skill_id: string
          skill_level_demonstrated: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          difficulty?: string | null
          evidence_source_id?: string | null
          evidence_source_table?: string | null
          evidence_type: string
          id?: string
          metadata?: Json | null
          recorded_at?: string
          score?: number | null
          skill_id: string
          skill_level_demonstrated?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          difficulty?: string | null
          evidence_source_id?: string | null
          evidence_source_table?: string | null
          evidence_type?: string
          id?: string
          metadata?: Json | null
          recorded_at?: string
          score?: number | null
          skill_id?: string
          skill_level_demonstrated?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_evidence_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_gaps: {
        Row: {
          calculated_at: string
          calculation_version: string
          confidence: string
          created_at: string | null
          current_level: string
          gap_size: string
          id: string
          importance: string
          is_prerequisite: boolean
          priority_score: number
          required_level: string
          skill_id: string
          skill_name: string
          urgency: string
          user_id: string
        }
        Insert: {
          calculated_at?: string
          calculation_version?: string
          confidence: string
          created_at?: string | null
          current_level: string
          gap_size: string
          id?: string
          importance: string
          is_prerequisite?: boolean
          priority_score: number
          required_level: string
          skill_id: string
          skill_name: string
          urgency: string
          user_id: string
        }
        Update: {
          calculated_at?: string
          calculation_version?: string
          confidence?: string
          created_at?: string | null
          current_level?: string
          gap_size?: string
          id?: string
          importance?: string
          is_prerequisite?: boolean
          priority_score?: number
          required_level?: string
          skill_id?: string
          skill_name?: string
          urgency?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_gaps_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          proficiency_level: number | null
          skill_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          proficiency_level?: number | null
          skill_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          proficiency_level?: number | null
          skill_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sources: {
        Row: {
          author: string | null
          created_at: string | null
          description: string | null
          id: string
          last_reviewed_at: string | null
          name: string
          organization: string | null
          source_type: string
          updated_at: string | null
          url: string | null
          verification_status: string
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          last_reviewed_at?: string | null
          name: string
          organization?: string | null
          source_type: string
          updated_at?: string | null
          url?: string | null
          verification_status?: string
        }
        Update: {
          author?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          last_reviewed_at?: string | null
          name?: string
          organization?: string | null
          source_type?: string
          updated_at?: string | null
          url?: string | null
          verification_status?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          completed: boolean | null
          created_at: string | null
          duration_minutes: number | null
          ended_at: string | null
          id: string
          session_type: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          session_type: string
          started_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          session_type?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      target_profiles: {
        Row: {
          available_hours_per_day: number | null
          created_at: string | null
          currency: string | null
          expected_end_date: string | null
          id: string
          start_date: string | null
          target_companies: string[] | null
          target_package_max: number | null
          target_package_min: number | null
          target_role: string
          timeline_weeks: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_hours_per_day?: number | null
          created_at?: string | null
          currency?: string | null
          expected_end_date?: string | null
          id?: string
          start_date?: string | null
          target_companies?: string[] | null
          target_package_max?: number | null
          target_package_min?: number | null
          target_role: string
          timeline_weeks?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_hours_per_day?: number | null
          created_at?: string | null
          currency?: string | null
          expected_end_date?: string | null
          id?: string
          start_date?: string | null
          target_companies?: string[] | null
          target_package_max?: number | null
          target_package_min?: number | null
          target_role?: string
          timeline_weeks?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_at: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          current_streak: number | null
          last_activity_date: string | null
          level: number | null
          longest_streak: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_streak?: number | null
          last_activity_date?: string | null
          level?: number | null
          longest_streak?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_streak?: number | null
          last_activity_date?: string | null
          level?: number | null
          longest_streak?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
