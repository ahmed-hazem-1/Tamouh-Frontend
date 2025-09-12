import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Database {
  public: {
    Tables: {
      budget: {
        Row: {
          id: string
          total_amount: number
          used_amount: number
          remaining_amount: number
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          total_amount?: number
          used_amount?: number
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          total_amount?: number
          used_amount?: number
          last_updated?: string
        }
      }
      employees: {
        Row: {
          id: string
          name: string
          employee_id: string
          phone: string | null
          wallet_type: string | null
          total_allowance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          employee_id: string
          phone?: string | null
          wallet_type?: string | null
          total_allowance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          employee_id?: string
          phone?: string | null
          wallet_type?: string | null
          total_allowance?: number
          updated_at?: string
        }
      }
      allowance_records: {
        Row: {
          id: string
          employee_id: string
          day: string
          arrival_time: string | null
          departure_time: string | null
          location: string | null
          going_amount: number
          return_amount: number
          total_amount: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          day: string
          arrival_time?: string | null
          departure_time?: string | null
          location?: string | null
          going_amount?: number
          return_amount?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          day?: string
          arrival_time?: string | null
          departure_time?: string | null
          location?: string | null
          going_amount?: number
          return_amount?: number
          notes?: string | null
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          type: 'budget_add' | 'allowance_deduct'
          amount: number
          description: string | null
          employee_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: 'budget_add' | 'allowance_deduct'
          amount: number
          description?: string | null
          employee_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'budget_add' | 'allowance_deduct'
          amount?: number
          description?: string | null
          employee_id?: string | null
        }
      }
    }
  }
}