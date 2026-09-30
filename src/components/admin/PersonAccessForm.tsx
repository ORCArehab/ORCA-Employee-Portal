"use client";

import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";
import { updateAccessAction, type AccessFormState } from "@/app/(portal)/admin/people/actions";
import type { RoleDefinition } from "@/lib/peopleApi";

const initialState: AccessFormState = { status: "idle" };

export function PersonAccessForm({
  personId,
  roles,
  currentRoles,
  active,
  isSelf,
}: {
  personId: string;
  roles: RoleDefinition[];
  currentRoles: string[];
  active: boolean;
  isSelf: boolean;
}) {
  const [state, formAction, isPending] = useActionState(updateAccessAction, initialState);
  // Remount the inputs after a save so they reflect what the API now holds.
  const key = `${currentRoles.join(",")}|${active}`;

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="personId" value={personId} />
      <input type="hidden" name="wasActive" value={String(active)} />
      {currentRoles.map((role) => (
        <input key={role} type="hidden" name="currentRoles" value={role} />
      ))}

      <fieldset key={key} className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <legend className="sr-only">Roles</legend>
        {roles.map((role) => (
          <label key={role.key} title={role.description} className="inline-flex items-center gap-1.5 text-sm text-orca-navy-800">
            <input
              type="checkbox"
              name="roles"
              value={role.key}
              defaultChecked={currentRoles.includes(role.key)}
              className="h-4 w-4 rounded border-border accent-orca-navy-900"
            />
            {role.label}
          </label>
        ))}
        <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
        <label
          className="inline-flex items-center gap-1.5 text-sm text-orca-navy-800"
          title={isSelf ? "You can't turn off your own access." : "Turned off: can't sign in to ORCA apps."}
        >
          <input
            type="checkbox"
            name="active"
            defaultChecked={active}
            disabled={isSelf}
            className="h-4 w-4 rounded border-border accent-orca-navy-900"
          />
          Active
          {/* A disabled checkbox isn't submitted; keep your own access on. */}
          {isSelf ? <input type="hidden" name="active" value="on" /> : null}
        </label>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-sm font-medium text-orca-navy-800 transition hover:bg-orca-navy-800/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Save
        </button>
        <p aria-live="polite" className="text-xs">
          {state.status === "saved" && !isPending ? (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <Check className="h-3.5 w-3.5" aria-hidden="true" /> Saved
            </span>
          ) : state.status === "error" ? (
            <span className="text-red-700">{state.message}</span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
