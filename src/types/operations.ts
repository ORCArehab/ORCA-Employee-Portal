/**
 * Response contracts of the ORCA API's operations dashboard (GET /v1/dashboard/providers and
 * /v1/dashboard/scribes). Only the fields the portal uses are typed; parser diagnostics are
 * deliberately not shown in the admin UI.
 */

// ── Providers ────────────────────────────────────────────

export interface ProviderEntry {
  name: string;
  /** "incomplete" when some of this provider's source data could not be read. */
  dataStatus: "ok" | "incomplete";
  /** Rows flagged for source-data review. */
  warningCount: number;
  tabs: string[];

  expectedNotes: number;
  completedNotes: number;
  outstandingNotes: number;
  /** Notes whose upload status is blank or free text — neither completed nor outstanding. */
  unknownStatusNotes: number;
  /** completed + outstanding. */
  classifiedNotes: number;
  /** completed / classified × 100; null when nothing has a known status. */
  completionRate: number | null;
  /** classified / expected × 100; null when nothing is expected. */
  statusCoveragePercent: number | null;

  outstandingBatches: number;
  oldestOutstandingDays: number | null;
  oldestOutstandingVisitDate: string | null;
  consults: number;
  followUps: number;
  billingSheetBacklog: number;
  facesheetBacklog: number;
}

export interface ProviderDashboard {
  meta: {
    generatedAt: string;
    asOfDate: string;
    timezone: string;
    cached: boolean;
    completionBasis: string;
    definitions: {
      completionRate: string;
      statusCoveragePercent: string;
      classifiedNotes: string;
      unknownStatusNotes: string;
      outstandingBatches: string;
    };
    statusCoverage: {
      expectedNotes: number;
      classifiedNotes: number;
      unknownStatusNotes: number;
      classifiedPercent: number | null;
      providersWithUnknownStatus: string[];
    };
    source: { label: string; spreadsheetTitle: string; fetchedAt: string };
  };
  providers: ProviderEntry[];
}

// ── Scribes (descriptive production only: no completion, outstanding, ranking or score) ──

export interface ProductionTotals {
  notesProduced: number;
  consults: number;
  followUps: number;
  hoursWorked: number;
  /** notesProduced / hoursWorked; null when no hours. */
  notesPerHour: number | null;
  /** Upload activity: separate from production (uploads can be for earlier work). */
  notesUploaded: number;
}

export interface PeriodProduction extends ProductionTotals {
  /** Day YYYY-MM-DD, week = Monday YYYY-MM-DD, month YYYY-MM. */
  period: string;
}

export interface ProductionSeries {
  daily: PeriodProduction[];
  weekly: PeriodProduction[];
  monthly: PeriodProduction[];
}

export interface ScribeMetrics extends ProductionTotals {
  name: string;
  sessions: number;
  workDays: number;
  facilitiesWorked: number;
  multiFacilityEntries: number;
  unallocatedFacilityNotes: number;
  firstWorkDate: string | null;
  lastWorkDate: string | null;
}

export interface ScribeEntry extends ScribeMetrics {
  warningCount: number;
  production: ProductionSeries;
}

export interface ScribeDashboard {
  meta: {
    generatedAt: string;
    asOfDate: string;
    timezone: string;
    cached: boolean;
    source: { label: string; spreadsheetTitle: string; fetchedAt: string };
    scope: { sourceTab: string | null; historyStartsOn: string | null; dataThrough: string | null; note: string };
    hoursBasis: string;
    definitions: Record<"notesProduced" | "hoursWorked" | "notesPerHour" | "notesUploaded" | "facilitiesWorked" | "multiFacilityEntries" | "extraNotes", string>;
  };
  totals: ScribeMetrics;
  production: ProductionSeries;
  scribes: ScribeEntry[];
}
