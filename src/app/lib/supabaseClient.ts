import { createClient } from '@supabase/supabase-js'

// Fallbacki zapobiegają wywaleniu stron przy braku .env.
// Po skonfigurowaniu .env.local zostaną użyte prawdziwe wartości.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-key";

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});