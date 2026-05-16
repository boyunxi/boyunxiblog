import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      email: "admin@blog.com",
      password: hashedPassword,
      name: "管理员",
      role: "admin",
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "薄云隙",
      siteDescription: "窥见世界裂隙",
      logoText: "隙",
      heroTitle: "薄云隙",
      heroSubtitle: "窥见世界裂隙 · 数字古风档案馆",
      archiveLabel: "云 海 档 案 馆",
      emptyStateText: "档案馆中尚无卷宗",
      copyrightText: "薄云隙 · 数字古风档案馆",
      aboutContent: `<section class="scroll-vessel incomplete-border p-8">
  <h2 class="font-serif text-[var(--text-soft)] text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
    <span class="w-1 h-4" style="background-color:rgba(var(--gold-rgb),0.2)"></span>
    档案馆主
  </h2>
  <p class="text-[var(--text-muted)] text-sm leading-[2.2]">
    薄云隙的创建者。在数字与古典之间穿行，于云层裂隙处窥见光芒。以文字为舟，在信息的深海中寻找那些被遗忘的岛屿。
  </p>
</section>

<section class="scroll-vessel incomplete-border p-8">
  <h2 class="font-serif text-[var(--text-soft)] text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
    <span class="w-1 h-4" style="background-color:rgba(var(--gold-rgb),0.2)"></span>
    关于此馆
  </h2>
  <p class="text-[var(--text-muted)] text-sm leading-[2.2]">
    薄云隙是一座漂浮于云海中的数字档案馆。这里收藏着思考的碎片、技术的痕迹、与世界的对话。每一篇卷宗，都是从云层裂隙中捕捉到的一缕微光。
  </p>
</section>

<section class="scroll-vessel incomplete-border p-8">
  <h2 class="font-serif text-[var(--text-soft)] text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
    <span class="w-1 h-4" style="background-color:rgba(var(--gold-rgb),0.2)"></span>
    联络方式
  </h2>
  <div class="space-y-3">
    <div class="flex items-center gap-4">
      <span class="w-6 h-6 rounded-full border border-[rgba(var(--gold-rgb),0.1)] flex items-center justify-center text-[rgba(var(--gold-rgb),0.3)] text-[10px] font-serif">邮</span>
      <a href="mailto:hello@moyun.dev" class="text-[var(--text-muted)] text-sm hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors duration-500 border-b border-[rgba(var(--gold-rgb),0.1)] hover:border-[rgba(var(--gold-rgb),0.25)]">
        hello@moyun.dev
      </a>
    </div>
    <div class="flex items-center gap-4">
      <span class="w-6 h-6 rounded-full border border-[rgba(var(--gold-rgb),0.1)] flex items-center justify-center text-[rgba(var(--gold-rgb),0.3)] text-[10px] font-serif">源</span>
      <a href="https://github.com/moyun" target="_blank" rel="noopener noreferrer" class="text-[var(--text-muted)] text-sm hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors duration-500 border-b border-[rgba(var(--gold-rgb),0.1)] hover:border-[rgba(var(--gold-rgb),0.25)]">
        @moyun
      </a>
    </div>
  </div>
</section>`,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
