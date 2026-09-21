import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { PortalApp } from "@/types/portal";

export function AppCard({ app }: { app: PortalApp }) {
  const {
    name,
    description,
    href,
    visibility,
    icon: Icon,
    brandColor,
    brandIconPath,
    logoSrc,
    logoVariant = "icon",
  } = app;
  const isExternal = visibility === "external";

  let tile: React.ReactNode;

  if (logoSrc && logoVariant === "tile") {
    tile = (
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={logoSrc}
          alt={name}
          width={160}
          height={160}
          className="h-full w-full object-cover"
        />
      </div>
    );
  } else if (logoSrc && logoVariant === "wordmark") {
    tile = (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl p-2"
        style={{ backgroundColor: `#${brandColor}` }}
      >
        <Image
          src={logoSrc}
          alt={name}
          width={492}
          height={292}
          className="h-full w-full object-contain"
        />
      </div>
    );
  } else if (logoSrc) {
    tile = (
      <div
        className="flex h-14 w-14 items-center justify-center rounded-xl p-2.5"
        style={brandColor ? { backgroundColor: `#${brandColor}26` } : undefined}
      >
        <Image
          src={logoSrc}
          alt={name}
          width={44}
          height={44}
          className="h-full w-full object-contain"
        />
      </div>
    );
  } else if (brandColor) {
    tile = (
      <div
        className="flex h-14 w-14 items-center justify-center rounded-xl"
        style={{ backgroundColor: `#${brandColor}26`, color: `#${brandColor}` }}
      >
        {brandIconPath ? (
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={brandIconPath} />
          </svg>
        ) : (
          <Icon className="h-7 w-7" aria-hidden="true" />
        )}
      </div>
    );
  } else {
    tile = (
      <div
        className={
          isExternal
            ? "flex h-14 w-14 items-center justify-center rounded-xl bg-orca-navy-800/5 text-orca-navy-800"
            : "flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orca-navy-800 to-orca-navy-950 text-orca-gold-400 shadow-sm"
        }
      >
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
    );
  }

  const content = (
    <>
      {brandColor ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: `#${brandColor}` }}
        />
      ) : null}
      {tile}
      <div className="mt-4">
        <h3 className="text-base font-semibold text-orca-navy-900">{name}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </>
  );

  const className =
    "app-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orca-gold-500";
  const style: CSSProperties | undefined = brandColor
    ? ({ "--brand-color": `#${brandColor}` } as CSSProperties)
    : undefined;

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      {content}
    </Link>
  );
}
