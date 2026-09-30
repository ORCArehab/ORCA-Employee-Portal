"use client";

import { useId, useMemo, useState } from "react";
import { Mail, Search, UserRound } from "lucide-react";
import type { BrandAccentColor } from "@/types/portal";
import type { StaffGroup, StaffMember } from "@/config/staff";

const ACCENT_CLASSES: Record<BrandAccentColor, string> = {
  navy: "bg-orca-navy-800/10 text-orca-navy-800",
  gold: "bg-orca-gold-050 text-orca-gold-500",
  sky: "bg-orca-sky-050 text-orca-sky-500",
};

function matches(member: StaffMember, query: string): boolean {
  return (
    member.name.toLowerCase().includes(query) ||
    member.title.toLowerCase().includes(query) ||
    (member.email ?? "").toLowerCase().includes(query)
  );
}

function StaffRow({
  member,
  accent,
}: {
  member: StaffMember;
  accent: BrandAccentColor;
}) {
  return (
    <li className="rounded-xl border border-border bg-surface p-3 transition hover:border-orca-navy-800/20 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${ACCENT_CLASSES[accent]}`}
        >
          <UserRound className="h-[18px] w-[18px]" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-orca-navy-900">
            {member.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {member.title}
          </p>
          {member.email ? (
            <a
              href={`mailto:${member.email}`}
              className="mt-1 inline-flex items-center gap-1 truncate text-xs text-orca-navy-700 hover:text-orca-navy-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
            >
              <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{member.email}</span>
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function StaffDirectory({ groups }: { groups: StaffGroup[] }) {
  const [query, setQuery] = useState("");
  const searchId = useId();

  const normalized = query.trim().toLowerCase();
  const totalCount = useMemo(
    () => groups.reduce((n, g) => n + g.members.length, 0),
    [groups],
  );

  const filteredGroups = useMemo(() => {
    if (!normalized) return groups;
    return groups
      .map((g) => ({ ...g, members: g.members.filter((m) => matches(m, normalized)) }))
      .filter((g) => g.members.length > 0);
  }, [groups, normalized]);

  const visibleCount = useMemo(
    () => filteredGroups.reduce((n, g) => n + g.members.length, 0),
    [filteredGroups],
  );

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          All Staff (
          {normalized ? `${visibleCount} of ${totalCount}` : totalCount})
        </h2>
        <div className="relative w-full sm:w-72">
          <label htmlFor={searchId} className="sr-only">
            Search staff
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
            placeholder="Search staff..."
            autoComplete="off"
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-3 text-sm text-orca-navy-900 placeholder:text-muted-foreground focus-visible:border-orca-navy-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
          />
        </div>
      </div>

      {filteredGroups.length > 0 ? (
        <div className="mt-4 space-y-6">
          {filteredGroups.map((group) => (
            <div key={group.id}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.name}
              </h3>
              <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.members.map((member) => (
                  <StaffRow
                    key={member.email ?? member.name}
                    member={member}
                    accent={group.accent}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center">
          <p className="text-sm font-medium text-orca-navy-900">
            No staff found
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a different name, title, or email.
          </p>
        </div>
      )}
    </section>
  );
}
