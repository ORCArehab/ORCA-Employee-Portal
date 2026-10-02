import type { PortalRole } from "@/types/user";

/**
 * One color per role, so a person's access reads at a glance. Class names are
 * written out in full so Tailwind picks them up.
 */
export const ROLE_STYLES: Record<PortalRole, { badge: string; dot: string; checked: string }> = {
  ADMIN: {
    badge: "bg-orca-navy-900 text-white ring-orca-navy-900",
    dot: "bg-white",
    checked: "has-[:checked]:bg-orca-navy-900 has-[:checked]:text-white has-[:checked]:ring-orca-navy-900",
  },
  HR: {
    badge: "bg-rose-50 text-rose-800 ring-rose-200",
    dot: "bg-rose-500",
    checked: "has-[:checked]:bg-rose-50 has-[:checked]:text-rose-800 has-[:checked]:ring-rose-300",
  },
  IT: {
    badge: "bg-violet-50 text-violet-800 ring-violet-200",
    dot: "bg-violet-500",
    checked: "has-[:checked]:bg-violet-50 has-[:checked]:text-violet-800 has-[:checked]:ring-violet-300",
  },
  PROVIDER: {
    badge: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    dot: "bg-emerald-500",
    checked: "has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-800 has-[:checked]:ring-emerald-300",
  },
  SCRIBE: {
    badge: "bg-amber-50 text-amber-900 ring-amber-200",
    dot: "bg-amber-500",
    checked: "has-[:checked]:bg-amber-50 has-[:checked]:text-amber-900 has-[:checked]:ring-amber-300",
  },
};

const BASE = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";

export function RoleBadge({ role, label, title }: { role: PortalRole; label: string; title?: string }) {
  const style = ROLE_STYLES[role];
  return (
    <span className={`${BASE} ${style.badge}`} title={title}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

/** Shown when someone has no extra roles — every active account is an employee. */
export function EmployeeBadge() {
  return <span className={`${BASE} bg-surface text-muted-foreground ring-border`}>Employee</span>;
}

export function InactiveBadge() {
  return <span className={`${BASE} bg-red-50 text-red-700 ring-red-200`}>Inactive</span>;
}
