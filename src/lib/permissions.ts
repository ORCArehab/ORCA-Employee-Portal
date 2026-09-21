import type { PortalApp } from "@/types/portal";
import type { OrcaUser, PortalRole } from "@/types/user";
import { portalApps } from "@/config/apps";

/**
 * Central place for "is this person allowed to..." checks. Add new
 * helpers here rather than comparing `user.email`/`user.role` inline
 * elsewhere in the app.
 */

export function isActiveUser(
  user: OrcaUser | null | undefined,
): user is OrcaUser {
  return !!user && user.active;
}

export function hasRole(
  user: OrcaUser | null | undefined,
  ...roles: PortalRole[]
): boolean {
  return isActiveUser(user) && roles.includes(user.role);
}

export function isAdmin(user: OrcaUser | null | undefined): boolean {
  return hasRole(user, "ADMIN");
}

/**
 * Whether `user` may see/open `app`. This only gates the dashboard/apps UI
 * — it is not a substitute for the destination application enforcing its
 * own access control once it has a real integration.
 */
export function canAccessApp(
  user: OrcaUser | null | undefined,
  app: PortalApp,
): boolean {
  if (!isActiveUser(user)) return false;
  if (!app.allowedRoles || app.allowedRoles.length === 0) return true;
  return app.allowedRoles.includes(user.role);
}

/** Apps `user` is authorized to see, in their configured order. */
export function getVisibleApps(user: OrcaUser | null | undefined): PortalApp[] {
  return portalApps.filter((app) => canAccessApp(user, app));
}

function findApp(id: string): PortalApp | undefined {
  return portalApps.find((app) => app.id === id);
}

// Named convenience checks for specific apps, per the shape future call
// sites will want (e.g. gating a nav link before an app has its own page).
export function canAccessNOVA(user: OrcaUser | null | undefined): boolean {
  const app = findApp("nova");
  return !!app && canAccessApp(user, app);
}

export function canAccessQuickBooks(user: OrcaUser | null | undefined): boolean {
  const app = findApp("quickbooks");
  return !!app && canAccessApp(user, app);
}

export function canAccessPCC(user: OrcaUser | null | undefined): boolean {
  const app = findApp("pcc");
  return !!app && canAccessApp(user, app);
}
