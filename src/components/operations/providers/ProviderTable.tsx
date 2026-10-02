import Link from "next/link";
import { Search } from "lucide-react";
import { ATTENTION_CRITERIA } from "@/lib/operations/attention";
import { EMPTY, formatCount, formatDays, providerHref } from "@/lib/operations/format";
import type { ProviderDashboard, ProviderEntry } from "@/types/operations";
import { CautionDot, OpsTable, linkClass, muted, type Column } from "../ui";
import { CompletionCell, CoverageCell } from "./CompletionCell";

/** Providers in the API's order (outstanding notes, then oldest outstanding age). Search is a GET form. */
export function ProviderTable({ data, q = "", searchAction }: { data: ProviderDashboard; q?: string; searchAction?: string }) {
  const needle = q.trim().toLowerCase();
  const rows = needle ? data.providers.filter((p) => p.name.toLowerCase().includes(needle)) : data.providers;
  const d = data.meta.definitions;
  const columns: Column<ProviderEntry>[] = [
    {
      key: "name",
      header: "Provider",
      render: (p) => (
        <span className="inline-flex items-center gap-1.5">
          <Link className={linkClass} href={providerHref(p.name)}>
            {p.name}
          </Link>
          {p.dataStatus === "incomplete" ? <CautionDot label="Some source data needs review" /> : null}
        </span>
      ),
    },
    { key: "completion", header: "Completion", align: "right", description: d.completionRate, render: (p) => <CompletionCell provider={p} /> },
    { key: "coverage", header: "Status coverage", align: "right", description: d.statusCoveragePercent, render: (p) => <CoverageCell provider={p} /> },
    { key: "outstanding", header: "Outstanding", align: "right", render: (p) => formatCount(p.outstandingNotes) },
    { key: "batches", header: "Outstanding batches", align: "right", description: d.outstandingBatches, render: (p) => formatCount(p.outstandingBatches) },
    {
      key: "oldest",
      header: "Oldest",
      align: "right",
      description: "Age of the oldest outstanding batch (days since visit date)",
      render: (p) => (p.oldestOutstandingDays === null ? <span className={muted}>{EMPTY}</span> : formatDays(p.oldestOutstandingDays)),
    },
  ];

  return (
    <div>
      {searchAction ? (
        <form method="get" action={searchAction} role="search" className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative">
            <label htmlFor="q" className="sr-only">Search providers</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search providers"
              className="w-64 max-w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-3 text-sm text-orca-navy-900 focus-visible:border-orca-navy-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
            />
          </div>
          <button type="submit" className="rounded-xl bg-orca-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-orca-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500">
            Search
          </button>
          {q ? (
            <Link href={searchAction} className="rounded-xl px-3 py-2 text-sm font-medium text-orca-navy-700 hover:bg-orca-navy-800/5">
              Clear
            </Link>
          ) : null}
          <span className="ml-auto text-xs text-muted-foreground">
            {rows.length === data.providers.length ? `${rows.length} providers` : `${rows.length} of ${data.providers.length} providers`}
          </span>
        </form>
      ) : null}
      <OpsTable caption="Provider documentation status" columns={columns} rows={rows} rowKey={(p) => p.name} empty={`No providers match “${q}”.`} />
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <CautionDot /> Completion describes only notes with a known status; the dot marks status coverage below {ATTENTION_CRITERIA.lowCoveragePercent}%.
      </p>
    </div>
  );
}
