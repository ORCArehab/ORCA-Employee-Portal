import type { BrandAccentColor } from "@/types/portal";

/**
 * Shapes the ORCA API's staff and facility records into what the Directory and Facilities pages
 * show. Pure, so it's tested without the API (src/lib/orgShape.test.ts).
 */

/** A staff record as GET /v1/org/staff returns it (fields the portal uses). Restricted fields appear for HR/admins. */
export interface ApiStaff {
  id: string;
  displayName: string;
  title: string | null;
  category: string;
  workEmail: string | null;
  ringcentralPhone?: string | null;
  employmentStatus?: string;
  directoryVisible?: boolean;
}

export interface ApiFacility {
  id: string;
  name: string;
  abbreviation: string | null;
  type: string;
  region: string | null;
  county: string | null;
  address: { line1: string | null; line2: string | null; city: string | null; state: string | null; postalCode: string | null };
  phone: string | null;
  operationalStatus: string;
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  email: string | null;
  phone: string | null;
}

export interface StaffGroup {
  id: string;
  name: string;
  accent: BrandAccentColor;
  members: StaffMember[];
}

export interface Facility {
  id: string;
  name: string;
  /** Region (or county) grouping; searchable. */
  region: string;
  /** One line; shown when a row is expanded; searchable. */
  address: string;
  phone: string | null;
  type: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  physician: "Physician",
  np_pa: "NP / PA",
  scribe: "Scribe",
  administrative: "Administrative",
  clinical_coordination: "Clinical coordination",
  it: "IT",
};

const GROUPS: { id: string; name: string; accent: BrandAccentColor; categories: string[] }[] = [
  { id: "providers", name: "Providers", accent: "navy", categories: ["physician", "np_pa"] },
  { id: "operations", name: "Administrative & Operations", accent: "gold", categories: ["administrative", "clinical_coordination", "it"] },
  { id: "scribes", name: "Scribes", accent: "sky", categories: ["scribe"] },
];

/** "Co-Founder", "Co-founder & CEO", "Cofounder": anyone whose job title says so is listed first. */
const FOUNDER = /\bco-?\s?founder\b/i;

/** The title without the co-founder part, which the group heading already says: "Co-Founder · CEO / MD" → "CEO / MD". */
const withoutFounder = (title: string) => title.replace(FOUNDER, "").replace(/^[\s·|,/&-]+|[\s·|,/&-]+$/g, "").trim();

/**
 * Directory groups: Co-Founders (by job title, set in ORCA Admin), Providers, Administrative &
 * Operations, Scribes, then Other. People hidden from
 * the directory or no longer with ORCA are left out (the API already does this for most viewers;
 * HR and admins get everyone, so it's applied here too).
 */
export function staffGroups(staff: ApiStaff[]): StaffGroup[] {
  const shown = staff.filter((s) => s.directoryVisible !== false && s.employmentStatus !== "separated");
  const member = (s: ApiStaff): StaffMember => ({
    id: s.id,
    name: s.displayName,
    title: s.title ?? CATEGORY_LABELS[s.category] ?? "",
    email: s.workEmail,
    phone: s.ringcentralPhone ?? null,
  });
  const byName = (a: StaffMember, b: StaffMember) => a.name.localeCompare(b.name);
  const founders = shown.filter((s) => s.title && FOUNDER.test(s.title));
  const rest = shown.filter((s) => !founders.includes(s));
  const known = new Set(GROUPS.flatMap((g) => g.categories));
  const groups: StaffGroup[] = [
    {
      id: "co-founders",
      name: "Co-Founders",
      accent: "gold",
      members: founders.map((s) => ({ ...member(s), title: withoutFounder(s.title!) || "Co-Founder" })).sort(byName),
    },
  ];
  groups.push(...GROUPS.map((g) => ({ id: g.id, name: g.name, accent: g.accent, members: rest.filter((s) => g.categories.includes(s.category)).map(member).sort(byName) })));
  groups.push({ id: "other", name: "Other Staff", accent: "navy", members: rest.filter((s) => !known.has(s.category)).map(member).sort(byName) });
  return groups.filter((g) => g.members.length > 0);
}

const TYPE_LABELS: Record<string, string> = { snf: "Skilled nursing", alf: "Assisted living", hospital: "Hospital", ltac: "Long-term acute care", irf: "Inpatient rehab" };

/** Facilities ORCA works with now (inactive ones left out), by region, then name. */
export function facilityList(facilities: ApiFacility[]): Facility[] {
  return facilities
    .filter((f) => f.operationalStatus !== "inactive")
    .map((f) => {
      const a = f.address;
      const cityLine = [a.city, [a.state, a.postalCode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
      return {
        id: f.id,
        name: f.name,
        region: f.region ?? (f.county ? f.county.replace(/\s+county$/i, "") : "Other"),
        address: [a.line1, a.line2, cityLine].filter(Boolean).join(", "),
        phone: f.phone,
        type: TYPE_LABELS[f.type] ?? null,
      };
    })
    .sort((x, y) => x.region.localeCompare(y.region) || x.name.localeCompare(y.name));
}
