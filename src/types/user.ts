/**
 * Roles ORCA supports today. Kept deliberately flat — see
 * src/lib/permissions.ts for how these gate access, rather than scattering
 * role checks through the app.
 */
export type PortalRole = "EMPLOYEE" | "PROVIDER" | "SCRIBE" | "ADMIN" | "IT";

/**
 * ORCA's view of an authenticated employee — "is this person an active
 * employee and what can they access", as distinct from what Google
 * authentication alone tells us ("who is this person").
 *
 * This is the schema a real database table would use. There's no database
 * yet (see src/lib/userRepository.ts for why and what replaces it), but
 * every caller already treats a user as this exact shape, so swapping in a
 * real store later doesn't touch call sites.
 */
export interface OrcaUser {
  /** Stable internal id. Today this is the Google subject id. */
  id: string;
  /** Google's stable, non-reassignable subject identifier ("sub" claim). */
  googleSubjectId: string;
  email: string;
  name: string;
  image: string | null;
  role: PortalRole;
  /** False = authenticated with Google but not (or no longer) an active ORCA employee. */
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
