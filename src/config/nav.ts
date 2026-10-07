import {
  LayoutDashboard,
  LayoutGrid,
  BookOpen,
  ClipboardList,
  MapPin,
  Users,
  LifeBuoy,
  UserSearch,
  CalendarDays,
  Building2,
} from "lucide-react";
import type { NavItem } from "@/types/portal";

export const primaryNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
  { id: "my-schedule", label: "My Schedule", href: "/my-schedule", icon: CalendarDays, allowedRoles: ["PROVIDER"] },
  { id: "my-facilities", label: "My Facilities", href: "/my-facilities", icon: Building2, allowedRoles: ["PROVIDER"] },
  { id: "apps", label: "Apps", href: "/apps", icon: LayoutGrid },
  { id: "resources", label: "Resources", href: "/resources", icon: BookOpen },
  { id: "forms", label: "Forms", href: "/forms", icon: ClipboardList },
  { id: "facilities", label: "Facilities", href: "/facilities", icon: MapPin },
  { id: "directory", label: "Directory", href: "/directory", icon: Users },
  { id: "it-support", label: "IT Support", href: "/it-support", icon: LifeBuoy },
  {
    id: "applicants",
    label: "Applicants",
    href: "/hr/applicants",
    icon: UserSearch,
    allowedRoles: ["HR", "ADMIN"],
  },
];
