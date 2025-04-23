
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Hardcoded values for the Supabase client
const SUPABASE_URL = "https://rgfqkkarupmmenbfcznp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZnFra2FydXBtbWVuYmZjem5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyOTA5MzUsImV4cCI6MjA2MDg2NjkzNX0.KaWtQLboqJq47DPxsjeR0VtS_nBnGS2soci0JGF8sVA";

// Check if valid values are provided
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error("Missing Supabase URL or key configuration");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
