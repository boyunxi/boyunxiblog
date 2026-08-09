import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { withLog } from "@/lib/with-log";
import { checkLockout, recordFail, recordSuccess } from "@/lib/login-guard";

export const POST = withLog(async (request: NextRequest) => {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { locked, remainingMs } = checkLockout(ip);
    if (locked) {
      void logger.warn({
        category: "auth",
        action: "password_change_blocked",
        message: `修改密码被锁定，剩余 ${Math.ceil(remainingMs / 60000)} 分钟`,
        ip,
      });
      return NextResponse.json(
        { success: false, error: `尝试过多，请 ${Math.ceil(remainingMs / 60000)} 分钟后重试` },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const currentPassword = body?.currentPassword as string | undefined;
    const newPassword = body?.newPassword as string | undefined;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "请输入当前密码与新密码" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "新密码至少 8 位" }, { status: 400 });
    }
    if (newPassword.length > 128) {
      return NextResponse.json({ success: false, error: "新密码过长" }, { status: 400 });
    }
    if (newPassword === currentPassword) {
      return NextResponse.json({ success: false, error: "新密码不能与当前密码相同" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
    });
    if (!user) {
      return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      const result = recordFail(ip);
      void logger.warn({
        category: "auth",
        action: "password_change_failed",
        message: `修改密码失败：当前密码错误${result.locked ? `，已锁定 ${Math.ceil(result.remainingMs / 60000)} 分钟` : ""}`,
        meta: { userId: user.id },
        userId: user.id,
        ip,
      });
      return NextResponse.json({ success: false, error: "当前密码错误" }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hash },
    });

    recordSuccess(ip);
    void logger.info({
      category: "auth",
      action: "password_change_success",
      message: `修改密码成功: ${user.email}`,
      meta: { userId: user.id },
      userId: user.id,
      ip,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ success: false, error: "修改失败" }, { status: 500 });
  }
});
