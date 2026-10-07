import { CalendarOff } from "lucide-react";
import { entryTitle, sortEntries, timeText } from "@/lib/provider/format";
import type { MySchedule } from "@/lib/provider/types";
import { dayHeading, today, weekDays } from "@/lib/provider/week";

/**
 * One week of the signed-in provider's schedule, a row per day. `compact` (the dashboard) hides
 * notes and addresses. Days with nothing scheduled say so, so a blank day isn't mistaken for a gap
 * in the data.
 */
export function WeekSchedule({ schedule, start, compact = false }: { schedule: MySchedule; start: string; compact?: boolean }) {
  const facilities = new Map(schedule.facilities.map((f) => [f.id, f]));
  const covered = new Map(schedule.coveredStaff.map((s) => [s.id, s.displayName]));
  const entries = sortEntries(schedule.assignments);
  const now = today();

  return (
    <ol className="divide-y divide-border">
      {weekDays(start).map((day) => {
        const heading = dayHeading(day);
        const todays = entries.filter((e) => e.date === day);
        const isToday = day === now;
        return (
          <li key={day} className={`flex gap-4 py-3 ${isToday ? "-mx-3 rounded-xl bg-orca-sky-050 px-3" : ""}`}>
            <div className="w-16 shrink-0">
              <p className={`text-xs font-semibold uppercase tracking-wide ${isToday ? "text-orca-navy-900" : "text-muted-foreground"}`}>{heading.weekday}</p>
              <p className="text-sm text-orca-navy-900">{heading.day}</p>
              {isToday && <p className="text-[11px] font-medium text-orca-sky-500">Today</p>}
            </div>
            <div className="min-w-0 flex-1">
              {todays.length === 0 ? (
                <p className="pt-0.5 text-sm text-muted-foreground">Nothing scheduled</p>
              ) : (
                <ul className="space-y-2">
                  {todays.map((e) => {
                    const facility = e.facilityId ? facilities.get(e.facilityId) : undefined;
                    const away = e.type === "pto" || e.type === "off";
                    return (
                      <li key={e.id} className="min-w-0">
                        <p className={`flex flex-wrap items-baseline gap-x-2 text-sm font-medium ${away ? "text-muted-foreground" : "text-orca-navy-900"}`}>
                          {away && <CalendarOff className="h-3.5 w-3.5 self-center" aria-hidden="true" />}
                          <span className="break-words">{entryTitle(e, facility)}</span>
                          <span className="text-xs font-normal text-muted-foreground">{timeText(e)}</span>
                        </p>
                        {e.coveringStaffId && covered.get(e.coveringStaffId) && (
                          <p className="text-xs text-muted-foreground">Covering for {covered.get(e.coveringStaffId)}</p>
                        )}
                        {!compact && facility?.address.city && (
                          <p className="text-xs text-muted-foreground">{[facility.address.line1, facility.address.city].filter(Boolean).join(", ")}</p>
                        )}
                        {!compact && e.notes && <p className="mt-0.5 whitespace-pre-line text-xs text-muted-foreground">{e.notes}</p>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
