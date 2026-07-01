import { NextResponse } from "next/server";
import { sampleHotspots, sampleMapPins } from "@/lib/product-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase().trim();

  const pins = query
    ? sampleMapPins.filter((pin) => {
        const haystack = [
          pin.displayName,
          pin.username ?? "",
          pin.city ?? "",
          pin.region ?? "",
          pin.country ?? "",
          ...pin.genres,
          ...pin.instruments,
          ...pin.skills,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      })
    : sampleMapPins;

  return NextResponse.json({
    pins,
    hotspots: sampleHotspots,
  });
}
