import Link from "next/link";
import { formatCount, formatDecimal } from "@/lib/operations/format";
import { periodLabel, type Granularity } from "@/lib/operations/periods";
import type { PeriodProduction, ProductionSeries } from "@/types/operations";
import { OpsTable, muted, type Column } from "../ui";

const LABELS: Record<Granularity, string> = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

export function parseGranularity(value: string | string[] | undefined, options: Granularity[], fallback: Granularity): Granularity {
  return typeof value === "string" && (options as string[]).includes(value) ? (value as Granularity) : fallback;
}

/** Production by work date as a plain table (no charts). The period switch is a link (?period=). */
export function ProductionTable({
  series,
  scope,
  granularity,
  options,
  basePath,
}: {
  series: ProductionSeries;
  scope: { from: string | null; to: string | null };
  granularity: Granularity;
  options: Granularity[];
  basePath: string;
}) {
  const rows = [...series[granularity]].reverse(); // most recent first
  const columns: Column<PeriodProduction>[] = [
    {
      key: "period",
      header: granularity === "daily" ? "Day" : granularity === "weekly" ? "Week" : "Month",
      render: (p) => {
        const { label, partial } = periodLabel(p.period, granularity, scope);
        return (
          <>
            {label}
            {partial ? <span className={muted}> · partial</span> : null}
          </>
        );
      },
    },
    { key: "notes", header: "Notes produced", align: "right", render: (p) => formatCount(p.notesProduced) },
    { key: "consults", header: "Consults", align: "right", render: (p) => formatCount(p.consults) },
    { key: "followUps", header: "Follow-ups", align: "right", render: (p) => formatCount(p.followUps) },
    { key: "hours", header: "Hours", align: "right", render: (p) => formatDecimal(p.hoursWorked) },
    { key: "rate", header: "Notes / hour", align: "right", render: (p) => formatDecimal(p.notesPerHour) },
    { key: "uploaded", header: "Uploaded", align: "right", render: (p) => formatCount(p.notesUploaded) },
  ];
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="Period" className="inline-flex overflow-hidden rounded-lg border border-border bg-surface">
          {options.map((g) => (
            <Link
              key={g}
              href={`${basePath}?period=${g}`}
              scroll={false}
              aria-current={g === granularity ? "true" : undefined}
              className={`px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 [&+&]:border-l [&+&]:border-border ${
                g === granularity ? "bg-orca-navy-900 text-white" : "text-orca-navy-700 hover:bg-orca-navy-800/5"
              }`}
            >
              {LABELS[g]}
            </Link>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">By work date, most recent first</span>
      </div>
      <OpsTable caption={`${LABELS[granularity]} production`} columns={columns} rows={rows} rowKey={(p) => p.period} empty="No production in this period." />
    </div>
  );
}
