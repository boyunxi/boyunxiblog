interface CloudDividerProps {
  className?: string;
  label?: string;
}

export default function CloudDivider({ className = "", label }: CloudDividerProps) {
  return (
    <div className={`cloud-divider ${className}`}>
      {label ? (
        <span className="absolute left-1/2 -translate-x-1/2 -top-[10px] bg-mist px-4 text-gold/50 text-[10px] font-serif tracking-[0.3em]">
          {label}
        </span>
      ) : null}
    </div>
  );
}
