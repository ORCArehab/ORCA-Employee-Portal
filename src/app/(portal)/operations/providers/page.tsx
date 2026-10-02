import type { Metadata } from "next";
import { DataFreshness } from "@/components/operations/DataFreshness";
import { LoadError } from "@/components/operations/LoadError";
import { OperationsTabs } from "@/components/operations/OperationsTabs";
import { ProviderTable } from "@/components/operations/providers/ProviderTable";
import { OpsHeader } from "@/components/operations/ui";
import { load } from "@/lib/operations/load";
import { requireOperationsUser } from "@/lib/operationsAccess";
import { getProviderDashboard } from "@/lib/operationsApi";

export const metadata: Metadata = { title: "Providers · Operations" };

export default async function OperationsProvidersPage({ searchParams }: PageProps<"/operations/providers">) {
  await requireOperationsUser();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const result = await load("provider dashboard", () => getProviderDashboard());
  return (
    <div>
      <OpsHeader
        title="Providers"
        description="Ordered by outstanding notes, then oldest outstanding batch."
        aside={result.ok ? <DataFreshness fetchedAt={result.data.meta.source.fetchedAt} timezone={result.data.meta.timezone} dataset="providers" returnTo="/operations/providers" /> : undefined}
      />
      <OperationsTabs />
      {!result.ok ? <LoadError status={result.status} what="Providers" /> : <ProviderTable data={result.data} q={q} searchAction="/operations/providers" />}
    </div>
  );
}
