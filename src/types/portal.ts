import type { LucideIcon } from "lucide-react";
import type { PortalRole } from "@/types/user";

/** Where a linked application lives relative to the portal. */
export type AppVisibility = "internal" | "external";

export interface PortalApp {
  id: string;
  name: string;
  /** Short line shown under the app name, e.g. "Clinical Documentation". */
  description: string;
  href: string;
  visibility: AppVisibility;
  icon: LucideIcon;
  /**
   * Brand color (hex, no `#`) used to tint the icon tile. Verified official
   * colors (sourced from simple-icons) and rough placeholder approximations
   * both use this field — see the comment on each entry in config/apps.ts.
   */
  brandColor?: string;
  /**
   * Official brand mark as SVG path data (`viewBox="0 0 24 24"`), e.g. from
   * simple-icons. Renders instead of `icon` when present. Leave unset for
   * brands without a verified source rather than guessing at a logo.
   */
  brandIconPath?: string;
  /**
   * Local brand asset path (e.g. "/brand/claimocity-icon.png"). Takes
   * precedence over `brandIconPath` and `icon` when present.
   */
  logoSrc?: string;
  /**
   * "icon" (default): `logoSrc` is a transparent icon-only mark, shown on a
   * light `brandColor`-tinted tile like the other cards.
   * "wordmark": `logoSrc` is a full-bleed lockup that already supplies its
   * own background (e.g. a wordmark on a solid brand-color block) — shown
   * edge-to-edge on a solid `brandColor` tile instead of tinted.
   * "tile": `logoSrc` is already a finished, self-contained square icon
   * (its own background baked in, e.g. an app-icon-style asset) — shown
   * as-is, filling the tile with no extra background or padding.
   */
  logoVariant?: "icon" | "wordmark" | "tile";
  /**
   * Roles allowed to see/open this app. Unset or empty = visible to every
   * active, authenticated employee (today's behavior for every app in
   * config/apps.ts). This only controls whether the card is shown — it is
   * not a substitute for the target application enforcing its own access
   * control once it has real integrations.
   */
  allowedRoles?: PortalRole[];
  /** Set while an app's destination isn't wired up yet. */
  disabled?: boolean;
}

/** One of the three colors in the ORCA icon mark, used as an accent. */
export type BrandAccentColor = "navy" | "gold" | "sky";

export interface PortalResource {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Icon tile accent color. Defaults to "sky" if unset. */
  accent?: BrandAccentColor;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  /** ISO date string. */
  publishedAt: string;
  category?: string;
}

export type { PortalRole, OrcaUser } from "@/types/user";
