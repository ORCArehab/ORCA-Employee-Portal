# ORCA Rehab Employee Portal

The internal hub for ORCA Rehab employees — a launch point for ORCA's apps
(NOVA, Gmail, Google Drive/Chat/Meet, QuickBooks, RingCentral, PCC,
Claimocity), company resources, and announcements. Destined for
`portal.orcarehab.com`.

Authenticated with Google Workspace (ORCA accounts only) via Auth.js.
Backend integrations for the individual apps (Drive, QuickBooks, etc.)
aren't built yet — they're external shortcuts today.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Auth.js v5](https://authjs.dev) (`next-auth@beta`) — Google OAuth/OIDC
- [lucide-react](https://lucide.dev) + [simple-icons](https://simpleicons.org) for iconography

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values — see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to
`/sign-in` until Google OAuth is configured — see **Authentication** below.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Structure

```
src/
  app/
    layout.tsx              root layout: fonts, metadata
    globals.css              design tokens (ORCA brand colors, fonts)
    sign-in/, access-denied/  public pages (outside the auth wall)
    api/auth/[...nextauth]/   Auth.js route handler
    (portal)/                route group sharing the sidebar/header shell —
                              everything here requires authentication
      layout.tsx              server-side auth check + wraps pages in <PortalShell>
      page.tsx                 dashboard ("/")
      apps/                     full app directory
      resources/ ...            resources hub + placeholder sub-pages
      directory/, it-support/, nova/, settings/, profile/, announcements/
  components/
    layout/                  Sidebar, Header, PortalShell (mobile drawer)
    dashboard/               AppCard, ResourceCard, AnnouncementsPanel
    ui/                      OrcaMark, BrandAccent, PlaceholderPage
  config/
    apps.ts                  ORCA app cards — name, description, href, icon,
                              optional allowedRoles
    resources.ts             resource cards
    nav.ts                   sidebar nav items
    site.ts                  site-wide constants
  lib/
    auth.ts                  getCurrentUser() — server-side session accessor
    authorization.ts         Workspace domain verification (+ dev-only env roles)
    userRepository.ts        employee record + roles, from the ORCA API
    orcaApi.ts               shared ORCA API client (API key + user token)
    careersApi.ts / peopleApi.ts  HR and admin routes of the ORCA API
    permissions.ts           canAccessApp / isAdmin / canAccessNOVA, etc.
    announcements.ts         getAnnouncements() — stub, returns []. Swap for
                              a real fetch once there's a data source.
  types/
    portal.ts                 PortalApp, PortalResource, NavItem, …
    user.ts                   OrcaUser, PortalRole — the employee record shape
    next-auth.d.ts             Session/JWT type augmentation
  auth.ts                    Auth.js config (providers, callbacks, session)
  proxy.ts                   route protection (Next 16's renamed middleware)
public/brand/                cropped/exported ORCA logo marks + animated mark
assets/                      original source assets (untouched)
```

Adding a new app or resource card means adding one entry to
`src/config/apps.ts` or `src/config/resources.ts` — no new markup.

## Authentication

Google Workspace SSO via [Auth.js v5](https://authjs.dev), restricted to the
`ALLOWED_GOOGLE_DOMAIN` Workspace domain. Flow:

```
Employee → /sign-in → Continue with Google → Google authenticates
  → src/auth.ts signIn callback verifies the account's Workspace domain
    server-side (Google's verified `hd` claim — never a client-supplied
    value) → session issued only if authorized → dashboard
```

An authenticated Google account that isn't part of the Workspace domain
never gets a session — it's redirected to `/access-denied` instead.

**People and roles live in the ORCA API** (the ORCA Careers API service),
shared with the onboarding app. After the domain check, the signIn callback
sends Google's ID token to the API, which verifies it again and returns the
person's roles and an API **user token**. That token stays in the encrypted
session cookie only — it's never copied into the session the browser can
read — and goes with this portal's `CAREERS_API_KEY` on every API call. The
API enforces roles itself on every request.

Sessions re-fetch roles every 10 minutes (`ROLE_REFRESH_INTERVAL_MS` in
`src/auth.ts`), so navigation reflects role changes quickly; someone
deactivated is signed out at the next refresh. Sign-in fails closed with a
specific message on `/access-denied` if the API refuses or can't be reached.

**Managing roles**: admins use **People & Roles** (`/admin/people`) to grant
roles, add someone before their first sign-in, or turn off access. The first
admins are seeded by the API's `BOOTSTRAP_ADMIN_EMAILS`.

Without `CAREERS_API_URL`/`CAREERS_API_KEY` (local development), roles fall
back to `ADMIN_EMAILS` / `HR_EMAILS` / `PROVIDER_EMAILS` and HR/admin pages
show "not configured".

**Roles**: every active account is an employee; `ADMIN`, `HR`, `IT`,
`PROVIDER`, `SCRIBE` grant more (`src/types/user.ts`, mirroring the API's
`roles` table). A person can hold several. Gate access with the helpers in
`src/lib/permissions.ts` (`canAccessApp`, `isAdmin`,
`canAccessNOVA`/`canAccessQuickBooks`/`canAccessPCC`) rather than scattering
`user.email === "..."` checks around the app. `PortalApp.allowedRoles` lets
a dashboard app card be restricted to specific roles; unset means visible
to every active employee (today's default for all apps).
`PortalResource.allowedRoles` does the same for Resources cards — e.g.
**Provider Onboarding**, shown only to `PROVIDER`s once `ONBOARDING_APP_URL`
is set (the onboarding app checks the role again when they sign in).

**Route protection**: `src/proxy.ts` (Next.js 16 renamed `middleware.ts` →
`proxy.ts`) redirects unauthenticated requests to `/sign-in` before any
protected page renders. `(portal)/layout.tsx` does a second, independent
server-side check — defense in depth, not just the proxy layer.

See `.env.example` for required environment variables and the setup
instructions given alongside this codebase for exact Google Cloud/Workspace
configuration steps.

## Branding

`assets/ORCA_ICON.png` is the original combined logo (icon + wordmark).
`assets/ORCAvid.mp4` is an animated version of the icon mark, used via the
`OrcaMark` component (sidebar logo swapped back to the static crop per
request; the animated mark still appears on the dashboard header).
`public/brand/` holds crops/exports generated from these for the UI. Brand
colors in `globals.css` (`--orca-navy-*`, `--orca-gold-*`, `--orca-sky-*`)
were sampled directly from the logo.

## Not implemented yet (by design)

- **A real database.** See **Authentication** above — `UserRepository` is
  the seam for when one exists.
- **Audit/security logging.** `src/auth.ts` has clearly marked
  `TODO(audit-log)` spots (sign-in, sign-out, access-denied) that currently
  just `console.log`/`console.warn` — swap for a real log store later.
  Never log tokens, secrets, or PHI.
- **Real data / integrations.** Announcements, the employee directory, IT
  ticketing, and the NOVA/Drive/QuickBooks/RingCentral/PCC/Claimocity
  integrations are placeholders or external shortcuts — no backend API
  calls to any of them yet.

No fake employee, patient, or company data is used anywhere — placeholders
say so explicitly instead of inventing content.
