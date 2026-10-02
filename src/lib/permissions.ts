import type { PortalApp, PortalResource } from "@/types/portal";
import type { OrcaUser, PortalRole } from "@/types/user";
import { portalApps } from "@/config/apps";
import { portalResources } from "@/config/resources";

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
  return isActiveUser(user) && user.roles.some((role) => roles.includes(role));
}

export function isAdmin(user: OrcaUser | null | undefined): boolean {
  return hasRole(user, "ADMIN");
}

/** Admins manage people and roles across ORCA apps (/admin/people). */
export function canManagePeople(user: OrcaUser | null | undefined): boolean {
  return isAdmin(user);
}

/**
 * The Operations dashboard (/operations): provider documentation and scribe production.
 * Mirrors the ORCA API's dashboard.read permission (ADMIN for now); the API enforces it too.
 */
export function canViewOperations(user: OrcaUser | null | undefined): boolean {
  return isAdmin(user);
}

/** HR staff and admins can review job applicants and résumés (/hr). */
export function canManageApplicants(user: OrcaUser | null | undefined): boolean {
  return hasRole(user, "HR", "ADMIN");
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
  return hasRole(user, ...app.allowedRoles);
}

/** Apps `user` is authorized to see, in their configured order. */
export function getVisibleApps(user: OrcaUser | null | undefined): PortalApp[] {
  return portalApps.filter((app) => canAccessApp(user, app));
}

/** Whether `user` may see `resource`'s card. Unset/empty `allowedRoles` = everyone. */
export function canSeeResource(
  user: OrcaUser | null | undefined,
  resource: PortalResource,
): boolean {
  if (!isActiveUser(user)) return false;
  if (!resource.allowedRoles || resource.allowedRoles.length === 0) return true;
  return hasRole(user, ...resource.allowedRoles);
}

/** Resources `user` may see, in their configured order. */
export function getVisibleResources(
  user: OrcaUser | null | undefined,
): PortalResource[] {
  return portalResources.filter((resource) => canSeeResource(user, resource));
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
