import { ExternalLink } from "lucide-react";
import type { BrandAccentColor, PortalForm } from "@/types/portal";

const ACCENT_CLASSES: Record<BrandAccentColor, string> = {
  navy: "bg-orca-navy-800/10 text-orca-navy-800",
  gold: "bg-orca-gold-050 text-orca-gold-500",
  sky: "bg-orca-sky-050 text-orca-sky-500",
};

export function FormCard({ form }: { form: PortalForm }) {
  const { name, description, href, icon: Icon, accent = "sky" } = form;

  const content = (
    <>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ACCENT_CLASSES[accent]}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-orca-navy-900">{name}</h3>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {href ? description : "Link coming soon"}
        </p>
      </div>
      {href ? (
        <ExternalLink
          className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-orca-navy-800"
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  if (!href) {
    return (
      <div
        aria-disabled="true"
        className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-surface/60 p-4 opacity-70"
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:border-orca-navy-800/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
    >
      {content}
    </a>
  );
}
