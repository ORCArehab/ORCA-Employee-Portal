"use client";

import { useActionState, useEffect, useState } from "react";
import { Check, Copy, Eye, EyeOff, KeyRound, Loader2, Pencil } from "lucide-react";
import { revealPccPassword, savePccAccess, type PccFormState } from "@/app/(portal)/my-facilities/actions";
import { changedBy, shortDate } from "@/lib/provider/format";
import { ACCESS_STATUS_LABELS, LOGIN_METHOD_LABELS, LOGIN_METHODS, type MyPccAccess } from "@/lib/provider/types";

const REVEAL_SECONDS = 30;
const initial: PccFormState = { status: "idle" };

/**
 * My PointClickCare login at one facility: view it, show the saved password for a moment, or add
 * and change it. ORCA sees each change (who and when) in ORCA Admin.
 */
export function PccAccessCard({ facilityId, facilityName, access, myEmail }: { facilityId: string; facilityName: string; access: MyPccAccess | null; myEmail: string }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(savePccAccess, initial);
  const [lastHandled, setLastHandled] = useState(state);

  // Close the form once a save succeeds (the page re-renders with the new values).
  if (state !== lastHandled) {
    setLastHandled(state);
    if (state.status === "saved") setEditing(false);
  }

  if (editing || (!access && state.status === "error")) {
    return <PccForm facilityId={facilityId} facilityName={facilityName} access={access} formAction={formAction} pending={pending} state={state} onCancel={() => setEditing(false)} />;
  }

  if (!access) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">No PCC login saved for this facility yet.</p>
        <button type="button" onClick={() => setEditing(true)} className={buttonPrimary}>
          <KeyRound className="h-4 w-4" aria-hidden="true" /> Add PCC login
        </button>
        {state.status === "saved" && <Status state={state} />}
      </div>
    );
  }

  const usernameBy = changedBy(access.usernameSetBy, access.usernameSetVia, myEmail);
  const passwordBy = changedBy(access.passwordSetBy, access.passwordSetVia, myEmail);
  return (
    <div className="space-y-3">
      {access.status === "disabled" && (
        <p className="rounded-xl bg-orca-gold-050 px-3 py-2 text-xs text-orca-navy-900">ORCA has this login marked as not working. If you&apos;ve fixed it, update it here.</p>
      )}
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Username</dt>
          <dd className="break-all font-medium text-orca-navy-900">{access.username ?? <span className="font-normal text-muted-foreground">Not saved</span>}</dd>
          {access.usernameSetAt && usernameBy && <dd className="text-xs text-muted-foreground">Changed {shortDate(access.usernameSetAt)} by {usernameBy}</dd>}
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Password</dt>
          <dd className="font-medium text-orca-navy-900">{access.hasPassword ? <RevealPassword accessId={access.id} /> : <span className="font-normal text-muted-foreground">Not saved</span>}</dd>
          {access.hasPassword && access.passwordSetAt && passwordBy && <dd className="text-xs text-muted-foreground">Changed {shortDate(access.passwordSetAt)} by {passwordBy}</dd>}
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Sign-in code</dt>
          <dd className="text-orca-navy-900">
            {LOGIN_METHOD_LABELS[access.loginMethod] ?? access.loginMethod}
            {access.loginMethodDetail && <span className="text-muted-foreground"> · {access.loginMethodDetail}</span>}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Status</dt>
          <dd className="text-orca-navy-900">{ACCESS_STATUS_LABELS[access.status] ?? access.status}{access.organization && <span className="text-muted-foreground"> · {access.organization}</span>}</dd>
        </div>
        {access.notes && (
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">Notes</dt>
            <dd className="whitespace-pre-line text-orca-navy-900">{access.notes}</dd>
          </div>
        )}
      </dl>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setEditing(true)} className={buttonQuiet}>
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Update login
        </button>
        <Status state={state} />
      </div>
    </div>
  );
}

