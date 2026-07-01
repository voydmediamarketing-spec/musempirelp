"use client";

import { useEffect, useState, useTransition } from "react";
import type { CollabRequest } from "@musempire/contracts";

type CollabResponse = {
  requests: CollabRequest[];
};

export default function CollabBoard() {
  const [requests, setRequests] = useState<CollabRequest[]>([]);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/collab-requests")
      .then((response) => response.json() as Promise<CollabResponse>)
      .then((payload) => setRequests(payload.requests))
      .catch(() => {
        return;
      });
  }, []);

  const createRequest = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/collab-requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetUserId: "95e3676a-2fd6-4e6b-84e1-c11fb5db0d62",
            message: message || "Looking for a collaboration sync inside Musempire.",
            requestedRole: "Creative collaborator",
          }),
        });

        const payload = (await response.json()) as CollabResponse & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to create the request.");
        }

        setRequests(payload.requests);
        setMessage("");
      } catch {
        return;
      }
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/75">Collaboration Pipeline</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Requests + Rooms</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/72">
          Alpha collaboration starts with direct requests and grows into structured project rooms.
        </p>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write the collaboration brief you want to send."
          className="mt-6 min-h-[180px] w-full rounded-[1.5rem] border border-white/10 bg-black/35 p-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-fuchsia-300/45"
        />
        <button
          type="button"
          onClick={createRequest}
          disabled={isPending}
          className="glow-button mt-4 rounded-full border border-fuchsia-300/70 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Create Sample Request"}
        </button>
      </section>

      <section className="space-y-4">
        {requests.map((request) => (
          <article key={request.id} className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-white">{request.requestedRole}</p>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                {request.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{request.message}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-fuchsia-200/70">
              Created {new Date(request.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
