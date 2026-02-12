export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward: number | null
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward?: number | null
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          applied_at: string | null
          company: string
          created_at: string
          id: string
          is_remote: boolean | null
          job_url: string | null
          location: string | null
          notes: string | null
          role: string
          salary: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          company: string
          created_at?: string
          id?: string
          is_remote?: boolean | null
          job_url?: string | null
          location?: string | null
          notes?: string | null
          role: string
          salary?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          company?: string
          created_at?: string
          id?: string
          is_remote?: boolean | null
          job_url?: string | null
          location?: string | null
          notes?: string | null
          role?: string
          salary?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assessment_attempts: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string
          id: string
          questions_order: number[] | null
          score: number | null
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          questions_order?: number[] | null
          score?: number | null
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          questions_order?: number[] | null
          score?: number | null
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      coding_problems: {
        Row: {
          created_at: string
          description: string
          difficulty: string
          id: string
          initial_code: string
          solution_code: string | null
          starter_code: string | null
          test_cases: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty: string
          id?: string
          initial_code: string
          solution_code?: string | null
          starter_code?: string | null
          test_cases?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          initial_code?: string
          solution_code?: string | null
          starter_code?: string | null
          test_cases?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id_1: string
          user_id_2: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id_1: string
          user_id_2: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id_1?: string
          user_id_2?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          from_user_id: string | null
          id: string
          is_read: boolean
          reference_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean
          reference_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean
          reference_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      post_upvotes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_upvotes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          post_type: string
          updated_at: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          post_type?: string
          updated_at?: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          post_type?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          applications_count: number
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          full_name: string | null
          github_url: string | null
          headline: string | null
          id: string
          last_active: string | null
          level: number
          linkedin_url: string | null
          problems_solved: number
          role: string | null
          skills: string[] | null
          streak: number
          target: string | null
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          applications_count?: number
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          github_url?: string | null
          headline?: string | null
          id?: string
          last_active?: string | null
          level?: number
          linkedin_url?: string | null
          problems_solved?: number
          role?: string | null
          skills?: string[] | null
          streak?: number
          target?: string | null
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          applications_count?: number
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          github_url?: string | null
          headline?: string | null
          id?: string
          last_active?: string | null
          level?: number
          linkedin_url?: string | null
          problems_solved?: number
          role?: string | null
          skills?: string[] | null
          streak?: number
          target?: string | null
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          duration_minutes: number
          ended_at: string | null
          id: string
          started_at: string
          topic: string | null
          user_id: string
        }
        Insert: {
          duration_minutes?: number
          ended_at?: string | null
          id?: string
          started_at?: string
          topic?: string | null
          user_id: string
        }
        Update: {
          duration_minutes?: number
          ended_at?: string | null
          id?: string
          started_at?: string
          topic?: string | null
          user_id?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          code: string
          created_at: string
          id: string
          language: string
          memory_kb: number | null
          problem_id: string
          runtime_ms: number | null
          status: string
          test_results: Json | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          language: string
          memory_kb?: number | null
          problem_id: string
          runtime_ms?: number | null
          status: string
          test_results?: Json | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          language?: string
          memory_kb?: number | null
          problem_id?: string
          runtime_ms?: number | null
          status?: string
          test_results?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "coding_problems"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_progress: {
        Row: {
          completed_lessons: string[] | null
          created_at: string
          id: string
          unlocked_hints: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_lessons?: string[] | null
          created_at?: string
          id?: string
          unlocked_hints?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_lessons?: string[] | null
          created_at?: string
          id?: string
          unlocked_hints?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      xp_config: {
        Row: {
          description: string | null
          id: string
          xp_value: number
        }
        Insert: {
          description?: string | null
          id: string
          xp_value: number
        }
        Update: {
          description?: string | null
          id?: string
          xp_value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_xp: {
        Args: {
          p_user_id: string
          p_action: string
          p_custom_xp?: number
        }
        Returns: {
          new_level: number
          leveled_up: boolean
        }
      }
      get_course_progress: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          user_id: string
          completed_lessons: string[]
          unlocked_hints: string[]
          created_at: string
          updated_at: string
        }[]
      }
      get_user_activity: {
        Args: {
          p_user_id: string
        }
        Returns: {
          act_date: string
          count: number
        }[]
      }
      save_course_progress: {
        Args: {
          p_user_id: string
          p_completed_lessons: string[]
          p_unlocked_hints: string[]
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
