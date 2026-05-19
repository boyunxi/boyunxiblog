export default function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="scroll-card overflow-hidden">
      <table className="w-full">{children}</table>
    </div>
  );
}

export function AdminTableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-ink/10 bg-ricepaper/50">
        {children}
      </tr>
    </thead>
  );
}

export function AdminTableHeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 text-sm font-serif text-ink">
      {children}
    </th>
  );
}

export function AdminTableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-ink/5 hover:bg-ricepaper/30">
      {children}
    </tr>
  );
}

export function AdminTableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-inkGray/70 ${className}`}>
      {children}
    </td>
  );
}
