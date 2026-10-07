import type { MyFacility } from "@/lib/provider/types";

const ASSIGNMENT_LABELS: Record<string, string> = {
  rounding_provider: "Rounding provider",
  scribe_coverage: "Scribe coverage",
  credentialed: "Credentialed",
  liaison: "Liaison",
  other: "Assigned",
};

export const assignmentText = (f: MyFacility) => [...new Set(f.assignments.map((a) => ASSIGNMENT_LABELS[a.type] ?? a.type))].join(", ");

export const addressText = (f: MyFacility) =>
  [f.address.line1, [f.address.city, [f.address.state, f.address.postalCode].filter(Boolean).join(" ")].filter(Boolean).join(", ")].filter(Boolean).join(", ");

/** Whether this facility still needs the provider's PCC login (none saved, or marked not working). */
export const needsPcc = (f: MyFacility) => !f.pcc || f.pcc.status === "disabled" || (!f.pcc.username && !f.pcc.hasPassword);
