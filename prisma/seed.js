const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("crypto");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findFirst();
  if (existing) {
    console.log("Database already seeded, skipping.");
    return;
  }

  // 初始口令不硬编码：明文口令一旦进版本库就是永久泄露。
  // 优先读 ADMIN_INITIAL_PASSWORD，未设置则生成随机口令并打印一次。
  const adminEmail = process.env.ADMIN_EMAIL || "boyunxioo";
  let initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  const generated = !initialPassword;
  if (generated) {
    initialPassword = randomBytes(12).toString("base64url");
  }

  const hashedPassword = await bcrypt.hash(initialPassword, 12);

  await prisma.user.create({
    data: {
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

  await prisma.siteSetting.create({
    data: {
      id: 1,
      siteName: "薄云隙",
      siteDescription: "窥见世界裂隙",
      logoText: "隙",
      heroTitle: "薄云隙",
      heroSubtitle: "窥见世界裂隙 · 数字古风档案馆",
      archiveLabel: "云 海 档 案 馆",
      emptyStateText: "档案馆中尚无卷宗",
      copyrightText: "薄云隙 · 数字古风档案馆",
    },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("Seed error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
