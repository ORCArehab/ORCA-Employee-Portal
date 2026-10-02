import type { Metadata } from "next";
import { DataFreshness } from "@/components/operations/DataFreshness";
import { LoadError } from "@/components/operations/LoadError";
import { OperationsTabs } from "@/components/operations/OperationsTabs";
import { AttentionList } from "@/components/operations/providers/AttentionList";
import { ProviderSummary } from "@/components/operations/providers/ProviderSummary";
import { ProviderTable } from "@/components/operations/providers/ProviderTable";
import { OpsHeader, Section } from "@/components/operations/ui";
import { load } from "@/lib/operations/load";
import { requireOperationsUser } from "@/lib/operationsAccess";
import { getProviderDashboard } from "@/lib/operationsApi";

export const metadata: Metadata = { title: "Operations" };

export default async function OperationsOverviewPage() {
  await requireOperationsUser();
  const result = await load("provider dashboard", () => getProviderDashboard());
  return (
    <div>
      <OpsHeader
        title="Operations"
        description="How provider documentation is doing, and who needs attention."
        aside={result.ok ? <DataFreshness fetchedAt={result.data.meta.source.fetchedAt} timezone={result.data.meta.timezone} dataset="providers" returnTo="/operations" /> : undefined}
      />
      <OperationsTabs />
      {!result.ok ? (
        <LoadError status={result.status} what="Provider documentation" />
      ) : (
        <>
          <ProviderSummary data={result.data} />
          <AttentionList providers={result.data.providers} />
          <Section title="Providers">
            <ProviderTable data={result.data} />
          </Section>
        </>
      )}
    </div>
  );
}
