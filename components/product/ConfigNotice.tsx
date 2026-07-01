type ConfigNoticeProps = {
  title: string;
  body: string;
};

export default function ConfigNotice({ title, body }: ConfigNoticeProps) {
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-amber-300/20 bg-amber-400/10 p-8 text-white">
      <p className="text-xs uppercase tracking-[0.25em] text-amber-100/70">Configuration Required</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight">{title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">{body}</p>
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
        Add `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or
        `NEXT_PUBLIC_SUPABASE_ANON_KEY` to start the authenticated app locally.
      </div>
    </div>
  );
}
