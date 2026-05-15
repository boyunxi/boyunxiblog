import CloudDivider from "@/components/ui/InkDivider";

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto">
      <header className="text-center mb-14">
        <div
          className="flex items-center justify-center gap-4 mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
        <h1 className="font-display text-5xl text-ink tracking-wider mb-4 opacity-0 animate-fade-up">关于我</h1>
        <CloudDivider />
      </header>

      <div className="space-y-12">
        <section className="opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-serif text-xl text-ink mb-5 flex items-center gap-3">
            <span className="w-1 h-6 bg-gold/60" />
            你好，欢迎来到博云隙
          </h2>
          <div className="pl-4 border-l-2 border-gold/20 py-1">
            <p className="text-ink-light leading-[2] text-[15px]">
              我是一个热爱思考与记录的人。在这个快节奏的时代，我选择用文字慢下来，
              记录生活中的点滴感悟，分享技术上的探索与成长。每一篇文章，都是一次与自己的对话，
              也是一次与世界的交流。
            </p>
          </div>
        </section>

        <CloudDivider label="关于本站" />

        <section className="opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="pl-4 border-l-2 border-gold/20 py-1">
            <p className="text-ink-light leading-[2] text-[15px]">
              博云隙是我的个人博客，创建于对知识与思考的热爱之上。这里记录着我在技术、
              生活、阅读等方面的思考与总结。我希望这些文字能够像云隙间的光一样，在时间的长河中
              留下淡淡的痕迹，也希望能为偶然到访的你带来一些启发或共鸣。
            </p>
          </div>
        </section>

        <CloudDivider label="联系方式" />

        <section className="opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="space-y-4">
            <div className="cloud-card p-4 flex items-center gap-4 group">
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-gold-faint text-gold font-serif text-sm group-hover:bg-gold/20 transition-all duration-300">
                邮
              </span>
              <div>
                <p className="text-ink-faint text-xs font-serif tracking-wider mb-0.5">邮箱</p>
                <a
                  href="mailto:hello@moyun.dev"
                  className="text-ink hover:text-gold transition-colors text-sm underline decoration-gold/30 underline-offset-3"
                >
                  hello@moyun.dev
                </a>
              </div>
            </div>

            <div className="cloud-card p-4 flex items-center gap-4 group">
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-gold-faint text-gold font-serif text-sm group-hover:bg-gold/20 transition-all duration-300">
                源
              </span>
              <div>
                <p className="text-ink-faint text-xs font-serif tracking-wider mb-0.5">GitHub</p>
                <a
                  href="https://github.com/moyun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-gold transition-colors text-sm underline decoration-gold/30 underline-offset-3"
                >
                  @moyun
                </a>
              </div>
            </div>

            <div className="cloud-card p-4 flex items-center gap-4 group">
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-gold-faint text-gold font-serif text-sm group-hover:bg-gold/20 transition-all duration-300">
                信
              </span>
              <div>
                <p className="text-ink-faint text-xs font-serif tracking-wider mb-0.5">微信</p>
                <span className="text-ink text-sm">moyun_dev</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
