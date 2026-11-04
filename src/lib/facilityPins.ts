import "server-only";
import type { Facility } from "@/lib/orgShape";
import { geocodeAddresses } from "@/lib/geocode";

export interface FacilityPin {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  type: string | null;
  lat: number;
  lng: number;
}

/**
 * Facilities with map coordinates, geocoded live from their addresses (see
 * src/lib/geocode.ts). A facility whose address can't be geocoded is left
 * off the map but still shows in the list below it. Driven entirely by
 * `facilities` — add one in ORCA Admin and it appears here on the next
 * visit, no map maintenance required.
 */
export async function getFacilityPins(facilities: Facility[]): Promise<FacilityPin[]> {
  const coordsByAddress = await geocodeAddresses(facilities.map((f) => f.address));

  const pins: FacilityPin[] = [];
  for (const f of facilities) {
    const coords = coordsByAddress.get(f.address);
    if (!coords) {
      console.warn("[facilities] couldn't geocode, omitting from map", { id: f.id, address: f.address });
      continue;
    }
    pins.push({ id: f.id, name: f.name, address: f.address, phone: f.phone, type: f.type, lat: coords.lat, lng: coords.lng });
  }
  return pins;
}
