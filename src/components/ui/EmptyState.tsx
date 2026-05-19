export default function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-20">
      <div className="rift-line mx-auto animate-gold-breathe mb-8" />
      <p className="text-[var(--text-ghost)] font-serif tracking-[0.3em] text-xs">{text}</p>
    </div>
  );
}
