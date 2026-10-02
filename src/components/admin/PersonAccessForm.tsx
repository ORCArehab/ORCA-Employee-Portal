"use client";

import { useActionState, useState } from "react";
import { Check, Loader2, Pencil } from "lucide-react";
import { updateAccessAction, type AccessFormState } from "@/app/(portal)/admin/people/actions";
import { EmployeeBadge, InactiveBadge, RoleBadge, roleStyle } from "@/components/admin/RoleBadge";
import type { RoleDefinition } from "@/lib/peopleApi";

const initialState: AccessFormState = { status: "idle" };

/**
 * A person's access: color-coded role badges, with an "Edit roles" button that
 * opens the toggles in place.
 */
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
  const [editing, setEditing] = useState(false);
  // Close the editor once a save lands.
  const [state, formAction, isPending] = useActionState(async (previous: AccessFormState, formData: FormData) => {
    const result = await updateAccessAction(previous, formData);
    if (result.status === "saved") setEditing(false);
    return result;
  }, initialState);

  const held = roles.filter((role) => currentRoles.includes(role.key));

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {!active ? <InactiveBadge /> : null}
        {held.length === 0 ? (
          <EmployeeBadge />
        ) : (
          held.map((role) => <RoleBadge key={role.key} role={role.key} label={role.label} title={role.description} />)
        )}
        {state.status === "saved" ? (
          <span aria-live="polite" className="inline-flex items-center gap-1 text-xs text-emerald-700">
            <Check className="h-3.5 w-3.5" aria-hidden="true" /> Saved
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="ml-1 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-orca-navy-700 transition hover:bg-orca-navy-800/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit roles
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-orca-navy-800/[0.02] p-3">
      <input type="hidden" name="personId" value={personId} />
      <input type="hidden" name="wasActive" value={String(active)} />
      {currentRoles.map((role) => (
        <input key={role} type="hidden" name="currentRoles" value={role} />
      ))}

      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mb-2 text-xs font-medium text-muted-foreground">Tap a role to turn it on or off</legend>
        {roles.map((role) => (
          <label
            key={role.key}
            title={role.description}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border transition hover:bg-orca-navy-800/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orca-gold-500 ${roleStyle(role.key).checked}`}
          >
            <input
              type="checkbox"
              name="roles"
              value={role.key}
              defaultChecked={currentRoles.includes(role.key)}
              className="peer sr-only"
            />
            <Check className="hidden h-3 w-3 peer-checked:block" aria-hidden="true" />
            {role.label}
          </label>
        ))}
      </fieldset>

      <label
        className="inline-flex items-center gap-2 text-xs text-orca-navy-800"
        title={isSelf ? "You can't turn off your own access." : "Turned off: can't sign in to ORCA apps."}
      >
        <input
          type="checkbox"
          name="active"
          defaultChecked={active}
          disabled={isSelf}
          className="h-4 w-4 rounded border-border accent-orca-navy-900"
        />
        Active — can sign in to ORCA apps
        {/* A disabled checkbox isn't submitted; keep your own access on. */}
        {isSelf ? <input type="hidden" name="active" value="on" /> : null}
      </label>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-orca-navy-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orca-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : null}
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={isPending}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-orca-navy-700 transition hover:bg-orca-navy-800/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
        >
          Cancel
        </button>
        <p aria-live="polite" className="text-xs">
          {state.status === "error" ? <span className="text-red-700">{state.message}</span> : null}
        </p>
      </div>
    </form>
  );
}
