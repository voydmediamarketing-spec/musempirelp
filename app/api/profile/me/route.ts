import { NextResponse } from "next/server";
import { profileUpdateSchema } from "@musempire/contracts";
import { getProductViewer } from "@/lib/product";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const viewer = await getProductViewer();

  if (viewer.envConfigured && !viewer.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!viewer.user) {
    return NextResponse.json({
      user: {
        id: "00000000-0000-0000-0000-000000000000",
        email: null,
      },
      profile: viewer.profile,
      flags: viewer.flags,
    });
  }

  return NextResponse.json({
    user: viewer.user,
    profile: viewer.profile,
    flags: viewer.flags,
  });
}

export async function PUT(request: Request) {
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

  const payload = profileUpdateSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten().formErrors.join(", ") || "Invalid profile payload." }, { status: 400 });
  }

  await supabase
    .from("profiles")
    .update({
      display_name: payload.data.displayName,
      username: payload.data.username,
      bio: payload.data.bio,
      city: payload.data.city,
      region: payload.data.region,
      country: payload.data.country,
      privacy_level: payload.data.privacyLevel,
      genres: payload.data.genres,
      instruments: payload.data.instruments,
      skills: payload.data.skills,
      is_seeking_collaboration: payload.data.isSeekingCollaboration,
      consent_location: payload.data.consentLocation,
      consent_ai: payload.data.consentAi,
      consent_marketing: payload.data.consentMarketing,
    })
    .eq("user_id", user.id);

  await supabase.from("profile_links").delete().eq("user_id", user.id);

  if (payload.data.links.length > 0) {
    await supabase.from("profile_links").insert(
      payload.data.links.map((link) => ({
        user_id: user.id,
        kind: link.kind,
        label: link.label,
        url: link.url,
        is_primary: link.isPrimary,
      })),
    );
  }

  const viewer = await getProductViewer();

  return NextResponse.json({
    user: viewer.user,
    profile: viewer.profile,
    flags: viewer.flags,
  });
}
