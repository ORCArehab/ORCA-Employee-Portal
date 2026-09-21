export function OrcaMark({ className }: { className?: string }) {
  return (
    <video
      className={className}
      autoPlay
      loop
      muted
      playsInline
      poster="/brand/orcavid-poster.png"
      aria-hidden="true"
    >
      <source src="/brand/orcavid.mp4" type="video/mp4" />
    </video>
  );
}
