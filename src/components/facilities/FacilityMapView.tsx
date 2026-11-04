"use client";

import dynamic from "next/dynamic";
import type { FacilityPin } from "@/lib/facilityPins";

// Leaflet touches `window` as soon as it's imported, which breaks server
// rendering — load the real map only in the browser. `ssr: false` is only
// allowed inside a Client Component (hence this wrapper), not directly in
// the server-rendered facilities page.
const FacilityMap = dynamic(() => import("./FacilityMap").then((m) => m.FacilityMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] animate-pulse items-center justify-center rounded-2xl border border-border bg-surface text-sm text-muted-foreground sm:h-[480px]">
      Loading map...
    </div>
  ),
});

export function FacilityMapView({ pins }: { pins: FacilityPin[] }) {
  return <FacilityMap pins={pins} />;
}
