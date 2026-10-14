import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Supabase connection comes ONLY from the build-time env variables:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
// Set them in Render (Environment) and in a local .env file for development.
// Nothing is hardcoded and nothing is read from a browser's localStorage, so
// every device and every login always uses the same database.
// ---------------------------------------------------------------------------

// Remove any old per-browser overrides saved by earlier versions of the app
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('krishi_supabase_url');
    localStorage.removeItem('krishi_supabase_anon_key');
  } catch {
    // ignore
  }
}

const readEnv = (name) => {
  try {
    const value = import.meta.env && import.meta.env[name];
    return value ? String(value).trim() : '';
  } catch {
    return '';
  }
};

function resolveSupabaseUrl() {
  let url = readEnv('VITE_SUPABASE_URL');
  if (!url) return '';

  // Remove trailing /rest/v1 or /rest/v1/ if the API URL was pasted
  url = url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

  // If only the project ref was entered (e.g. 'abcdefghijklmnop')
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.includes('.supabase.co')) {
      url = `https://${url}`;
    } else if (/^[a-z0-9-]+$/i.test(url)) {
      url = `https://${url}.supabase.co`;
    } else {
      return '';
    }
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.origin;
    }
  } catch {
    // invalid URL
  }
  return '';
}

function resolveSupabaseKey() {
  const key = readEnv('VITE_SUPABASE_ANON_KEY');
  return key.length >= 20 ? key : '';
}

export const SUPABASE_URL = resolveSupabaseUrl();
export const SUPABASE_ANON_KEY = resolveSupabaseKey();

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  console.error(
    'Supabase is NOT configured: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing or invalid. ' +
    'Add them in Render > Environment, then use "Clear build cache & deploy". ' +
    'Until then, changes are saved only in this browser.'
  );
}

function createSafeSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    });
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

// Initialize Supabase Client instance (null when env variables are missing)
export const supabase = createSafeSupabaseClient();

/**
 * Upload an image file directly to a dedicated Supabase Storage Bucket.
 * Supported bucket types:
 * - 'products' (Product Catalog Photos)
 * - 'homepage' (Hero Slides, Banners & Showcase)
 * - 'workshops' (Events & Training Sessions)
 * - 'founders' (Leadership & Team Portraits)
 *
 * Automatically creates unique timestamped filenames, attempts dedicated bucket
 * and cascades to generic buckets ('public', 'images') if needed.
 * Returns { success: true, url, bucket, path }
 */
export async function uploadToSupabaseBucket(file, bucketType = 'products') {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  // Create clean, unique file path: <bucketType>/filename-timestamp.ext
  const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()
    .slice(0, 35);
  const fileName = `${cleanBaseName}-${Date.now()}.${fileExt}`;
  const filePath = `${bucketType}/${fileName}`;

  // Candidate bucket priority for this upload type
  const candidateBuckets = [
    bucketType, // e.g. 'products', 'homepage', 'workshops', 'founders'
    `krishi-${bucketType}`,
    'products',
    'public',
    'images'
  ];

  // Remove duplicates while preserving order
  const uniqueCandidateBuckets = [...new Set(candidateBuckets)];
  let lastError = null;

  for (const bucket of uniqueCandidateBuckets) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/jpeg'
        });

      if (error) {
        lastError = error;
        continue;
      }

      if (data) {
        // Fetch public CDN URL
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return {
          success: true,
          url: publicUrlData.publicUrl,
          bucket: bucket,
          path: filePath
        };
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    lastError?.message ||
    `Could not upload to Supabase storage. Please create a public bucket named '${bucketType}' in your Supabase dashboard.`
  );
}

/**
 * Backward compatibility alias for uploadProductImage
 */
export async function uploadProductImage(file) {
  return uploadToSupabaseBucket(file, 'products');
}

/**
 * Upload to 'homepage' storage bucket
 */
export async function uploadHomepageImage(file) {
  return uploadToSupabaseBucket(file, 'homepage');
}

/**
 * Upload to 'workshops' storage bucket
 */
export async function uploadWorkshopImage(file) {
  return uploadToSupabaseBucket(file, 'workshops');
}

/**
 * Upload to 'founders' storage bucket
 */
export async function uploadFounderImage(file) {
  return uploadToSupabaseBucket(file, 'founders');
}

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
  "subCategory" TEXT,
  "majorCategory" TEXT,
  unit TEXT DEFAULT '100 GM',
  moq TEXT DEFAULT '1 Pack',
  benefit TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2b. Shared site settings (categories, shared by every device and login)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for client application access
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public all on products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public all on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on partner_inquiries" ON public.partner_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on partner_inquiries" ON public.partner_inquiries FOR SELECT USING (true);

CREATE POLICY "Allow public insert on training_inquiries" ON public.training_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on training_inquiries" ON public.training_inquiries FOR SELECT USING (true);

CREATE POLICY "Allow public all on users" ON public.users FOR ALL USING (true);

-- 8. Storage Buckets ('products', 'homepage', 'workshops', 'founders')
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('products', 'products', true),
  ('homepage', 'homepage', true),
  ('workshops', 'workshops', true),
  ('founders', 'founders', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for public read and upload across all Krishi Kutir buckets
DO $$
BEGIN
  -- Read Policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Access to Krishi Kutir Buckets'
  ) THEN
    CREATE POLICY "Public Access to Krishi Kutir Buckets"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('products', 'homepage', 'workshops', 'founders'));
  END IF;

  -- Upload Policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow Public Uploads to Krishi Kutir Buckets'
  ) THEN
    CREATE POLICY "Allow Public Uploads to Krishi Kutir Buckets"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('products', 'homepage', 'workshops', 'founders'));
  END IF;

  -- Update Policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow Public Updates to Krishi Kutir Buckets'
  ) THEN
    CREATE POLICY "Allow Public Updates to Krishi Kutir Buckets"
    ON storage.objects FOR UPDATE
    USING (bucket_id IN ('products', 'homepage', 'workshops', 'founders'));
  END IF;
END $$;

-- 9. Realtime: push product and category changes to every open browser
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'products') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'site_settings') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
  END IF;
END $$;
`;