import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AppSidebar from "@/components/product/AppSidebar";
import { getProductViewer } from "@/lib/product";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const viewer = await getProductViewer();

  if (!viewer.user) {
    redirect("/login?next=/app");
  }

  if (viewer.profile && !viewer.profile.onboardingCompleted) {
    redirect("/app/onboarding");
  }

  if (viewer.profile && !viewer.profile.alphaAccessGranted) {
    redirect("/");
  }

  const displayName = viewer.profile?.displayName ?? viewer.user.email ?? "Musempire User";
  const roleLabel = viewer.profile?.role ? `${viewer.profile.role} account` : "alpha account";

  return (
    <main className="min-h-screen bg-stage px-6 py-6 text-white sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row">
        <AppSidebar displayName={displayName} roleLabel={roleLabel} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
