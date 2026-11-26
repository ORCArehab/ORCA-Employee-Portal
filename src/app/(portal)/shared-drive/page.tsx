import type { Metadata } from "next";
import Link from "next/link";
import { Building, ExternalLink, Network, ShieldCheck } from "lucide-react";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { sharedDriveLinks } from "@/config/sharedDrive";

export const metadata: Metadata = { title: "Shared Drive" };

const ICONS = { office: Building, tailscale: Network, wireguard: ShieldCheck } as const;

export default function SharedDrivePage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">
          Shared Drive
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The company&apos;s shared files, read-only: you can open and download them, but not
          change them. Choose the link for how you&apos;re connected right now.
        </p>
        <BrandAccent className="mt-4" />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sharedDriveLinks.map((link) => {
          const Icon = ICONS[link.id as keyof typeof ICONS] ?? Network;
          return (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orca-navy-800 to-orca-navy-950 text-orca-gold-400 shadow-sm">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-3 text-base font-semibold text-orca-navy-900">{link.label}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{link.description}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 break-all font-mono text-xs text-orca-navy-700">
                {link.href.replace(/^http:\/\//, "")}
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </span>
            </a>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        These links only open on ORCA&apos;s network. If none of them loads, connect to the office
        Wi-Fi, Tailscale or WireGuard first, or ask{" "}
        <Link href="/it-support" className="font-medium text-orca-navy-800 underline underline-offset-2">
          IT Support
        </Link>
        .
      </p>
    </div>
  );
}
