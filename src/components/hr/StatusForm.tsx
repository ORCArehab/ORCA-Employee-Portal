"use client";

import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  changeApplicationStatus,
  type StatusFormState,
} from "@/app/(portal)/hr/applicants/[id]/actions";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/applicationStatus";

const initialState: StatusFormState = { status: "idle" };

export function StatusForm({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
}) {
  const [state, formAction, isPending] = useActionState(changeApplicationStatus, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="applicationId" value={applicationId} />
      <label htmlFor="status" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Status
      </label>
      <div className="flex gap-2">
        {/* key resets the select to the saved value after a successful change. */}
        <select
          key={currentStatus}
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-orca-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {APPLICATION_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-orca-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-orca-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Update
        </button>
      </div>
      <p aria-live="polite" className="min-h-5 text-xs">
        {state.status === "saved" && !isPending ? (
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <Check className="h-3.5 w-3.5" aria-hidden="true" /> Status updated
          </span>
        ) : state.status === "error" ? (
          <span className="text-red-700">{state.message}</span>
        ) : null}
      </p>
    </form>
  );
}