function PccForm({
  facilityId,
  facilityName,
  access,
  formAction,
  pending,
  state,
  onCancel,
}: {
  facilityId: string;
  facilityName: string;
  access: MyPccAccess | null;
  formAction: (formData: FormData) => void;
  pending: boolean;
  state: PccFormState;
  onCancel: () => void;
}) {
  const id = `pcc-${facilityId}`;
  return (
    <form action={formAction} className="space-y-3" autoComplete="off">
      <input type="hidden" name="facilityId" value={facilityId} />
      {access && <input type="hidden" name="accessId" value={access.id} />}
      <p className="text-xs text-muted-foreground">Your PointClickCare login for {facilityName}. Only you and ORCA&apos;s admin team can see it; the password is encrypted.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Username" htmlFor={`${id}-user`}>
          <input id={`${id}-user`} name="username" defaultValue={access?.username ?? ""} autoComplete="off" spellCheck={false} className={input} />
        </Field>
        <Field label={access?.hasPassword ? "New password" : "Password"} htmlFor={`${id}-pass`} hint={access?.hasPassword ? "Leave blank to keep the saved one." : undefined}>
          <input id={`${id}-pass`} name="password" type="password" autoComplete="new-password" className={input} />
        </Field>
        <Field label="How you get your sign-in code" htmlFor={`${id}-method`}>
          <select id={`${id}-method`} name="loginMethod" defaultValue={access?.loginMethod ?? "ringcentral_sms"} className={input}>
            {LOGIN_METHODS.map((m) => (
              <option key={m} value={m}>
                {LOGIN_METHOD_LABELS[m]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Details (optional)" htmlFor={`${id}-detail`} hint="Which phone or app. Never a code.">
          <input id={`${id}-detail`} name="loginMethodDetail" defaultValue={access?.loginMethodDetail ?? ""} maxLength={200} className={input} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Notes (optional)" htmlFor={`${id}-notes`}>
            <textarea id={`${id}-notes`} name="notes" defaultValue={access?.notes ?? ""} maxLength={1000} rows={2} className={input} />
          </Field>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Status state={state} />
        <button type="button" onClick={onCancel} disabled={pending} className={buttonQuiet}>
          Cancel
        </button>
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Save
        </button>
      </div>
    </form>
  );
}

function RevealPassword({ accessId }: { accessId: string }) {
  const [value, setValue] = useState<string | null>(null);
  const [left, setLeft] = useState(0);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (value === null) return;
    const timer = window.setTimeout(() => (left <= 1 ? setValue(null) : setLeft(left - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [value, left]);

  if (value === null) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        <span aria-hidden="true">••••••••</span>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setNote(null);
            const result = await revealPccPassword(accessId);
            setBusy(false);
            if (result.password !== undefined) {
              setValue(result.password);
              setLeft(REVEAL_SECONDS);
            } else setNote(result.error ?? "Couldn't show the password.");
          }}
          className="inline-flex items-center gap-1 text-xs font-medium text-orca-navy-700 hover:text-orca-navy-900"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />} Show
        </button>
        {note && <span className="text-xs font-normal text-red-700">{note}</span>}
      </span>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <code className="break-all rounded bg-background px-1.5 py-0.5 font-mono text-sm">{value}</code>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setNote("Copied");
          } catch {
            setNote("Select it to copy");
          }
        }}
        className="inline-flex items-center gap-1 text-xs font-medium text-orca-navy-700 hover:text-orca-navy-900"
      >
        <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copy
      </button>
      <button type="button" onClick={() => setValue(null)} className="inline-flex items-center gap-1 text-xs font-medium text-orca-navy-700 hover:text-orca-navy-900">
        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> Hide
      </button>
      <span className="text-xs font-normal text-muted-foreground">{note ?? `Hides in ${left}s`}</span>
    </span>
  );
}

function Status({ state }: { state: PccFormState }) {
  if (state.status === "saved")
    return (
      <span aria-live="polite" className="inline-flex items-center gap-1 text-xs text-emerald-700">
        <Check className="h-3.5 w-3.5" aria-hidden="true" /> {state.message}
      </span>
    );
  if (state.status === "error")
    return (
      <span aria-live="polite" role="alert" className="text-xs text-red-700">
        {state.message}
      </span>
    );
  return null;
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="text-xs font-medium text-orca-navy-900">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

const input =
  "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-orca-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500";
const buttonPrimary =
  "inline-flex items-center gap-1.5 rounded-xl bg-orca-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-orca-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 disabled:opacity-70";
const buttonQuiet =
  "inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-sm font-medium text-orca-navy-900 transition hover:border-orca-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 disabled:opacity-70";
