import { prisma } from "@/lib/prisma";

export default async function AboutPage() {
  const settings = await prisma.siteSetting.findFirst({ where: { id: 1 } });
  const aboutContent = settings?.aboutContent;

  return (
    <div className="relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-[30%] w-[400px] h-[250px] rounded-full blur-[80px] animate-fog-drift" style={{backgroundColor: "rgba(var(--gold-rgb),0.015)"}} />
      </div>

      <div className="max-w-content mx-auto px-6 py-16 relative z-10">
        <header className="text-center mb-20">
          <div className="rift-line animate-rift-glow mb-10" />
          <h1 className="font-serif text-3xl text-[var(--text)] tracking-[0.2em] gold-text-glow">关于</h1>
          <div className="rift-line animate-rift-glow mt-10" style={{ animationDelay: "-2s" }} />
        </header>

        <div className="space-y-16">
          {aboutContent ? (
            <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
          ) : (
            <>
              <section className="scroll-vessel incomplete-border p-8">
                <h2 className="font-serif text-[var(--text-soft)] text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
                  <span className="w-1 h-4" style={{backgroundColor: "rgba(var(--gold-rgb),0.2)"}} />
                  档案馆主
                </h2>
                <p className="text-[var(--text-muted)] text-sm leading-[2.2]">
                  薄云隙的创建者。在数字与古典之间穿行，于云层裂隙处窥见光芒。以文字为舟，在信息的深海中寻找那些被遗忘的岛屿。
                </p>
              </section>

              <section className="scroll-vessel incomplete-border p-8">
                <h2 className="font-serif text-[var(--text-soft)] text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
                  <span className="w-1 h-4" style={{backgroundColor: "rgba(var(--gold-rgb),0.2)"}} />
                  关于此馆
                </h2>
                <p className="text-[var(--text-muted)] text-sm leading-[2.2]">
                  薄云隙是一座漂浮于云海中的数字档案馆。这里收藏着思考的碎片、技术的痕迹、与世界的对话。每一篇卷宗，都是从云层裂隙中捕捉到的一缕微光。
                </p>
              </section>

              <section className="scroll-vessel incomplete-border p-8">
                <h2 className="font-serif text-[var(--text-soft)] text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
                  <span className="w-1 h-4" style={{backgroundColor: "rgba(var(--gold-rgb),0.2)"}} />
                  联络方式
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full border border-[rgba(var(--gold-rgb),0.1)] flex items-center justify-center text-[rgba(var(--gold-rgb),0.3)] text-[10px] font-serif">邮</span>
                    <a href="mailto:hello@moyun.dev" className="text-[var(--text-muted)] text-sm hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors duration-500 border-b border-[rgba(var(--gold-rgb),0.1)] hover:border-[rgba(var(--gold-rgb),0.25)]">
                      hello@moyun.dev
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full border border-[rgba(var(--gold-rgb),0.1)] flex items-center justify-center text-[rgba(var(--gold-rgb),0.3)] text-[10px] font-serif">源</span>
                    <a href="https://github.com/moyun" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] text-sm hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors duration-500 border-b border-[rgba(var(--gold-rgb),0.1)] hover:border-[rgba(var(--gold-rgb),0.25)]">
                      @moyun
                    </a>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
