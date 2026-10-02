import "server-only";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canViewOperations } from "@/lib/permissions";

/**
 * Gate for every Operations page and action. Signed-out users go to sign-in; signed-in
 * employees without access get a 404, so the area's existence isn't confirmed to them.
 * The ORCA API checks the same permission again on every request.
 */
export async function requireOperationsUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!canViewOperations(user)) notFound();
  return user;
}
