import Link from "next/link";
import { AlertCircle, Building2, CalendarDays, ChevronRight } from "lucide-react";
import { getMyFacilities, getMySchedule } from "@/lib/provider/api";
import { addDays, today, weekLabel, weekStart } from "@/lib/provider/week";
import { assignmentText, needsPcc } from "./FacilityLines";
import { LOAD_FAILED, NOT_LINKED } from "./ProviderNotice";
import { WeekSchedule } from "./WeekSchedule";

/** Dashboard panels for providers: this week's schedule and My Facilities. Each loads on its own. */
export async function ProviderPanels() {
  const start = weekStart(today());
  const [schedule, facilities] = await Promise.all([
    getMySchedule(start, addDays(start, 6)).catch((error) => (console.error("[dashboard] schedule load failed", { error: String(error) }), null)),
    getMyFacilities().catch((error) => (console.error("[dashboard] facilities load failed", { error: String(error) }), null)),
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <section className="min-w-0 rounded-2xl border border-border bg-surface p-5 lg:col-span-3">
        <PanelHeading icon={<CalendarDays className="h-4.5 w-4.5 text-orca-gold-500" aria-hidden="true" />} title="This week" detail={weekLabel(start)} href="/my-schedule" link="Full schedule" />
        {!schedule ? <Muted>{LOAD_FAILED}</Muted> : !schedule.linked ? <Muted>{NOT_LINKED}</Muted> : <WeekSchedule schedule={schedule} start={start} compact />}
      </section>

      <section className="min-w-0 rounded-2xl border border-border bg-surface p-5 lg:col-span-2">
        <PanelHeading icon={<Building2 className="h-4.5 w-4.5 text-orca-gold-500" aria-hidden="true" />} title="My facilities" href="/my-facilities" link="PCC logins" />
        {!facilities ? (
          <Muted>{LOAD_FAILED}</Muted>
        ) : !facilities.linked ? (
          <Muted>{NOT_LINKED}</Muted>
        ) : facilities.facilities.length === 0 ? (
          <Muted>You aren&apos;t assigned to any facilities yet.</Muted>
        ) : (
          <ul className="divide-y divide-border">
            {facilities.facilities.map((f) => (
              <li key={f.id}>
                <Link href={`/my-facilities#facility-${f.id}`} className="group flex items-center gap-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-sm font-medium text-orca-navy-900 group-hover:text-orca-navy-700">{f.name}</span>
                    <span className="block text-xs text-muted-foreground">{assignmentText(f)}</span>
                  </span>
                  {needsPcc(f) && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orca-gold-050 px-2 py-0.5 text-[11px] font-medium text-orca-navy-900">
                      <AlertCircle className="h-3 w-3" aria-hidden="true" /> {f.pcc?.status === "disabled" ? "PCC not working" : "Add PCC login"}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PanelHeading({ icon, title, detail, href, link }: { icon: React.ReactNode; title: string; detail?: string; href: string; link: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-orca-navy-900">{title}</h2>
        {detail && <span className="text-xs text-muted-foreground">{detail}</span>}
      </div>
      <Link href={href} className="text-xs font-medium text-orca-navy-700 hover:text-orca-navy-900">
        {link}
      </Link>
    </div>
  );
}

const Muted = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-muted-foreground">{children}</p>;
