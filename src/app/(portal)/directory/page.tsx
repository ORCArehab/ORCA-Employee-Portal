import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata: Metadata = { title: "Employee Directory" };

export default function DirectoryPage() {
  return (
    <PlaceholderPage
      icon={Users}
      title="Employee Directory"
      description="A searchable directory of ORCA Rehab team members will live here."
      note="This will be populated from ORCA's Google Workspace directory once sign-in is connected."
    />
  );
}
