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

function getCsp(nonce?: string): string {
  // 开发环境放宽：HMR 需要 unsafe-eval；不加 upgrade-insecure-requests 以免本地资源被强制升级
  if (process.env.NODE_ENV !== "production") {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; ");
  }
  // 生产：Next 内联 RSC 脚本用每请求 nonce；shiki/React 内联样式必须 unsafe-inline
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
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
    "upgrade-insecure-requests",
  ].join("; ");
}

function withSecurityHeaders(response: NextResponse, nonce?: string): NextResponse {
  response.headers.set("Content-Security-Policy", getCsp(nonce));
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
  const nonce = crypto.randomUUID();

  if (isBadBot(ua)) return withSecurityHeaders(block404(), nonce);

  if (isGoodCrawler(ua)) {
    if (!rateLimit(`c:${ip}`, 5, 10_000) || !rateLimit(`cs:${ip}`, 20, 60_000)) {
      return withSecurityHeaders(block404(), nonce);
    }
  } else if (path.startsWith("/api/auth/callback") || path.startsWith("/api/auth/signin")) {
    if (!rateLimit(`a:${ip}`, 5, 10_000) || !rateLimit(`as:${ip}`, 10, 60_000)) {
      return withSecurityHeaders(tooManyRequests(), nonce);
    }
  } else if (path.startsWith("/api/")) {
    if (!rateLimit(`api:${ip}`, 30, 10_000) || !rateLimit(`apis:${ip}`, 120, 60_000)) {
      return withSecurityHeaders(tooManyRequests(), nonce);
    }
  } else {
    if (!rateLimit(`p:${ip}`, 20, 10_000) || !rateLimit(`ps:${ip}`, 120, 60_000)) {
      return withSecurityHeaders(block404(), nonce);
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
        return withSecurityHeaders(new NextResponse("Forbidden", { status: 403 }), nonce);
      }
    }
  }

  if ((path === "/admin" || path.startsWith("/admin/")) && path !== "/admin/login") {
    const token = await getToken({ req });
    if (!token) {
      return withSecurityHeaders(NextResponse.redirect(new URL("/admin/login", req.url)), nonce);
    }
  }

  // 生产环境为 Next 内联脚本注入 nonce 请求头（Next 会自动应用到脚本上）
  const response = NextResponse.next();
  if (process.env.NODE_ENV === "production") {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-nonce", nonce);
    return withSecurityHeaders(NextResponse.next({ request: { headers: requestHeaders } }), nonce);
  }
  return withSecurityHeaders(response, nonce);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|images/).*)"],
};
