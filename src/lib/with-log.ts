import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";

type AnyContext = Record<string, any>;

function extractIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
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

export function withLog<T extends AnyContext = AnyContext>(
  handler: (request: NextRequest, context: T) => Promise<NextResponse>
): (request: NextRequest, context: T) => Promise<NextResponse> {
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
