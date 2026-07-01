export default function InvestPlaceholderPage() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-white">
      <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/75">Placeholder Only</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Artist investment is deferred.</h1>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/72 sm:text-base">
        Musempire will eventually model artist investment, fan participation, and deeper
        monetization flows. In this alpha build, the route exists only to capture the roadmap and
        keep regulated mechanics out of live product scope.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
          <p className="text-lg font-semibold">No securities logic</p>
          <p className="mt-3 text-sm text-white/68">No tokenization, wallet, or revenue-share implementation yet.</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
          <p className="text-lg font-semibold">Roadmap visibility</p>
          <p className="mt-3 text-sm text-white/68">The placeholder keeps user interest and planning visible without legal drift.</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
          <p className="text-lg font-semibold">Compliance first</p>
          <p className="mt-3 text-sm text-white/68">Regulated features will require separate architecture and legal review.</p>
        </article>
      </div>
    </section>
  );
}
