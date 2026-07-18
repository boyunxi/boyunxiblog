export default function AdminBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "warning";
}) {
  const variants = {
    default: "bg-emerald-900/10 text-emerald-900 border border-emerald-900/10",
    warning: "bg-amber-700/10 text-amber-800 border border-amber-700/10",
  };

  return (
    <span className={`inline-flex min-h-6 items-center px-2 text-xs rounded ${variants[variant]}`}>
      {children}
    </span>
  );
}
