import "server-only";
import { OrcaApiError, isOrcaApiConfigured } from "@/lib/orcaApi";

export type LoadResult<T> = { ok: true; data: T } | { ok: false; status: number };

/** Runs an ORCA API call and turns failures into a status for <LoadError>. Never logs response data. */
export async function load<T>(what: string, fn: () => Promise<T>): Promise<LoadResult<T>> {
  if (!isOrcaApiConfigured()) return { ok: false, status: 503 };
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    const status = error instanceof OrcaApiError ? error.status : 0;
    console.error(`[operations] could not load ${what}`, { status });
    return { ok: false, status };
  }
}
