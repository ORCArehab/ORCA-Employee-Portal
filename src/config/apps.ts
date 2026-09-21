import {
  FolderOpen,
  Clock3,
  PhoneCall,
  HeartPulse,
  Receipt,
  MessagesSquare,
  Video,
  Mail,
} from "lucide-react";
import {
  siGmail,
  siGoogledrive,
  siGooglechat,
  siGooglemeet,
  siQuickbooks,
} from "simple-icons";
import type { PortalApp } from "@/types/portal";

/**
 * ORCA's internal + shortcut applications. Add new apps here — cards on the
 * dashboard and the /apps page are generated from this list, nothing else
 * needs to change.
 *
 * Logo sourcing, in order of preference:
 *  1. `logoSrc` — a real brand asset the team dropped in `assets/` (cropped
 *     into `public/brand/`). Most accurate, used for PCC and Claimocity.
 *  2. `brandIconPath` — a verified official mark from simple-icons
 *     (https://simpleicons.org, CC0-licensed SVGs). Used for Gmail, Google
 *     Drive, Google Chat, Google Meet, and QuickBooks.
 *  3. `brandColor` alone — no verified logo, so the generic `icon` is just
 *     tinted with a rough approximation of the brand's real-world color.
 *     Used for RingCentral until we have a real asset for it too.
 */
export const portalApps: PortalApp[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Email",
    href: "https://mail.google.com",
    visibility: "external",
    icon: Mail,
    brandColor: siGmail.hex,
    brandIconPath: siGmail.path,
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Files & Documents",
    href: "https://drive.google.com",
    visibility: "external",
    icon: FolderOpen,
    brandColor: siGoogledrive.hex,
    brandIconPath: siGoogledrive.path,
  },
  {
    id: "google-chat",
    name: "Google Chat",
    description: "Messaging & Spaces",
    href: "https://chat.google.com",
    visibility: "external",
    icon: MessagesSquare,
    brandColor: siGooglechat.hex,
    brandIconPath: siGooglechat.path,
  },
  {
    id: "google-meet",
    name: "Google Meet",
    description: "Video Meetings",
    href: "https://meet.google.com",
    visibility: "external",
    icon: Video,
    brandColor: siGooglemeet.hex,
    brandIconPath: siGooglemeet.path,
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Time & Payroll",
    href: "https://qbo.intuit.com",
    visibility: "external",
    icon: Clock3,
    brandColor: siQuickbooks.hex,
    brandIconPath: siQuickbooks.path,
  },
  {
    id: "ringcentral",
    name: "RingCentral",
    description: "Calls & Messages",
    href: "https://app.ringcentral.com",
    visibility: "external",
    icon: PhoneCall,
    // Placeholder approximation of RingCentral's orange — not the official mark.
    brandColor: "F5610D",
  },
  {
    id: "pcc",
    name: "PCC",
    description: "EHR & Care Management",
    href: "https://pointclickcare.com",
    visibility: "external",
    icon: HeartPulse,
    logoSrc: "/brand/pcc-icon.png",
    logoVariant: "tile",
    // Not used by the tile itself (it supplies its own color) — only for
    // the card's hover/accent coordination. Sampled from the icon's green.
    brandColor: "849C31",
  },
  {
    id: "claimocity",
    name: "Claimocity",
    description: "Charge Capture & Billing",
    href: "https://claimocity.com",
    visibility: "external",
    icon: Receipt,
    logoSrc: "/brand/claimocity-icon.png",
    // Approximate color sampled from the icon itself, for the tile tint.
    brandColor: "4661E6",
  },
];
