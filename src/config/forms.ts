import {
  ClipboardCheck,
  CalendarDays,
  UserPen,
  LifeBuoy,
  FileWarning,
  Laptop,
} from "lucide-react";
import type { PortalForm } from "@/types/portal";

/**
 * Employee forms, each a link out to a Google Form. Cards on the dashboard
 * and /forms are generated from this list. To activate a form, paste its
 * Google Form URL into `href` — until then it renders as "Link coming soon"
 * rather than a broken link.
 */
export const portalForms: PortalForm[] = [
  {
    id: "technical-readiness",
    name: "Technical Readiness",
    description: "Complete the technical readiness form.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfUKDenCwSFBKkSUaH1N050wI1FhW_n4g9tis6ZYxWBzevRWA/viewform?usp=header",
    icon: ClipboardCheck,
    accent: "navy",
  },
  {
    id: "time-off",
    name: "Request Time Off",
    description: "Submit a time-off request.",
    icon: CalendarDays,
    accent: "sky",
    // href: "https://forms.gle/...",
  },
  {
    id: "update-employee-info",
    name: "Update Employee Information",
    description: "Update your contact or personal details on file.",
    icon: UserPen,
    accent: "navy",
  },
  {
    id: "it-support-request",
    name: "IT Support Request",
    description: "Report a technical problem or request IT help.",
    icon: LifeBuoy,
    accent: "gold",
  },
  {
    id: "incident-report",
    name: "Incident Report",
    description: "Report a workplace incident.",
    icon: FileWarning,
    accent: "gold",
  },
  {
    id: "equipment-request",
    name: "Equipment Request",
    description: "Request equipment or supplies.",
    icon: Laptop,
    accent: "sky",
  },
];
