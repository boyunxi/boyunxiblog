export function cn(...inputs: (string | undefined | null | false)[]): string {
  const classes = inputs.filter(Boolean) as string[];
  const merged: string[] = [];

  for (const cls of classes) {
    const parts = cls.split(" ").filter(Boolean);
    for (const part of parts) {
      if (part.startsWith("-")) {
        const base = part.slice(1).split("-").slice(0, -1).join("-");
        const idx = merged.findIndex(
          (c) => c === base || c.startsWith(base + "-")
        );
        if (idx !== -1) {
          merged.splice(idx, 1);
        }
        merged.push(part);
      } else {
        const prefix = part.split("-").slice(0, -1).join("-");
        const existingIdx = merged.findIndex(
          (c) =>
            c === part ||
            (prefix && c.startsWith(prefix + "-") && !c.startsWith("-"))
        );
        if (existingIdx !== -1) {
          merged[existingIdx] = part;
        } else {
          merged.push(part);
        }
      }
    }
  }

  return merged.join(" ");
}

export function generateSlug(title: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);
  const sanitized = title
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 50);
  return `${sanitized}-${timestamp}-${random}`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}年${month}月${day}日`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * 解码动态路由参数中的 URL 编码（如 %E6%BD%AE%E6%B1%95 → 潮汕）。
 *
 * Next.js 14 中页面路由（page.tsx）的 params 不做 URL 解码，
 * 而 API 路由会自动解码，导致含非 ASCII 字符（中文）的 slug 在页面路由中
 * 查不到记录而 404。此函数安全地处理两种情况：
 * - 未编码：原样返回（decodeURIComponent 对无 % 的字符串是幂等的）
 * - 已编码：解码为原始字符
 * - 非法编码：捕获异常后返回原值
 */
export function decodeSlugParam(value: string): string {
  if (!value || !value.includes("%")) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
