import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata: Metadata = { title: "Company Policies" };

export default function PoliciesPage() {
  return (
    <PlaceholderPage
      icon={ScrollText}
      title="Company Policies"
      description="HR policies, employee handbooks, and compliance guidelines will live here."
    />
  );
}
