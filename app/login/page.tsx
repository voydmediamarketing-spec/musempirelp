import AuthPanel from "@/components/product/AuthPanel";
import ConfigNotice from "@/components/product/ConfigNotice";
import { hasSupabaseBrowserEnv } from "@/lib/env";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const nextPath = searchParams?.next ?? "/app";

  return (
    <main className="min-h-screen bg-stage px-6 py-20 text-white sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/70">Function First</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight">The collaboration layer starts here.</h1>
          <p className="mt-6 text-sm leading-relaxed text-white/72 sm:text-base">
            Musempire alpha turns the landing page into a real product: protected routes, role-aware
            onboarding, world map discovery, collaboration requests, project rooms, and a draft-only
            AiM beta.
          </p>
        </div>

        {hasSupabaseBrowserEnv() ? (
          <AuthPanel envConfigured={true} nextPath={nextPath} />
        ) : (
          <ConfigNotice
            title="Supabase auth is not configured yet."
            body="The product shell has been implemented, but the authentication runtime still needs project URL and publishable key values before login flows can operate."
          />
        )}
      </div>
    </main>
  );
}
