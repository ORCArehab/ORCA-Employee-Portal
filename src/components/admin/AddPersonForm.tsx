"use client";

import { useActionState } from "react";
import { Check, Loader2, UserPlus } from "lucide-react";
import { addPersonAction, type AccessFormState } from "@/app/(portal)/admin/people/actions";

const initialState: AccessFormState = { status: "idle" };

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-orca-navy-900 focus-visible:border-orca-navy-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500";

export function AddPersonForm() {
  const [state, formAction, isPending] = useActionState(addPersonAction, initialState);

  return (
    <form action={formAction} className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-sm font-medium text-orca-navy-900">Add someone before they sign in</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Anyone with an ORCA Rehab Google account is added automatically the first time they sign in. Add them here
        to give them a role ahead of time.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_auto]">
        <label className="sr-only" htmlFor="new-email">Email</label>
        <input id="new-email" name="email" type="email" required placeholder="name@orcarehab.com" className={fieldClass} />
        <label className="sr-only" htmlFor="new-name">Name (optional)</label>
        <input id="new-name" name="name" type="text" placeholder="Name (optional)" className={fieldClass} />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orca-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-orca-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 disabled:opacity-70"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <UserPlus className="h-4 w-4" aria-hidden="true" />
          )}
          Add
        </button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-xs">
        {state.status === "saved" && !isPending ? (
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <Check className="h-3.5 w-3.5" aria-hidden="true" /> Added
          </span>
        ) : state.status === "error" ? (
          <span className="text-red-700">{state.message}</span>
        ) : null}
      </p>
    </form>
  );
}
