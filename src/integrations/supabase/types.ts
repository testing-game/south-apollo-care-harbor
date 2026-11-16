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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      doctor_appointments: {
        Row: {
          appointment_date: string
          appointment_number: string
          appointment_time: string | null
          created_at: string
          doctor_id: string
          id: string
          notes: string | null
          patient_age: number
          patient_gender: string
          patient_name: string
          patient_phone: string
          status: string
        }
        Insert: {
          appointment_date: string
          appointment_number?: string
          appointment_time?: string | null
          created_at?: string
          doctor_id: string
          id?: string
          notes?: string | null
          patient_age: number
          patient_gender: string
          patient_name: string
          patient_phone: string
          status?: string
        }
        Update: {
          appointment_date?: string
          appointment_number?: string
          appointment_time?: string | null
          created_at?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_age?: number
          patient_gender?: string
          patient_name?: string
          patient_phone?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          bio: string
          consultation_fee: number | null
          created_at: string
          degrees: string
          department_name: string
          designation: string
          display_order: number
          experience: string
          id: string
          image_url: string
          institution: string
          is_active: boolean
          is_featured: boolean
          name: string
          room_number: string | null
          speciality_id: string | null
          visiting_days: string[]
          visiting_hours: string
        }
        Insert: {
          bio?: string
          consultation_fee?: number | null
          created_at?: string
          degrees?: string
          department_name?: string
          designation?: string
          display_order?: number
          experience?: string
          id?: string
          image_url?: string
          institution?: string
          is_active?: boolean
          is_featured?: boolean
          name: string
          room_number?: string | null
          speciality_id?: string | null
          visiting_days?: string[]
          visiting_hours?: string
        }
        Update: {
          bio?: string
          consultation_fee?: number | null
          created_at?: string
          degrees?: string
          department_name?: string
          designation?: string
          display_order?: number
          experience?: string
          id?: string
          image_url?: string
          institution?: string
          is_active?: boolean
          is_featured?: boolean
          name?: string
          room_number?: string | null
          speciality_id?: string | null
          visiting_days?: string[]
          visiting_hours?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_speciality_id_fkey"
            columns: ["speciality_id"]
            isOneToOne: false
            referencedRelation: "specialities"
            referencedColumns: ["id"]
          },
        ]
      }
      health_packages: {
        Row: {
          created_at: string
          description: string
          display_order: number
          home_image_url: string
          id: string
          image_url: string
          included_tests: string[]
          is_active: boolean
          is_featured: boolean
          preparation: string
          price: number | null
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          home_image_url?: string
          id?: string
          image_url?: string
          included_tests?: string[]
          is_active?: boolean
          is_featured?: boolean
          preparation?: string
          price?: number | null
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          home_image_url?: string
          id?: string
          image_url?: string
          included_tests?: string[]
          is_active?: boolean
          is_featured?: boolean
          preparation?: string
          price?: number | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      hero_banners: {
        Row: {
          created_at: string
          cta_link: string | null
          cta_text: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          media_type: string
          subtitle: string | null
          title: string
          video_url: string
        }
        Insert: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          media_type?: string
          subtitle?: string | null
          title: string
          video_url?: string
        }
        Update: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          media_type?: string
          subtitle?: string | null
          title?: string
          video_url?: string
        }
        Relationships: []
      }
      job_circulars: {
        Row: {
          apply_email: string
          apply_instructions: string
          created_at: string
          deadline: string | null
          department: string
          description: string
          employment_type: string
          id: string
          is_active: boolean
          qualifications: string
          salary: string
          title: string
          vacancies: number
        }
        Insert: {
          apply_email?: string
          apply_instructions?: string
          created_at?: string
          deadline?: string | null
          department?: string
          description?: string
          employment_type?: string
          id?: string
          is_active?: boolean
          qualifications?: string
          salary?: string
          title: string
          vacancies?: number
        }
        Update: {
          apply_email?: string
          apply_instructions?: string
          created_at?: string
          deadline?: string | null
          department?: string
          description?: string
          employment_type?: string
          id?: string
          is_active?: boolean
          qualifications?: string
          salary?: string
          title?: string
          vacancies?: number
        }
        Relationships: []
      }
      page_videos: {
        Row: {
          caption: string
          is_active: boolean
          poster_url: string
          slot: string
          source_type: string
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          caption?: string
          is_active?: boolean
          poster_url?: string
          slot: string
          source_type?: string
          title?: string
          updated_at?: string
          video_url?: string
        }
        Update: {
          caption?: string
          is_active?: boolean
          poster_url?: string
          slot?: string
          source_type?: string
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      patient_stories: {
        Row: {
          created_at: string
          doctor_id: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          patient_name: string
          slug: string
          story_content: string
          thumbnail_url: string
          treatment_title: string
          youtube_video_url: string | null
        }
        Insert: {
          created_at?: string
          doctor_id?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          patient_name: string
          slug: string
          story_content?: string
          thumbnail_url?: string
          treatment_title: string
          youtube_video_url?: string | null
        }
        Update: {
          created_at?: string
          doctor_id?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          patient_name?: string
          slug?: string
          story_content?: string
          thumbnail_url?: string
          treatment_title?: string
          youtube_video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_stories_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_name: string | null
          content: string
          created_at: string
          excerpt: string
          featured_image: string
          gallery_images: string[]
          id: string
          is_featured: boolean
          is_published: boolean
          published_date: string
          slug: string
          title: string
          type: string
        }
        Insert: {
          author_name?: string | null
          content?: string
          created_at?: string
          excerpt?: string
          featured_image?: string
          gallery_images?: string[]
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_date?: string
          slug: string
          title: string
          type: string
        }
        Update: {
          author_name?: string | null
          content?: string
          created_at?: string
          excerpt?: string
          featured_image?: string
          gallery_images?: string[]
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_date?: string
          slug?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      queries_contact: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          phone: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          phone: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          display_order: number
          is_active: boolean
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          display_order?: number
          is_active?: boolean
          platform: string
          updated_at?: string
          url?: string
        }
        Update: {
          display_order?: number
          is_active?: boolean
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      specialities: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon_url: string
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon_url?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon_url?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      test_bookings: {
        Row: {
          booking_date: string
          booking_number: string
          created_at: string
          id: string
          notes: string
          package_id: string
          patient_age: number | null
          patient_gender: string | null
          patient_name: string
          patient_phone: string
          status: string
        }
        Insert: {
          booking_date: string
          booking_number?: string
          created_at?: string
          id?: string
          notes?: string
          package_id: string
          patient_age?: number | null
          patient_gender?: string | null
          patient_name: string
          patient_phone: string
          status?: string
        }
        Update: {
          booking_date?: string
          booking_number?: string
          created_at?: string
          id?: string
          notes?: string
          package_id?: string
          patient_age?: number | null
          patient_gender?: string | null
          patient_name?: string
          patient_phone?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "health_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      book_appointment: {
        Args: {
          _age: number
          _date: string
          _doctor_id: string
          _gender: string
          _name: string
          _notes: string
          _phone: string
        }
        Returns: string
      }
      book_test: {
        Args: {
          _age?: number
          _date: string
          _gender?: string
          _name: string
          _notes?: string
          _package_id: string
          _phone: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      send_query: {
        Args: {
          _email: string
          _message: string
          _name: string
          _phone: string
          _subject: string
        }
        Returns: undefined
      }
      staff_book_appointment: {
        Args: {
          _age: number
          _date: string
          _doctor_id: string
          _gender: string
          _name: string
          _notes: string
          _phone: string
          _time: string
        }
        Returns: {
          appointment_number: string
          id: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
