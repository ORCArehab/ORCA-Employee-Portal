import type { Metadata } from "next";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { StaffDirectory } from "@/components/directory/StaffDirectory";
import { getStaffDirectory } from "@/lib/orgDirectory";

export const metadata: Metadata = { title: "Employee Directory" };

/** Live from the ORCA API on every visit: the same staff records ORCA Admin maintains. */
export default async function DirectoryPage() {
  const groups = await getStaffDirectory();

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

      {groups === null ? (
        <p className="text-sm text-muted-foreground">
          The staff directory couldn&apos;t be loaded right now. Please try again in a moment.
        </p>
      ) : (
        <StaffDirectory groups={groups} />
      )}
    </div>
  );
}
