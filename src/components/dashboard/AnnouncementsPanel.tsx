import { Megaphone } from "lucide-react";
import type { Announcement } from "@/types/portal";

export function AnnouncementsPanel({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <Megaphone className="h-4.5 w-4.5 text-orca-gold-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-orca-navy-900">
          ORCA Announcements
        </h2>
      </div>

      {announcements.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No new announcements.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {announcements.map((a) => (
            <li key={a.id} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
              <p className="text-sm font-medium text-orca-navy-900">{a.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{a.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(a.publishedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
