export default function NavigationLoadingScreen({
  label,
  className = "bg-[var(--bg)]",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={`min-h-[40vh] flex items-center justify-center ${className}`} role="status" aria-live="polite">
      <div className="loading-cloud-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
