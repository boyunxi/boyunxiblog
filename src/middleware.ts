import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const BAD_BOTS = [
  /semrush/i, /ahrefs/i, /mj12bot/i, /dotbot/i, /rogerbot/i,
  /exabot/i, /blexbot/i, /megaindex/i, /sistrix/i, /spyfu/i,
  /sqlmap/i, /nikto/i, /masscan/i, /nmap/i, /dirbuster/i,
  /gobuster/i, /hydra/i, /burpsuite/i, /wpscan/i, /ccbot/i,
  /gptbot/i, /chatgpt-user/i, /claudebot/i, /bytespider/i,
  /petalbot/i, /dataforseo/i, /crawler\.go/i,
];

const GOOD_CRAWLERS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
  /baiduspider/i, /yandexbot/i, /facebookexternalhit/i,
  /twitterbot/i, /linkedinbot/i,
];

function isBadBot(ua: string): boolean {
  if (!ua) return true;
  return BAD_BOTS.some((p) => p.test(ua));
}

function isGoodCrawler(ua: string): boolean {
  return GOOD_CRAWLERS.some((p) => p.test(ua));
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// 注意：Next.js 14.x 不支持 x-nonce 自动应用到内联 RSC 脚本，
// 因此 script-src 必须包含 'unsafe-inline' 才能让 hydration 脚本执行。
// 站点无第三方脚本，'self' 已限制外部脚本源，配合其余指令整体风险可控。
function getCsp(): string {
  const isProd = process.env.NODE_ENV === "production";
  const directives = [
    "default-src 'self'",
    isProd
      ? "script-src 'self' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src 'none'",
    "worker-src 'self' blob:",
  ];
  if (isProd) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("Content-Security-Policy", getCsp());
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  return response;
}

function block404() {
  return new NextResponse(null, { status: 404 });
}

function tooManyRequests() {
  const res = new NextResponse("Too Many Requests", { status: 429 });
  res.headers.set("Retry-After", "10");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const ua = req.headers.get("user-agent") || "";
  const ip = getIp(req);

  if (isBadBot(ua)) return withSecurityHeaders(block404());

  if (isGoodCrawler(ua)) {
    if (!rateLimit(`c:${ip}`, 5, 10_000) || !rateLimit(`cs:${ip}`, 20, 60_000)) {
      return withSecurityHeaders(block404());
    }
  } else if (path.startsWith("/api/auth/callback") || path.startsWith("/api/auth/signin")) {
    if (!rateLimit(`a:${ip}`, 5, 10_000) || !rateLimit(`as:${ip}`, 10, 60_000)) {
      return withSecurityHeaders(tooManyRequests());
    }
  } else if (path.startsWith("/api/")) {
    if (!rateLimit(`api:${ip}`, 30, 10_000) || !rateLimit(`apis:${ip}`, 120, 60_000)) {
      return withSecurityHeaders(tooManyRequests());
    }
  } else {
    if (!rateLimit(`p:${ip}`, 20, 10_000) || !rateLimit(`ps:${ip}`, 120, 60_000)) {
      return withSecurityHeaders(block404());
    }
  }

  // /api 写操作 CSRF 纵深防御：生产环境校验 Origin 与站点一致（dev 放宽；无 Origin 的 curl/同源 GET 放行，靠 session 兜底）
  if (
    process.env.NODE_ENV === "production" &&
    path.startsWith("/api/") &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
  ) {
    const origin = req.headers.get("origin");
    if (origin) {
      const allowed = new Set(
        [process.env.NEXT_PUBLIC_SITE_URL, process.env.NEXTAUTH_URL].filter(Boolean)
      );
      if (!allowed.has(origin)) {
        return withSecurityHeaders(new NextResponse("Forbidden", { status: 403 }));
      }
    }
  }

  if ((path === "/admin" || path.startsWith("/admin/")) && path !== "/admin/login") {
    const token = await getToken({ req });
    if (!token) {
      return withSecurityHeaders(NextResponse.redirect(new URL("/admin/login", req.url)));
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|images/).*)"],
};
