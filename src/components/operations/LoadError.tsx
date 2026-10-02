import { EmptyState } from "./ui";

/** Why a dashboard couldn't load, in plain terms (no technical details). */
export function LoadError({ status, what }: { status: number; what: string }) {
  const detail =
    status === 401
      ? "Your session has expired. Sign out and sign in again."
      : status === 403
        ? "Your account doesn't have access to the Operations dashboard."
        : status === 503
          ? "The ORCA API or its dashboard data source isn't configured yet."
          : "The ORCA API didn't respond. Try again in a moment.";
  return <EmptyState title={`${what} couldn't be loaded`}>{detail}</EmptyState>;
}
