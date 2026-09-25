import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { FacilityDirectory } from "@/components/facilities/FacilityDirectory";
import { facilities, facilitiesMap } from "@/config/facilities";

export const metadata: Metadata = { title: "Facilities" };

export default function FacilitiesPage() {
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

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <iframe
          src={facilitiesMap.embedUrl}
          title="Map of ORCA Rehab facilities"
          className="block h-[280px] sm:h-[340px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={facilitiesMap.viewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-orca-navy-700 hover:text-orca-navy-900"
      >
        Open map in Google Maps
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>

      <FacilityDirectory facilities={facilities} />
    </div>
  );
}
