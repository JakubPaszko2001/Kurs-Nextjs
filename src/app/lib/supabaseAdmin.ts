import { createClient } from "@supabase/supabase-js";

// Fallbacki zapobiegają wywaleniu builda/route'ów przy braku .env.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  // UWAGA: klucz serwisowy, tylko po stronie serwera
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "service-role-placeholder";

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

