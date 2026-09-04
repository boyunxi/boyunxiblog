const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("crypto");

const prisma = new PrismaClient();

/**
 * 管理员口令轮换脚本（运维 / 紧急处置用）。
 *
 * 背景：早期版本的 seed 里硬编码过明文口令，凡用它初始化过的数据库（尤其线上）
 * 都应视为「口令已泄露」，需要立即更换。能正常登录后台时，优先走
 * 「后台 → 设置 → 修改密码」（需要当前密码）；当口令已泄露 / 遗忘、无法或不愿
 * 用旧口令登录时，用本脚本在数据库层直接重置：
 *
 *   容器：docker compose exec -T blog node prisma/reset-admin-password.js
 *   本地：npm run db:reset-admin      （或 node prisma/reset-admin-password.js）
 *
 * 新口令来源：环境变量 NEW_ADMIN_PASSWORD；未提供则随机生成并只在控制台打印一次。
 * 只更新 ADMIN_EMAIL（默认 boyunxioo）对应账号的 password 字段，不动其它数据。
 */
async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "boyunxioo";
  const fromEnv = process.env.NEW_ADMIN_PASSWORD;

  if (fromEnv && fromEnv.length < 8) {
    console.error("NEW_ADMIN_PASSWORD 太短（至少 8 位，与后台改密校验一致）。");
    process.exit(1);
  }

  const newPassword = fromEnv ?? randomBytes(12).toString("base64url");

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    console.error(`未找到管理员账号「${adminEmail}」。请先初始化（本地 npm run db:seed；容器由 entrypoint 自动 seed）。`);
    process.exit(1);
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: existing.id }, data: { password: hash } });

  console.log(`管理员「${adminEmail}」的口令已重置（bcrypt cost=12）。`);
  if (fromEnv) {
    console.log("（使用 NEW_ADMIN_PASSWORD 提供的新口令）");
  } else {
    console.log("新口令（仅显示这一次，请立即保存并登录验证）：");
    console.log(`  ${newPassword}`);
  }
}

main()
  .catch((e) => {
    console.error("reset-admin-password error:", e.message || e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
