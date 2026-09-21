import type { Metadata } from "next";
import { AnnouncementsPanel } from "@/components/dashboard/AnnouncementsPanel";
import { getAnnouncements } from "@/lib/announcements";

export const metadata: Metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">
          Announcements
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Company-wide updates and news from ORCA Rehab.
        </p>
      </header>

      <div className="max-w-xl">
        <AnnouncementsPanel announcements={announcements} />
      </div>
    </div>
  );
}
