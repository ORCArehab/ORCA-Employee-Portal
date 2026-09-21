"use client";

import { useState } from "react";
import { OrcaMark } from "@/components/ui/OrcaMark";
import { BrandAccent } from "@/components/ui/BrandAccent";
import type { OrcaUser } from "@/types/user";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Header({ user }: { user: OrcaUser }) {
  // Depends on the viewer's local clock, so server and client can briefly
  // disagree on hydration — suppressHydrationWarning is the correct escape
  // hatch for that (rather than routing this through an effect).
  const [greeting] = useState(() => greetingForHour(new Date().getHours()));
  const firstName = user.name.trim().split(/\s+/)[0] || null;

  return (
    <header className="mb-8 flex items-start justify-between gap-6">
      <div>
        <p
          className="text-sm font-medium text-orca-gold-500"
          suppressHydrationWarning
        >
          {greeting}
          {firstName ? `, ${firstName}` : ""}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-orca-navy-900 sm:text-4xl">
          Welcome to ORCA Rehab
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your apps, resources, and company information, all in one place.
        </p>
        <BrandAccent className="mt-4" />
      </div>
      <OrcaMark className="hidden h-20 w-20 shrink-0 object-contain sm:block md:h-24 md:w-24" />
    </header>
  );
}
