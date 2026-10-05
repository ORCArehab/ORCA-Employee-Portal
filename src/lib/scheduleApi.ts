import "server-only";
import { orcaApiRequestAsUser } from "@/lib/orcaApi";

/**
 * The signed-in provider's own schedule, from the ORCA API (GET /v1/schedule/me). The API
 * finds their staff record from who they're signed in as; this portal never sends an id,
 * and its key can't read anyone else's schedule. Operations manages the schedule in ORCA Admin.
 */

export type ScheduleEntryType = "facility" | "coverage" | "admin" | "clinic" | "pto" | "off";
export type ScheduleTimeBlock = "am" | "pm" | "all_day" | "custom";

export interface ScheduleEntry {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  type: ScheduleEntryType;
  facilityId: string | null;
  coveringStaffId: string | null;
  timeBlock: ScheduleTimeBlock;
  /** HH:MM, custom times only. */
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
}

export interface ScheduleFacility {
  id: string;
  name: string;
  abbreviation: string | null;
  address: { line1: string | null; city: string | null; state: string | null };
}

export interface MySchedule {
  from: string;
  to: string;
  /** False when this account isn't linked to a staff record yet. */
  linked: boolean;
  staff: { id: string; displayName: string; credentials: string | null } | null;
  assignments: ScheduleEntry[];
  facilities: ScheduleFacility[];
  coveredStaff: { id: string; displayName: string }[];
}

export function getMySchedule(from: string, to: string) {
  return orcaApiRequestAsUser<MySchedule>(`/v1/schedule/me?${new URLSearchParams({ from, to })}`);
}
