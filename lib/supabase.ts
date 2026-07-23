import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  process.env.VITE_SUPABASE_URL?.trim() ||
  'https://placeholder-url.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  'placeholder-anon-key';

if (
  (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.VITE_SUPABASE_URL) ||
  (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !process.env.VITE_SUPABASE_ANON_KEY)
) {
  console.warn(
    'Supabase environment variables are missing; using placeholder values for build evaluation.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
