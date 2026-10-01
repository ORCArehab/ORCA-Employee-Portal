/**
 * Roles that can be granted on top of being an employee (every active ORCA
 * account is one). Mirrors the `roles` table in the ORCA Careers API, which
 * is where roles are granted — see /admin/people. See src/lib/permissions.ts
 * for how these gate access, rather than scattering role checks through the
 * app.
 */
export const PORTAL_ROLES = ["ADMIN", "HR", "IT", "PROVIDER", "SCRIBE"] as const;

export type PortalRole = (typeof PORTAL_ROLES)[number];

/**
 * ORCA's view of an authenticated employee — "is this person an active
 * employee and what can they access", as distinct from what Google
 * authentication alone tells us ("who is this person").
 *
 * The ORCA Careers API is the source of truth for this record (see
 * src/lib/userRepository.ts).
 */
export interface OrcaUser {
  /** Stable internal id: the person's id in the ORCA API (the Google subject id when it isn't configured). */
  id: string;
  /** Google's stable, non-reassignable subject identifier ("sub" claim). */
  googleSubjectId: string;
  email: string;
  name: string;
  image: string | null;
  /** Empty for an employee with no extra roles. */
  roles: PortalRole[];
  /** False = authenticated with Google but not (or no longer) an active ORCA employee. */
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
