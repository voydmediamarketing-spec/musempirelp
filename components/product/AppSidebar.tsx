import Link from "next/link";

const navItems = [
  { href: "/app", label: "Overview" },
  { href: "/app/map", label: "World Map" },
  { href: "/app/collabs", label: "Collabs" },
  { href: "/app/projects", label: "Projects" },
  { href: "/app/aim", label: "AiM Beta" },
  { href: "/app/invest", label: "Invest" },
];

type AppSidebarProps = {
  displayName: string;
  roleLabel: string;
};

export default function AppSidebar({ displayName, roleLabel }: AppSidebarProps) {
  return (
    <aside className="w-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-72">
      <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/70">Musempire Alpha</p>
        <p className="mt-3 text-2xl font-black tracking-tight text-white">{displayName}</p>
        <p className="mt-1 text-sm text-white/60">{roleLabel}</p>
      </div>

      <nav className="mt-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white/78 transition hover:border-fuchsia-300/35 hover:bg-white/[0.04] hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-cyan-400/10 p-5">
        <p className="text-sm font-semibold text-white">Closed Alpha Rules</p>
        <p className="mt-2 text-sm leading-relaxed text-white/68">
          City-level map visibility is the default. AiM stays draft-only. Regulated investment
          flows remain placeholders in this phase.
        </p>
      </div>
    </aside>
  );
}
