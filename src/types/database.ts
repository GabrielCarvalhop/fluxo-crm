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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string
          entity_type: string
          from_value: string | null
          id: string
          metadata: Json
          to_value: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          from_value?: string | null
          id?: string
          metadata?: Json
          to_value?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          from_value?: string | null
          id?: string
          metadata?: Json
          to_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_template_items: {
        Row: {
          created_at: string
          group_label: string
          id: string
          label: string
          position: number
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_label: string
          id?: string
          label: string
          position?: number
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_label?: string
          id?: string
          label?: string
          position?: number
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          name: string
          project_type: Database["public"]["Enums"]["project_type_enum"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          project_type?: Database["public"]["Enums"]["project_type_enum"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          project_type?: Database["public"]["Enums"]["project_type_enum"] | null
          updated_at?: string
        }
        Relationships: []
      }
      client_tags: {
        Row: {
          client_id: string
          created_at: string
          tag_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          tag_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tags_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          city: string | null
          company_name: string
          contact_name: string | null
          created_at: string
          deleted_at: string | null
          document: string | null
          domain: string | null
          email: string | null
          id: string
          instagram: string | null
          last_contact_at: string | null
          lead_id: string | null
          notes: string | null
          state: string | null
          status: Database["public"]["Enums"]["client_status_enum"]
          updated_at: string
          website_url: string | null
          whatsapp: string | null
        }
        Insert: {
          city?: string | null
          company_name: string
          contact_name?: string | null
          created_at?: string
          deleted_at?: string | null
          document?: string | null
          domain?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_contact_at?: string | null
          lead_id?: string | null
          notes?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["client_status_enum"]
          updated_at?: string
          website_url?: string | null
          whatsapp?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string
          contact_name?: string | null
          created_at?: string
          deleted_at?: string | null
          document?: string | null
          domain?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_contact_at?: string | null
          lead_id?: string | null
          notes?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["client_status_enum"]
          updated_at?: string
          website_url?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          cost: number | null
          created_at: string
          dns_configured: boolean
          domain_name: string
          expires_at: string | null
          final_url: string | null
          hosting: Database["public"]["Enums"]["hosting_enum"] | null
          hosting_notes: string | null
          id: string
          paid_by: Database["public"]["Enums"]["paid_by_enum"] | null
          project_id: string
          registered_at: string | null
          registrar: string | null
          updated_at: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          dns_configured?: boolean
          domain_name: string
          expires_at?: string | null
          final_url?: string | null
          hosting?: Database["public"]["Enums"]["hosting_enum"] | null
          hosting_notes?: string | null
          id?: string
          paid_by?: Database["public"]["Enums"]["paid_by_enum"] | null
          project_id: string
          registered_at?: string | null
          registrar?: string | null
          updated_at?: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          dns_configured?: boolean
          domain_name?: string
          expires_at?: string | null
          final_url?: string | null
          hosting?: Database["public"]["Enums"]["hosting_enum"] | null
          hosting_notes?: string | null
          id?: string
          paid_by?: Database["public"]["Enums"]["paid_by_enum"] | null
          project_id?: string
          registered_at?: string | null
          registrar?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "domains_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "domains_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_progress"
            referencedColumns: ["project_id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          filename: string
          id: string
          mime: string | null
          size: number | null
          storage_path: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          filename: string
          id?: string
          mime?: string | null
          size?: number | null
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          filename?: string
          id?: string
          mime?: string | null
          size?: number | null
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          deleted_at: string | null
          description: string
          due_date: string | null
          expense_category:
            | Database["public"]["Enums"]["expense_category_enum"]
            | null
          id: string
          kind: Database["public"]["Enums"]["transaction_kind_enum"]
          method: Database["public"]["Enums"]["payment_method_enum"] | null
          notes: string | null
          paid_at: string | null
          project_id: string | null
          proposal_id: string | null
          status: Database["public"]["Enums"]["transaction_status_enum"]
          updated_at: string
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description: string
          due_date?: string | null
          expense_category?:
            | Database["public"]["Enums"]["expense_category_enum"]
            | null
          id?: string
          kind: Database["public"]["Enums"]["transaction_kind_enum"]
          method?: Database["public"]["Enums"]["payment_method_enum"] | null
          notes?: string | null
          paid_at?: string | null
          project_id?: string | null
          proposal_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status_enum"]
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string
          due_date?: string | null
          expense_category?:
            | Database["public"]["Enums"]["expense_category_enum"]
            | null
          id?: string
          kind?: Database["public"]["Enums"]["transaction_kind_enum"]
          method?: Database["public"]["Enums"]["payment_method_enum"] | null
          notes?: string | null
          paid_at?: string | null
          project_id?: string | null
          proposal_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "financial_transactions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "v_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          client_id: string | null
          created_at: string
          done_at: string | null
          due_at: string
          id: string
          lead_id: string | null
          owner_id: string | null
          snoozed_from: string | null
          source_contact_id: string | null
          status: Database["public"]["Enums"]["follow_up_status_enum"]
          title: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          done_at?: string | null
          due_at: string
          id?: string
          lead_id?: string | null
          owner_id?: string | null
          snoozed_from?: string | null
          source_contact_id?: string | null
          status?: Database["public"]["Enums"]["follow_up_status_enum"]
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          done_at?: string | null
          due_at?: string
          id?: string
          lead_id?: string | null
          owner_id?: string | null
          snoozed_from?: string | null
          source_contact_id?: string | null
          status?: Database["public"]["Enums"]["follow_up_status_enum"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_source_contact_id_fkey"
            columns: ["source_contact_id"]
            isOneToOne: false
            referencedRelation: "lead_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations_config: {
        Row: {
          config: Json
          created_at: string
          enabled: boolean
          id: string
          provider: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          provider: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_contacts: {
        Row: {
          client_id: string | null
          contacted_at: string
          created_at: string
          external_id: string | null
          external_source: string | null
          id: string
          lead_id: string | null
          next_action: string | null
          next_action_at: string | null
          outcome: string | null
          summary: string | null
          type: Database["public"]["Enums"]["contact_type_enum"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          contacted_at?: string
          created_at?: string
          external_id?: string | null
          external_source?: string | null
          id?: string
          lead_id?: string | null
          next_action?: string | null
          next_action_at?: string | null
          outcome?: string | null
          summary?: string | null
          type: Database["public"]["Enums"]["contact_type_enum"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          contacted_at?: string
          created_at?: string
          external_id?: string | null
          external_source?: string | null
          id?: string
          lead_id?: string | null
          next_action?: string | null
          next_action_at?: string | null
          outcome?: string | null
          summary?: string | null
          type?: Database["public"]["Enums"]["contact_type_enum"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_contacts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          active: boolean
          created_at: string
          id: string
          key: string
          label: string
          position: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          key: string
          label: string
          position?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          key?: string
          label?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      lead_tags: {
        Row: {
          created_at: string
          lead_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          lead_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          lead_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_tags_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          city: string | null
          company_name: string
          contact_name: string | null
          converted_at: string | null
          converted_client_id: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          estimated_value: number | null
          google_maps_url: string | null
          has_website: boolean | null
          id: string
          instagram: string | null
          last_contact_at: string | null
          lead_score: number
          loss_notes: string | null
          loss_reason_id: string | null
          next_action: string | null
          next_follow_up_at: string | null
          notes: string | null
          owner_id: string | null
          phone: string | null
          pilot_created: boolean
          pilot_url: string | null
          position: number
          prospected_at: string
          segment_id: string | null
          source_id: string | null
          stage_changed_at: string
          stage_id: string
          state: string | null
          temperature: Database["public"]["Enums"]["lead_temperature_enum"]
          updated_at: string
          website_quality:
            | Database["public"]["Enums"]["website_quality_enum"]
            | null
          website_url: string | null
          whatsapp: string | null
        }
        Insert: {
          city?: string | null
          company_name: string
          contact_name?: string | null
          converted_at?: string | null
          converted_client_id?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          estimated_value?: number | null
          google_maps_url?: string | null
          has_website?: boolean | null
          id?: string
          instagram?: string | null
          last_contact_at?: string | null
          lead_score?: number
          loss_notes?: string | null
          loss_reason_id?: string | null
          next_action?: string | null
          next_follow_up_at?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          pilot_created?: boolean
          pilot_url?: string | null
          position?: number
          prospected_at?: string
          segment_id?: string | null
          source_id?: string | null
          stage_changed_at?: string
          stage_id: string
          state?: string | null
          temperature?: Database["public"]["Enums"]["lead_temperature_enum"]
          updated_at?: string
          website_quality?:
            | Database["public"]["Enums"]["website_quality_enum"]
            | null
          website_url?: string | null
          whatsapp?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string
          contact_name?: string | null
          converted_at?: string | null
          converted_client_id?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          estimated_value?: number | null
          google_maps_url?: string | null
          has_website?: boolean | null
          id?: string
          instagram?: string | null
          last_contact_at?: string | null
          lead_score?: number
          loss_notes?: string | null
          loss_reason_id?: string | null
          next_action?: string | null
          next_follow_up_at?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          pilot_created?: boolean
          pilot_url?: string | null
          position?: number
          prospected_at?: string
          segment_id?: string | null
          source_id?: string | null
          stage_changed_at?: string
          stage_id?: string
          state?: string | null
          temperature?: Database["public"]["Enums"]["lead_temperature_enum"]
          updated_at?: string
          website_quality?:
            | Database["public"]["Enums"]["website_quality_enum"]
            | null
          website_url?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_client_id_fkey"
            columns: ["converted_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_loss_reason_id_fkey"
            columns: ["loss_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "lead_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      loss_reasons: {
        Row: {
          active: boolean
          created_at: string
          id: string
          key: string
          label: string
          position: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          key: string
          label: string
          position?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          key?: string
          label?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          client_id: string | null
          created_at: string
          ends_at: string | null
          external_id: string | null
          external_source: string | null
          format: Database["public"]["Enums"]["meeting_format_enum"] | null
          id: string
          lead_id: string | null
          link: string | null
          location: string | null
          notes: string | null
          objective: string | null
          project_id: string | null
          reminder_minutes: number | null
          starts_at: string
          status: Database["public"]["Enums"]["meeting_status_enum"]
          title: string
          type: Database["public"]["Enums"]["meeting_type_enum"]
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          ends_at?: string | null
          external_id?: string | null
          external_source?: string | null
          format?: Database["public"]["Enums"]["meeting_format_enum"] | null
          id?: string
          lead_id?: string | null
          link?: string | null
          location?: string | null
          notes?: string | null
          objective?: string | null
          project_id?: string | null
          reminder_minutes?: number | null
          starts_at: string
          status?: Database["public"]["Enums"]["meeting_status_enum"]
          title: string
          type?: Database["public"]["Enums"]["meeting_type_enum"]
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          ends_at?: string | null
          external_id?: string | null
          external_source?: string | null
          format?: Database["public"]["Enums"]["meeting_format_enum"] | null
          id?: string
          lead_id?: string | null
          link?: string | null
          location?: string | null
          notes?: string | null
          objective?: string | null
          project_id?: string | null
          reminder_minutes?: number | null
          starts_at?: string
          status?: Database["public"]["Enums"]["meeting_status_enum"]
          title?: string
          type?: Database["public"]["Enums"]["meeting_type_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_progress"
            referencedColumns: ["project_id"]
          },
        ]
      }
      message_templates: {
        Row: {
          active: boolean
          body: string
          created_at: string
          id: string
          key: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          body: string
          created_at?: string
          id?: string
          key: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string
          created_at?: string
          id?: string
          key?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          author_id: string | null
          body: string
          client_id: string | null
          created_at: string
          id: string
          lead_id: string | null
          project_id: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body: string
          client_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          project_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          client_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          project_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_progress"
            referencedColumns: ["project_id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          active: boolean
          color: string
          created_at: string
          id: string
          is_lost: boolean
          is_won: boolean
          key: string
          label: string
          position: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          color: string
          created_at?: string
          id?: string
          is_lost?: boolean
          is_won?: boolean
          key: string
          label: string
          position: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          color?: string
          created_at?: string
          id?: string
          is_lost?: boolean
          is_won?: boolean
          key?: string
          label?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_briefings: {
        Row: {
          about: string | null
          answered_at: string | null
          colors: string | null
          competitors: string | null
          created_at: string
          differentiators: string | null
          domain_notes: string | null
          goal: string | null
          id: string
          instagram: string | null
          location: string | null
          logo_notes: string | null
          photos_notes: string | null
          project_id: string
          references_text: string | null
          services: string | null
          target_audience: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          about?: string | null
          answered_at?: string | null
          colors?: string | null
          competitors?: string | null
          created_at?: string
          differentiators?: string | null
          domain_notes?: string | null
          goal?: string | null
          id?: string
          instagram?: string | null
          location?: string | null
          logo_notes?: string | null
          photos_notes?: string | null
          project_id: string
          references_text?: string | null
          services?: string | null
          target_audience?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          about?: string | null
          answered_at?: string | null
          colors?: string | null
          competitors?: string | null
          created_at?: string
          differentiators?: string | null
          domain_notes?: string | null
          goal?: string | null
          id?: string
          instagram?: string | null
          location?: string | null
          logo_notes?: string | null
          photos_notes?: string | null
          project_id?: string
          references_text?: string | null
          services?: string | null
          target_audience?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_briefings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_briefings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "v_project_progress"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_checklist_groups: {
        Row: {
          created_at: string
          id: string
          label: string
          position: number
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          position?: number
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          position?: number
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_checklist_groups_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_checklist_groups_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_progress"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_checklist_items: {
        Row: {
          created_at: string
          done: boolean
          done_at: string | null
          done_by: string | null
          group_id: string
          id: string
          label: string
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          done_at?: string | null
          done_by?: string | null
          group_id: string
          id?: string
          label: string
          position?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          done?: boolean
          done_at?: string | null
          done_by?: string | null
          group_id?: string
          id?: string
          label?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_checklist_items_done_by_fkey"
            columns: ["done_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_checklist_items_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "project_checklist_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          briefing_status: Database["public"]["Enums"]["briefing_status_enum"]
          client_id: string
          created_at: string
          deleted_at: string | null
          delivered_at: string | null
          due_date: string | null
          final_url: string | null
          id: string
          name: string
          notes: string | null
          proposal_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status_enum"]
          type: Database["public"]["Enums"]["project_type_enum"]
          updated_at: string
          value: number | null
        }
        Insert: {
          briefing_status?: Database["public"]["Enums"]["briefing_status_enum"]
          client_id: string
          created_at?: string
          deleted_at?: string | null
          delivered_at?: string | null
          due_date?: string | null
          final_url?: string | null
          id?: string
          name: string
          notes?: string | null
          proposal_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status_enum"]
          type?: Database["public"]["Enums"]["project_type_enum"]
          updated_at?: string
          value?: number | null
        }
        Update: {
          briefing_status?: Database["public"]["Enums"]["briefing_status_enum"]
          client_id?: string
          created_at?: string
          deleted_at?: string | null
          delivered_at?: string | null
          due_date?: string | null
          final_url?: string | null
          id?: string
          name?: string
          notes?: string | null
          proposal_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status_enum"]
          type?: Database["public"]["Enums"]["project_type_enum"]
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "v_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_code_counters: {
        Row: {
          last_value: number
          year: number
        }
        Insert: {
          last_value?: number
          year: number
        }
        Update: {
          last_value?: number
          year?: number
        }
        Relationships: []
      }
      proposals: {
        Row: {
          client_id: string | null
          code: string | null
          created_at: string
          deleted_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          payment_method: string | null
          payment_terms: string | null
          project_id: string | null
          rejected_reason_id: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["proposal_status_enum"]
          title: string
          updated_at: string
          valid_until: string | null
          value: number
        }
        Insert: {
          client_id?: string | null
          code?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_terms?: string | null
          project_id?: string | null
          rejected_reason_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["proposal_status_enum"]
          title: string
          updated_at?: string
          valid_until?: string | null
          value: number
        }
        Update: {
          client_id?: string | null
          code?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_terms?: string | null
          project_id?: string | null
          rejected_reason_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["proposal_status_enum"]
          title?: string
          updated_at?: string
          valid_until?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "proposals_rejected_reason_id_fkey"
            columns: ["rejected_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
        ]
      }
      segments: {
        Row: {
          active: boolean
          created_at: string
          id: string
          key: string
          label: string
          position: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          key: string
          label: string
          position?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          key?: string
          label?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          label: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          label: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          client_id: string | null
          created_at: string
          description: string | null
          done_at: string | null
          due_at: string | null
          id: string
          lead_id: string | null
          priority: Database["public"]["Enums"]["task_priority_enum"]
          project_id: string | null
          status: Database["public"]["Enums"]["task_status_enum"]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          done_at?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority_enum"]
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status_enum"]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          done_at?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority_enum"]
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status_enum"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_progress"
            referencedColumns: ["project_id"]
          },
        ]
      }
    }
    Views: {
      v_agenda_events: {
        Row: {
          client_id: string | null
          ends_at: string | null
          id: string | null
          lead_id: string | null
          project_id: string | null
          source: string | null
          starts_at: string | null
          status: string | null
          title: string | null
        }
        Relationships: []
      }
      v_financial_status: {
        Row: {
          amount: number | null
          client_id: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          due_date: string | null
          effective_status: string | null
          expense_category:
            | Database["public"]["Enums"]["expense_category_enum"]
            | null
          id: string | null
          kind: Database["public"]["Enums"]["transaction_kind_enum"] | null
          method: Database["public"]["Enums"]["payment_method_enum"] | null
          notes: string | null
          paid_at: string | null
          project_id: string | null
          proposal_id: string | null
          status: Database["public"]["Enums"]["transaction_status_enum"] | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          client_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          effective_status?: never
          expense_category?:
            | Database["public"]["Enums"]["expense_category_enum"]
            | null
          id?: string | null
          kind?: Database["public"]["Enums"]["transaction_kind_enum"] | null
          method?: Database["public"]["Enums"]["payment_method_enum"] | null
          notes?: string | null
          paid_at?: string | null
          project_id?: string | null
          proposal_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status_enum"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          client_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          effective_status?: never
          expense_category?:
            | Database["public"]["Enums"]["expense_category_enum"]
            | null
          id?: string | null
          kind?: Database["public"]["Enums"]["transaction_kind_enum"] | null
          method?: Database["public"]["Enums"]["payment_method_enum"] | null
          notes?: string | null
          paid_at?: string | null
          project_id?: string | null
          proposal_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status_enum"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "financial_transactions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "v_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      v_funnel_metrics: {
        Row: {
          meeting_count: number | null
          proposal_count: number | null
          prospected_count: number | null
          responded_count: number | null
          won_count: number | null
        }
        Relationships: []
      }
      v_project_progress: {
        Row: {
          done_items: number | null
          profit_estimate: number | null
          progress_pct: number | null
          project_id: string | null
          total_expenses: number | null
          total_items: number | null
        }
        Relationships: []
      }
      v_proposals: {
        Row: {
          client_id: string | null
          code: string | null
          created_at: string | null
          deleted_at: string | null
          effective_status: string | null
          id: string | null
          lead_id: string | null
          notes: string | null
          payment_method: string | null
          payment_terms: string | null
          project_id: string | null
          rejected_reason_id: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["proposal_status_enum"] | null
          title: string | null
          updated_at: string | null
          valid_until: string | null
          value: number | null
        }
        Insert: {
          client_id?: string | null
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          effective_status?: never
          id?: string | null
          lead_id?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_terms?: string | null
          project_id?: string | null
          rejected_reason_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["proposal_status_enum"] | null
          title?: string | null
          updated_at?: string | null
          valid_until?: string | null
          value?: number | null
        }
        Update: {
          client_id?: string | null
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          effective_status?: never
          id?: string | null
          lead_id?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_terms?: string | null
          project_id?: string | null
          rejected_reason_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["proposal_status_enum"] | null
          title?: string | null
          updated_at?: string | null
          valid_until?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "proposals_rejected_reason_id_fkey"
            columns: ["rejected_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      global_search: {
        Args: { q: string }
        Returns: {
          id: string
          subtitle: string
          title: string
          type: string
        }[]
      }
      is_active_user: { Args: never; Returns: boolean }
      log_activity: {
        Args: {
          p_action: string
          p_actor_id: string
          p_entity_id: string
          p_entity_type: string
          p_from_value?: string
          p_metadata?: Json
          p_to_value?: string
        }
        Returns: undefined
      }
      next_proposal_code: { Args: never; Returns: string }
      reorder_leads: {
        Args: { p_lead_ids: string[]; p_stage_id: string }
        Returns: undefined
      }
      sync_lead_next_follow_up: {
        Args: { p_lead_id: string }
        Returns: undefined
      }
    }
    Enums: {
      briefing_status_enum:
        | "not_sent"
        | "sent"
        | "answered"
        | "incomplete"
        | "complete"
      client_status_enum: "active" | "inactive"
      contact_type_enum:
        | "whatsapp"
        | "call"
        | "instagram"
        | "email"
        | "meeting"
        | "other"
      expense_category_enum:
        | "domain"
        | "hosting"
        | "plugin"
        | "tool"
        | "freelancer"
        | "other"
      follow_up_status_enum: "pending" | "done" | "snoozed" | "canceled"
      hosting_enum: "vercel" | "railway" | "other"
      lead_temperature_enum: "hot" | "warm" | "cold" | "none"
      meeting_format_enum: "online" | "in_person"
      meeting_status_enum: "scheduled" | "done" | "canceled" | "no_show"
      meeting_type_enum:
        | "meeting"
        | "follow_up"
        | "presentation"
        | "deadline"
        | "delivery"
        | "task"
      paid_by_enum: "client" | "fluxo"
      payment_method_enum: "pix" | "cash" | "transfer" | "card" | "other"
      project_status_enum:
        | "briefing_pending"
        | "awaiting_materials"
        | "planning"
        | "design"
        | "development"
        | "internal_review"
        | "client_review"
        | "awaiting_approval"
        | "deploy"
        | "finished"
        | "post_sale"
      project_type_enum:
        | "landing_page"
        | "institutional"
        | "redesign"
        | "portfolio"
        | "professional"
        | "other"
      proposal_status_enum:
        | "draft"
        | "sent"
        | "viewed"
        | "negotiation"
        | "accepted"
        | "rejected"
        | "expired"
      task_priority_enum: "high" | "medium" | "low"
      task_status_enum: "pending" | "in_progress" | "done"
      transaction_kind_enum: "income" | "expense"
      transaction_status_enum: "paid" | "pending" | "canceled"
      website_quality_enum: "none" | "very_bad" | "bad" | "average" | "good"
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
    Enums: {
      briefing_status_enum: [
        "not_sent",
        "sent",
        "answered",
        "incomplete",
        "complete",
      ],
      client_status_enum: ["active", "inactive"],
      contact_type_enum: [
        "whatsapp",
        "call",
        "instagram",
        "email",
        "meeting",
        "other",
      ],
      expense_category_enum: [
        "domain",
        "hosting",
        "plugin",
        "tool",
        "freelancer",
        "other",
      ],
      follow_up_status_enum: ["pending", "done", "snoozed", "canceled"],
      hosting_enum: ["vercel", "railway", "other"],
      lead_temperature_enum: ["hot", "warm", "cold", "none"],
      meeting_format_enum: ["online", "in_person"],
      meeting_status_enum: ["scheduled", "done", "canceled", "no_show"],
      meeting_type_enum: [
        "meeting",
        "follow_up",
        "presentation",
        "deadline",
        "delivery",
        "task",
      ],
      paid_by_enum: ["client", "fluxo"],
      payment_method_enum: ["pix", "cash", "transfer", "card", "other"],
      project_status_enum: [
        "briefing_pending",
        "awaiting_materials",
        "planning",
        "design",
        "development",
        "internal_review",
        "client_review",
        "awaiting_approval",
        "deploy",
        "finished",
        "post_sale",
      ],
      project_type_enum: [
        "landing_page",
        "institutional",
        "redesign",
        "portfolio",
        "professional",
        "other",
      ],
      proposal_status_enum: [
        "draft",
        "sent",
        "viewed",
        "negotiation",
        "accepted",
        "rejected",
        "expired",
      ],
      task_priority_enum: ["high", "medium", "low"],
      task_status_enum: ["pending", "in_progress", "done"],
      transaction_kind_enum: ["income", "expense"],
      transaction_status_enum: ["paid", "pending", "canceled"],
      website_quality_enum: ["none", "very_bad", "bad", "average", "good"],
    },
  },
} as const
