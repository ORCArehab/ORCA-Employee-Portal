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

function getAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
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
 * Derives a role for a newly (or re-)authenticated employee. There's no
 * user database yet (see userRepository.ts), so this is intentionally the
 * only place role assignment happens — a real implementation would look
 * the user up instead of recomputing this from env config every sign-in.
 */
export function resolveRoleForEmail(email: string): PortalRole {
  return getAdminEmails().has(email.toLowerCase()) ? "ADMIN" : "EMPLOYEE";
}
