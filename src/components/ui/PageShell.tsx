export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[25%] right-[20%] w-[350px] h-[200px] rounded-full blur-[80px] animate-fog-drift" style={{ backgroundColor: "rgba(var(--gold-rgb),0.015)" }} />
      </div>
      <div className="max-w-page mx-auto px-6 py-16 relative z-10">
        {children}
      </div>
    </div>
  );
}
