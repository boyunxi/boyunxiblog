export default function AdminBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "warning";
}) {
  const variants = {
    default: "bg-jade/10 text-jade border border-jade/20",
    warning: "bg-ochre/10 text-ochre border border-ochre/20",
  };

  return (
    <span className={`inline-flex min-h-6 items-center px-2 text-xs rounded ${variants[variant]}`}>
      {children}
    </span>
  );
}
