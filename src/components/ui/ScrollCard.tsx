export default function ScrollCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`scroll-vessel ${className}`}>{children}</div>;
}
