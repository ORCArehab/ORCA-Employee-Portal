import { Info } from "lucide-react";

/** A calm one-liner for "nothing to show yet" and "couldn't load" states. */
export function ProviderNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-orca-sky-500" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export const NOT_LINKED =
  "Your sign-in isn't linked to your provider record yet, so there's nothing to show. Ask ORCA's admin team to link it.";
export const LOAD_FAILED = "This couldn't be loaded right now. Please try again in a moment.";
