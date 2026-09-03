import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";
import { getClientIp } from "./client-ip";

/**
 * Next 16 起 route handler 的 context.params 是 Promise。
 *
 * 约束成 Promise<unknown> 而不是具体形状：漏掉 await 的同步标注
 * （{ params: { id: string } }）会在 withLog 调用处直接编译失败，
 * 而不是退化成 parseInt(undefined) → NaN → Prisma 返回 null 的静默 404。
 * 具体的 params 类型由 handler 自己的 RouteContext<'/api/...'> 提供。
 */
type RouteContextLike = { params: Promise<unknown> };

function extractIp(req: NextRequest): string {
  return getClientIp(req.headers);
}

function inferCategory(pathname: string): string {
  if (pathname.includes("/auth")) return "auth";
  if (pathname.includes("/posts")) return "post";
  if (pathname.includes("/categories")) return "category";
  if (pathname.includes("/tags")) return "tag";
  if (pathname.includes("/settings")) return "setting";
  if (pathname.includes("/search")) return "view";
  if (pathname.includes("/stats")) return "system";
  if (pathname.includes("/logs")) return "system";
  return "api";
}

export function withLog<C extends RouteContextLike = RouteContextLike>(
  handler: (request: NextRequest, context: C) => Promise<NextResponse>
): (request: NextRequest, context: C) => Promise<NextResponse> {
  return async (request, context) => {
    const start = Date.now();
    const { pathname } = new URL(request.url);
    const method = request.method;
    const ip = extractIp(request);

    try {
      const response = await handler(request, context);
      const duration = Date.now() - start;
      const status = response.status;

      const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";

      void logger[level]({
        category: inferCategory(pathname) as any,
        action: `${method} ${pathname}`,
        message: `${status} ${method} ${pathname} ${duration}ms`,
        meta: { status, duration, method },
        ip,
      });

      return response;
    } catch (err) {
      const duration = Date.now() - start;

      void logger.error({
        category: inferCategory(pathname) as any,
        action: `${method} ${pathname}`,
        message: err instanceof Error ? err.message : "Unknown error",
        meta: { duration, method, error: true },
        ip,
      });

      return NextResponse.json(
        { success: false, error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
