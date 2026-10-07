/** The shapes the ORCA API returns for a provider's own schedule and facilities (fields the portal uses). */

export type EntryType = "facility" | "coverage" | "admin" | "clinic" | "pto" | "off";
export type TimeBlock = "am" | "pm" | "all_day" | "custom";

export interface ScheduleEntry {
  id: string;
  date: string;
  type: EntryType;
  facilityId: string | null;
  coveringStaffId: string | null;
  timeBlock: TimeBlock;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
}

export interface ScheduleFacility {
  id: string;
  name: string;
  abbreviation: string | null;
  address: { line1: string | null; city: string | null; state: string | null };
}

export interface MySchedule {
  from: string;
  to: string;
  linked: boolean;
  assignments: ScheduleEntry[];
  facilities: ScheduleFacility[];
  /** Names of the people being covered for. */
  coveredStaff: { id: string; displayName: string }[];
}

export const LOGIN_METHODS = ["ringcentral_sms", "sms", "authenticator_app", "email", "none", "other", "unknown"] as const;
export type LoginMethod = (typeof LOGIN_METHODS)[number];

export const LOGIN_METHOD_LABELS: Record<LoginMethod, string> = {
  ringcentral_sms: "RingCentral (text)",
  sms: "Text message",
  authenticator_app: "Authenticator app",
  email: "Email",
  none: "None",
  other: "Other",
  unknown: "Not recorded",
};

export const ACCESS_STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  active: "Active",
  disabled: "Not working",
  expired: "Expired",
  unknown: "Not recorded",
};

/** One of my hospital logins at a facility (PointClickCare or another system). Never includes the password. */
export interface HospitalLogin {
  id: string;
  /** "pcc" = PointClickCare; "other" = another hospital system, named in systemName. Older API: absent (PCC). */
  system?: "pcc" | "other";
  systemName?: string | null;
  organization: string | null;
  username: string | null;
  loginMethod: LoginMethod;
  loginMethodDetail: string | null;
  status: string;
  notes: string | null;
  hasPassword: boolean;
  passwordSetAt: string | null;
  passwordSetBy: string | null;
  passwordSetVia: string | null;
  usernameSetAt: string | null;
  usernameSetBy: string | null;
  usernameSetVia: string | null;
}

export interface MyFacility {
  id: string;
  name: string;
  abbreviation: string | null;
  address: { line1: string | null; city: string | null; state: string | null; postalCode: string | null };
  phone: string | null;
  assignments: { id: string; type: string; effectiveFrom: string | null }[];
  /** Every login I have here, PointClickCare first (newer API). */
  logins?: HospitalLogin[];
  /** My PointClickCare login here (older API). */
  pcc: HospitalLogin | null;
}


/** My logins at a facility, whichever API version answered. */
export const loginsAt = (f: Pick<MyFacility, "logins" | "pcc">): HospitalLogin[] => f.logins ?? (f.pcc ? [f.pcc] : []);

/** "PointClickCare", or the other system's name. */
export const systemLabel = (l: Pick<HospitalLogin, "system" | "systemName">) => (l.system === "other" ? (l.systemName ?? "Other system") : "PointClickCare");

export interface MyFacilities {
  linked: boolean;
  facilities: MyFacility[];
}
