export default function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-20 border border-dashed border-[var(--border)]">
      <p className="text-[var(--text-muted)] font-sans tracking-wide text-sm">{text}</p>
    </div>
  );
}
