import { redirect } from "next/navigation";
import type { FeatureFlag, Profile } from "@musempire/contracts";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { defaultFeatureFlags, sampleProfile } from "@/lib/product-data";
import { hasSupabaseBrowserEnv } from "@/lib/env";

export type ProductViewer = {
  envConfigured: boolean;
  user: {
    id: string;
    email: string | null;
  } | null;
  profile: Profile | null;
  flags: FeatureFlag[];
};

async function getFeatureFlags() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return defaultFeatureFlags;
  }

  const { data } = await supabase.from("feature_flags").select("key, enabled, description, config").order("key");

  if (!data) {
    return defaultFeatureFlags;
  }

  return data.map((flag) => ({
    key: flag.key,
    enabled: flag.enabled,
    description: flag.description,
    config: flag.config ?? {},
  })) as FeatureFlag[];
}

export async function getProductViewer(): Promise<ProductViewer> {
  if (!hasSupabaseBrowserEnv()) {
    return {
      envConfigured: false,
      user: null,
      profile: sampleProfile,
      flags: defaultFeatureFlags,
    };
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return {
      envConfigured: false,
      user: null,
      profile: sampleProfile,
      flags: defaultFeatureFlags,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const flags = await getFeatureFlags();

  if (!user) {
    return {
      envConfigured: true,
      user: null,
      profile: null,
      flags,
    };
  }

  const [{ data: profile }, { data: userDetails }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "user_id, display_name, username, bio, city, region, country, privacy_level, avatar_path, genres, instruments, skills, is_seeking_collaboration, consent_location, consent_ai, consent_marketing, profile_links(id, kind, label, url, is_primary)",
      )
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("users")
      .select("role, alpha_access_granted, onboarding_completed")
      .eq("id", user.id)
      .single(),
  ]);

  if (!profile) {
    return {
      envConfigured: true,
      user: {
        id: user.id,
        email: user.email ?? null,
      },
      profile: userDetails
        ? {
            userId: user.id,
            displayName: user.email ?? "Musempire User",
            username: null,
            bio: null,
            city: null,
            region: null,
            country: null,
            privacyLevel: "city",
            avatarUrl: null,
            genres: [],
            instruments: [],
            skills: [],
            isSeekingCollaboration: true,
            consentLocation: false,
            consentAi: false,
            consentMarketing: false,
            role: userDetails.role ?? null,
            alphaAccessGranted: userDetails.alpha_access_granted ?? false,
            onboardingCompleted: userDetails.onboarding_completed ?? false,
            links: [],
          }
        : null,
      flags,
    };
  }

  return {
    envConfigured: true,
    user: {
      id: user.id,
      email: user.email ?? null,
    },
    profile: {
      userId: profile.user_id,
      displayName: profile.display_name,
      username: profile.username,
      bio: profile.bio,
      city: profile.city,
      region: profile.region,
      country: profile.country,
      privacyLevel: profile.privacy_level,
      avatarUrl: profile.avatar_path,
      genres: profile.genres ?? [],
      instruments: profile.instruments ?? [],
      skills: profile.skills ?? [],
      isSeekingCollaboration: profile.is_seeking_collaboration ?? true,
      consentLocation: profile.consent_location ?? false,
      consentAi: profile.consent_ai ?? false,
      consentMarketing: profile.consent_marketing ?? false,
      role: userDetails?.role ?? null,
      alphaAccessGranted: userDetails?.alpha_access_granted ?? false,
      onboardingCompleted: userDetails?.onboarding_completed ?? false,
      links: (profile.profile_links ?? []).map((link) => ({
        id: link.id,
        kind: link.kind,
        label: link.label,
        url: link.url,
        isPrimary: link.is_primary,
      })),
    },
    flags,
  };
}

export async function requireAuthenticatedViewer(next: string) {
  const viewer = await getProductViewer();

  if (!viewer.envConfigured) {
    return viewer;
  }

  if (!viewer.user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return viewer;
}
