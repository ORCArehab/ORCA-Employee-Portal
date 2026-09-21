import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/layout/PortalShell";
import { getCurrentUser } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Proxy (src/proxy.ts) already redirects signed-out requests before this
  // renders — this is a second, independent check per route render rather
  // than relying on Proxy alone, and it's how the shell gets the
  // authenticated employee to display.
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return <PortalShell user={user}>{children}</PortalShell>;
}
