import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata: Metadata = { title: "Facility Directory" };

export default function FacilityDirectoryPage() {
  return (
    <PlaceholderPage
      icon={Building2}
      title="Facility Directory"
      description="Contact information and locations for every ORCA Rehab facility will live here."
    />
  );
}
