import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_STYLES,
  type ApplicationStatus,
} from "@/lib/applicationStatus";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${APPLICATION_STATUS_STYLES[status]}`}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}
