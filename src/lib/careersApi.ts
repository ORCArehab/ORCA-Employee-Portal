import "server-only";
import type { ApplicationStatus } from "@/lib/applicationStatus";
import type { OrcaUser } from "@/types/user";

/**
 * Client for the HR routes of the ORCA Careers API (Cloud Run), which holds
 * job applications and résumés. Server-only: the API key must never reach
 * the browser.
 *
 * Every call takes the signed-in user. Callers must have already checked
 * canManageApplicants(user); the API additionally requires the portal key
 * and an ORCA Workspace email, and records that email on status changes.
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

export class CareersApiError extends Error {
  constructor(readonly status: number) {
    super(`Careers API responded ${status}`);
  }
}

export function isCareersApiConfigured(): boolean {
  return !!process.env.CAREERS_API_URL?.trim() && !!process.env.CAREERS_API_KEY?.trim();
}

async function request<T>(user: OrcaUser, path: string, init: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.CAREERS_API_URL?.trim().replace(/\/+$/, "");
  const key = process.env.CAREERS_API_KEY?.trim();
  if (!baseUrl || !key) throw new CareersApiError(503);

  const res = await fetch(`${baseUrl}/v1/hr${path}`, {
    ...init,
    headers: {
      ...init.headers,
      authorization: `Bearer ${key}`,
      "x-orca-actor-email": user.email,
    },
    // Applicant data is always fetched fresh and never cached.
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new CareersApiError(res.status);
  return (await res.json()) as T;
}

export function listJobs(user: OrcaUser) {
  return request<{ jobs: { slug: string; title: string; location: string; active: boolean }[] }>(user, "/jobs");
}

export function listApplications(user: OrcaUser, filters: ApplicationFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  return request<{ total: number; page: number; pageSize: number; applications: ApplicationSummary[] }>(
    user,
    `/applications?${params}`,
  );
}

/** Returns null if there's no such application. */
export async function getApplication(user: OrcaUser, id: string): Promise<ApplicationDetail | null> {
  try {
    return (await request<{ application: ApplicationDetail }>(user, `/applications/${encodeURIComponent(id)}`))
      .application;
  } catch (error) {
    if (error instanceof CareersApiError && error.status === 404) return null;
    throw error;
  }
}

export function updateApplicationStatus(user: OrcaUser, id: string, status: ApplicationStatus) {
  return request<{ status: ApplicationStatus }>(user, `/applications/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

/** A short-lived (5 minute) link to the résumé PDF. Request one per view; never store it. */
export function createResumeLink(user: OrcaUser, id: string) {
  return request<{ url: string; expiresAt: string }>(user, `/applications/${encodeURIComponent(id)}/resume-link`, {
    method: "POST",
  });
}
