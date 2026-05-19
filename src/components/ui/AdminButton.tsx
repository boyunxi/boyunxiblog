type AdminButtonVariant = "primary" | "secondary" | "danger";

export default function AdminButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: AdminButtonVariant }) {
  const base = "inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<AdminButtonVariant, string> = {
    primary: "bg-ink text-ricepaper hover:bg-ink/90",
    secondary: "border border-ink/20 text-inkGray hover:bg-ink/5",
    danger: "bg-ochre text-ricepaper hover:bg-ochre/90",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
