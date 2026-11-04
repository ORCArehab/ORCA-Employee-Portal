import type { Facility } from "@/lib/orgShape";
import { getFacilityPins } from "@/lib/facilityPins";
import { FacilityMapView } from "@/components/facilities/FacilityMapView";

/**
 * Split out from the page itself so it can sit inside a <Suspense> boundary:
 * geocoding a facility address no one's visited the page since can take a
 * while (sequential, ~1/sec, to stay within Nominatim's rate limit), and
 * that must never hold up the rest of the page — see facilities/page.tsx.
 */
export async function FacilityMapSection({ facilities }: { facilities: Facility[] | null }) {
  const pins = facilities ? await getFacilityPins(facilities) : [];
  return <FacilityMapView pins={pins} />;
}
