import "server-only";
import type { BrandAccentColor } from "@/types/portal";

export interface StaffMember {
  name: string;
  title: string;
  email: string;
}

export interface StaffGroup {
  id: string;
  name: string;
  accent: BrandAccentColor;
  members: StaffMember[];
}

/**
 * Staff directory data (real names/emails) is never committed to git — it
 * lives only in the STAFF_DIRECTORY_JSON environment variable. Set it in
 * .env.local for dev and in Vercel's project env vars for production.
 * Expected value: a JSON-encoded StaffGroup[], e.g.
 * '[{"id":"admin","name":"Administrative Staff","accent":"gold","members":[{"name":"...","title":"...","email":"..."}]}]'
 *
 * Returns [] (fails closed, doesn't throw) if unset or malformed, so a
 * missing/bad env var shows an empty directory rather than breaking the
 * page or the build.
 */
export function getStaffDirectory(): StaffGroup[] {
  const raw = process.env.STAFF_DIRECTORY_JSON;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StaffGroup[]) : [];
  } catch {
    console.error("[staff] STAFF_DIRECTORY_JSON is not valid JSON");
    return [];
  }
}
