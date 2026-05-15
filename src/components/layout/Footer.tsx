export default function Footer() {
  return (
    <footer className="bg-void-deep">
      <div className="rift-horizontal" />
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border border-gold/15 flex items-center justify-center text-gold/30 text-sm font-serif animate-gold-breathe">隙</div>
        <span className="font-serif text-pale-muted text-xs tracking-[0.3em]">薄云隙</span>
        <span className="text-pale-ghost text-[10px] tracking-[0.4em] font-serif">窥见世界裂隙</span>
        <div className="w-16 my-4"><div className="rift-horizontal" /></div>
        <p className="text-pale-ghost/50 text-[10px] tracking-wider">© {new Date().getFullYear()} 薄云隙 · 数字古风档案馆</p>
      </div>
    </footer>
  );
}
