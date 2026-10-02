import Link from "next/link";
import { formatCount, formatDecimal, scribeHref } from "@/lib/operations/format";
import type { ScribeDashboard, ScribeEntry } from "@/types/operations";
import { CautionDot, OpsTable, linkClass, type Column } from "../ui";

/** Scribes in alphabetical order: descriptive, not a ranking. */
export function ScribeTable({ data }: { data: ScribeDashboard }) {
  const d = data.meta.definitions;
  const columns: Column<ScribeEntry>[] = [
    {
      key: "name",
      header: "Scribe",
      render: (s) => (
        <span className="inline-flex items-center gap-1.5">
          <Link className={linkClass} href={scribeHref(s.name)}>
            {s.name}
          </Link>
          {s.warningCount > 0 ? <CautionDot label="Some source data needs review" /> : null}
        </span>
      ),
    },
    { key: "notes", header: "Notes produced", align: "right", description: d.notesProduced, render: (s) => formatCount(s.notesProduced) },
    { key: "consults", header: "Consults", align: "right", render: (s) => formatCount(s.consults) },
    { key: "followUps", header: "Follow-ups", align: "right", render: (s) => formatCount(s.followUps) },
    { key: "hours", header: "Hours", align: "right", description: d.hoursWorked, render: (s) => formatDecimal(s.hoursWorked) },
    { key: "rate", header: "Notes / hour", align: "right", description: d.notesPerHour, render: (s) => formatDecimal(s.notesPerHour) },
    { key: "uploaded", header: "Uploaded", align: "right", description: d.notesUploaded, render: (s) => formatCount(s.notesUploaded) },
    { key: "days", header: "Work days", align: "right", render: (s) => formatCount(s.workDays) },
    { key: "facilities", header: "Facilities", align: "right", description: d.facilitiesWorked, render: (s) => formatCount(s.facilitiesWorked) },
  ];
  return <OpsTable caption="Scribe production" columns={columns} rows={data.scribes} rowKey={(s) => s.name} empty="No scribe rows in the reporting period." />;
}
