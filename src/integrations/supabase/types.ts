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
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
        }
        Relationships: []
      }
      booking_payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          payment_date: string | null
          status: string
          utr_number: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          payment_date?: string | null
          status: string
          utr_number?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          payment_date?: string | null
          status?: string
          utr_number?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          created_at: string
          discount_applied: number | null
          event_id: string
          final_amount: number
          id: string
          payment_id: string | null
          seats: Json
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          booking_date?: string
          created_at?: string
          discount_applied?: number | null
          event_id: string
          final_amount: number
          id?: string
          payment_id?: string | null
          seats: Json
          status: string
          total_amount: number
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          discount_applied?: number | null
          event_id?: string
          final_amount?: number
          id?: string
          payment_id?: string | null
          seats?: Json
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      delivery_details: {
        Row: {
          address: string
          booking_id: string
          city: string
          created_at: string
          id: string
          name: string
          phone: string
          pincode: string
        }
        Insert: {
          address: string
          booking_id: string
          city: string
          created_at?: string
          id?: string
          name: string
          phone: string
          pincode: string
        }
        Update: {
          address?: string
          booking_id?: string
          city?: string
          created_at?: string
          id?: string
          name?: string
          phone?: string
          pincode?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_details_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          amount: number
          auto_apply: boolean
          code: string
          created_at: string
          description: string | null
          event_id: string | null
          expiry_date: string | null
          id: string
          is_active: boolean
          max_uses: number
          priority: number
          uses_count: number
        }
        Insert: {
          amount: number
          auto_apply?: boolean
          code: string
          created_at?: string
          description?: string | null
          event_id?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          priority?: number
          uses_count?: number
        }
        Update: {
          amount?: number
          auto_apply?: boolean
          code?: string
          created_at?: string
          description?: string | null
          event_id?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          priority?: number
          uses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "discounts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          categories: string[] | null
          created_at: string
          description: string
          end_date: string
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          location: string
          price_range: string | null
          seats_available: number
          start_date: string
          title: string
          total_seats: number
          venue_id: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          location: string
          price_range?: string | null
          seats_available: number
          start_date: string
          title: string
          total_seats: number
          venue_id?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          location?: string
          price_range?: string | null
          seats_available?: number
          start_date?: string
          title?: string
          total_seats?: number
          venue_id?: string | null
        }
        Relationships: []
      }
      seats: {
        Row: {
          category: string
          created_at: string
          id: string
          is_available: boolean
          number: string
          price: number
          row: string
          section: string
          stadium_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_available?: boolean
          number: string
          price: number
          row: string
          section: string
          stadium_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_available?: boolean
          number?: string
          price?: number
          row?: string
          section?: string
          stadium_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seats_stadium_id_fkey"
            columns: ["stadium_id"]
            isOneToOne: false
            referencedRelation: "stadiums"
            referencedColumns: ["id"]
          },
        ]
      }
      stadiums: {
        Row: {
          ar_model_url: string | null
          capacity: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          name: string
        }
        Insert: {
          ar_model_url?: string | null
          capacity: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
        }
        Update: {
          ar_model_url?: string | null
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          short_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          short_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          short_name?: string
        }
        Relationships: []
      }
      upi_settings: {
        Row: {
          created_at: string
          discountamount: number
          id: string
          isactive: boolean
          updated_at: string
          upivpa: string
        }
        Insert: {
          created_at?: string
          discountamount?: number
          id?: string
          isactive?: boolean
          updated_at?: string
          upivpa: string
        }
        Update: {
          created_at?: string
          discountamount?: number
          id?: string
          isactive?: boolean
          updated_at?: string
          upivpa?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
