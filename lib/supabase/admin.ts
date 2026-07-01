import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerKey, getSupabaseUrl, hasSupabaseServerEnv } from "@/lib/env";

export function createAdminSupabaseClient() {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  return createClient(getSupabaseUrl(), getSupabaseServerKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
