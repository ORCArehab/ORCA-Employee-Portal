import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata: Metadata = { title: "Training Materials" };

export default function TrainingPage() {
  return (
    <PlaceholderPage
      icon={GraduationCap}
      title="Training Materials"
      description="Onboarding guides and ongoing training resources will live here."
    />
  );
}
