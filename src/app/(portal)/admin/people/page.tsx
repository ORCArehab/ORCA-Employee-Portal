import { redirect } from "next/navigation";
import { OPERATIONS_APP_URL } from "@/config/apps";

/**
 * People & Roles moved to ORCA Admin (Operations), where an employee's roles are also their
 * Category on their profile. Old links and bookmarks land there; that app checks access itself.
 */
export default function PeopleMovedPage() {
  redirect(`${OPERATIONS_APP_URL}/people`);
}
