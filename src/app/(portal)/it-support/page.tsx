import type { Metadata } from "next";
import { LifeBuoy } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata: Metadata = { title: "IT Support" };

export default function ItSupportPage() {
  return (
    <PlaceholderPage
      icon={LifeBuoy}
      title="IT Support"
      description="Submit and track hardware, software, and access requests here."
      note="A ticketing system will be connected in a future release."
    />
  );
}
