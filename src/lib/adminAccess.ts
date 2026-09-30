import "server-only";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canManagePeople } from "@/lib/permissions";

/**
 * Gate for every admin page and action. Signed-out users go to sign-in;
 * signed-in employees without ADMIN get a 404, so the admin area's existence
 * isn't confirmed to them.
 */
export async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!canManagePeople(user)) notFound();
  return user;
}
