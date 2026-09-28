import "server-only";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canManageApplicants } from "@/lib/permissions";

/**
 * Gate for every HR page, action, and route. Signed-out users go to sign-in;
 * signed-in employees without HR access get a 404, so the HR area's
 * existence isn't confirmed to them.
 */
export async function requireHrUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!canManageApplicants(user)) notFound();
  return user;
}
