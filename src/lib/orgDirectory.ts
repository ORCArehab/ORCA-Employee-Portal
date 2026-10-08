import "server-only";
import { connection } from "next/server";
import { orcaApiRequestAsUser } from "@/lib/orcaApi";
import { facilityList, staffGroups, type ApiFacility, type ApiStaff, type Facility, type StaffGroup } from "@/lib/orgShape";

/**
 * Live staff and facility lists from the ORCA API, the same records ORCA Admin edits. Fetched on
 * every page load (never cached), so a change in ORCA Admin shows here on the next visit. Null
 * when the API can't be reached; the page says so instead of showing an old list.
 */

export async function getStaffDirectory(): Promise<StaffGroup[] | null> {
  // Render at request time, never at build: the list must be today's. (Outside the try, so the
  // catch below can't swallow Next's signal and bake a "couldn't load" page into the build.)
  await connection();
  try {
    const { staff } = await orcaApiRequestAsUser<{ staff: ApiStaff[] }>("/v1/org/staff");
    return staffGroups(staff);
  } catch (error) {
    console.error("[directory] staff load failed", { error: String(error) });
    return null;
  }
}

export async function getFacilities(): Promise<Facility[] | null> {
  await connection();
  try {
    const { facilities } = await orcaApiRequestAsUser<{ facilities: ApiFacility[] }>("/v1/org/facilities");
    return facilityList(facilities);
  } catch (error) {
    console.error("[facilities] load failed", { error: String(error) });
    return null;
  }
}
