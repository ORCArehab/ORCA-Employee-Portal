"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/adminAccess";
import { OrcaApiError } from "@/lib/orcaApi";
import { addPerson, grantRole, listRoles, revokeRole, setPersonActive } from "@/lib/peopleApi";

export type AccessFormState = { status: "idle" | "saved" | "error"; message?: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorMessage(error: unknown, fallback: string): AccessFormState {
  if (error instanceof OrcaApiError && error.status === 409) {
    return { status: "error", message: "ORCA must keep at least one active admin." };
  }
  console.error("[admin] access change failed", { error: String(error) });
  return { status: "error", message: fallback };
}

export async function addPersonAction(_previous: AccessFormState, formData: FormData): Promise<AccessFormState> {
  // Server Actions are reachable by direct POST, so authorize here too — not just on the page.
  await requireAdminUser();

  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim() || null;
  if (!email) return { status: "error", message: "Enter an email address." };

  try {
    await addPerson(email, name);
  } catch (error) {
    if (error instanceof OrcaApiError && error.status === 409) {
      return { status: "error", message: "That person is already in the list." };
    }
    if (error instanceof OrcaApiError && error.status === 400) {
      return { status: "error", message: "Enter an ORCA Rehab Google Workspace email address." };
    }
    return errorMessage(error, "Couldn't add that person. Please try again.");
  }

  revalidatePath("/admin/people");
  return { status: "saved" };
}

/**
 * Saves one person's roles and active status. Sends only what changed, so an
 * unchanged role isn't re-granted and the audit log stays accurate.
 */
export async function updateAccessAction(_previous: AccessFormState, formData: FormData): Promise<AccessFormState> {
  await requireAdminUser();

  const id = String(formData.get("personId") ?? "");
  if (!UUID.test(id)) return { status: "error", message: "Invalid request." };

  const currentRoles = new Set(formData.getAll("currentRoles").map(String));
  const wantedRoles = new Set(formData.getAll("roles").map(String));
  const wasActive = formData.get("wasActive") === "true";
  const active = formData.get("active") === "on";

  try {
    // Every role the API defines, including ones the portal doesn't use itself (e.g. HIM).
    const { roles } = await listRoles();
    const roleKeys = roles.map((role) => role.key);
    // Grants first, so moving ADMIN between people never briefly leaves none.
    for (const role of roleKeys) {
      if (wantedRoles.has(role) && !currentRoles.has(role)) await grantRole(id, role);
    }
    if (active !== wasActive) await setPersonActive(id, active);
    for (const role of roleKeys) {
      if (!wantedRoles.has(role) && currentRoles.has(role)) await revokeRole(id, role);
    }
  } catch (error) {
    revalidatePath("/admin/people");
    return errorMessage(error, "Couldn't save every change. Please review and try again.");
  }

  revalidatePath("/admin/people");
  return { status: "saved" };
}
