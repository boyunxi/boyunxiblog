import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  // eslint-config-next 16 把 TypeScript 规则拆成了独立入口，不再随 core-web-vitals
  // 一起生效。旧的 .eslintrc.json 只有 next/core-web-vitals，所以这里显式加上，
  // 否则升级后 TS 相关规则会静默消失。
  ...nextTs,
  {
    // eslint-config-next 16 自带的 eslint-plugin-react-hooks v7 引入了两条新规则，
    // 把项目里既有的 SSR / hydration 惯用写法一律判成 error：读 localStorage 初始化
    // 主题、从 useSearchParams 同步状态、客户端 only 的 API 探测、导航后清进度条等。
    // 共 11 处，全部早于本次升级存在，不是升级引入的缺陷。逐个重写是一项独立的重构
    // （ThemeProvider 改错会导致主题闪烁），不该混进框架大版本跳版里，所以降为 warn
    // 保留信号、不改行为。
    //
    // no-explicit-any 同理：8 处既有 any，与升级无关。
    //
    // next build 在 Next 16 里已不再跑 lint，所以这些不会阻塞构建；
    // npm run lint 只看 error，因此保持为 0。
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    ".next/dev/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // prisma/seed.js 是 seed.ts 的编译产物，由 entrypoint.sh 直接执行
    "prisma/seed.js",
    ".workbuddy-ai/**",
  ]),
]);
