export default function AboutPage() {
  return (
    <div className="relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-[30%] w-[400px] h-[250px] rounded-full bg-gold/[0.015] blur-[80px] animate-fog-drift" />
      </div>

      <div className="max-w-content mx-auto px-6 py-16 relative z-10">
        <header className="text-center mb-20">
          <div className="rift-line animate-rift-glow mb-10" />
          <h1 className="font-serif text-3xl text-pale tracking-[0.2em] gold-text-glow">关于</h1>
          <div className="rift-line animate-rift-glow mt-10" style={{ animationDelay: "-2s" }} />
        </header>

        <div className="space-y-16">
          <section className="scroll-vessel incomplete-border p-8">
            <h2 className="font-serif text-pale-soft text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
              <span className="w-1 h-4 bg-gold/20" />
              档案馆主
            </h2>
            <p className="text-pale-muted text-sm leading-[2.2]">
              薄云隙的创建者。在数字与古典之间穿行，于云层裂隙处窥见光芒。以文字为舟，在信息的深海中寻找那些被遗忘的岛屿。
            </p>
          </section>

          <section className="scroll-vessel incomplete-border p-8">
            <h2 className="font-serif text-pale-soft text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
              <span className="w-1 h-4 bg-gold/20" />
              关于此馆
            </h2>
            <p className="text-pale-muted text-sm leading-[2.2]">
              薄云隙是一座漂浮于云海中的数字档案馆。这里收藏着思考的碎片、技术的痕迹、与世界的对话。每一篇卷宗，都是从云层裂隙中捕捉到的一缕微光。
            </p>
          </section>

          <section className="scroll-vessel incomplete-border p-8">
            <h2 className="font-serif text-pale-soft text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
              <span className="w-1 h-4 bg-gold/20" />
              联络方式
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full border border-gold/10 flex items-center justify-center text-gold/30 text-[10px] font-serif">邮</span>
                <a href="mailto:hello@moyun.dev" className="text-pale-muted text-sm hover:text-gold/60 transition-colors duration-500 border-b border-gold/10 hover:border-gold/25">
                  hello@moyun.dev
                </a>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full border border-gold/10 flex items-center justify-center text-gold/30 text-[10px] font-serif">源</span>
                <a href="https://github.com/moyun" target="_blank" rel="noopener noreferrer" className="text-pale-muted text-sm hover:text-gold/60 transition-colors duration-500 border-b border-gold/10 hover:border-gold/25">
                  @moyun
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
