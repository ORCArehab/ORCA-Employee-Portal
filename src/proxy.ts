import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Renamed from `middleware.ts` in Next.js 16 — same behavior, new file and
// export name. See node_modules/next/dist/docs/.../proxy.md.

const PUBLIC_PATHS = ["/sign-in", "/access-denied"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/**
 * Optimistic, cookie-only auth check that runs before every protected
 * route renders — this is what stops someone from reaching a portal page
 * just by navigating directly to its URL while signed out. Session
 * validity itself is verified by Auth.js (the JWT is decrypted/verified
 * here, not just checked for presence); role/authorization data is
 * re-confirmed server-side wherever it matters (see getCurrentUser() and
 * the (portal) layout) since Proxy should stay cheap and not hit a
 * database.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Everything except API routes, Next internals, and files with an
  // extension (favicons, /brand/* images and video, etc).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
