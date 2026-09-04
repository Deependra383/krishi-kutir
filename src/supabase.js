import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://fiwpnlccjtluwjbahtkq.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpd3BubGNjanRsdXdqYmFodGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzUxNzksImV4cCI6MjEwMzkxMTE3OX0.ESEnCScXFDJjK4qJ-0hVKuONL4M0qwzGxbB3KyvQSU0';

function resolveSupabaseUrl() {
  let url = '';
  
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) {
    url = String(import.meta.env.VITE_SUPABASE_URL).trim();
  }
  
  if (!url && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('krishi_supabase_url');
      if (stored && stored !== 'undefined' && stored !== 'null') {
        url = stored.trim();
      }
    } catch {
      // ignore
    }
  }

  if (!url) {
    url = DEFAULT_SUPABASE_URL;
  }

  // Remove trailing /rest/v1 or /rest/v1/ if user pasted API URL
  url = url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

  // If user only entered project ref (e.g. 'fiwpnlccjtluwjbahtkq')
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.includes('.supabase.co')) {
      url = `https://${url}`;
    } else if (/^[a-z0-9-]+$/i.test(url)) {
      url = `https://${url}.supabase.co`;
    } else {
      url = DEFAULT_SUPABASE_URL;
    }
  }

  // Double check if old typo domain exists
  if (url.includes('fiwpnlccjtluxjbahtkq.supabase.co')) {
    url = url.replace('fiwpnlccjtluxjbahtkq.supabase.co', 'fiwpnlccjtluwjbahtkq.supabase.co');
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.origin;
    }
  } catch {
    // If URL parsing fails, fallback to default
    return DEFAULT_SUPABASE_URL;
  }

  return DEFAULT_SUPABASE_URL;
}

function resolveSupabaseKey() {
  let key = '';

  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    key = String(import.meta.env.VITE_SUPABASE_ANON_KEY).trim();
  }

  if (!key && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('krishi_supabase_anon_key');
      if (stored && stored !== 'undefined' && stored !== 'null' && stored.length > 20) {
        key = stored.trim();
      }
    } catch {
      // ignore
    }
  }

  if (!key || key.length < 20) {
    key = DEFAULT_SUPABASE_KEY;
  }

  return key;
}

export const SUPABASE_URL = resolveSupabaseUrl();
export const SUPABASE_ANON_KEY = resolveSupabaseKey();

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  (SUPABASE_URL.startsWith('https://') || SUPABASE_URL.startsWith('http://'))
);

function createSafeSupabaseClient() {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    });
  } catch (err) {
    console.error('Failed to create Supabase client with custom URL, falling back to default:', err);
    return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    });
  }
}

// Initialize Supabase Client instance
export const supabase = createSafeSupabaseClient();

/**
 * Full PostgreSQL Schema for Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- Krishi Kutir Supabase Database Schema
-- Copy and run this in your Supabase Dashboard -> SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  unit TEXT DEFAULT '100 GM',
  moq TEXT DEFAULT '1 Pack',
  benefit TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address JSONB,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT DEFAULT 'Razorpay / Prepaid',
  payment_id TEXT,
  status TEXT DEFAULT 'Placed',
  order_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. B2B Partner Inquiries Table
CREATE TABLE IF NOT EXISTS public.partner_inquiries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_type TEXT DEFAULT 'Hotel / Cafe / Restaurant',
  estimated_volume TEXT,
  city TEXT,
  notes TEXT,
  status TEXT DEFAULT 'New Lead',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Training / Workshop Inquiries Table
CREATE TABLE IF NOT EXISTS public.training_inquiries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  workshop_type TEXT DEFAULT 'Commercial Urban Farming (3 Days)',
  batch_preference TEXT,
  city TEXT,
  questions TEXT,
  status TEXT DEFAULT 'New Inquiry',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Profiles Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Enable Row Level Security (RLS) & Public Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for client application access
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public all on products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on partner_inquiries" ON public.partner_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on partner_inquiries" ON public.partner_inquiries FOR SELECT USING (true);

CREATE POLICY "Allow public insert on training_inquiries" ON public.training_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on training_inquiries" ON public.training_inquiries FOR SELECT USING (true);

CREATE POLICY "Allow public all on users" ON public.users FOR ALL USING (true);
`;
