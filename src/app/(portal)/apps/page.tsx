import type { Metadata } from "next";
import { AppCard } from "@/components/dashboard/AppCard";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { getCurrentUser } from "@/lib/auth";
import { getVisibleApps } from "@/lib/permissions";

export const metadata: Metadata = { title: "Apps" };

export default async function AppsPage() {
  const user = await getCurrentUser();
  const apps = getVisibleApps(user);

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">
          ORCA Apps
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything you need to do your job, in one place. Internal ORCA
          systems and shortcuts to the outside tools your team relies on.
        </p>
        <BrandAccent className="mt-4" />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
