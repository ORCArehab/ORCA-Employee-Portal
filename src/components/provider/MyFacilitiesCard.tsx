"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AlertCircle, ChevronDown, ChevronRight, Search } from "lucide-react";
import type { MyFacility } from "@/lib/provider/types";
import { assignmentText, loginProblem } from "./FacilityLines";

const PREVIEW_COUNT = 4;

function FacilityRow({ f }: { f: MyFacility }) {
  const problem = loginProblem(f);
  return (
    <li>
      <Link href={`/my-facilities#facility-${f.id}`} className="group flex items-center gap-3 py-2.5">
        <span className="min-w-0 flex-1">
          <span className="block break-words text-sm font-medium text-orca-navy-900 group-hover:text-orca-navy-700">
            {f.name}
          </span>
          <span className="block text-xs text-muted-foreground">{assignmentText(f)}</span>
        </span>
        {problem && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orca-gold-050 px-2 py-0.5 text-[11px] font-medium text-orca-navy-900">
            <AlertCircle className="h-3 w-3" aria-hidden="true" /> {problem}
          </span>
        )}
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </Link>
    </li>
  );
}

/**
 * The dashboard's My Facilities preview: the first few assignments, with a
 * "View all" disclosure for the rest (searchable, internally scrollable) so
 * the card stays the same size whether someone has 1 facility or 30.
 */
export function MyFacilitiesCard({ facilities }: { facilities: MyFacility[] }) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const searchId = useId();

  const hasMore = facilities.length > PREVIEW_COUNT;
  const preview = facilities.slice(0, PREVIEW_COUNT);

  const q = query.trim().toLowerCase();
  const filtered = q ? facilities.filter((f) => f.name.toLowerCase().includes(q)) : facilities;

  return (
    <div>
      {!expanded && (
        <ul className="divide-y divide-border">
          {preview.map((f) => (
            <FacilityRow key={f.id} f={f} />
          ))}
        </ul>
      )}

      {hasMore && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs font-medium text-orca-navy-700 transition hover:border-orca-navy-700 hover:bg-orca-navy-800/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
          >
            {expanded ? "Show less" : `View all facilities (${facilities.length})`}
            <ChevronDown
              className={`h-3.5 w-3.5 transition ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {expanded && (
            <div className="mt-3 rounded-xl border border-border bg-background/60 p-3">
              <label htmlFor={searchId} className="sr-only">
                Search your facilities
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search facilities..."
                  autoComplete="off"
                  className="w-full rounded-lg border border-border bg-surface py-1.5 pl-8 pr-3 text-sm text-orca-navy-900 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
                />
              </div>

              {filtered.length === 0 ? (
                <p className="mt-3 py-2 text-center text-xs text-muted-foreground">
                  No facilities match &ldquo;{query}&rdquo;.
                </p>
              ) : (
                <ul className="mt-1 max-h-72 divide-y divide-border overflow-y-auto">
                  {filtered.map((f) => (
                    <FacilityRow key={f.id} f={f} />
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
