import { formatCount, formatPercent } from "@/lib/operations/format";
import type { ProviderDashboard } from "@/types/operations";
import { MetricStrip } from "../ui";

/** Four headline numbers. No overall completion % without coverage: status coverage is shown instead. */
export function ProviderSummary({ data }: { data: ProviderDashboard }) {
  const sum = (k: "completedNotes" | "outstandingNotes") => data.providers.reduce((a, p) => a + p[k], 0);
  const cov = data.meta.statusCoverage;
  return (
    <MetricStrip
      items={[
        { label: "Expected notes", value: formatCount(cov.expectedNotes) },
        { label: "Completed notes", value: formatCount(sum("completedNotes")) },
        { label: "Outstanding notes", value: formatCount(sum("outstandingNotes")) },
        {
          label: "Status coverage",
          value: formatPercent(cov.classifiedPercent),
          note: cov.unknownStatusNotes > 0 ? `${formatCount(cov.unknownStatusNotes)} notes have unknown status` : "All notes have a known status",
        },
      ]}
    />
  );
}
