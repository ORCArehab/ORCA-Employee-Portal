export function BrandAccent({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-1 w-14 rounded-full bg-gradient-to-r from-orca-gold-500 via-orca-sky-500 to-orca-navy-700 ${className}`}
    />
  );
}
