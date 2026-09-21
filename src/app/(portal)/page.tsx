import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AppCard } from "@/components/dashboard/AppCard";
import { ResourceCard } from "@/components/dashboard/ResourceCard";
import { AnnouncementsPanel } from "@/components/dashboard/AnnouncementsPanel";
import { portalResources } from "@/config/resources";
import { getAnnouncements } from "@/lib/announcements";
import { getCurrentUser } from "@/lib/auth";
import { getVisibleApps } from "@/lib/permissions";

export default async function DashboardPage() {
  // (portal)/layout.tsx already guarantees an authenticated user before
  // this renders; getCurrentUser() is cached per-request, so this is a
  // cheap re-read, not a second session check.
  const [user, announcements] = await Promise.all([
    getCurrentUser(),
    getAnnouncements(),
  ]);
  if (!user) {
    redirect("/sign-in");
  }
  const apps = getVisibleApps(user);

  return (
    <div>
      <Header user={user} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Your Apps
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Resources
              </h2>
              <a
                href="/resources"
                className="text-xs font-medium text-orca-navy-700 hover:text-orca-navy-900"
              >
                View all
              </a>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {portalResources.slice(0, 4).map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <AnnouncementsPanel announcements={announcements} />
        </div>
      </div>
    </div>
  );
}
