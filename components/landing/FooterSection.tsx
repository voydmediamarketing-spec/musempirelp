"use client";

const links = [
  { label: "Vision", href: "#vision" },
  { label: "Features", href: "#features" },
  { label: "AiM", href: "#aim" },
  { label: "Map", href: "#map" },
  { label: "Invest", href: "#invest" },
  { label: "Waitlist", href: "#waitlist" },
];

const socials = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "Twitter/X", href: "#", Icon: XIcon },
  { label: "YouTube", href: "#", Icon: YouTubeIcon },
];

export default function FooterSection() {
  return (
    <footer className="border-t border-white/10 px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Musempire</p>
            <p className="mt-1 text-sm text-white/62">Your Music. Your Empire. One Platform.</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-white/68">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.16em] text-white/45">Built with 🎵 and AI</p>

          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/75 transition hover:border-fuchsia-300/60 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M4 4h4.5l4 5.3L17 4h3L14 11.2 20.2 20H15.7l-4.3-5.8L6.4 20H3.3l6.2-8.8L4 4Z" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="6.2" width="18" height="11.6" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="m10 9.5 5 2.3-5 2.7V9.5Z" fill="currentColor" />
    </svg>
  );
}
