import { createClient } from "@supabase/supabase-js";
import {
  getSupabasePublishableKey,
  getSupabaseServerKey,
  getSupabaseUrl,
  hasSupabaseBrowserEnv,
  hasSupabaseServerEnv,
} from "@/lib/env";

function createStatelessSupabaseClient(key: string) {
  return createClient(getSupabaseUrl(), key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createAdminSupabaseClient() {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  return createStatelessSupabaseClient(getSupabaseServerKey());
}

export function createPublicSupabaseClient() {
  if (!hasSupabaseBrowserEnv()) {
    return null;
  }

  return createStatelessSupabaseClient(getSupabasePublishableKey());
}
