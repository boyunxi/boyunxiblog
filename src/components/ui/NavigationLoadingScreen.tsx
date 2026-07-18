export default function NavigationLoadingScreen({ label }: { label: string }) {
  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-[var(--bg)]" role="status" aria-live="polite">
      <div className="loading-cloud-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
