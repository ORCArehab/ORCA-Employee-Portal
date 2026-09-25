import {
  LayoutDashboard,
  LayoutGrid,
  BookOpen,
  ClipboardList,
  Users,
  LifeBuoy,
} from "lucide-react";
import type { NavItem } from "@/types/portal";

export const primaryNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
  { id: "apps", label: "Apps", href: "/apps", icon: LayoutGrid },
  { id: "resources", label: "Resources", href: "/resources", icon: BookOpen },
  { id: "forms", label: "Forms", href: "/forms", icon: ClipboardList },
  { id: "directory", label: "Directory", href: "/directory", icon: Users },
  { id: "it-support", label: "IT Support", href: "/it-support", icon: LifeBuoy },
];
