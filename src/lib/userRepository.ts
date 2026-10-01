import "server-only";
import type { OrcaUser, PortalRole } from "@/types/user";
import { PORTAL_ROLES } from "@/types/user";
import { resolveRolesForEmail } from "@/lib/authorization";
import { OrcaApiError, isOrcaApiConfigured, orcaApiRequest } from "@/lib/orcaApi";

export interface GoogleSignInProfile {
  googleSubjectId: string;
  email: string;
  name: string;
  image: string | null;
  /** The Google ID token from this sign-in, which the ORCA API verifies itself. */
  idToken: string | undefined;
}

/** The ORCA API's user token for this session. Stored only in the encrypted session cookie. */
export interface ApiSession {
  token: string;
  expiresAt: string;
  /** When the token and roles were last fetched (ms since epoch). */
  refreshedAt: number;
}

export type SignInOutcome =
  | { ok: true; user: OrcaUser; apiSession: ApiSession | null }
  | { ok: false; reason: "disabled" | "conflict" | "unavailable" };

export type RefreshOutcome = { user: OrcaUser; apiSession: ApiSession } | "signed-out" | "unavailable";

/**
 * Where ORCA's employee records and roles come from. `signIn` runs once per
 * Google sign-in (see the signIn callback in src/auth.ts); `refresh` runs
 * periodically during a session to pick up role changes.
 */
export interface UserRepository {
  signIn(profile: GoogleSignInProfile): Promise<SignInOutcome>;
  refresh(session: ApiSession, current: OrcaUser): Promise<RefreshOutcome>;
}

interface ApiPerson {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  active: boolean;
  roles: string[];
  createdAt: string;
}

interface ApiSessionResponse {
  person: ApiPerson;
  token: string;
  expiresAt: string;
}

function toOrcaUser(person: ApiPerson, googleSubjectId: string, fallbackImage: string | null): OrcaUser {
  return {
    id: person.id,
    googleSubjectId,
    email: person.email,
    name: person.name ?? person.email,
    image: person.imageUrl ?? fallbackImage,
    // Ignore any role this portal doesn't know about yet rather than failing.
    roles: person.roles.filter((role): role is PortalRole => (PORTAL_ROLES as readonly string[]).includes(role)),
    active: person.active,
    createdAt: person.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

function toApiSession(response: ApiSessionResponse): ApiSession {
  return { token: response.token, expiresAt: response.expiresAt, refreshedAt: Date.now() };
}

/** People and roles from the ORCA API — the same records every ORCA app shares. */
class OrcaApiUserRepository implements UserRepository {
  async signIn(profile: GoogleSignInProfile): Promise<SignInOutcome> {
    if (!profile.idToken) return { ok: false, reason: "unavailable" };
    try {
      const response = await orcaApiRequest<ApiSessionResponse>("/v1/identity/sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken: profile.idToken }),
      });
      return {
        ok: true,
        user: toOrcaUser(response.person, profile.googleSubjectId, profile.image),
        apiSession: toApiSession(response),
      };
    } catch (error) {
      if (error instanceof OrcaApiError && error.status === 403) return { ok: false, reason: "disabled" };
      if (error instanceof OrcaApiError && error.status === 409) return { ok: false, reason: "conflict" };
      console.error("[auth] ORCA API sign-in failed", { error: String(error) });
      return { ok: false, reason: "unavailable" };
    }
  }

  async refresh(session: ApiSession, current: OrcaUser): Promise<RefreshOutcome> {
    try {
      const response = await orcaApiRequest<ApiSessionResponse>("/v1/identity/sessions/refresh", {
        method: "POST",
        userToken: session.token,
      });
      return {
        user: toOrcaUser(response.person, current.googleSubjectId, current.image),
        apiSession: toApiSession(response),
      };
    } catch (error) {
      // 401: deactivated, or signed in too long ago. Either way the session is over.
      if (error instanceof OrcaApiError && error.status === 401) return "signed-out";
      console.error("[auth] ORCA API session refresh failed", { error: String(error) });
      return "unavailable";
    }
  }
}

/**
 * Local-development fallback when the ORCA API isn't configured: roles come
 * from ADMIN_EMAILS / HR_EMAILS and nothing is persisted. HR and admin pages
 * can't load data in this mode, since there's no API to load it from.
 */
class EnvDerivedUserRepository implements UserRepository {
  async signIn(profile: GoogleSignInProfile): Promise<SignInOutcome> {
    const now = new Date().toISOString();
    return {
      ok: true,
      user: {
        id: profile.googleSubjectId,
        googleSubjectId: profile.googleSubjectId,
        email: profile.email,
        name: profile.name,
        image: profile.image,
        roles: resolveRolesForEmail(profile.email),
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      apiSession: null,
    };
  }

  async refresh(): Promise<RefreshOutcome> {
    return "unavailable";
  }
}

export const userRepository: UserRepository = isOrcaApiConfigured()
  ? new OrcaApiUserRepository()
  : new EnvDerivedUserRepository();
