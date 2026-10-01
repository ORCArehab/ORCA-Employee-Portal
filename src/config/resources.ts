import {
  ClipboardCheck,
  ScrollText,
  Building2,
  Users,
  GraduationCap,
  LifeBuoy,
  Megaphone,
} from "lucide-react";
import type { PortalResource } from "@/types/portal";

/**
 * Company resources. Cards on /resources are generated from this list —
 * add new entries here rather than hand-building more markup.
 *
 * `accent` cycles through the three colors in the ORCA icon mark (navy,
 * gold, sky) so the grid reads as branded rather than a flat icon list.
 *
 * Filter with getVisibleResources() (src/lib/permissions.ts) before showing.
 */

// The onboarding app (ORCA_Rehab_Onboarding) signs providers in itself and
// checks their PROVIDER role there too. Its card is hidden until this is set.
const onboardingAppUrl = process.env.ONBOARDING_APP_URL?.trim();

export const portalResources: PortalResource[] = [
  ...(onboardingAppUrl
    ? [
        {
          id: "provider-onboarding",
          name: "Provider Onboarding",
          description: "Submit your credentialing documents and employee information.",
          href: onboardingAppUrl,
          icon: ClipboardCheck,
          accent: "gold",
          allowedRoles: ["PROVIDER"],
        } satisfies PortalResource,
      ]
    : []),
  {
    id: "policies",
    name: "Company Policies",
    description: "HR policies, handbooks, and compliance guidelines.",
    href: "/resources/policies",
    icon: ScrollText,
    accent: "navy",
  },
  {
    id: "facility-directory",
    name: "Facility Directory",
    description: "Contact info and locations for every ORCA facility.",
    href: "/facilities",
    icon: Building2,
    accent: "gold",
  },
  {
    id: "employee-directory",
    name: "Employee Directory",
    description: "Find and connect with ORCA Rehab team members.",
    href: "/directory",
    icon: Users,
    accent: "sky",
  },
  {
    id: "training",
    name: "Training Materials",
    description: "Onboarding guides and ongoing training resources.",
    href: "/resources/training",
    icon: GraduationCap,
    accent: "sky",
  },
  {
    id: "it-support",
    name: "IT Support",
    description: "Get help with hardware, software, and access issues.",
    href: "/it-support",
    icon: LifeBuoy,
    accent: "navy",
  },
  {
    id: "announcements",
    name: "Announcements",
    description: "Company-wide updates and news.",
    href: "/announcements",
    icon: Megaphone,
    accent: "gold",
  },
];
