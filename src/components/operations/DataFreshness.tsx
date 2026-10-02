import { RefreshCw } from "lucide-react";
import { refreshOperations } from "@/app/(portal)/operations/actions";
import { formatDateTime } from "@/lib/operations/format";

/** "Tracker read …" plus a Refresh button that re-reads the source spreadsheet (bypasses the API cache). */
export function DataFreshness({ fetchedAt, timezone, dataset, returnTo }: { fetchedAt: string; timezone: string; dataset: "providers" | "scribes"; returnTo: string }) {
  return (
    <>
      <span>Tracker read {formatDateTime(fetchedAt, timezone)}</span>
      <form action={refreshOperations}>
        <input type="hidden" name="dataset" value={dataset} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-orca-navy-700 hover:bg-orca-navy-800/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Refresh
        </button>
      </form>
    </>
  );
}
