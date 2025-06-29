import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          company_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      buildings: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          address: string
          city: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          address: string
          city: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          address?: string
          city?: string
          notes?: string | null
          created_at?: string
        }
      }
      entrances: {
        Row: {
          id: string
          building_id: string
          label: string
          created_at: string
        }
        Insert: {
          id?: string
          building_id: string
          label: string
          created_at?: string
        }
        Update: {
          id?: string
          building_id?: string
          label?: string
          created_at?: string
        }
      }
      floors: {
        Row: {
          id: string
          entrance_id: string
          floor_number: number
          created_at: string
        }
        Insert: {
          id?: string
          entrance_id: string
          floor_number: number
          created_at?: string
        }
        Update: {
          id?: string
          entrance_id?: string
          floor_number?: number
          created_at?: string
        }
      }
      flats: {
        Row: {
          id: string
          floor_id: string
          flat_number: string
          slug: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          floor_id: string
          flat_number: string
          slug: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          floor_id?: string
          flat_number?: string
          slug?: string
          notes?: string | null
          created_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          flat_id: string
          room_name: string
          slug: string
          square_meters: number
          image_url_1: string | null
          image_url_2: string | null
          image_url_3: string | null
          created_at: string
        }
        Insert: {
          id?: string
          flat_id: string
          room_name: string
          slug: string
          square_meters: number
          image_url_1?: string | null
          image_url_2?: string | null
          image_url_3?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          flat_id?: string
          room_name?: string
          slug?: string
          square_meters?: number
          image_url_1?: string | null
          image_url_2?: string | null
          image_url_3?: string | null
          created_at?: string
        }
      }
    }
  }
}