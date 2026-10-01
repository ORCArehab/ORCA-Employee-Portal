import "server-only";
import type { ApplicationStatus } from "@/lib/applicationStatus";
import { OrcaApiError, orcaApiRequestAsUser } from "@/lib/orcaApi";

/**
 * HR routes of the ORCA Careers API: job applications and résumés. Every call
 * is made as the signed-in person (see src/lib/orcaApi.ts); the API requires
 * them to hold the HR or ADMIN role and records them on status changes.
 * Callers still check canManageApplicants(user) first, to render the right page.
 */

export interface ApplicationSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: ApplicationStatus;
  submittedAt: string;
  job: { slug: string; title: string; location: string };
}

export interface ApplicationDetail extends ApplicationSummary {
  linkedinUrl: string | null;
  coverLetter: string | null;
  updatedAt: string;
  resume: { filename: string; sizeBytes: number };
  answers: { key: string; label: string; answer: string }[];
  statusHistory: { from: ApplicationStatus | null; to: ApplicationStatus; changedBy: string; changedAt: string }[];
}

export interface ApplicationFilters {
  job?: string;
  status?: string;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
}

function request<T>(path: string, init?: RequestInit) {
  return orcaApiRequestAsUser<T>(`/v1/hr${path}`, init);
}

export function listJobs() {
  return request<{ jobs: { slug: string; title: string; location: string; active: boolean }[] }>("/jobs");
}

export function listApplications(filters: ApplicationFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  return request<{ total: number; page: number; pageSize: number; applications: ApplicationSummary[] }>(
    `/applications?${params}`,
  );
}

/** Returns null if there's no such application. */
export async function getApplication(id: string): Promise<ApplicationDetail | null> {
  try {
    return (await request<{ application: ApplicationDetail }>(`/applications/${encodeURIComponent(id)}`))
      .application;
  } catch (error) {
    if (error instanceof OrcaApiError && error.status === 404) return null;
    throw error;
  }
}

export function updateApplicationStatus(id: string, status: ApplicationStatus) {
  return request<{ status: ApplicationStatus }>(`/applications/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

/** A short-lived (5 minute) link to the résumé PDF. Request one per view; never store it. */
export function createResumeLink(id: string) {
  return request<{ url: string; expiresAt: string }>(`/applications/${encodeURIComponent(id)}/resume-link`, {
    method: "POST",
  });
}
