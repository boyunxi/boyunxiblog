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

function block404() {
  return new NextResponse(null, { status: 404 });
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const ua = req.headers.get("user-agent") || "";
  const ip = getIp(req);

  if (isBadBot(ua)) return block404();

  if (isGoodCrawler(ua)) {
    if (!rateLimit(`c:${ip}`, 5, 10_000) || !rateLimit(`cs:${ip}`, 20, 60_000)) {
      return block404();
    }
  } else if (path.startsWith("/api/auth/callback") || path.startsWith("/api/auth/signin")) {
    if (!rateLimit(`a:${ip}`, 5, 10_000) || !rateLimit(`as:${ip}`, 10, 60_000)) {
      return block404();
    }
  } else if (path.startsWith("/api/")) {
    if (!rateLimit(`api:${ip}`, 30, 10_000) || !rateLimit(`apis:${ip}`, 120, 60_000)) {
      return block404();
    }
  } else {
    if (!rateLimit(`p:${ip}`, 20, 10_000) || !rateLimit(`ps:${ip}`, 120, 60_000)) {
      return block404();
    }
  }

  if (path.startsWith("/admin/") && path !== "/admin/login") {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|images/).*)"],
};
