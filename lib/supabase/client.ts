import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database.types';

/**
 * Supabase client configuration with environment variable fallbacks for build time
 * Create a Supabase client for use in Client Components
 * This client handles session management automatically via cookies
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase environment variables are not set. Client will not function properly.');
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
