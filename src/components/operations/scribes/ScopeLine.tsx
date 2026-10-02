import { formatDateRange } from "@/lib/operations/format";
import type { ScribeDashboard } from "@/types/operations";

/** States exactly what the scribe data covers, so no one assumes earlier history exists. */
export function ScopeLine({ meta }: { meta: ScribeDashboard["meta"] }) {
  const { historyStartsOn, dataThrough } = meta.scope;
  return (
    <p className="-mt-2 mb-5 text-sm text-muted-foreground">
      Reporting period {historyStartsOn && dataThrough ? formatDateRange(historyStartsOn, dataThrough) : "—"} · Source: Daily Production tab. Earlier history and former
      scribes are not included yet.
    </p>
  );
}
