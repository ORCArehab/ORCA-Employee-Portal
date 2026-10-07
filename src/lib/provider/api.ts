import "server-only";
import { orcaApiRequestAsUser } from "@/lib/orcaApi";
import type { MyFacilities, HospitalLogin, MySchedule } from "./types";

/**
 * The signed-in provider's own schedule, facilities and hospital logins, from the ORCA API. The API
 * finds everything through the person's linked staff record; nothing here sends a staff id.
 */

export const getMySchedule = (from: string, to: string) =>
  orcaApiRequestAsUser<MySchedule>(`/v1/schedule/me?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);

export const getMyFacilities = () => orcaApiRequestAsUser<MyFacilities>("/v1/my/facilities");

export type PccChange = Partial<{ system: "pcc" | "other"; systemName: string; username: string | null; password: string | null; loginMethod: string; loginMethodDetail: string | null; notes: string | null }>;

const json = (method: string, body: unknown): RequestInit => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export const addMyPcc = (facilityId: string, change: PccChange) =>
  orcaApiRequestAsUser<{ access: HospitalLogin }>("/v1/my/facility-access", json("POST", { facilityId, ...change }));

export const updateMyPcc = (id: string, change: PccChange) =>
  orcaApiRequestAsUser<{ changed: string[]; access: HospitalLogin }>(`/v1/my/facility-access/${encodeURIComponent(id)}`, json("PATCH", change));

/** Deletes my own login and its password; the ORCA API records it. */
export const deleteMyLogin = (id: string) => orcaApiRequestAsUser<{ deleted: true }>(`/v1/my/facility-access/${encodeURIComponent(id)}`, { method: "DELETE" });

/** The ORCA API records the reveal on the facility and the provider before answering. */
export const revealMyPcc = (id: string) =>
  orcaApiRequestAsUser<{ password: string }>(`/v1/my/facility-access/${encodeURIComponent(id)}/reveal`, { method: "POST" }).then((r) => r.password);
