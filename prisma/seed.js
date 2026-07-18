const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findFirst();
  if (existing) {
    console.log("Database already seeded, skipping.");
    return;
  }

  const hashedPassword = await bcrypt.hash("zip1314521", 10);

  await prisma.user.create({
    data: {
      email: "boyunxioo",
      password: hashedPassword,
      name: "管理员",
      role: "admin",
    },
  });

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
