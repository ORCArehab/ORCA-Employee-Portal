import type { ReactNode } from "react";
import { BrandAccent } from "@/components/ui/BrandAccent";

/**
 * Building blocks shared by the Operations pages (providers now; scribes, facilities later),
 * in the portal's visual language: navy text, quiet borders, gold only for caution.
 */

export function OpsHeader({ title, description, aside, back }: { title: string; description?: ReactNode; aside?: ReactNode; back?: ReactNode }) {
  return (
    <header className="mb-6">
      {back}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">{title}</h1>
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {aside ? <div className="flex items-center gap-3 text-xs text-muted-foreground">{aside}</div> : null}
      </div>
      <BrandAccent className="mt-4" />
    </header>
  );
}

export interface MetricItem {
  label: string;
  value: ReactNode;
  note?: ReactNode;
}

export function MetricStrip({ items }: { items: MetricItem[] }) {
  return (
    <section aria-label="Summary" className="mb-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-4">
      {items.map((m, i) => (
        <div
          key={m.label}
          className={`px-5 py-4 ${i % 2 === 1 ? "border-l border-border" : ""} ${i >= 2 ? "border-t border-border lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
        >
          <div className="text-xs text-muted-foreground">{m.label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-orca-navy-900 tabular-nums">{m.value}</div>
          {m.note ? <div className="mt-1 text-xs text-muted-foreground">{m.note}</div> : null}
        </div>
      ))}
    </section>
  );
}

export function Section({ title, aside, note, children }: { title: string; aside?: ReactNode; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-orca-navy-900">{title}</h2>
        {aside}
      </div>
      {children}
      {note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
    </section>
  );
}

/** Small gold dot used for "caution": limited status coverage or source data needing review. */
export function CautionDot({ label }: { label?: string }) {
  return <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-orca-gold-500" {...(label ? { role: "img", "aria-label": label, title: label } : { "aria-hidden": true })} />;
}

/** Subtle, non-technical notice. Parser diagnostics are deliberately not shown in the admin UI. */
export function Notice({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="mb-5 flex items-start gap-2 rounded-xl border border-orca-gold-400/50 bg-orca-gold-050 px-4 py-2.5 text-sm text-orca-navy-900">
      <span className="mt-1.5">
        <CautionDot />
      </span>
      <span>{children}</span>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center">
      <p className="text-sm font-medium text-orca-navy-900">{title}</p>
      {children ? <p className="mt-1 text-xs text-muted-foreground">{children}</p> : null}
    </div>
  );
}

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
  /** Shown as the header's tooltip (metric definition). */
  description?: string;
}

/** Generic table for Operations lists. The first column should contain the row's link. */
export function OpsTable<T>({ columns, rows, rowKey, caption, empty = "No results." }: { columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string; caption: string; empty?: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                title={c.description}
                className={`whitespace-nowrap border-b border-border px-4 py-2.5 text-xs font-medium text-muted-foreground ${c.align === "right" ? "text-right" : "text-left"}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-muted-foreground">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-border last:border-0 hover:bg-orca-navy-800/[0.03]">
                {columns.map((c) => (
                  <td key={c.key} className={`whitespace-nowrap px-4 py-2.5 text-orca-navy-900 ${c.align === "right" ? "text-right tabular-nums" : ""}`}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const linkClass = "font-medium text-orca-navy-900 hover:text-orca-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 rounded";
export const muted = "text-muted-foreground";
export const caution = "text-amber-800";
