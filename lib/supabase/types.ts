export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type WorkspaceMode = "freelancer" | "business";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          current_mode: WorkspaceMode;
          role: string;
          business_entity: string;
          avatar_url: string | null;
          timezone: string;
          bio: string | null;
          base_currency: string;
          hourly_rate: number;
          target_velocity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          current_mode?: WorkspaceMode;
          role?: string;
          business_entity?: string;
          avatar_url?: string | null;
          timezone?: string;
          bio?: string | null;
          base_currency?: string;
          hourly_rate?: number;
          target_velocity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          current_mode?: WorkspaceMode;
          role?: string;
          business_entity?: string;
          avatar_url?: string | null;
          timezone?: string;
          bio?: string | null;
          base_currency?: string;
          hourly_rate?: number;
          target_velocity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          project_details: string;
          contact_name: string | null;
          status: "Contacted" | "Pitched" | "Won" | "Lost";
          value: number;
          tags: string[];
          initials: string | null;
          progress: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          project_details: string;
          contact_name?: string | null;
          status: "Contacted" | "Pitched" | "Won" | "Lost";
          value?: number;
          tags?: string[];
          initials?: string | null;
          progress?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          project_details?: string;
          contact_name?: string | null;
          status?: "Contacted" | "Pitched" | "Won" | "Lost";
          value?: number;
          tags?: string[];
          initials?: string | null;
          progress?: number;
          created_at?: string;
        };
      };
      connections: {
        Row: {
          id: string;
          user_id: string;
          contact_name: string;
          network_platform: string | null;
          last_contacted: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          contact_name: string;
          network_platform?: string | null;
          last_contacted?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          contact_name?: string;
          network_platform?: string | null;
          last_contacted?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          ltv: number;
          status: "Active" | "Churned";
          joined_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          ltv?: number;
          status: "Active" | "Churned";
          joined_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          ltv?: number;
          status?: "Active" | "Churned";
          joined_at?: string;
          created_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          amount: number;
          date: string;
          invoice_status: "Paid" | "Pending" | "Overdue";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          client_id?: string | null;
          amount?: number;
          date?: string;
          invoice_status: "Paid" | "Pending" | "Overdue";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          client_id?: string | null;
          amount?: number;
          date?: string;
          invoice_status?: "Paid" | "Pending" | "Overdue";
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          invoice_number: string;
          client: string;
          description: string | null;
          amount: number;
          date: string;
          due_date: string | null;
          status: "paid" | "pending" | "overdue";
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          invoice_number: string;
          client: string;
          description?: string | null;
          amount: number;
          date?: string;
          due_date?: string | null;
          status: "paid" | "pending" | "overdue";
          type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          invoice_number?: string;
          client?: string;
          description?: string | null;
          amount?: number;
          date?: string;
          due_date?: string | null;
          status?: "paid" | "pending" | "overdue";
          type?: string;
          created_at?: string;
        };
      };
    };
  };
}
