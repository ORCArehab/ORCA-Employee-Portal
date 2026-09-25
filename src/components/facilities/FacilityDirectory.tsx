"use client";

import { useId, useMemo, useState } from "react";
import { Building2, ChevronDown, Search } from "lucide-react";
import type { Facility } from "@/config/facilities";

function matches(facility: Facility, query: string): boolean {
  return (
    facility.name.toLowerCase().includes(query) ||
    facility.address.toLowerCase().includes(query) ||
    facility.region.toLowerCase().includes(query)
  );
}

function FacilityRow({ facility }: { facility: Facility }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <li className="rounded-xl border border-border bg-surface transition hover:border-orca-navy-800/20 hover:shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={detailsId}
        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orca-sky-050 text-orca-sky-500">
          <Building2 className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="min-w-0 flex-1 text-sm font-medium text-orca-navy-900">
          {facility.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <p
          id={detailsId}
          className="border-t border-border px-3 py-2 pl-[3.25rem] text-xs text-muted-foreground"
        >
          {facility.address}
        </p>
      ) : null}
    </li>
  );
}

export function FacilityDirectory({ facilities }: { facilities: Facility[] }) {
  const [query, setQuery] = useState("");
  const searchId = useId();

  const normalized = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      normalized
        ? facilities.filter((f) => matches(f, normalized))
        : facilities,
    [facilities, normalized],
  );

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          All Facilities (
          {normalized ? `${visible.length} of ${facilities.length}` : facilities.length}
          )
        </h2>
        <div className="relative w-full sm:w-72">
          <label htmlFor={searchId} className="sr-only">
            Search facilities
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search facilities..."
            autoComplete="off"
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-3 text-sm text-orca-navy-900 placeholder:text-muted-foreground focus-visible:border-orca-navy-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
          />
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className="mt-3 grid grid-cols-1 items-start gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((facility) => (
            <FacilityRow key={facility.name} facility={facility} />
          ))}
        </ul>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center">
          <p className="text-sm font-medium text-orca-navy-900">
            No facilities found
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a different name.
          </p>
        </div>
      )}
    </section>
  );
}
