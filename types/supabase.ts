export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          commitment: string | null
          created_at: string | null
          discord_username: string | null
          education: string | null
          email: string | null
          employment: string | null
          github_username: string | null
          homework_github_url: string | null
          homework_staging_url: string | null
          id: number
          languages: string | null
          location: string | null
          project_proposal: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          commitment?: string | null
          created_at?: string | null
          discord_username?: string | null
          education?: string | null
          email?: string | null
          employment?: string | null
          github_username?: string | null
          homework_github_url?: string | null
          homework_staging_url?: string | null
          id?: number
          languages?: string | null
          location?: string | null
          project_proposal?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          commitment?: string | null
          created_at?: string | null
          discord_username?: string | null
          education?: string | null
          email?: string | null
          employment?: string | null
          github_username?: string | null
          homework_github_url?: string | null
          homework_staging_url?: string | null
          id?: number
          languages?: string | null
          location?: string | null
          project_proposal?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cohorts: {
        Row: {
          created_at: string | null
          finished_at: string | null
          id: number
          name: string | null
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          finished_at?: string | null
          id?: number
          name?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          finished_at?: string | null
          id?: number
          name?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          application_id: number | null
          bio: string | null
          cohort_id: number | null
          created_at: string | null
          discord_username: string | null
          display_name: string | null
          email: string | null
          github_username: string | null
          goals: string | null
          id: number
          linkedin_url: string | null
          portfolio_url: string | null
          project_demo_url: string | null
          project_github_url: string | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_id?: number | null
          bio?: string | null
          cohort_id?: number | null
          created_at?: string | null
          discord_username?: string | null
          display_name?: string | null
          email?: string | null
          github_username?: string | null
          goals?: string | null
          id?: number
          linkedin_url?: string | null
          portfolio_url?: string | null
          project_demo_url?: string | null
          project_github_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_id?: number | null
          bio?: string | null
          cohort_id?: number | null
          created_at?: string | null
          discord_username?: string | null
          display_name?: string | null
          email?: string | null
          github_username?: string | null
          goals?: string | null
          id?: number
          linkedin_url?: string | null
          portfolio_url?: string | null
          project_demo_url?: string | null
          project_github_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_application_id_fkey"
            columns: ["application_id"]
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_cohort_id_fkey"
            columns: ["cohort_id"]
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
