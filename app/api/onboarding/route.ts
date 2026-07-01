import { NextResponse } from "next/server";
import { onboardingRequestSchema } from "@musempire/contracts";
import { getProductViewer } from "@/lib/product";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const payload = onboardingRequestSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten().formErrors.join(", ") || "Invalid onboarding payload." }, { status: 400 });
  }

  const data = payload.data;

  await supabase
    .from("users")
    .update({
      role: data.role,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  await supabase
    .from("profiles")
    .update({
      display_name: data.displayName,
      username: data.username ?? null,
      city: data.city,
      region: data.region ?? null,
      country: data.country,
      privacy_level: data.privacyLevel,
      genres: data.genres,
      instruments: data.instruments,
      skills: data.skills,
      is_seeking_collaboration: data.isSeekingCollaboration,
      consent_location: data.consentLocation,
      consent_ai: data.consentAi,
      consent_marketing: data.consentMarketing,
    })
    .eq("user_id", user.id);

  await supabase
    .from("map_presence")
    .update({
      city: data.city,
      region: data.region ?? null,
      country: data.country,
      precise_location_enabled: data.preciseLocationEnabled,
      is_visible: data.privacyLevel !== "hidden",
    })
    .eq("user_id", user.id);

  const viewer = await getProductViewer();

  return NextResponse.json({
    user: viewer.user,
    profile: viewer.profile,
    flags: viewer.flags,
  });
}
