"use client";

import { useEffect, useMemo, useState } from "react";
import type { MapPin } from "@musempire/contracts";

type MapResponse = {
  pins: MapPin[];
  hotspots: {
    id: string;
    city: string;
    region: string | null;
    country: string;
    artistCount: number;
  }[];
};

export default function MapSurface() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<MapResponse>({ pins: [], hotspots: [] });

  useEffect(() => {
    const url = query ? `/api/map/query?query=${encodeURIComponent(query)}` : "/api/map/query";

    fetch(url)
      .then((response) => response.json() as Promise<MapResponse>)
      .then(setData)
      .catch(() => {
        return;
      });
  }, [query]);

  const filteredPins = useMemo(() => data.pins.slice(0, 12), [data.pins]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/70">Primary Product Surface</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">World Map</h1>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by city, genre, instrument, or skill"
            className="h-12 w-full max-w-md rounded-full border border-white/15 bg-black/30 px-5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-fuchsia-300/50"
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(194,64,255,0.22),transparent_52%)] p-6">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
            {filteredPins.map((pin, index) => (
              <div
                key={pin.userId}
                className="absolute rounded-full border border-fuchsia-300/40 bg-fuchsia-400/20 px-3 py-2 text-xs text-white shadow-[0_0_20px_rgba(228,87,255,0.4)]"
                style={{
                  left: `${14 + (index % 4) * 20}%`,
                  top: `${12 + (index % 3) * 23}%`,
                }}
              >
                <p className="font-semibold">{pin.displayName}</p>
                <p className="text-white/70">{pin.city}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5">
              <p className="text-sm font-semibold text-white">Hotspots</p>
              <div className="mt-4 space-y-3">
                {data.hotspots.map((hotspot) => (
                  <div key={hotspot.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-semibold text-white">
                      {hotspot.city}, {hotspot.country}
                    </p>
                    <p className="mt-1 text-sm text-white/65">{hotspot.artistCount} active profiles</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5">
              <p className="text-sm font-semibold text-white">Activity layer</p>
              <p className="mt-3 text-sm leading-relaxed text-white/68">
                Status snippets, event pulses, and audio or video drops appear here. The alpha app
                keeps city-level visibility by default.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {filteredPins.map((pin) => (
          <article key={pin.userId} className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{pin.displayName}</p>
                <p className="text-sm text-white/55">
                  {pin.role} · {pin.city}
                </p>
              </div>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                {pin.isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/72">{pin.headline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...pin.genres, ...pin.skills].slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-fuchsia-200/70">{pin.activitySnippet}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
