"use server";

import { revalidatePath } from "next/cache";
import { isApplicationStatus } from "@/lib/applicationStatus";
import { updateApplicationStatus } from "@/lib/careersApi";
import { requireHrUser } from "@/lib/hrAccess";

export type StatusFormState = { status: "idle" | "saved" | "error"; message?: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function changeApplicationStatus(
  _previous: StatusFormState,
  formData: FormData,
): Promise<StatusFormState> {
  // Server Actions are reachable by direct POST, so authorize here too — not just on the page.
  const user = await requireHrUser();

  const id = String(formData.get("applicationId") ?? "");
  const status = formData.get("status");
  if (!UUID.test(id) || !isApplicationStatus(status)) {
    return { status: "error", message: "Invalid request." };
  }

  try {
    await updateApplicationStatus(user, id, status);
  } catch (error) {
    console.error("[hr] status update failed", { applicationId: id, error: String(error) });
    return { status: "error", message: "Couldn't update the status. Please try again." };
  }

  revalidatePath(`/hr/applicants/${id}`);
  revalidatePath("/hr/applicants");
  return { status: "saved" };
}
