import type { EntryType, ScheduleEntry, ScheduleFacility, TimeBlock } from "./types";

export const ENTRY_LABELS: Record<EntryType, string> = {
  facility: "Facility",
  coverage: "Coverage",
  admin: "Admin",
  clinic: "Clinic",
  pto: "PTO",
  off: "Off",
};

const TIME_LABELS: Record<TimeBlock, string> = { am: "AM", pm: "PM", all_day: "All day", custom: "Custom" };

/** 13:30 → "1:30 PM", 09:00 → "9 AM". */
export function clockTime(time: string): string {
  const [h, m] = time.split(":").map(Number) as [number, number];
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
}

/** "All day", "AM", "PM" or "9 AM – 5 PM". */
export function timeText(e: Pick<ScheduleEntry, "timeBlock" | "startTime" | "endTime">): string {
  if (e.timeBlock === "custom" && e.startTime && e.endTime) return `${clockTime(e.startTime)} – ${clockTime(e.endTime)}`;
  return TIME_LABELS[e.timeBlock];
}

/** The headline of an entry: the facility's name for facility work, otherwise the kind of day. */
export function entryTitle(e: ScheduleEntry, facility: ScheduleFacility | undefined): string {
  if (e.type === "facility") return facility?.name ?? "Facility";
  if (e.type === "coverage") return facility ? `Coverage · ${facility.name}` : "Coverage";
  return facility ? `${ENTRY_LABELS[e.type]} · ${facility.name}` : ENTRY_LABELS[e.type];
}

/** Earlier first; all-day and AM before PM; custom by start time. */
export function sortEntries(entries: ScheduleEntry[]): ScheduleEntry[] {
  const rank = (e: ScheduleEntry) => (e.timeBlock === "all_day" ? "00:00" : e.timeBlock === "am" ? "08:00" : e.timeBlock === "pm" ? "13:00" : (e.startTime ?? "12:00"));
  return [...entries].sort((a, b) => a.date.localeCompare(b.date) || rank(a).localeCompare(rank(b)));
}

/** "Changed by you", "Changed by ORCA (pat@orcarehab.com)" — who last set a hospital login's username or password. */
export function changedBy(email: string | null, via: string | null, myEmail: string): string | null {
  if (!email) return null;
  if (email.toLowerCase() === myEmail.toLowerCase()) return "you";
  return via === "portal" ? email : `ORCA (${email})`;
}

export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" });
}
