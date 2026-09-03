import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

/**
 * 管理员初始口令不再硬编码。
 *
 * 明文口令一旦提交进版本库就是永久泄露 —— 本仓库已推送到远程，
 * 任何人都能从历史里翻出它直接登录后台。因此：
 *   · 优先读环境变量 ADMIN_INITIAL_PASSWORD；
 *   · 未设置则生成随机口令，并在初始化时打印一次。
 *
 * 注意 upsert 的 update 是空对象：已存在的管理员密码不会被覆盖，
 * 所以重跑 seed 不会把你改过的密码重置回去。
 */
async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "boyunxioo";
  let initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  const generated = !initialPassword;
  if (generated) {
    initialPassword = randomBytes(12).toString("base64url");
  }

  const hashedPassword = await bcrypt.hash(initialPassword as string, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "管理员",
      role: "admin",
    },
  });

  if (generated) {
    console.log("========================================");
    console.log("管理员账号已创建（随机口令仅显示这一次）：");
    console.log(`  账号: ${adminEmail}`);
    console.log(`  口令: ${initialPassword}`);
    console.log("请立即登录后修改，并妥善保存。");
    console.log("========================================");
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
