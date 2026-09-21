import type { Metadata } from "next";
import Image from "next/image";
import { siGoogle } from "simple-icons";
import { signIn } from "@/auth";
import { BrandAccent } from "@/components/ui/BrandAccent";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const params = await searchParams;
  const rawCallbackUrl = params.callbackUrl;
  const callbackUrl =
    typeof rawCallbackUrl === "string" && rawCallbackUrl.startsWith("/")
      ? rawCallbackUrl
      : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
        <Image
          src="/brand/orca-icon.png"
          alt=""
          width={729}
          height={600}
          className="mx-auto h-14 w-auto object-contain"
          priority
        />
        <h1 className="mt-4 font-serif text-2xl font-semibold text-orca-navy-900">
          ORCA Rehab
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Employee Portal</p>
        <BrandAccent className="mx-auto mt-4" />

        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-orca-navy-900 shadow-sm transition hover:border-orca-navy-800/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill={`#${siGoogle.hex}`} d={siGoogle.path} />
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground">
          Sign in with your ORCA Rehab Google Workspace account.
        </p>
      </div>
    </div>
  );
}
