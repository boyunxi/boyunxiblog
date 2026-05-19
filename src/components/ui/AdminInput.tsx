export default function AdminInput({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const inputClass = "w-full px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50 transition-colors";

  if (label) {
    return (
      <div>
        <label className="block text-sm font-serif text-ink mb-1.5">{label}</label>
        <input className={`${inputClass} ${className}`} {...props} />
      </div>
    );
  }

  return <input className={`${inputClass} ${className}`} {...props} />;
}
