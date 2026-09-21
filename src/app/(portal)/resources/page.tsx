import type { Metadata } from "next";
import { ResourceCard } from "@/components/dashboard/ResourceCard";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { portalResources } from "@/config/resources";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">
          Resources
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Company policies, directories, training, and support — everything
          an ORCA employee needs to reference.
        </p>
        <BrandAccent className="mt-4" />
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {portalResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
