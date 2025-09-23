import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          original_price: number | null;
          images: string[];
          category: string;
          brand: string;
          in_stock: boolean;
          stock: number;
          status: 'active' | 'out_of_stock' | 'pending' | 'inactive';
          rating: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          original_price?: number | null;
          images: string[];
          category: string;
          brand: string;
          in_stock: boolean;
          stock: number;
          status: 'active' | 'out_of_stock' | 'pending' | 'inactive';
          rating?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          original_price?: number | null;
          images?: string[];
          category?: string;
          brand?: string;
          in_stock?: boolean;
          stock?: number;
          status?: 'active' | 'out_of_stock' | 'pending' | 'inactive';
          rating?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          image: string;
          product_count: number;
          href: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image: string;
          product_count?: number;
          href: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image?: string;
          product_count?: number;
          href?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}








