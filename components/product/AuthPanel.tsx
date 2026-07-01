"use client";

import { useState, useTransition } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const oauthProviders = [
  { label: "Continue with Google", provider: "google" },
  { label: "Continue with Apple", provider: "apple" },
  { label: "Continue with Spotify", provider: "spotify" },
] as const;

type AuthPanelProps = {
  envConfigured: boolean;
  nextPath: string;
};

export default function AuthPanel({ envConfigured, nextPath }: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Use email magic links or social sign-in to enter the alpha.");
  const [isPending, startTransition] = useTransition();

  const handleMagicLink = () => {
    startTransition(async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const origin = window.location.origin;
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          },
        });

        if (error) {
          throw error;
        }

        setMessage("Check your inbox for the Musempire login link.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to send the magic link.");
      }
    });
  };

  const handleOAuth = (provider: (typeof oauthProviders)[number]["provider"]) => {
    startTransition(async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const origin = window.location.origin;
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          },
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to start social sign-in.");
      }
    });
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_35px_70px_-50px_rgba(227,54,172,0.8)]">
      <p className="text-xs uppercase tracking-[0.28em] text-fuchsia-200/75">Invite-Only Product</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Enter Musempire Alpha</h1>
      <p className="mt-4 text-sm leading-relaxed text-white/72 sm:text-base">
        Artists, providers, and fans join through the same entry point, then complete a role-aware
        onboarding flow before the collaboration map opens.
      </p>

      <div className="mt-8 space-y-3">
        {oauthProviders.map((provider) => (
          <button
            key={provider.provider}
            type="button"
            onClick={() => handleOAuth(provider.provider)}
            disabled={!envConfigured || isPending}
            className="w-full rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-left text-sm font-medium text-white transition hover:border-fuchsia-300/35 hover:bg-black/45 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {provider.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/35 p-4">
        <label htmlFor="login-email" className="block text-sm font-medium text-white/80">
          Email magic link
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="artist@label-free.world"
          className="mt-3 h-12 w-full rounded-full border border-white/20 bg-black/35 px-5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-fuchsia-300/60"
        />
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={!envConfigured || !email || isPending}
          className="glow-button mt-4 inline-flex w-full items-center justify-center rounded-full border border-fuchsia-300/70 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Working..." : "Send Login Link"}
        </button>
      </div>

      <p className="mt-5 text-sm text-white/65">{message}</p>

      <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/30 p-4 text-sm text-white/64">
        Instagram and TikTok sign-in are documented for a later custom OAuth phase. The first
        alpha supports email, Google, Apple, and Spotify.
      </div>
    </div>
  );
}
