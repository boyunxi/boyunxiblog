export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="text-center mb-20">
      <div className="rift-line animate-rift-glow mb-10" />
      {subtitle && (
        <span className="text-[var(--text-ghost)] text-[10px] tracking-[0.5em] font-serif block mb-4">
          {subtitle}
        </span>
      )}
      <h1 className="font-serif text-3xl text-[var(--text)] tracking-[0.2em] gold-text-glow">
        {title}
      </h1>
      <div className="rift-line animate-rift-glow mt-10" style={{ animationDelay: "-2s" }} />
    </header>
  );
}
