import { hasLimitedCoverage } from "@/lib/operations/attention";
import { formatCount, formatPercent } from "@/lib/operations/format";
import type { ProviderEntry } from "@/types/operations";
import { CautionDot, caution, muted } from "../ui";

/** Completion rate that always carries its coverage context. */
export function CompletionCell({ provider: p }: { provider: ProviderEntry }) {
  if (p.completionRate === null) {
    return (
      <span className={muted} title={p.expectedNotes > 0 ? "No notes have a known upload status" : "No expected notes"}>
        —
      </span>
    );
  }
  const limited = hasLimitedCoverage(p);
  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={limited ? `Based on ${formatCount(p.classifiedNotes)} of ${formatCount(p.expectedNotes)} notes with a known status (${formatPercent(p.statusCoveragePercent)} coverage)` : undefined}
    >
      {formatPercent(p.completionRate)}
      {limited ? (
        <>
          <CautionDot />
          <span className="sr-only">based on incomplete status coverage</span>
        </>
      ) : null}
    </span>
  );
}

export function CoverageCell({ provider: p }: { provider: ProviderEntry }) {
  if (p.statusCoveragePercent === null) return <span className={muted}>—</span>;
  return <span className={hasLimitedCoverage(p) ? caution : undefined}>{formatPercent(p.statusCoveragePercent)}</span>;
}
