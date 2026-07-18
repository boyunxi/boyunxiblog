export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="text-center mb-16">
      <div className="w-10 h-px bg-[var(--gold)] mx-auto mb-8 opacity-70" />
      {subtitle && (
        <span className="text-[var(--text-muted)] text-xs tracking-[0.12em] font-sans block mb-4">
          {subtitle}
        </span>
      )}
      <h1 className="font-serif text-3xl text-[var(--text)] tracking-[0.12em]">
        {title}
      </h1>
      <div className="w-16 h-px bg-[var(--border)] mx-auto mt-8" />
    </header>
  );
}
