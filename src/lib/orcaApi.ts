import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";

/**
 * Shared client for the ORCA Careers API (Cloud Run), which holds job
 * applications and is the source of truth for people and roles. Server-only:
 * neither the API key nor the user token may reach the browser.
 *
 * Every signed-in request sends two credentials: this portal's API key, and
 * the user token the API issued when this person signed in (kept only in the
 * encrypted Auth.js session cookie — see src/auth.ts). The API checks the
 * person's roles itself on every request.
 */

export class OrcaApiError extends Error {
  /** The API's own explanation (its `error` field), when it gave one. Safe to show: never a secret. */
  constructor(
    readonly status: number,
    readonly apiMessage: string | null = null,
  ) {
    super(`ORCA API responded ${status}`);
  }
}

export function isOrcaApiConfigured(): boolean {
  return !!process.env.CAREERS_API_URL?.trim() && !!process.env.CAREERS_API_KEY?.trim();
}

/** The signed-in person's user token, read from the session cookie. Null if signed out. */
export const getOrcaApiToken = cache(async (): Promise<string | null> => {
  const requestHeaders = await headers();
  // The cookie name depends on whether the site is served over https; try both.
  for (const secureCookie of [true, false]) {
    const token = await getToken({ req: { headers: requestHeaders }, secret: process.env.AUTH_SECRET, secureCookie });
    if (token) return token.orcaApi?.token ?? null;
  }
  return null;
});

export async function orcaApiRequest<T>(
  path: string,
  init: RequestInit & { userToken?: string | null } = {},
): Promise<T> {
  const baseUrl = process.env.CAREERS_API_URL?.trim().replace(/\/+$/, "");
  const key = process.env.CAREERS_API_KEY?.trim();
  if (!baseUrl || !key) throw new OrcaApiError(503);

  const { userToken, ...rest } = init;
  const res = await fetch(`${baseUrl}${path}`, {
    ...rest,
    headers: {
      ...rest.headers,
      authorization: `Bearer ${key}`,
      ...(userToken ? { "x-orca-user-token": userToken } : {}),
    },
    // Applicant and access data is always fetched fresh and never cached.
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
    throw new OrcaApiError(res.status, typeof body?.error === "string" ? body.error : null);
  }
  return (await res.json()) as T;
}

/** A request as the signed-in person. Throws OrcaApiError(401) if there's no session. */
export async function orcaApiRequestAsUser<T>(path: string, init: RequestInit = {}): Promise<T> {
  const userToken = await getOrcaApiToken();
  if (!userToken) throw new OrcaApiError(401);
  return orcaApiRequest<T>(path, { ...init, userToken });
}
