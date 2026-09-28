import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText, Link2, Mail, Phone } from "lucide-react";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { StatusBadge } from "@/components/hr/StatusBadge";
import { StatusForm } from "@/components/hr/StatusForm";
import { APPLICATION_STATUS_LABELS } from "@/lib/applicationStatus";
import { getApplication } from "@/lib/careersApi";
import { requireHrUser } from "@/lib/hrAccess";

// Applicant names stay out of the browser tab title and history.
export const metadata: Metadata = { title: "Applicant" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatAnswer(key: string, answer: string) {
  if (answer === "yes") return "Yes";
  if (answer === "no") return "No";
  if (key.endsWith("_years")) return `${answer} ${answer === "1" ? "year" : "years"}`;
  return answer;
}

export default async function ApplicantPage({ params }: PageProps<"/hr/applicants/[id]">) {
  const user = await requireHrUser();
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const application = await getApplication(user, id);
  if (!application) notFound();

  const name = `${application.firstName} ${application.lastName}`;

  return (
    <div>
      <Link
        href="/hr/applicants"
        className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-orca-navy-700 hover:text-orca-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All applicants
      </Link>

      <header className="mb-8 mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">{name}</h1>
          <StatusBadge status={application.status} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {application.job.title} · {application.job.location} · Applied {formatDateTime(application.submittedAt)}
        </p>
        <BrandAccent className="mt-4" />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Card title="Screening Questions">
            {application.answers.length > 0 ? (
              <dl className="divide-y divide-border">
                {application.answers.map((answer) => (
                  <div key={answer.key} className="grid grid-cols-1 gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_9rem] sm:gap-4">
                    <dt className="text-sm text-orca-navy-800">{answer.label}</dt>
                    <dd className="text-sm font-semibold text-orca-navy-900 sm:text-right">
                      {formatAnswer(answer.key, answer.answer)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">No screening questions for this position.</p>
            )}
          </Card>

          <Card title="Cover Letter / Comments">
            {application.coverLetter ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-orca-navy-800">{application.coverLetter}</p>
            ) : (
              <p className="text-sm text-muted-foreground">None provided.</p>
            )}
          </Card>

          <Card title="Status History">
            <ol className="space-y-2">
              {application.statusHistory.map((event, index) => (
                <li key={index} className="text-sm text-orca-navy-800">
                  <span className="font-medium">{APPLICATION_STATUS_LABELS[event.to]}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {formatDateTime(event.changedAt)} · {event.changedBy === "applicant" ? "Submitted by applicant" : event.changedBy}
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <StatusForm applicationId={application.id} currentStatus={application.status} />
          </Card>

          <Card title="Contact">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-orca-navy-700/70" aria-hidden="true" />
                <a href={`mailto:${application.email}`} className="break-all text-orca-navy-800 hover:underline">
                  {application.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-orca-navy-700/70" aria-hidden="true" />
                <a href={`tel:${application.phone.replace(/[^\d+]/g, "")}`} className="text-orca-navy-800 hover:underline">
                  {application.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Link2 className="h-4 w-4 shrink-0 text-orca-navy-700/70" aria-hidden="true" />
                {application.linkedinUrl ? (
                  <a
                    href={application.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 break-all text-orca-navy-800 hover:underline"
                  >
                    LinkedIn profile
                    <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </li>
            </ul>
          </Card>

          <Card title="Résumé">
            <a
              href={`/hr/applicants/${application.id}/resume`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border p-3 transition hover:border-orca-navy-800/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orca-sky-050 text-orca-navy-800">
                <FileText className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-orca-navy-900">{application.resume.filename}</span>
                <span className="block text-xs text-muted-foreground">
                  PDF · {(application.resume.sizeBytes / 1024 / 1024).toFixed(1)} MB · opens in a new tab
                </span>
              </span>
            </a>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      {title ? (
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
