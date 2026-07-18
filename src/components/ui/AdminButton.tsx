type AdminButtonVariant = "primary" | "secondary" | "danger";

export default function AdminButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: AdminButtonVariant }) {
  const base = "inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre/60 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<AdminButtonVariant, string> = {
    primary: "bg-ink text-ricepaper hover:bg-ink/90",
    secondary: "border border-ink/20 text-inkGray bg-transparent hover:bg-ink/5",
    danger: "bg-red-700 text-white hover:bg-red-800",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
