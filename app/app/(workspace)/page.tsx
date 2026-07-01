import Link from "next/link";
import { getProductViewer } from "@/lib/product";

const workspaceCards = [
  {
    href: "/app/map",
    title: "World Map",
    copy: "Profile pins, filters, activity layers, and hotspot discovery.",
  },
  {
    href: "/app/collabs",
    title: "Collabs",
    copy: "Requests, messaging pathways, and collaboration entry points.",
  },
  {
    href: "/app/projects",
    title: "Projects",
    copy: "Room-based coordination with tasks, files, and ownership.",
  },
  {
    href: "/app/aim",
    title: "AiM Beta",
    copy: "Draft-only career copilot for planning, outreach, and next actions.",
  },
  {
    href: "/app/invest",
    title: "Invest",
    copy: "Regulated roadmap placeholder without live financial mechanics.",
  },
];

export default async function WorkspaceHomePage() {
  const viewer = await getProductViewer();

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/75">Alpha Workspace</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight text-white">
          {viewer.profile?.displayName ?? "Musempire"} is inside.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/72 sm:text-base">
          The landing page now routes into a real protected product shell with documentation,
          typed contracts, Supabase schema, role-aware onboarding, and the first surfaces for map
          discovery, collaboration, project coordination, and AiM.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {workspaceCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-[1.75rem] border border-white/10 bg-black/30 p-6 transition hover:border-fuchsia-300/40 hover:bg-black/45"
          >
            <p className="text-2xl font-semibold text-white">{card.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{card.copy}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
