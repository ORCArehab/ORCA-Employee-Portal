import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { getCurrentUser } from "@/lib/auth";
import { isOrcaApiConfigured } from "@/lib/orcaApi";
import { canViewOwnSchedule } from "@/lib/permissions";
import { addDays, dayLabel, ENTRY_TYPE_LABELS, entryTime, groupByDay, isIsoDate, today, weekLabel, weekStart } from "@/lib/schedule";
import { getMySchedule, type MySchedule, type ScheduleEntry, type ScheduleFacility } from "@/lib/scheduleApi";

export const metadata: Metadata = { title: "My Schedule" };

const navButton =
  "inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-orca-navy-700 transition hover:bg-orca-navy-800/5 hover:text-orca-navy-900";

/** Badge colors by kind of entry: facilities neutral, coverage gold, time away muted. */
const BADGE: Record<ScheduleEntry["type"], string> = {
  facility: "bg-orca-navy-800/5 text-orca-navy-800",
  coverage: "bg-orca-gold-400/20 text-orca-navy-900",
  admin: "bg-orca-sky-400/15 text-orca-navy-800",
  clinic: "bg-orca-sky-400/15 text-orca-navy-800",
  pto: "bg-orca-navy-800/10 text-muted-foreground",
  off: "bg-orca-navy-800/10 text-muted-foreground",
};

function facilityAddress(f: ScheduleFacility) {
  const cityState = [f.address.city, f.address.state].filter(Boolean).join(", ");
  return [f.address.line1, cityState].filter(Boolean).join(", ");
}

function EntryCard({ entry, schedule }: { entry: ScheduleEntry; schedule: MySchedule }) {
  const facility = entry.facilityId ? schedule.facilities.find((f) => f.id === entry.facilityId) : undefined;
  const covering = entry.coveringStaffId ? schedule.coveredStaff.find((s) => s.id === entry.coveringStaffId) : undefined;
  const away = entry.type === "pto" || entry.type === "off";
  const address = facility ? facilityAddress(facility) : "";

  return (
    <li className={`rounded-xl border border-border p-3 sm:p-4 ${away ? "bg-orca-sky-050" : "bg-surface"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${BADGE[entry.type]}`}>{ENTRY_TYPE_LABELS[entry.type]}</span>
        <span className="text-sm font-medium text-orca-navy-700">{entryTime(entry)}</span>
      </div>
      {/* Without a facility the badge already says what it is (Admin, Clinic, PTO, Off). */}
      {facility && (
        <p className="mt-1.5 font-semibold text-orca-navy-900">
          {facility.name}
          {facility.abbreviation && <span className="ml-1.5 text-sm font-normal text-muted-foreground">({facility.abbreviation})</span>}
        </p>
      )}
      {covering && <p className="mt-0.5 text-sm text-orca-navy-700">Covering for {covering.displayName}</p>}
      {address && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${facility!.name}, ${address}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-start gap-1 text-sm text-muted-foreground hover:text-orca-navy-900"
        >
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{address}</span>
        </a>
      )}
      {entry.notes && <p className="mt-1.5 whitespace-pre-line text-sm text-orca-navy-700">{entry.notes}</p>}
    </li>
  );
}

function Message({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-semibold text-orca-navy-900">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

/**
 * A provider's own schedule, read-only: "where am I supposed to be this week?"
 * ?week=YYYY-MM-DD (any day of the week) opens that week.
 */
export default async function MySchedulePage({ searchParams }: PageProps<"/schedule">) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  // Not a provider: the page doesn't exist for them (the API refuses them too).
  if (!canViewOwnSchedule(user)) notFound();

  const { week } = await searchParams;
  const now = today();
  const start = weekStart(isIsoDate(week) ? week : now);
  const thisWeek = weekStart(now);

  let schedule: MySchedule | null = null;
  let failed = false;
  if (isOrcaApiConfigured()) {
    try {
      schedule = await getMySchedule(start, addDays(start, 6));
    } catch (error) {
      failed = true;
      console.error("[schedule] could not load my schedule", { error: String(error) });
    }
  }

  const weekHref = (s: string) => (s === thisWeek ? "/schedule" : `/schedule?week=${s}`);

  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">My Schedule</h1>
        <p className="mt-2 text-sm text-muted-foreground">Where you&apos;re scheduled, day by day. Set by Operations.</p>
        <BrandAccent className="mt-4" />
      </header>

      <nav aria-label="Week" className="mb-6 flex flex-wrap items-center gap-2">
        <Link href={weekHref(addDays(start, -7))} className={navButton} aria-label="Previous week">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
        {start === thisWeek ? (
          <span className={`${navButton} pointer-events-none opacity-50`} aria-disabled="true">
            This week
          </span>
        ) : (
          <Link href="/schedule" className={navButton}>
            This week
          </Link>
        )}
        <Link href={weekHref(addDays(start, 7))} className={navButton} aria-label="Next week">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <h2 className="ml-1 text-base font-semibold text-orca-navy-900 sm:ml-2 sm:text-lg">{weekLabel(start)}</h2>
      </nav>

      {!isOrcaApiConfigured() ? (
        <Message title="Not available yet">The schedule service isn&apos;t configured for this portal.</Message>
      ) : failed || !schedule ? (
        <Message title="Your schedule couldn't be loaded">Please try again in a moment. If it keeps happening, contact IT Support.</Message>
      ) : !schedule.linked ? (
        <Message title="Your schedule isn't connected yet">
          Your ORCA account isn&apos;t linked to your provider record, so there&apos;s nothing to show. Ask Operations or HR to link it.
        </Message>
      ) : (
        <>
          {schedule.assignments.length === 0 && (
            <p className="mb-4 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              Nothing is scheduled for you this week.
            </p>
          )}
          <ol className="space-y-5">
            {groupByDay(schedule.assignments, start).map(({ date, entries }) => {
              const label = dayLabel(date);
              const isToday = date === now;
              return (
                <li key={date} aria-current={isToday ? "date" : undefined}>
                  <h3 className="mb-2 flex items-baseline gap-2 text-sm">
                    <span className={`font-semibold ${isToday ? "text-orca-navy-900" : "text-orca-navy-800"}`}>{label.weekday}</span>
                    <span className="text-muted-foreground">{label.date}</span>
                    {isToday && <span className="rounded-full bg-orca-gold-400/25 px-2 py-0.5 text-xs font-semibold text-orca-navy-900">Today</span>}
                  </h3>
                  {entries.length > 0 ? (
                    <ul className="space-y-2">
                      {entries.map((entry) => (
                        <EntryCard key={entry.id} entry={entry} schedule={schedule} />
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-xl border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground">Nothing scheduled</p>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}
