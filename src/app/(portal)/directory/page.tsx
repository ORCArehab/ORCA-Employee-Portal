import type { Metadata } from "next";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { StaffDirectory } from "@/components/directory/StaffDirectory";
import { getStaffDirectory } from "@/config/staff";

export const metadata: Metadata = { title: "Employee Directory" };

export default function DirectoryPage() {
  const groups = getStaffDirectory();

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">
          Employee Directory
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Find and connect with ORCA Rehab team members.
        </p>
        <BrandAccent className="mt-4" />
      </header>

      {groups.length > 0 ? (
        <StaffDirectory groups={groups} />
      ) : (
        <p className="text-sm text-muted-foreground">
          The staff directory isn&apos;t configured yet.
        </p>
      )}
    </div>
  );
}
