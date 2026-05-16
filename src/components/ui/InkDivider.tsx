export default function InkDivider({ label }: { label?: string }) {
  return (
    <div className="relative my-8">
      <div className="rift-horizontal" />
      {label && (
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-[var(--text-ghost)] text-[10px] tracking-[0.3em] font-serif" style={{backgroundColor: "var(--bg)"}}>
          {label}
        </span>
      )}
    </div>
  );
}
