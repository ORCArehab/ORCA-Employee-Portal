import Link from "next/link";
import { ATTENTION_CRITERIA, needsAttention } from "@/lib/operations/attention";
import { providerHref } from "@/lib/operations/format";
import type { ProviderEntry } from "@/types/operations";
import { Section } from "../ui";

export function AttentionList({ providers }: { providers: ProviderEntry[] }) {
  const { items, total } = needsAttention(providers);
  const c = ATTENTION_CRITERIA;
  return (
    <Section
      title="Needs attention"
      aside={total > items.length ? <span className="text-xs text-muted-foreground">Showing {items.length} of {total} · all providers below</span> : undefined}
      note={`Listed when a provider is among the ${c.topOutstandingCount} with the most outstanding notes, has an outstanding batch ${c.oldOutstandingDays}+ days old, has status coverage below ${c.lowCoveragePercent}%, or has source data that needs review. Ordered by outstanding notes.`}
    >
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing needs attention right now.</p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {items.map(({ provider, reasons }) => (
            <li key={provider.name}>
              <Link
                href={providerHref(provider.name)}
                className="flex flex-col gap-1 px-4 py-3 hover:bg-orca-navy-800/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="text-sm font-medium text-orca-navy-900 sm:w-56 sm:shrink-0">{provider.name}</span>
                <span className="flex flex-wrap gap-x-5 gap-y-1 text-sm tabular-nums">
                  {reasons.map((r) => (
                    <span key={r.kind} className={r.kind === "coverage" || r.kind === "source" ? "text-amber-800" : "text-muted-foreground"}>
                      {r.label}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
