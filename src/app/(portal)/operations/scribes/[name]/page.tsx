import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DataFreshness } from "@/components/operations/DataFreshness";
import { LoadError } from "@/components/operations/LoadError";
import { ProductionTable, parseGranularity } from "@/components/operations/scribes/ProductionTable";
import { ScopeLine } from "@/components/operations/scribes/ScopeLine";
import { EmptyState, Notice, OpsHeader, Section } from "@/components/operations/ui";
import { EMPTY, formatCount, formatDate, formatDecimal, scribeHref } from "@/lib/operations/format";
import type { Granularity } from "@/lib/operations/periods";
import { load } from "@/lib/operations/load";
import { requireOperationsUser } from "@/lib/operationsAccess";
import { getScribeDashboard } from "@/lib/operationsApi";
import type { ScribeDashboard, ScribeEntry } from "@/types/operations";

export const metadata: Metadata = { title: "Scribe · Operations" };

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const back = (
  <Link href="/operations/scribes" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-orca-navy-900">
    <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Scribes
  </Link>
);

export default async function OperationsScribePage({ params, searchParams }: PageProps<"/operations/scribes/[name]">) {
  await requireOperationsUser();
  const name = safeDecode((await params).name);
  const period = parseGranularity((await searchParams).period, ["daily", "weekly", "monthly"], "weekly");
  const result = await load("scribe dashboard", () => getScribeDashboard());
  const scribe = result.ok ? result.data.scribes.find((s) => s.name === name) : undefined;
  return (
    <div>
      <OpsHeader
        back={back}
        title={name}
        aside={result.ok ? <DataFreshness fetchedAt={result.data.meta.source.fetchedAt} timezone={result.data.meta.timezone} dataset="scribes" returnTo={scribeHref(name)} /> : undefined}
      />
      {!result.ok ? (
        <LoadError status={result.status} what="This scribe" />
      ) : scribe ? (
        <ScribeDetail scribe={scribe} data={result.data} period={period} />
      ) : (
        <EmptyState title="Scribe not found">No scribe named “{name}” appears in Daily Production for the reporting period.</EmptyState>
      )}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-border py-2 first:border-0" title={hint}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-orca-navy-900 tabular-nums">{value}</dd>
    </div>
  );
}

function Panel({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface px-5 py-4">
      <h2 className="mb-1 text-sm font-semibold text-orca-navy-700">{title}</h2>
      <dl>{children}</dl>
      {note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
    </section>
  );
}

function ScribeDetail({ scribe: s, data, period }: { scribe: ScribeEntry; data: ScribeDashboard; period: Granularity }) {
  const d = data.meta.definitions;
  return (
    <>
      <ScopeLine meta={data.meta} />
      {s.warningCount > 0 ? <Notice>Some source data needs review.</Notice> : null}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Panel title="Production">
          <Stat label="Notes produced" value={formatCount(s.notesProduced)} hint={d.notesProduced} />
          <Stat label="Consults" value={formatCount(s.consults)} />
          <Stat label="Follow-ups" value={formatCount(s.followUps)} />
        </Panel>
        <Panel title="Time" note="Hours include every session, including upload-only sessions.">
          <Stat label="Hours worked" value={formatDecimal(s.hoursWorked)} hint={d.hoursWorked} />
          <Stat label="Notes per hour" value={formatDecimal(s.notesPerHour)} hint={d.notesPerHour} />
          <Stat label="Sessions" value={formatCount(s.sessions)} />
          <Stat label="Work days" value={formatCount(s.workDays)} />
        </Panel>
        <Panel title="Upload activity" note="Uploads can be for notes produced on earlier dates, so they are shown separately and not compared with production.">
          <Stat label="Notes uploaded" value={formatCount(s.notesUploaded)} hint={d.notesUploaded} />
        </Panel>
        <Panel title="Facilities">
          <Stat label="Facilities worked" value={formatCount(s.facilitiesWorked)} hint={d.facilitiesWorked} />
          <Stat label="Multi-facility entries" value={formatCount(s.multiFacilityEntries)} hint={d.multiFacilityEntries} />
          <Stat label="Notes not attributed to a facility" value={formatCount(s.unallocatedFacilityNotes)} />
          <Stat label="Active" value={s.firstWorkDate && s.lastWorkDate ? `${formatDate(s.firstWorkDate)} – ${formatDate(s.lastWorkDate)}` : EMPTY} />
        </Panel>
      </div>
      <Section title="Production over time">
        <ProductionTable
          series={s.production}
          scope={{ from: data.meta.scope.historyStartsOn, to: data.meta.scope.dataThrough }}
          granularity={period}
          options={["daily", "weekly", "monthly"]}
          basePath={scribeHref(s.name)}
        />
      </Section>
    </>
  );
}
