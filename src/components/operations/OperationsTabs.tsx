"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/operations", label: "Overview", match: (p: string) => p === "/operations" },
  { href: "/operations/providers", label: "Providers", match: (p: string) => p.startsWith("/operations/providers") },
  { href: "/operations/scribes", label: "Scribes", match: (p: string) => p.startsWith("/operations/scribes") },
];

export function OperationsTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Operations" className="mb-6 flex gap-1 border-b border-border">
      {TABS.map((t) => {
        const active = t.match(pathname);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500 ${
              active ? "border-orca-gold-500 text-orca-navy-900" : "border-transparent text-muted-foreground hover:text-orca-navy-900"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
