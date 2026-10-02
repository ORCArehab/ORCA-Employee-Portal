"use server";

import { redirect } from "next/navigation";
import { requireOperationsUser } from "@/lib/operationsAccess";
import { getProviderDashboard, getScribeDashboard } from "@/lib/operationsApi";

/** Re-reads a dashboard's source spreadsheet (bypassing the API's cache), then returns to the page. */
export async function refreshOperations(formData: FormData) {
  await requireOperationsUser();
  const dataset = formData.get("dataset");
  const returnTo = String(formData.get("returnTo") ?? "");
  try {
    if (dataset === "providers") await getProviderDashboard({ refresh: true });
    else if (dataset === "scribes") await getScribeDashboard({ refresh: true });
  } catch {
    // The page shows the error state when it reloads.
  }
  // Only ever return within the Operations area.
  redirect(returnTo.startsWith("/operations") && !returnTo.startsWith("//") ? returnTo : "/operations");
}
