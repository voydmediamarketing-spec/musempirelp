"use client";

import { useState, useTransition } from "react";

type AimPayload = {
  threadId: string;
  response: {
    summary: string;
    factualContext: string[];
    generatedAdvice: string[];
    nextActions: string[];
    caution: string;
  };
};

export default function AimConsole() {
  const [prompt, setPrompt] = useState("");
  const [contextType, setContextType] = useState("career");
  const [response, setResponse] = useState<AimPayload["response"] | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      const apiResponse = await fetch("/api/aim/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          contextType,
          artistSummary: "Alpha user operating inside Musempire.",
        }),
      });

      const payload = (await apiResponse.json()) as AimPayload;
      if (apiResponse.ok) {
        setResponse(payload.response);
      }
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/75">AiM Beta</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Draft-only career copilot</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/72">
          AiM separates factual context from generated advice and never sends, signs, or publishes
          on your behalf in this release.
        </p>

        <select
          value={contextType}
          onChange={(event) => setContextType(event.target.value)}
          className="mt-6 h-12 w-full rounded-full border border-white/15 bg-black/30 px-5 text-sm text-white outline-none"
        >
          <option value="career">Career</option>
          <option value="release">Release</option>
          <option value="outreach">Outreach</option>
          <option value="contracts">Contracts</option>
          <option value="pricing">Pricing</option>
          <option value="analytics">Analytics</option>
          <option value="next_steps">Next steps</option>
        </select>

        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask AiM to plan your release, draft outreach, summarize a contract concern, or suggest next steps."
          className="mt-4 min-h-[220px] w-full rounded-[1.5rem] border border-white/10 bg-black/35 p-4 text-sm text-white placeholder:text-white/40 outline-none"
        />

        <button
          type="button"
          onClick={submit}
          disabled={!prompt || isPending}
          className="glow-button mt-4 rounded-full border border-fuchsia-300/70 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Generating..." : "Generate Draft"}
        </button>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-black/35 p-6">
        <p className="text-sm font-semibold text-white">AiM Response</p>
        {response ? (
          <div className="mt-5 space-y-5">
            <Panel title="Summary" lines={[response.summary]} />
            <Panel title="Factual Context" lines={response.factualContext} />
            <Panel title="Generated Advice" lines={response.generatedAdvice} />
            <Panel title="Next Actions" lines={response.nextActions} />
            <Panel title="Caution" lines={[response.caution]} />
          </div>
        ) : (
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            AiM outputs will appear here with factual context and generated advice separated.
          </p>
        )}
      </section>
    </div>
  );
}

function Panel({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-200/70">{title}</p>
      <div className="mt-3 space-y-2">
        {lines.map((line) => (
          <p key={line} className="text-sm leading-relaxed text-white/72">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
