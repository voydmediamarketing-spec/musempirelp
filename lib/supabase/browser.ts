"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl, hasSupabaseBrowserEnv } from "@/lib/env";

export function createBrowserSupabaseClient() {
  if (!hasSupabaseBrowserEnv()) {
    throw new Error("Supabase browser environment variables are missing.");
  }

  return createBrowserClient(getSupabaseUrl(), getSupabasePublishableKey());
}
