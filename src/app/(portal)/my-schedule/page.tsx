import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { LOAD_FAILED, NOT_LINKED, ProviderNotice } from "@/components/provider/ProviderNotice";
import { WeekSchedule } from "@/components/provider/WeekSchedule";
import { getCurrentUser } from "@/lib/auth";
import { hasRole } from "@/lib/permissions";
import { getMySchedule } from "@/lib/provider/api";
import type { MySchedule } from "@/lib/provider/types";
import { addDays, isIsoDate, today, weekLabel, weekStart } from "@/lib/provider/week";

export const metadata: Metadata = { title: "My Schedule" };

/** The signed-in provider's week (?week=YYYY-MM-DD, any day in it), Monday to Sunday. Read-only: ORCA's operations team keeps the schedule. */
export default async function MySchedulePage({ searchParams }: PageProps<"/my-schedule">) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!hasRole(user, "PROVIDER")) redirect("/");

  const { week } = await searchParams;
  const current = weekStart(today());
  const start = isIsoDate(week) ? weekStart(week) : current;
  let schedule: MySchedule | null = null;
  try {
    schedule = await getMySchedule(start, addDays(start, 6));
  } catch (error) {
    console.error("[my-schedule] load failed", { error: String(error) });
  }

  const nav = "inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-sm font-medium text-orca-navy-900 transition hover:border-orca-navy-700";
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">My Schedule</h1>
        <p className="mt-2 text-sm text-muted-foreground">Where you&apos;re scheduled each day. Questions about your schedule go to ORCA&apos;s operations team.</p>
        <BrandAccent className="mt-4" />
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-orca-navy-900">{weekLabel(start)}</h2>
        <div className="flex items-center gap-2">
          <Link href={`/my-schedule?week=${addDays(start, -7)}`} className={nav} aria-label="Previous week">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
          </Link>
          {start !== current && (
            <Link href="/my-schedule" className={nav}>
              This week
            </Link>
          )}
          <Link href={`/my-schedule?week=${addDays(start, 7)}`} className={nav} aria-label="Next week">
            Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {!schedule ? (
        <ProviderNotice>{LOAD_FAILED}</ProviderNotice>
      ) : !schedule.linked ? (
        <ProviderNotice>{NOT_LINKED}</ProviderNotice>
      ) : (
        <section className="rounded-2xl border border-border bg-surface px-5 py-2">
          <WeekSchedule schedule={schedule} start={start} />
        </section>
      )}
    </div>
  );
}
