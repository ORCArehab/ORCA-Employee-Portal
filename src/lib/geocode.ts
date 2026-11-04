import "server-only";
import { unstable_cache } from "next/cache";

/**
 * Turns a facility's street address into map coordinates, via OpenStreetMap's
 * free Nominatim geocoder (no API key). Each address is cached independently
 * and for a long time (addresses almost never change), so a newly added
 * facility is the only one that ever triggers a real lookup — everything
 * else is served from cache. See src/lib/facilitiesMap.ts for the per-request
 * list this feeds.
 */

interface Coordinates {
  lat: number;
  lng: number;
}

// unstable_cache only ever calls this body on a cache miss, so the
// throttling delay below runs exactly once per address that's genuinely new
// — not on every cached hit. That's what keeps a page full of already-known
// facilities fast while still respecting Nominatim's ~1 req/sec policy.
const geocodeOnce = unstable_cache(
  async (address: string): Promise<Coordinates | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    try {
      const res = await fetch(url, {
        // Nominatim's usage policy requires an identifying User-Agent.
        headers: { "User-Agent": "ORCA-Employee-Portal/1.0 (it@orcarehab.com)" },
        signal: AbortSignal.timeout(8_000),
      });
      if (!res.ok) return null;
      const results = (await res.json()) as Array<{ lat: string; lon: string }>;
      const first = results[0];
      if (!first) return null;
      return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
    } catch (error) {
      console.error("[geocode] lookup failed", { address, error: String(error) });
      return null;
    }
  },
  ["facility-geocode"],
  // 30 days: long enough that this is effectively permanent for an address
  // that doesn't change, short enough to self-heal if one was ever wrong.
  { revalidate: 60 * 60 * 24 * 30 },
);

/**
 * Looked up sequentially (not in parallel) so that any brand-new addresses'
 * one-second throttling delays stack instead of firing a burst of
 * simultaneous requests at Nominatim. Addresses already cached from a
 * previous visit resolve immediately, so this only runs slow the first time
 * a new facility's address is seen.
 */
export async function geocodeAddresses(addresses: string[]): Promise<Map<string, Coordinates | null>> {
  const results = new Map<string, Coordinates | null>();
  for (const address of addresses) {
    if (results.has(address)) continue;
    results.set(address, await geocodeOnce(address));
  }
  return results;
}
