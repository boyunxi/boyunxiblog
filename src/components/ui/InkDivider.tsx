export default function InkDivider({ label }: { label?: string }) {
  return (
    <div className="relative my-8">
      <div className="rift-horizontal" />
      {label && (
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-void px-4 text-pale-ghost text-[10px] tracking-[0.3em] font-serif">
          {label}
        </span>
      )}
    </div>
  );
}
