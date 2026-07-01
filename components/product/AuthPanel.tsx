"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type AuthPanelProps = {
  envConfigured: boolean;
  nextPath: string;
};

export default function AuthPanel({ envConfigured, nextPath }: AuthPanelProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState(
    "Use the same email you joined the waitlist with. Alpha access is granted from the waitlist table.",
  );
  const [isPending, startTransition] = useTransition();

  const actionLabel = useMemo(
    () => (authMode === "signin" ? "Sign In" : "Create Account"),
    [authMode],
  );

  const handleEmailPasswordAuth = () => {
    startTransition(async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const credentials = {
          email: email.trim().toLowerCase(),
          password,
        };
        const response =
          authMode === "signin"
            ? await supabase.auth.signInWithPassword(credentials)
            : await supabase.auth.signUp(credentials);
        const { data, error } = response;

        if (error) {
          throw error;
        }

        if (data.session) {
          router.push(nextPath);
          router.refresh();
          return;
        }

        setMessage(
          authMode === "signup"
            ? "Account created. If access is enabled for your email, sign in to continue."
            : "Signed in. Refresh if the product shell does not update immediately.",
        );
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to complete authentication.");
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

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-[1.25rem] border border-white/10 bg-black/30 p-2">
        {[
          { key: "signin", label: "Sign In" },
          { key: "signup", label: "Create Account" },
        ].map((mode) => (
          <button
            key={mode.key}
            type="button"
            onClick={() => setAuthMode(mode.key as "signin" | "signup")}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
              authMode === mode.key
                ? "border border-fuchsia-300/60 bg-fuchsia-500/15 text-white"
                : "border border-transparent bg-transparent text-white/68 hover:border-white/10 hover:bg-black/20"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/35 p-4">
        <label htmlFor="login-email" className="block text-sm font-medium text-white/80">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="artist@label-free.world"
          className="mt-3 h-12 w-full rounded-full border border-white/20 bg-black/35 px-5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-fuchsia-300/60"
        />
        <label htmlFor="login-password" className="mt-4 block text-sm font-medium text-white/80">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 characters"
          className="mt-3 h-12 w-full rounded-full border border-white/20 bg-black/35 px-5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-fuchsia-300/60"
        />
        <button
          type="button"
          onClick={handleEmailPasswordAuth}
          disabled={!envConfigured || !email || password.length < 8 || isPending}
          className="glow-button mt-4 inline-flex w-full items-center justify-center rounded-full border border-fuchsia-300/70 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Working..." : actionLabel}
        </button>
      </div>

      <p className="mt-5 text-sm text-white/65">{message}</p>

      <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/30 p-4 text-sm text-white/64">
        Password auth is live for the alpha. Magic links and social providers can be re-enabled
        after SMTP and OAuth credentials are connected to the self-hosted stack.
      </div>
    </div>
  );
}
