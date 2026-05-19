export default function AdminBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "warning";
}) {
  const variants = {
    default: "bg-ink/10 text-ink",
    warning: "bg-ochre/10 text-ochre",
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs rounded-sm ${variants[variant]}`}>
      {children}
    </span>
  );
}
