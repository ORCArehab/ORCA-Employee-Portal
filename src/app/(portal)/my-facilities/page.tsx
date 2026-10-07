import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { addressText, assignmentText } from "@/components/provider/FacilityLines";
import { HospitalLogins } from "@/components/provider/HospitalLogins";
import { LOAD_FAILED, NOT_LINKED, ProviderNotice } from "@/components/provider/ProviderNotice";
import { getCurrentUser } from "@/lib/auth";
import { hasRole } from "@/lib/permissions";
import { getMyFacilities } from "@/lib/provider/api";
import { loginsAt, type MyFacilities } from "@/lib/provider/types";

export const metadata: Metadata = { title: "My Facilities" };

/** The facilities ORCA has assigned the signed-in provider to, each with their hospital logins there. */
export default async function MyFacilitiesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!hasRole(user, "PROVIDER")) redirect("/");

  let data: MyFacilities | null = null;
  try {
    data = await getMyFacilities();
  } catch (error) {
    console.error("[my-facilities] load failed", { error: String(error) });
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">My Facilities</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Where ORCA has you assigned, and your hospital logins for each (PointClickCare and any other system). Keep them up to date here; ORCA&apos;s admin team sees each change.
        </p>
        <BrandAccent className="mt-4" />
      </header>

      {!data ? (
        <ProviderNotice>{LOAD_FAILED}</ProviderNotice>
      ) : !data.linked ? (
        <ProviderNotice>{NOT_LINKED}</ProviderNotice>
      ) : data.facilities.length === 0 ? (
        <ProviderNotice>You aren&apos;t assigned to any facilities yet. Facility assignments are set by ORCA&apos;s admin team.</ProviderNotice>
      ) : (
        <ul className="space-y-4">
          {data.facilities.map((f) => (
            <li key={f.id} id={`facility-${f.id}`} className="scroll-mt-6 rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <h2 className="break-words text-base font-semibold text-orca-navy-900">
                    {f.name}
                    {f.abbreviation && <span className="ml-2 text-xs font-medium text-muted-foreground">{f.abbreviation}</span>}
                  </h2>
                  <p className="text-xs text-muted-foreground">{assignmentText(f)}</p>
                </div>
                <div className="space-y-0.5 text-xs text-muted-foreground sm:text-right">
                  {addressText(f) && (
                    <p className="flex items-center gap-1 sm:justify-end">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {addressText(f)}
                    </p>
                  )}
                  {f.phone && (
                    <p className="flex items-center gap-1 sm:justify-end">
                      <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <a href={`tel:${f.phone.replace(/[^\d+]/g, "")}`} className="hover:text-orca-navy-900">
                        {f.phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hospital logins</h3>
                <HospitalLogins facilityId={f.id} facilityName={f.name} logins={loginsAt(f)} myEmail={user.email} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
