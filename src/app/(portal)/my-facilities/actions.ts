"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { OrcaApiError } from "@/lib/orcaApi";
import { hasRole } from "@/lib/permissions";
import { addMyPcc, deleteMyLogin, revealMyPcc, updateMyPcc, type PccChange } from "@/lib/provider/api";
import { LOGIN_METHODS } from "@/lib/provider/types";

export type PccFormState = { status: "idle" | "saved" | "error"; message?: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function explain(error: unknown, fallback: string): string {
  if (error instanceof OrcaApiError) {
    if (error.status === 401) return "Your session has ended. Sign in again.";
    if (error.apiMessage && [400, 403, 404, 409, 503].includes(error.status)) return error.apiMessage;
  }
  return fallback;
}

/**
 * Adds or changes one of the signed-in provider's own hospital logins (PointClickCare or another
 * system) at one of their facilities. Server
 * Actions are reachable by direct POST, so the role is checked here; the ORCA API checks again
 * (own record, assigned facility). The password is passed straight through and never logged.
 */
export async function savePccAccess(_previous: PccFormState, formData: FormData): Promise<PccFormState> {
  const user = await getCurrentUser();
  if (!hasRole(user, "PROVIDER")) return { status: "error", message: "Only providers can do this." };

  const accessId = String(formData.get("accessId") ?? "");
  const facilityId = String(formData.get("facilityId") ?? "");
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? ""); // never trimmed: spaces can be part of a password
  const loginMethod = String(formData.get("loginMethod") ?? "");
  const loginMethodDetail = String(formData.get("loginMethodDetail") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const system = formData.get("system") === "other" ? "other" : "pcc";
  const systemName = String(formData.get("systemName") ?? "").trim();
  if ((accessId && !UUID.test(accessId)) || (!accessId && !UUID.test(facilityId))) return { status: "error", message: "Invalid request." };
  if (!(LOGIN_METHODS as readonly string[]).includes(loginMethod)) return { status: "error", message: "Choose how you get your sign-in code." };

  if (system === "other" && !systemName) return { status: "error", message: "Name the system, for example Workspace / Fluency Flex." };
  const change: PccChange = { username: username || null, loginMethod, loginMethodDetail: loginMethodDetail || null, notes: notes || null };
  if (system === "other") change.systemName = systemName;
  if (!accessId) change.system = system;
  if (password) change.password = password;
  if (!accessId && !username && !password) return { status: "error", message: "Enter your username or password." };

  try {
    if (accessId) {
      const result = await updateMyPcc(accessId, change);
      revalidatePath("/my-facilities");
      revalidatePath("/");
      return { status: "saved", message: result.changed.length ? "Saved. ORCA can see what you changed and when." : "No changes." };
    }
    await addMyPcc(facilityId, change);
  } catch (error) {
    console.error("[my-facilities] login save failed", { status: error instanceof OrcaApiError ? error.status : "unknown" });
    return { status: "error", message: explain(error, "Couldn't save. Please try again.") };
  }
  revalidatePath("/my-facilities");
  revalidatePath("/");
  return { status: "saved", message: "Saved. ORCA can see what you changed and when." };
}

/** The provider's own saved password, for a moment. The ORCA API records the reveal. */
export async function revealPccPassword(accessId: string): Promise<{ password?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!hasRole(user, "PROVIDER")) return { error: "Only providers can do this." };
  if (!UUID.test(accessId)) return { error: "Invalid request." };
  try {
    return { password: await revealMyPcc(accessId) };
  } catch (error) {
    console.error("[my-facilities] login reveal failed", { status: error instanceof OrcaApiError ? error.status : "unknown" });
    return { error: explain(error, "Couldn't show the password. Please try again.") };
  }
}

/** Deletes one of the provider's own logins and its password. The ORCA API checks it's theirs and records it. */
export async function deleteHospitalLogin(accessId: string): Promise<{ ok?: true; error?: string }> {
  const user = await getCurrentUser();
  if (!hasRole(user, "PROVIDER")) return { error: "Only providers can do this." };
  if (!UUID.test(accessId)) return { error: "Invalid request." };
  try {
    await deleteMyLogin(accessId);
  } catch (error) {
    console.error("[my-facilities] login delete failed", { status: error instanceof OrcaApiError ? error.status : "unknown" });
    return { error: explain(error, "Couldn't delete. Please try again.") };
  }
  revalidatePath("/my-facilities");
  revalidatePath("/");
  return { ok: true };
}
