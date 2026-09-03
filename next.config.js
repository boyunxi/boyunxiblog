/** @type {import('next').NextConfig} */
// 图片优化端点（/_next/image）的远程白名单：
// 通过 IMAGES_REMOTE_HOSTS 逐个登记可信域名（逗号分隔，默认只放本站）。
// 切勿写成通配 `**` —— 那等于把 /_next/image 变成开放的 HTTP 代理 + SSRF 跳板。
// 外链正文图片由 src/lib/mdx-components.tsx 走原生 <img>，不经此白名单。
const remoteHosts = (process.env.IMAGES_REMOTE_HOSTS || "boyunxi.cn")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean)
  .map((hostname) => ({ protocol: "https", hostname }));

const nextConfig = {
  output: "standalone",

  // 不暴露 X-Powered-By: Next.js
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

  // minio 是 CJS/ESM 双模，靠 browser-or-node 在运行时嗅探环境，Turbopack
  // 默认会把它打进 server chunk。这里保持外置，等同升级前 webpack 的行为：
  // 本地没有 MinIO 实例，无法验证打包后的运行时分支，而图片上传/删除一旦
  // 走错分支就是硬故障。
  // ip2region 不需要列在这里 —— 已实测其 data/*.db 被产物追踪正常带出，
  // geo 解析在 standalone 下可用。
  serverExternalPackages: ["minio"],

  // 注意：不要开启 compiler.removeConsole。
  // src/components/EasterEggs.tsx 用 console.log 输出「控制台欢迎语」彩蛋
  // （由后台设置项 easterEggConsoleEnabled 控制，带金色样式），
  // 开启后 SWC 会在生产构建中把它连同所有 console.* 一起剔除，
  // 等于悄悄废掉一个可见功能。省下的那几行体积远不值这个代价。
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

module.exports = nextConfig;
