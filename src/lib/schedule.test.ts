import { describe, expect, it } from "vitest";
import type { ScheduleEntry } from "@/lib/scheduleApi";
import { addDays, clockTime, entryTime, groupByDay, isIsoDate, today, weekLabel, weekStart } from "./schedule";

const entry = (over: Partial<ScheduleEntry>): ScheduleEntry => ({ id: "x", date: "2026-10-12", type: "facility", facilityId: "f", coveringStaffId: null, timeBlock: "am", startTime: null, endTime: null, notes: null, ...over });

describe("my schedule helpers", () => {
  it("find Monday-start weeks", () => {
    expect(weekStart("2026-10-18")).toBe("2026-10-12");
    expect(weekStart("2026-10-12")).toBe("2026-10-12");
    expect(addDays("2026-12-28", 7)).toBe("2027-01-04");
    expect(weekLabel("2026-09-28")).toBe("Sep 28 – Oct 4, 2026");
  });
  it("know today in ORCA's timezone", () => {
    expect(today(new Date("2026-10-13T05:00:00Z"))).toBe("2026-10-12");
  });
  it("reject bad week parameters", () => {
    expect(isIsoDate("2026-13-01")).toBe(false);
    expect(isIsoDate("<script>")).toBe(false);
  });
  it("describe times plainly", () => {
    expect(entryTime(entry({}))).toBe("Morning (AM)");
    expect(entryTime(entry({ timeBlock: "all_day" }))).toBe("All day");
    expect(entryTime(entry({ timeBlock: "custom", startTime: "09:00", endTime: "13:30" }))).toBe("9:00 AM – 1:30 PM");
    expect(clockTime("00:15")).toBe("12:15 AM");
  });
  it("lay out all seven days, keeping several entries a day", () => {
    const days = groupByDay([entry({ id: "a" }), entry({ id: "b", timeBlock: "pm" }), entry({ id: "c", date: "2026-10-14" }), entry({ id: "z", date: "2026-10-30" })], "2026-10-12");
    expect(days).toHaveLength(7);
    expect(days[0]!.entries.map((e) => e.id)).toEqual(["a", "b"]);
    expect(days[2]!.entries.map((e) => e.id)).toEqual(["c"]);
    expect(days.flatMap((d) => d.entries).some((e) => e.id === "z")).toBe(false);
  });
});
