import { describe, expect, it } from "vitest";
import { changedBy, clockTime, entryTitle, sortEntries, timeText } from "./format";
import type { ScheduleEntry } from "./types";
import { addDays, isIsoDate, today, weekDays, weekLabel, weekStart } from "./week";

const entry = (overrides: Partial<ScheduleEntry> = {}): ScheduleEntry => ({
  id: "e1",
  date: "2026-10-07",
  type: "facility",
  facilityId: "f1",
  coveringStaffId: null,
  timeBlock: "all_day",
  startTime: null,
  endTime: null,
  notes: null,
  ...overrides,
});
const facility = { id: "f1", name: "Example Care Center", abbreviation: "ECC", address: { line1: null, city: null, state: null } };

describe("weeks", () => {
  it("runs Monday to Sunday, across months and years", () => {
    expect(weekStart("2026-10-07")).toBe("2026-10-05");
    expect(weekStart("2026-10-11")).toBe("2026-10-05"); // Sunday belongs to the week before
    expect(weekDays("2026-12-28").at(-1)).toBe("2027-01-03");
    expect(weekLabel("2026-10-05")).toBe("Oct 5 – 11, 2026");
    expect(weekLabel("2026-09-28")).toBe("Sep 28 – Oct 4, 2026");
    expect(weekLabel("2026-12-28")).toBe("Dec 28, 2026 – Jan 3, 2027");
    expect(addDays("2026-03-07", 1)).toBe("2026-03-08");
  });

  it("accepts only real dates and uses Pacific time for today", () => {
    expect(isIsoDate("2026-02-30")).toBe(false);
    expect(isIsoDate("2026-10-07")).toBe(true);
    expect(today(new Date("2026-10-08T05:00:00Z"))).toBe("2026-10-07"); // 10 PM Pacific
  });
});

describe("schedule entries", () => {
  it("names the facility, or the kind of day", () => {
    expect(entryTitle(entry(), facility)).toBe("Example Care Center");
    expect(entryTitle(entry({ type: "coverage" }), facility)).toBe("Coverage · Example Care Center");
    expect(entryTitle(entry({ type: "pto", facilityId: null }), undefined)).toBe("PTO");
  });

  it("shows times plainly and orders the day", () => {
    expect(clockTime("09:00")).toBe("9 AM");
    expect(clockTime("13:30")).toBe("1:30 PM");
    expect(clockTime("00:15")).toBe("12:15 AM");
    expect(timeText(entry({ timeBlock: "custom", startTime: "09:00", endTime: "17:00" }))).toBe("9 AM – 5 PM");
    expect(timeText(entry({ timeBlock: "pm" }))).toBe("PM");
    const ordered = sortEntries([entry({ id: "pm", timeBlock: "pm" }), entry({ id: "next", date: "2026-10-08" }), entry({ id: "am", timeBlock: "am" })]);
    expect(ordered.map((e) => e.id)).toEqual(["am", "pm", "next"]);
  });
});

describe("hospital login change stamps", () => {
  it("says you when you made the change", () => {
    expect(changedBy("Kim@orcarehab.com", "portal", "kim@orcarehab.com")).toBe("you");
    expect(changedBy("him@orcarehab.com", "admin", "kim@orcarehab.com")).toBe("ORCA (him@orcarehab.com)");
    expect(changedBy(null, null, "kim@orcarehab.com")).toBeNull();
  });
});

describe("hospital logins", () => {
  it("names the system and finds what needs attention", async () => {
    const { loginsAt, systemLabel } = await import("./types");
    const { loginProblem } = await import("@/components/provider/FacilityLines");
    const login = (overrides: object) => ({ id: "l", username: "u", hasPassword: true, status: "active", ...overrides }) as never;
    expect(systemLabel({ system: "pcc" })).toBe("PointClickCare");
    expect(systemLabel({})).toBe("PointClickCare"); // older API: PCC only
    expect(systemLabel({ system: "other", systemName: "Fluency Flex" })).toBe("Fluency Flex");
    const f = (logins: unknown[] | undefined, pcc: unknown = null) => ({ logins, pcc }) as never;
    expect(loginsAt(f(undefined, login({})))).toHaveLength(1); // older API
    expect(loginProblem(f([]))).toBe("Add a login");
    expect(loginProblem(f([login({ system: "pcc" })]))).toBeNull();
    expect(loginProblem(f([login({ system: "pcc" }), login({ system: "other", systemName: "Fluency Flex", status: "disabled" })]))).toBe("Fluency Flex not working");
    expect(loginProblem(f([login({ system: "pcc", status: "disabled" })]))).toBe("PCC not working");
  });
});
