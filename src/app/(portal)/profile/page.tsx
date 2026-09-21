import type { Metadata } from "next";
import { UserCircle } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <PlaceholderPage
      icon={UserCircle}
      title="Your Profile"
      description="Your employee profile will appear here once ORCA Rehab Google Workspace sign-in is connected."
    />
  );
}
