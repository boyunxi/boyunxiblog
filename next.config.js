/** @type {import('next').NextConfig} */
const remoteHosts = (process.env.IMAGES_REMOTE_HOSTS || "boyunxi.cn")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean)
  .map((hostname) => ({ protocol: "https", hostname }));

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: remoteHosts,
  },
  async headers() {
    return [
      {
        // 静态资源长缓存 + 基础安全头（CSP 由 middleware 按请求生成）
        source: "/_next/static/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
