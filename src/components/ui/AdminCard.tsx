export default function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-ink/10 rounded-lg p-6 space-y-5 shadow-[0_8px_24px_rgba(32,37,34,0.05)] ${className}`}>{children}</div>;
}
