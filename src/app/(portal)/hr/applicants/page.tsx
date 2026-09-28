import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { StatusBadge } from "@/components/hr/StatusBadge";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
} from "@/lib/applicationStatus";
import {
  isCareersApiConfigured,
  listApplications,
  listJobs,
  type ApplicationFilters,
} from "@/lib/careersApi";
import { requireHrUser } from "@/lib/hrAccess";

export const metadata: Metadata = { title: "Applicants" };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-orca-navy-900 focus-visible:border-orca-navy-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500";

function first(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ApplicantsPage({
  searchParams,
}: PageProps<"/hr/applicants">) {
  const user = await requireHrUser();
  const params = await searchParams;

  const filters: ApplicationFilters = {
    job: first(params.job)?.slice(0, 100),
    status: first(params.status),
    from: DATE.test(first(params.from) ?? "") ? first(params.from) : undefined,
    to: DATE.test(first(params.to) ?? "") ? first(params.to) : undefined,
    q: first(params.q)?.slice(0, 100),
    page: Math.max(1, Number.parseInt(first(params.page) ?? "1", 10) || 1),
  };
  if (filters.status && !(APPLICATION_STATUSES as readonly string[]).includes(filters.status)) {
    filters.status = undefined;
  }

  let data: Awaited<ReturnType<typeof listApplications>> | null = null;
  let jobs: Awaited<ReturnType<typeof listJobs>>["jobs"] = [];
  if (isCareersApiConfigured()) {
    try {
      [data, { jobs }] = await Promise.all([listApplications(user, filters), listJobs(user)]);
    } catch (error) {
      console.error("[hr] could not load applicants", { error: String(error) });
    }
  }

  const hasFilters = !!(filters.job || filters.status || filters.from || filters.to || filters.q);
  const pageCount = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const pageHref = (page: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filters, page })) {
      if (value !== undefined && value !== "" && !(key === "page" && value === 1)) next.set(key, String(value));
    }
    const query = next.toString();
    return query ? `/hr/applicants?${query}` : "/hr/applicants";
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">Applicants</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Applications submitted through the ORCA Rehab website. Applicant information is confidential.
        </p>
        <BrandAccent className="mt-4" />
      </header>

      <form
        method="get"
        role="search"
        className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto_auto_auto]"
      >
        <div className="relative">
          <label htmlFor="q" className="sr-only">
            Search by name or email
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Search name or email"
            className={`${fieldClass} pl-9`}
          />
        </div>
        <div>
          <label htmlFor="job" className="sr-only">
            Position
          </label>
          <select id="job" name="job" defaultValue={filters.job ?? ""} className={fieldClass}>
            <option value="">All positions</option>
            {jobs.map((job) => (
              <option key={job.slug} value={job.slug}>
                {job.title} — {job.location}
                {job.active ? "" : " (closed)"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="sr-only">
            Status
          </label>
          <select id="status" name="status" defaultValue={filters.status ?? ""} className={fieldClass}>
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="from" className="text-xs text-muted-foreground">
            From
          </label>
          <input id="from" name="from" type="date" defaultValue={filters.from} className={fieldClass} />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="to" className="text-xs text-muted-foreground">
            To
          </label>
          <input id="to" name="to" type="date" defaultValue={filters.to} className={fieldClass} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="rounded-xl bg-orca-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-orca-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
          >
            Apply
          </button>
          {hasFilters ? (
            <Link
              href="/hr/applicants"
              className="rounded-xl px-3 py-2 text-sm font-medium text-orca-navy-700 hover:bg-orca-navy-800/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      {!data ? (
        <EmptyState
          title="Applicants couldn't be loaded"
          body={
            isCareersApiConfigured()
              ? "The careers service didn't respond. Try again in a moment."
              : "The careers service isn't configured yet (CAREERS_API_URL / CAREERS_API_KEY)."
          }
        />
      ) : data.applications.length === 0 ? (
        <EmptyState
          title={hasFilters ? "No applicants match these filters" : "No applications yet"}
          body={hasFilters ? "Try widening the search or clearing filters." : "New applications will appear here."}
        />
      ) : (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            {data.total} {data.total === 1 ? "applicant" : "applicants"} · newest first
          </p>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Applicant</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Position</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Applied</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.applications.map((application) => (
                  <tr key={application.id} className="relative transition hover:bg-orca-navy-800/[0.03]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/hr/applicants/${application.id}`}
                        className="font-medium text-orca-navy-900 after:absolute after:inset-0 hover:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-orca-gold-500"
                      >
                        {application.firstName} {application.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-orca-navy-800">
                      {application.job.title}
                      <span className="block text-xs text-muted-foreground">{application.job.location}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-orca-navy-800">
                      {formatDate(application.submittedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-4 py-3 text-orca-navy-800">{application.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-orca-navy-800">{application.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 ? (
            <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Page {data.page} of {pageCount}
              </span>
              <div className="flex gap-2">
                {data.page > 1 ? (
                  <Link href={pageHref(data.page - 1)} className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 font-medium text-orca-navy-800 hover:bg-orca-navy-800/5">
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
                  </Link>
                ) : null}
                {data.page < pageCount ? (
                  <Link href={pageHref(data.page + 1)} className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 font-medium text-orca-navy-800 hover:bg-orca-navy-800/5">
                    Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center">
      <p className="text-sm font-medium text-orca-navy-900">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
