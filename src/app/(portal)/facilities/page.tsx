import type { Metadata } from "next";
import { ExternalLink, MapPinned } from "lucide-react";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { FacilityDirectory } from "@/components/facilities/FacilityDirectory";
import { facilitiesMap } from "@/config/facilities";
import { getFacilities } from "@/lib/orgDirectory";

export const metadata: Metadata = { title: "Facilities" };

/** The list below is live from the ORCA API on every visit; the map is a Google Maps list, linked out (Google doesn't support embedding lists). */
export default async function FacilitiesPage() {
  const facilities = await getFacilities();
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">
          Facilities
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Where ORCA Rehab provides care.
        </p>
        <BrandAccent className="mt-4" />
      </header>

      <a
        href={facilitiesMap.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-orca-navy-800/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orca-sky-050 text-orca-sky-500">
            <MapPinned className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-orca-navy-900">ORCA Facilities map</p>
            <p className="text-xs text-muted-foreground">Opens in Google Maps, in a new tab.</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-orca-navy-900 px-4 py-2 text-sm font-medium text-white transition group-hover:bg-orca-navy-800">
          Open in Google Maps
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </span>
      </a>

      {facilities === null ? (
        <p className="mt-8 text-sm text-muted-foreground">The facility list couldn&apos;t be loaded right now. Please try again in a moment.</p>
      ) : (
        <FacilityDirectory facilities={facilities} />
      )}
    </div>
  );
}
