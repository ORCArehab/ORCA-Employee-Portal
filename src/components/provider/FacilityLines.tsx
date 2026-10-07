import { loginsAt, systemLabel, type MyFacility } from "@/lib/provider/types";

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

/** What's missing from the provider's hospital logins here: no logins at all, or one marked not working. Null when all's well. */
export function loginProblem(f: MyFacility): string | null {
  const logins = loginsAt(f);
  if (logins.length === 0 || logins.every((l) => !l.username && !l.hasPassword)) return "Add a login";
  const broken = logins.find((l) => l.status === "disabled");
  return broken ? `${systemLabel(broken) === "PointClickCare" ? "PCC" : systemLabel(broken)} not working` : null;
}
