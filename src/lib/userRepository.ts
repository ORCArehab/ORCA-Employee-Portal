import "server-only";
import type { OrcaUser } from "@/types/user";
import { resolveRoleForEmail } from "@/lib/authorization";

export interface GoogleSignInProfile {
  googleSubjectId: string;
  email: string;
  name: string;
  image: string | null;
}

/**
 * The seam for a real employee store. `upsertFromGoogleSignIn` is called
 * once per sign-in (see the `jwt` callback in src/auth.ts) and should
 * return the authoritative ORCA record for that person.
 */
export interface UserRepository {
  upsertFromGoogleSignIn(profile: GoogleSignInProfile): Promise<OrcaUser>;
}

/**
 * ORCA doesn't have a database yet, so this is intentionally the only
 * implementation. Nothing is persisted: every sign-in re-derives the same
 * deterministic role/active status from environment configuration
 * (ALLOWED_GOOGLE_DOMAIN via the signIn callback, ADMIN_EMAILS here).
 *
 * When a real database exists, write a second implementation of
 * UserRepository backed by it (e.g. Prisma) — findByGoogleSubjectId can do
 * a real lookup, upsertFromGoogleSignIn can do a real upsert — and swap it
 * in here. Nothing else in the app needs to change, since callers only
 * depend on this interface and the OrcaUser shape.
 */
class EnvDerivedUserRepository implements UserRepository {
  async upsertFromGoogleSignIn(profile: GoogleSignInProfile): Promise<OrcaUser> {
    const now = new Date().toISOString();
    return {
      id: profile.googleSubjectId,
      googleSubjectId: profile.googleSubjectId,
      email: profile.email,
      name: profile.name,
      image: profile.image,
      role: resolveRoleForEmail(profile.email),
      active: true,
      // Not persisted, so these reflect this sign-in rather than the
      // employee's real first-seen date — a real store would set
      // createdAt once and only bump updatedAt here.
      createdAt: now,
      updatedAt: now,
    };
  }
}

export const userRepository: UserRepository = new EnvDerivedUserRepository();
