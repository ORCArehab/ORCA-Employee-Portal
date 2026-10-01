import "server-only";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { GoogleProfile } from "next-auth/providers/google";
import { isVerifiedOrcaWorkspaceAccount, getAllowedGoogleDomain } from "@/lib/authorization";
import { userRepository, type SignInOutcome } from "@/lib/userRepository";
import type { OrcaUser } from "@/types/user";

const allowedDomain = getAllowedGoogleDomain();

/**
 * How often a session re-fetches the person's roles (and a fresh ORCA API
 * token). Role changes show up in the portal's navigation within this long;
 * the API itself enforces them immediately.
 */
const ROLE_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

const SIGN_IN_ERRORS: Record<Extract<SignInOutcome, { ok: false }>["reason"], string> = {
  disabled: "AccountDisabled",
  conflict: "AccountConflict",
  unavailable: "SignInUnavailable",
};

/**
 * Hands the ORCA API's sign-in result from the signIn callback (which can
 * refuse with a specific message) to the jwt callback (which stores it).
 * Auth.js passes the same `account` object to both within one request, so a
 * WeakMap keyed on it needs no cleanup.
 */
const pendingSignIns = new WeakMap<object, Extract<SignInOutcome, { ok: true }>>();

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Lets Auth.js trust the incoming Host header to build callback/redirect
  // URLs — needed on Vercel and any non-localhost deployment. When AUTH_URL
  // is set (required in production — see .env.example), Auth.js ignores
  // the request's Host entirely and pins the origin to AUTH_URL instead
  // (see next-auth/lib/env.js: reqWithEnvURL rewrites the request origin
  // before this setting is even consulted), so trustHost only matters for
  // environments without AUTH_URL, like local dev and Vercel preview
  // deployments with per-deploy URLs.
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          // Least privilege: identity only. Do not add Drive/Gmail/Chat/
          // Calendar scopes here for future integrations — request those
          // separately, at the time those integrations are actually built.
          scope: "openid email profile",
          // UX only — pre-filters Google's account chooser to ORCA's
          // Workspace domain. NOT a security boundary: a client could
          // strip this param, which is exactly why the signIn callback
          // below re-validates the verified `hd` claim server-side.
          ...(allowedDomain ? { hd: allowedDomain } : {}),
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    // Conservative for an internal healthcare portal: re-authenticate
    // roughly once per workday rather than Auth.js's 30-day default.
    maxAge: 8 * 60 * 60,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/sign-in",
    // Both "Google auth ok but not an ORCA account" and other sign-in
    // errors land here; /access-denied reads `?error=` to tailor the copy.
    error: "/access-denied",
  },
  callbacks: {
    async signIn({ profile, account }) {
      const googleProfile = profile as GoogleProfile | undefined;
      const allowed = isVerifiedOrcaWorkspaceAccount({
        email: googleProfile?.email,
        emailVerified: googleProfile?.email_verified,
        hostedDomain: googleProfile?.hd,
      });

      // TODO(audit-log): once a logging store exists, record
      // { email, allowed, at: new Date().toISOString() } here for both
      // outcomes. Never log tokens, secrets, or the raw profile object.
      if (!allowed || !googleProfile || !account) {
        console.warn("[auth] rejected sign-in: not an ORCA Workspace account");
        return false;
      }

      // The ORCA API verifies the Google ID token again itself, then returns
      // this person's roles — or refuses if they've been deactivated.
      const outcome = await userRepository.signIn({
        googleSubjectId: googleProfile.sub,
        email: googleProfile.email,
        name: googleProfile.name,
        image: googleProfile.picture ?? null,
        idToken: account.id_token,
      });
      if (!outcome.ok) {
        console.warn("[auth] rejected sign-in", { reason: outcome.reason });
        return `/access-denied?error=${SIGN_IN_ERRORS[outcome.reason]}`;
      }

      pendingSignIns.set(account, outcome);
      return true;
    },
    async jwt({ token, account, trigger }) {
      if (trigger === "signIn" || trigger === "signUp") {
        const outcome = account ? pendingSignIns.get(account) : undefined;
        if (!outcome) throw new Error("Sign-in result missing");
        token.orcaUser = outcome.user;
        token.orcaApi = outcome.apiSession ?? undefined;
        return token;
      }

      // Pick up role changes, and end the session if the person was deactivated.
      if (token.orcaUser && token.orcaApi && Date.now() - token.orcaApi.refreshedAt > ROLE_REFRESH_INTERVAL_MS) {
        const result = await userRepository.refresh(token.orcaApi, token.orcaUser);
        if (result === "signed-out") return null;
        // "unavailable": keep the current token, which stays valid for hours, and retry next time.
        if (result !== "unavailable") {
          token.orcaUser = result.user;
          token.orcaApi = result.apiSession;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.orcaUser) {
        session.user = {
          ...session.user,
          ...(token.orcaUser as OrcaUser),
        };
      }
      return session;
    },
  },
  events: {
    // TODO(audit-log): swap these console calls for a real audit log once
    // one exists. Only identifiers/timestamps — never tokens or secrets.
    async signIn({ user }) {
      console.log("[auth] sign-in", { email: user.email, at: new Date().toISOString() });
    },
    async signOut() {
      console.log("[auth] sign-out", { at: new Date().toISOString() });
    },
  },
});
