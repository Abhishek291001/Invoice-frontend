// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = "https://tharwjhrlmfvaucjtzmx.supabase.co";
// const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYXJ3amhybG1mdmF1Y2p0em14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzI2MTcsImV4cCI6MjA3ODYwODYxN30.5EBA_tc4CCBRrIJBRhDthNUOHZry9-XPzrQc2VW4hMw";
// const localApi="http://localhost:5000"
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// export type AppRole = 'superadmin' | 'admin' | 'viewer';

// export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

// export interface UserRole {
//   id: string;
//   user_id: string;
//   role: AppRole;
//   created_at: string;
// }

// export interface Client {
//   id: string;
//   name: string;
//   email?: string;
//   phone?: string;
//   billing_address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   postal_code?: string;
//   gst_number?: string;
//   vat_number?: string;
//   currency_preference: string;
//   created_by?: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface Admin {
//   id: string;
//   name: string;
//   email?: string;
//   phone?: string;
//   billing_address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   postal_code?: string;
//   gst_number?: string;
//   vat_number?: string;
//   currency_preference: string;
//   created_by?: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface Viewer {
//   id: string;
//   name: string;
//   email?: string;
//   phone?: string;
//   billing_address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   postal_code?: string;
//   gst_number?: string;
//   vat_number?: string;
//   currency_preference: string;
//   created_by?: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface Invoice {
//   id: string;
//   invoice_number: string;
//   client_id: string;
//   admin_id:string;
//   brand_id: string;
//   brand?: Brand;
//   invoice_date: string;
//   due_date: string;
//   currency: string;
//   subtotal: number;
//   discount_type: 'flat' | 'percentage';
//   discount_amount: number;
//   tax_total: number;
//   grand_total: number;
//   status: InvoiceStatus;
//   notes?: string;
//   terms_and_conditions?: string;
//   created_by?: string;
//   updated_by?: string;
//   created_at: string;
//   updated_at: string;
//   client?: Client;
//   admin?:Admin;
// }

// export interface InvoiceItem {
//   id: string;
//   invoice_id: string;
//   description: string;
//   quantity: number;
//   unit_price: number;
//   amount: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface TaxConfiguration {
//   id: string;
//   invoice_id: string;
//   tax_name: string;
//   tax_percentage: number;
//   tax_amount: number;
//   created_at: string;
//   updated_at: string;
// }
// export interface Brand {
//   id: string;
//   brand_name: string;
//   business_name: string;
//   account_no: string;
//   ifsc: string;
//   gstin: string;
//   address_line1: string;
//   address_line2?: string;
//   country: string;
//   email: string;
//   website: string;
//   logo_url?: string;
//   created_at: string;
// }

