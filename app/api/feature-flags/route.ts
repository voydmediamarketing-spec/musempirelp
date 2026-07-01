import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { defaultFeatureFlags } from "@/lib/product-data";

export async function GET() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ flags: defaultFeatureFlags });
  }

  const { data } = await supabase.from("feature_flags").select("key, enabled, description, config").order("key");

  if (!data) {
    return NextResponse.json({ flags: defaultFeatureFlags });
  }

  return NextResponse.json({
    flags: data.map((flag) => ({
      key: flag.key,
      enabled: flag.enabled,
      description: flag.description,
      config: flag.config ?? {},
    })),
  });
}
