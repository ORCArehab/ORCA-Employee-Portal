import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { FacilityDirectory } from "@/components/facilities/FacilityDirectory";
import { FacilityMapView } from "@/components/facilities/FacilityMapView";
import { facilitiesMap } from "@/config/facilities";
import { getFacilities } from "@/lib/orgDirectory";
import { getFacilityPins } from "@/lib/facilityPins";

export const metadata: Metadata = { title: "Facilities" };

/** The map and the list below it are both live from the ORCA API on every visit — add a facility in ORCA Admin and it appears in both, no map maintenance required. */
export default async function FacilitiesPage() {
  const facilities = await getFacilities();
  const pins = facilities ? await getFacilityPins(facilities) : [];

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">
            Facilities
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Where ORCA Rehab provides care.
          </p>
          <BrandAccent className="mt-4" />
        </div>
        <a
          href={facilitiesMap.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-orca-navy-700 hover:text-orca-navy-900"
        >
          Open in Google Maps
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </header>

      <div className="mb-8">
        <FacilityMapView pins={pins} />
      </div>

      {facilities === null ? (
        <p className="mt-8 text-sm text-muted-foreground">The facility list couldn&apos;t be loaded right now. Please try again in a moment.</p>
      ) : (
        <FacilityDirectory facilities={facilities} />
      )}
    </div>
  );
}
