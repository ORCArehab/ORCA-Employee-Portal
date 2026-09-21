import "server-only";
import { cache } from "react";
import { auth } from "@/auth";
import type { OrcaUser } from "@/types/user";

/**
 * Server-side accessor for the current ORCA employee, backed by the
 * Auth.js session (see src/auth.ts). Every caller already treats the
 * result as possibly-null and async, from before real auth existed.
 *
 * Wrapped in React's cache() so calling it from both the (portal) layout
 * and a page in the same request reads the session once, not twice.
 */
export const getCurrentUser = cache(async (): Promise<OrcaUser | null> => {
  const user = (await auth())?.user;
  // Defensive: only trust sessions our own jwt/session callbacks
  // populated with ORCA's user fields, not just any Auth.js session.
  if (!user?.id || !user.role) return null;

  return {
    id: user.id,
    googleSubjectId: user.googleSubjectId,
    email: user.email ?? "",
    name: user.name ?? "",
    image: user.image ?? null,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
});
