export default function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`scroll-card p-6 space-y-5 ${className}`}>{children}</div>;
}
