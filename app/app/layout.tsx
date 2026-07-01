import type { ReactNode } from "react";
import ConfigNotice from "@/components/product/ConfigNotice";
import { requireAuthenticatedViewer } from "@/lib/product";

export default async function ProductRootLayout({ children }: { children: ReactNode }) {
  const viewer = await requireAuthenticatedViewer("/app");

  if (!viewer.envConfigured) {
    return (
      <main className="min-h-screen bg-stage px-6 py-16 text-white sm:px-10 lg:px-16">
        <ConfigNotice
          title="The authenticated product is ready, but Supabase is not connected."
          body="Configure Supabase auth and database credentials to activate login, onboarding, realtime, and persistence."
        />
      </main>
    );
  }

  return <>{children}</>;
}
