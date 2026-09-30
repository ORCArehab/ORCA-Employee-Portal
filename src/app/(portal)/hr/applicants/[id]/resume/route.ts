import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createResumeLink } from "@/lib/careersApi";
import { OrcaApiError } from "@/lib/orcaApi";
import { canManageApplicants } from "@/lib/permissions";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Opens an applicant's résumé: checks HR access, gets a fresh 5-minute signed
 * link from the Careers API, and redirects to it. The link is never stored or
 * shown on a page, so there is no lasting URL to share.
 */
export async function GET(_request: Request, { params }: RouteContext<"/hr/applicants/[id]/resume">) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  if (!canManageApplicants(user)) return new NextResponse("Not found", { status: 404 });

  const { id } = await params;
  if (!UUID.test(id)) return new NextResponse("Not found", { status: 404 });

  try {
    const { url } = await createResumeLink(id);
    const response = NextResponse.redirect(url, 303);
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch (error) {
    if (error instanceof OrcaApiError && error.status === 404) {
      return new NextResponse("Not found", { status: 404 });
    }
    console.error("[hr] résumé link failed", { applicationId: id, error: String(error) });
    return new NextResponse("The résumé couldn't be opened. Please try again.", { status: 502 });
  }
}
