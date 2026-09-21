import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = { title: "Access Denied" };

function messageForError(error: string | undefined): string {
  if (error === "AccessDenied") {
    return "Your Google account isn't part of the ORCA Rehab organization, so it can't access this portal. If this seems wrong, contact IT.";
  }
  return "Something went wrong while signing you in. Please try again.";
}

export default async function AccessDeniedPage({
  searchParams,
}: PageProps<"/access-denied">) {
  const params = await searchParams;
  const rawError = params.error;
  const error = typeof rawError === "string" ? rawError : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
        <Image
          src="/brand/orca-icon.png"
          alt=""
          width={729}
          height={600}
          className="mx-auto h-11 w-auto object-contain"
        />

        <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orca-gold-050 text-orca-gold-500">
          <ShieldAlert className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-4 font-serif text-2xl font-semibold text-orca-navy-900">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {messageForError(error)}
        </p>

        <Link
          href="/sign-in"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-orca-navy-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orca-navy-800"
        >
          Try a different account
        </Link>
      </div>
    </div>
  );
}
