import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DataFreshness } from "@/components/operations/DataFreshness";
import { LoadError } from "@/components/operations/LoadError";
import { EmptyState, Notice, OpsHeader } from "@/components/operations/ui";
import { hasLimitedCoverage } from "@/lib/operations/attention";
import { EMPTY, formatCount, formatDate, formatDays, formatPercent, providerHref } from "@/lib/operations/format";
import { load } from "@/lib/operations/load";
import { requireOperationsUser } from "@/lib/operationsAccess";
import { getProviderDashboard } from "@/lib/operationsApi";
import type { ProviderDashboard, ProviderEntry } from "@/types/operations";

export const metadata: Metadata = { title: "Provider · Operations" };

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const back = (
  <Link href="/operations/providers" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-orca-navy-900">
    <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Providers
  </Link>
);

export default async function OperationsProviderPage({ params }: PageProps<"/operations/providers/[name]">) {
  await requireOperationsUser();
  const name = safeDecode((await params).name);
  const result = await load("provider dashboard", () => getProviderDashboard());
  const provider = result.ok ? result.data.providers.find((p) => p.name === name) : undefined;
  return (
    <div>
      <OpsHeader
        back={back}
        title={name}
        aside={result.ok ? <DataFreshness fetchedAt={result.data.meta.source.fetchedAt} timezone={result.data.meta.timezone} dataset="providers" returnTo={providerHref(name)} /> : undefined}
      />
      {!result.ok ? (
        <LoadError status={result.status} what="This provider" />
      ) : provider ? (
        <ProviderDetail provider={provider} data={result.data} />
      ) : (
        <EmptyState title="Provider not found">No provider named “{name}” is in the current tracker.</EmptyState>
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

function ProviderDetail({ provider: p, data }: { provider: ProviderEntry; data: ProviderDashboard }) {
  const d = data.meta.definitions;
  return (
    <>
      {p.dataStatus === "incomplete" || p.warningCount > 0 ? (
        <Notice>
          Some source data needs review{p.dataStatus === "incomplete" ? " — part of this provider's tracker could not be read." : "."}
        </Notice>
      ) : null}
      {hasLimitedCoverage(p) ? (
        <Notice>
          Completion is based on {formatCount(p.classifiedNotes)} of {formatCount(p.expectedNotes)} notes that have a known upload status ({formatPercent(p.statusCoveragePercent)} status coverage).
        </Notice>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          title="Notes"
          note="Outstanding notes are explicitly marked not uploaded. Unknown-status notes have a blank or free-text upload status and count as neither completed nor outstanding."
        >
          <Stat label="Expected" value={formatCount(p.expectedNotes)} />
          <Stat label="Completed" value={formatCount(p.completedNotes)} />
          <Stat label="Outstanding" value={formatCount(p.outstandingNotes)} hint="Upload status is explicitly not uploaded" />
          <Stat label="Unknown status" value={formatCount(p.unknownStatusNotes)} hint={d.unknownStatusNotes} />
        </Panel>
        <Panel title="Completion" note="Completion rate describes notes with a known status. Status coverage describes how much of the expected workload has a known status.">
          <Stat label="Completion rate" value={formatPercent(p.completionRate)} hint={d.completionRate} />
          <Stat label="Status coverage" value={formatPercent(p.statusCoveragePercent)} hint={d.statusCoveragePercent} />
        </Panel>
        <Panel title="Backlog">
          <Stat label="Outstanding batches" value={formatCount(p.outstandingBatches)} hint={d.outstandingBatches} />
          <Stat
            label="Oldest outstanding"
            value={
              p.oldestOutstandingDays === null ? (
                EMPTY
              ) : (
                <>
                  {formatDays(p.oldestOutstandingDays)}
                  {p.oldestOutstandingVisitDate ? <span className="font-normal text-muted-foreground"> · visit {formatDate(p.oldestOutstandingVisitDate)}</span> : null}
                </>
              )
            }
          />
          <Stat label="Billing sheet backlog" value={`${formatCount(p.billingSheetBacklog)} batches`} />
          <Stat label="Facesheet backlog" value={`${formatCount(p.facesheetBacklog)} batches`} />
        </Panel>
        <Panel title="Volume">
          <Stat label="Consults" value={formatCount(p.consults)} />
          <Stat label="Follow-ups" value={formatCount(p.followUps)} />
        </Panel>
      </div>
    </>
  );
}
