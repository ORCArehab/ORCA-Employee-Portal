/** Mirrors the `application_status` enum in the ORCA Careers API. Order is the usual hiring flow. */
export const APPLICATION_STATUSES = ["new", "reviewing", "interview", "offer", "hired", "rejected"] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};

export const APPLICATION_STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: "bg-orca-sky-050 text-orca-navy-800 ring-orca-sky-500/30",
  reviewing: "bg-orca-gold-050 text-orca-navy-800 ring-orca-gold-500/40",
  interview: "bg-violet-50 text-violet-800 ring-violet-500/30",
  offer: "bg-blue-50 text-blue-800 ring-blue-500/30",
  hired: "bg-emerald-50 text-emerald-800 ring-emerald-500/30",
  rejected: "bg-slate-100 text-slate-600 ring-slate-400/30",
};

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && (APPLICATION_STATUSES as readonly string[]).includes(value);
}
