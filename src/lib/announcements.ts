import type { Announcement } from "@/types/portal";

/**
 * Stand-in for a future announcements API/database table. Swap this for a
 * real fetch once one exists — callers already treat it as async.
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  return [];
}
