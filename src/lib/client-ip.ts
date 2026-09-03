/**
 * 统一的客户端 IP 解析。
 *
 * 为什么需要单独一个文件：
 *   X-Forwarded-For 是客户端可以任意伪造的请求头。原先项目里有 7 处各自
 *   解析它，且都取链首（第一部分）—— 那正是攻击者自己填的值。
 *   后果是：限流、登录渐进锁定、日志审计全都可以靠换一个头绕过。
 *
 * 本项目的可信链路是 nginx → Next.js（见 nginx.conf）：
 *   · `proxy_set_header X-Real-IP $remote_addr` 是覆盖而非追加，
 *     客户端自带的那份会被替换掉，所以 X-Real-IP 是可信来源；
 *   · `set_real_ip_from` 限定只信任 Docker 内网段。
 *
 * 因此只有在 TRUST_PROXY=true（确实部署在反向代理之后）时才解析转发头，
 * 且优先取 X-Real-IP、其次取 XFF 链尾（最近一个代理追加的值）。
 * 直接暴露端口的场景不使用转发头，避免被伪造值绕过。
 *
 * 例外：开发态（NODE_ENV=development）也信任转发头。本地没有代理，若不放行
 * 则所有请求都落到 "unknown"，限流、登录渐进锁定与 geo 会共用同一个桶，
 * 这些安全路径在本地就完全无从验证。代价是 dev server 必须只绑 127.0.0.1
 * （见 package.json 的 dev 脚本）—— 否则同网段的人可以伪造头。
 * 生产是 NODE_ENV=production，这个分支不会生效。
 */

type HeaderLike =
  | Headers
  | { get(name: string): string | null | undefined }
  | Record<string, string | string[] | undefined>;

const TRUST_PROXY = process.env.TRUST_PROXY === "true";
const TRUST_FORWARDED =
  TRUST_PROXY || process.env.NODE_ENV === "development";

function readHeader(source: HeaderLike, name: string): string | undefined {
  if (!source) return undefined;

  // Headers 实例或 NextRequest.headers
  if (typeof (source as Headers).get === "function") {
    const value = (source as Headers).get(name);
    return value ?? undefined;
  }

  // 普通对象（NextAuth 的 authorize 回调里可能传这种形态）
  const record = source as Record<string, string | string[] | undefined>;
  const direct = record[name] ?? record[name.toLowerCase()];
  return Array.isArray(direct) ? direct[0] : direct;
}

/**
 * 取客户端 IP。
 *
 * @param headers 请求头来源（Headers / NextRequest.headers / 普通对象）
 */
export function getClientIp(
  headers: HeaderLike | null | undefined
): string {
  if (TRUST_FORWARDED && headers) {
    const realIp = readHeader(headers, "x-real-ip")?.trim();
    if (realIp) return realIp;

    const xff = readHeader(headers, "x-forwarded-for");
    if (xff) {
      const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
      // 取链尾：链首是客户端自己填的，链尾才是最近一个代理追加的
      if (parts.length) return parts[parts.length - 1];
    }
  }

  return "unknown";
}
