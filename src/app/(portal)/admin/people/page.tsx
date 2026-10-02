import type { Metadata } from "next";
import Link from "next/link";
import { Search, UserCircle } from "lucide-react";
import { AddPersonForm } from "@/components/admin/AddPersonForm";
import { PersonAccessForm } from "@/components/admin/PersonAccessForm";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { requireAdminUser } from "@/lib/adminAccess";
import { isOrcaApiConfigured } from "@/lib/orcaApi";
import { listPeople, listRoles } from "@/lib/peopleApi";

export const metadata: Metadata = { title: "People & Roles" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function PeoplePage({ searchParams }: PageProps<"/admin/people">) {
  const user = await requireAdminUser();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";

  let data: [Awaited<ReturnType<typeof listPeople>>, Awaited<ReturnType<typeof listRoles>>] | null = null;
  if (isOrcaApiConfigured()) {
    try {
      data = await Promise.all([listPeople(q || undefined), listRoles()]);
    } catch (error) {
      console.error("[admin] could not load people", { error: String(error) });
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">People &amp; Roles</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Who can use ORCA apps, and what extra access they have. Changes apply across the portal, careers, and
          onboarding apps, and are recorded with your name.
        </p>
        <BrandAccent className="mt-4" />
      </header>

      {!data ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center">
          <p className="text-sm font-medium text-orca-navy-900">People couldn&apos;t be loaded</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isOrcaApiConfigured()
              ? "The ORCA API didn't respond. Try again in a moment."
              : "The ORCA API isn't configured yet (CAREERS_API_URL / CAREERS_API_KEY)."}
          </p>
        </div>
      ) : (
        <PeopleList data={data} q={q} currentUserId={user.id} />
      )}
    </div>
  );
}

function PeopleList({
  data: [{ people }, { roles }],
  q,
  currentUserId,
}: {
  data: [Awaited<ReturnType<typeof listPeople>>, Awaited<ReturnType<typeof listRoles>>];
  q: string;
  currentUserId: string;
}) {
  return (
    <div className="space-y-6">
      <AddPersonForm />

      <form method="get" role="search" className="flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="q" className="sr-only">Search by name or email</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search name or email"
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-3 text-sm text-orca-navy-900 focus-visible:border-orca-navy-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-orca-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-orca-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
        >
          Search
        </button>
        {q ? (
          <Link href="/admin/people" className="rounded-xl px-3 py-2 text-sm font-medium text-orca-navy-700 hover:bg-orca-navy-800/5">
            Clear
          </Link>
        ) : null}
      </form>

      {people.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center text-sm text-muted-foreground">
          {q ? "Nobody matches that search." : "Nobody has signed in yet."}
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {people.map((person) => (
            <li
              key={person.id}
              className={`grid grid-cols-1 gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center ${person.active ? "" : "bg-orca-navy-800/[0.03]"}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                {person.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Google profile photos, small and remote.
                  <img src={person.imageUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserCircle className="h-9 w-9 shrink-0 text-orca-navy-700/60" aria-hidden="true" />
                )}
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-medium text-orca-navy-900">
                    {person.name || person.email}
                    {person.id === currentUserId ? <span className="font-normal text-muted-foreground"> (you)</span> : null}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {person.email} ·{" "}
                    {person.lastSignInAt ? `Last signed in ${formatDate(person.lastSignInAt)}` : "Hasn't signed in yet"}
                  </p>
                </div>
              </div>
              <PersonAccessForm
                personId={person.id}
                roles={roles}
                currentRoles={person.roles}
                active={person.active}
                isSelf={person.id === currentUserId}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
