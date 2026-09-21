"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { primaryNav } from "@/config/nav";
import type { OrcaUser } from "@/types/user";

const ROLE_LABELS: Record<OrcaUser["role"], string> = {
  EMPLOYEE: "Employee",
  PROVIDER: "Provider",
  SCRIBE: "Scribe",
  ADMIN: "Admin",
  IT: "IT",
};

export function Sidebar({
  user,
  onNavigate,
}: {
  user: OrcaUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
        <Image
          src="/brand/orca-icon.png"
          alt=""
          width={729}
          height={600}
          className="h-11 w-auto object-contain"
          priority
        />
        <div className="leading-tight">
          <p className="font-serif text-xl font-semibold text-orca-navy-900">
            ORCA Rehab
          </p>
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
            Employee Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {primaryNav.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-orca-navy-900 text-white shadow-sm"
                  : "text-orca-navy-700 hover:bg-orca-navy-800/5"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] ${
                  isActive ? "text-orca-gold-400" : "text-orca-navy-700/70"
                }`}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-3">
        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-orca-navy-800/5"
        >
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <UserCircle
              className="h-9 w-9 shrink-0 text-orca-navy-700/60"
              aria-hidden="true"
            />
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-orca-navy-900">
              {user.name || user.email}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
              {user.role !== "EMPLOYEE" ? ` · ${ROLE_LABELS[user.role]}` : ""}
            </p>
          </div>
        </Link>

        <div className="mt-1 flex flex-col">
          <Link
            href="/settings"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-orca-navy-700 transition hover:bg-orca-navy-800/5"
          >
            <Settings className="h-[18px] w-[18px] text-orca-navy-700/70" aria-hidden="true" />
            Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              void signOut({ callbackUrl: "/sign-in" });
            }}
            className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-orca-navy-700 transition hover:bg-orca-navy-800/5"
          >
            <LogOut className="h-[18px] w-[18px] text-orca-navy-700/70" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
