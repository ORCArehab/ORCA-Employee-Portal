import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <PlaceholderPage
      icon={Settings}
      title="Settings"
      description="Account and notification preferences will live here once sign-in is connected."
    />
  );
}
