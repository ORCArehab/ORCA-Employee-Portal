import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Extra context shown in a muted note, e.g. what's coming next. */
  note?: string;
}

export function PlaceholderPage({
  icon: Icon,
  title,
  description,
  note,
}: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orca-navy-800/5 text-orca-navy-800">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h1 className="mt-5 font-serif text-2xl font-semibold text-orca-navy-900">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center rounded-full bg-orca-gold-050 px-3 py-1 text-xs font-medium text-orca-gold-500">
        Coming soon
      </span>
      {note ? (
        <p className="mt-6 max-w-md text-xs text-muted-foreground">{note}</p>
      ) : null}
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-orca-navy-700 hover:text-orca-navy-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Dashboard
      </Link>
    </div>
  );
}
