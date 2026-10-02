import type { Metadata } from "next";
import { DataFreshness } from "@/components/operations/DataFreshness";
import { LoadError } from "@/components/operations/LoadError";
import { OperationsTabs } from "@/components/operations/OperationsTabs";
import { ProductionTable, parseGranularity } from "@/components/operations/scribes/ProductionTable";
import { ScopeLine } from "@/components/operations/scribes/ScopeLine";
import { ScribeSummary } from "@/components/operations/scribes/ScribeSummary";
import { ScribeTable } from "@/components/operations/scribes/ScribeTable";
import { OpsHeader, Section } from "@/components/operations/ui";
import { load } from "@/lib/operations/load";
import { requireOperationsUser } from "@/lib/operationsAccess";
import { getScribeDashboard } from "@/lib/operationsApi";

export const metadata: Metadata = { title: "Scribes · Operations" };

export default async function OperationsScribesPage({ searchParams }: PageProps<"/operations/scribes">) {
  await requireOperationsUser();
  const period = parseGranularity((await searchParams).period, ["weekly", "monthly"], "weekly");
  const result = await load("scribe dashboard", () => getScribeDashboard());
  return (
    <div>
      <OpsHeader
        title="Scribe production"
        description="What scribes produced and uploaded, by work date."
        aside={result.ok ? <DataFreshness fetchedAt={result.data.meta.source.fetchedAt} timezone={result.data.meta.timezone} dataset="scribes" returnTo="/operations/scribes" /> : undefined}
      />
      <OperationsTabs />
      {!result.ok ? (
        <LoadError status={result.status} what="Scribe production" />
      ) : (
        <>
          <ScopeLine meta={result.data.meta} />
          <ScribeSummary totals={result.data.totals} />
          <Section title="Scribes" note="Listed alphabetically. Notes uploaded is upload activity and is not compared with notes produced: uploads can be for work produced on earlier dates.">
            <ScribeTable data={result.data} />
          </Section>
          <Section title="Production over time">
            <ProductionTable
              series={result.data.production}
              scope={{ from: result.data.meta.scope.historyStartsOn, to: result.data.meta.scope.dataThrough }}
              granularity={period}
              options={["weekly", "monthly"]}
              basePath="/operations/scribes"
            />
          </Section>
        </>
      )}
    </div>
  );
}
