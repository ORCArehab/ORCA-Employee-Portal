import "server-only";
import { orcaApiRequestAsUser } from "@/lib/orcaApi";
import type { ProviderDashboard, ScribeDashboard } from "@/types/operations";

/**
 * Operations dashboard routes of the ORCA API. The API requires the signed-in person to
 * hold the dashboard.read permission (ADMIN for now) and checks it on every request;
 * callers check canViewOperations(user) first. Responses are aggregated metrics only.
 */
function query(refresh?: boolean) {
  return refresh ? "?refresh=true" : "";
}

export function getProviderDashboard(opts: { refresh?: boolean } = {}) {
  return orcaApiRequestAsUser<ProviderDashboard>(`/v1/dashboard/providers${query(opts.refresh)}`);
}

export function getScribeDashboard(opts: { refresh?: boolean } = {}) {
  return orcaApiRequestAsUser<ScribeDashboard>(`/v1/dashboard/scribes${query(opts.refresh)}`);
}
