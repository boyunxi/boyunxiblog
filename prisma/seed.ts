import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

/**
 * 管理员初始口令不再硬编码。
 *
 * 明文口令一旦提交进版本库就是永久泄露 —— 任何人都能从历史里翻出它直接登录后台。
 * 因此优先读环境变量 ADMIN_INITIAL_PASSWORD；未设置则生成随机口令，且仅在
 * 「确实新建了管理员 + 未走环境变量」时打印一次。
 *
 * 幂等：管理员已存在时保留其现有口令（不覆盖、不重置），也不会打印任何口令，
 * 避免重跑 seed 时输出一个其实没写进库、登录即用不了的误导性口令。
 *
 * 注意：本文件与 prisma/seed.js 是等价的两份种子。容器 entrypoint.sh 用纯 node
 * 执行 seed.js（运行时无 ts-node），本地 `prisma db seed` 用 ts-node 执行本文件。
 * 改动务必同步两份。
 */
const ABOUT_CONTENT = `<section class="scroll-vessel incomplete-border p-8">
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
</section>`;

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "boyunxioo";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existingAdmin) {
    console.log(`管理员 ${adminEmail} 已存在，保留其现有口令（不覆盖、不重置）。`);
  } else {
    const fromEnv = process.env.ADMIN_INITIAL_PASSWORD;
    const initialPassword = fromEnv ?? randomBytes(12).toString("base64url");
    const hashedPassword = await bcrypt.hash(initialPassword, 12);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "管理员",
        role: "admin",
      },
    });

    if (!fromEnv) {
      console.log("========================================");
      console.log("管理员账号已创建（随机口令仅显示这一次）：");
      console.log(`  账号: ${adminEmail}`);
      console.log(`  口令: ${initialPassword}`);
      console.log("请立即登录后修改，并妥善保存。");
      console.log("========================================");
    }
  }

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
      aboutContent: ABOUT_CONTENT,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
