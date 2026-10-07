import "server-only";
import { orcaApiRequestAsUser } from "@/lib/orcaApi";
import type { MyFacilities, MyPccAccess, MySchedule } from "./types";

/**
 * The signed-in provider's own schedule, facilities and PCC logins, from the ORCA API. The API
 * finds everything through the person's linked staff record; nothing here sends a staff id.
 */

export const getMySchedule = (from: string, to: string) =>
  orcaApiRequestAsUser<MySchedule>(`/v1/schedule/me?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);

export const getMyFacilities = () => orcaApiRequestAsUser<MyFacilities>("/v1/my/facilities");

export type PccChange = Partial<{ username: string | null; password: string | null; loginMethod: string; loginMethodDetail: string | null; notes: string | null }>;

const json = (method: string, body: unknown): RequestInit => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export const addMyPcc = (facilityId: string, change: PccChange) =>
  orcaApiRequestAsUser<{ access: MyPccAccess }>("/v1/my/facility-access", json("POST", { facilityId, ...change }));

export const updateMyPcc = (id: string, change: PccChange) =>
  orcaApiRequestAsUser<{ changed: string[]; access: MyPccAccess }>(`/v1/my/facility-access/${encodeURIComponent(id)}`, json("PATCH", change));

/** The ORCA API records the reveal on the facility and the provider before answering. */
export const revealMyPcc = (id: string) =>
  orcaApiRequestAsUser<{ password: string }>(`/v1/my/facility-access/${encodeURIComponent(id)}/reveal`, { method: "POST" }).then((r) => r.password);
