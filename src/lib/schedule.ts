import type { ScheduleEntry, ScheduleEntryType } from "@/lib/scheduleApi";

/**
 * Pure helpers for My Schedule: Monday–Sunday weeks as YYYY-MM-DD strings (UTC arithmetic on
 * plain dates, so nothing shifts with timezones), and how entries read.
 */

export const SCHEDULE_TIMEZONE = "America/Los_Angeles";

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toIso = (date: Date) => date.toISOString().slice(0, 10);

export function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(toDate(value).getTime()) && toIso(toDate(value)) === value;
}

export function addDays(iso: string, days: number) {
  const date = toDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

/** The Monday on or before a date. */
export function weekStart(iso: string) {
  const day = toDate(iso).getUTCDay();
  return addDays(iso, day === 0 ? -6 : 1 - day);
}

export function weekDays(start: string) {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Today's date where ORCA operates. */
export function today(now: Date = new Date(), timeZone = SCHEDULE_TIMEZONE) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

const fmt = (iso: string, options: Intl.DateTimeFormatOptions) => toDate(iso).toLocaleDateString("en-US", { timeZone: "UTC", ...options });

export function weekLabel(start: string) {
  const end = addDays(start, 6);
  if (start.slice(0, 7) === end.slice(0, 7)) return `${fmt(start, { month: "short", day: "numeric" })} – ${fmt(end, { day: "numeric" })}, ${end.slice(0, 4)}`;
  if (start.slice(0, 4) === end.slice(0, 4)) return `${fmt(start, { month: "short", day: "numeric" })} – ${fmt(end, { month: "short", day: "numeric" })}, ${end.slice(0, 4)}`;
  return `${fmt(start, { month: "short", day: "numeric", year: "numeric" })} – ${fmt(end, { month: "short", day: "numeric", year: "numeric" })}`;
}

export function dayLabel(iso: string) {
  return { weekday: fmt(iso, { weekday: "long" }), date: fmt(iso, { month: "short", day: "numeric" }) };
}

export const ENTRY_TYPE_LABELS: Record<ScheduleEntryType, string> = {
  facility: "Facility",
  coverage: "Coverage",
  admin: "Admin",
  clinic: "Clinic",
  pto: "PTO",
  off: "Off",
};

/** 13:30 → "1:30 PM". */
export function clockTime(time: string) {
  const [h, m] = time.split(":").map(Number) as [number, number];
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export function entryTime(entry: Pick<ScheduleEntry, "timeBlock" | "startTime" | "endTime">) {
  if (entry.timeBlock === "custom" && entry.startTime && entry.endTime) return `${clockTime(entry.startTime)} – ${clockTime(entry.endTime)}`;
  return { am: "Morning (AM)", pm: "Afternoon (PM)", all_day: "All day", custom: "Custom hours" }[entry.timeBlock];
}

/** Entries by date, for every day of the week (empty days included), in the order the API sent. */
export function groupByDay(entries: ScheduleEntry[], start: string) {
  const days = weekDays(start).map((date) => ({ date, entries: [] as ScheduleEntry[] }));
  const byDate = new Map(days.map((d) => [d.date, d]));
  for (const entry of entries) byDate.get(entry.date)?.entries.push(entry);
  return days;
}
