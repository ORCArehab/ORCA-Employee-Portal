import "server-only";
import type { PortalRole } from "@/types/user";

function normalizeDomain(domain: string): string {
  return domain.trim().toLowerCase().replace(/^@/, "");
}

/** The single Google Workspace domain this portal accepts sign-ins from. */
export function getAllowedGoogleDomain(): string | null {
  const raw = process.env.ALLOWED_GOOGLE_DOMAIN;
  return raw ? normalizeDomain(raw) : null;
}

function getEmailList(name: "ADMIN_EMAILS" | "HR_EMAILS" | "PROVIDER_EMAILS"): Set<string> {
  return new Set(
    (process.env[name] ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Server-side Google Workspace domain check. Must be called with claims
 * from a verified Google ID token/OIDC profile (never a value the browser
 * supplied directly) — this is the actual security boundary. The `hd`
 * OAuth param set on the provider is a UX nicety only; it does not enforce
 * anything on its own since a client could omit or alter it.
 */
export function isVerifiedOrcaWorkspaceAccount(claims: {
  email?: string | null;
  emailVerified?: boolean | null;
  hostedDomain?: string | null;
}): boolean {
  const allowedDomain = getAllowedGoogleDomain();
  // Fail closed: if the domain isn't configured, nobody is authorized.
  if (!allowedDomain) return false;

  if (!claims.email || claims.emailVerified !== true) return false;

  const emailDomain = claims.email.split("@")[1]?.toLowerCase();
  const hostedDomain = claims.hostedDomain?.toLowerCase();

  return emailDomain === allowedDomain && hostedDomain === allowedDomain;
}

/**
 * Roles for local development without the ORCA API (see the fallback in
 * userRepository.ts). With the API configured, roles are granted at
 * /admin/people instead and these lists are unused.
 */
export function resolveRolesForEmail(email: string): PortalRole[] {
  const normalized = email.toLowerCase();
  const roles: PortalRole[] = [];
  if (getEmailList("ADMIN_EMAILS").has(normalized)) roles.push("ADMIN");
  if (getEmailList("HR_EMAILS").has(normalized)) roles.push("HR");
  if (getEmailList("PROVIDER_EMAILS").has(normalized)) roles.push("PROVIDER");
  return roles;
}
