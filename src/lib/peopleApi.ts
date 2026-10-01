import "server-only";
import { orcaApiRequestAsUser } from "@/lib/orcaApi";
import type { PortalRole } from "@/types/user";

/**
 * Admin routes of the ORCA API: the people who can sign in to ORCA apps and
 * their roles. The API requires the signed-in person to hold ADMIN and
 * records them on every change; callers check canManagePeople(user) first.
 */

export interface Person {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  active: boolean;
  roles: string[];
  lastSignInAt: string | null;
  createdAt: string;
}

export interface RoleDefinition {
  key: PortalRole;
  label: string;
  description: string;
}

function request<T>(path: string, init?: RequestInit) {
  return orcaApiRequestAsUser<T>(`/v1/admin${path}`, init);
}

const json = (body: unknown): RequestInit => ({
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

export function listPeople(search?: string) {
  const query = search ? `?${new URLSearchParams({ q: search })}` : "";
  return request<{ people: Person[] }>(`/people${query}`);
}

export function listRoles() {
  return request<{ roles: RoleDefinition[] }>("/roles");
}

export function addPerson(email: string, name: string | null) {
  return request<{ person: Person }>("/people", { method: "POST", ...json({ email, name }) });
}

export function setPersonActive(id: string, active: boolean) {
  return request<{ changed: boolean }>(`/people/${encodeURIComponent(id)}`, { method: "PATCH", ...json({ active }) });
}

export function grantRole(id: string, role: PortalRole) {
  return request<{ changed: boolean }>(`/people/${encodeURIComponent(id)}/roles/${role}`, { method: "PUT" });
}

export function revokeRole(id: string, role: PortalRole) {
  return request<{ changed: boolean }>(`/people/${encodeURIComponent(id)}/roles/${role}`, { method: "DELETE" });
}
