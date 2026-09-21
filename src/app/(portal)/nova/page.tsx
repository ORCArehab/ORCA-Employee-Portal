import type { Metadata } from "next";
import { Stethoscope } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata: Metadata = { title: "NOVA" };

export default function NovaPage() {
  return (
    <PlaceholderPage
      icon={Stethoscope}
      title="NOVA"
      description="ORCA Rehab's internal clinical documentation system. This will link to NOVA directly once it's ready."
      note="Internal ORCA application."
    />
  );
}
