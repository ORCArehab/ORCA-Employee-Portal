"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import type { OrcaUser } from "@/types/user";

export function PortalShell({
  children,
  user,
}: {
  children: ReactNode;
  user: OrcaUser;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar user={user} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <Image
          src="/brand/orca-lockup.png"
          alt="ORCA Rehab"
          width={1030}
          height={314}
          className="h-9 w-auto object-contain"
        />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-orca-navy-800 hover:bg-orca-navy-800/5"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-orca-navy-950/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-surface shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-orca-navy-700 hover:bg-orca-navy-800/5"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <Sidebar user={user} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen w-full flex-1 flex-col pt-14 lg:pt-0">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
