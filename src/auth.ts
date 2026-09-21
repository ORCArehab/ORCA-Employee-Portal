import "server-only";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { GoogleProfile } from "next-auth/providers/google";
import { isVerifiedOrcaWorkspaceAccount, getAllowedGoogleDomain } from "@/lib/authorization";
import { userRepository } from "@/lib/userRepository";
import type { OrcaUser } from "@/types/user";

const allowedDomain = getAllowedGoogleDomain();

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
    async signIn({ profile }) {
      const googleProfile = profile as GoogleProfile | undefined;
      const allowed = isVerifiedOrcaWorkspaceAccount({
        email: googleProfile?.email,
        emailVerified: googleProfile?.email_verified,
        hostedDomain: googleProfile?.hd,
      });

      // TODO(audit-log): once a logging store exists, record
      // { email, allowed, at: new Date().toISOString() } here for both
      // outcomes. Never log tokens, secrets, or the raw profile object.
      if (!allowed) {
        console.warn("[auth] rejected sign-in: not an ORCA Workspace account");
      }

      return allowed;
    },
    async jwt({ token, profile, trigger }) {
      if (trigger === "signIn" && profile) {
        const googleProfile = profile as GoogleProfile;
        const orcaUser = await userRepository.upsertFromGoogleSignIn({
          googleSubjectId: googleProfile.sub,
          email: googleProfile.email,
          name: googleProfile.name,
          image: googleProfile.picture ?? null,
        });
        token.orcaUser = orcaUser;
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
