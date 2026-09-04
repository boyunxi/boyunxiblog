"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/components/ui/ThemeProvider";
import ContextMenu from "@/components/ui/ContextMenu";
import NavigationLoader from "@/components/ui/NavigationLoader";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        {/* NavigationLoader 读 useSearchParams。静态预渲染时缺少 Suspense 边界
            会让整页降级成动态渲染，而 Providers 包住了全部前台静态路由 ——
            那会把每个 ○/● 都翻成 ƒ。fallback 用 null 是零成本的：
            NavigationLoader 空闲时本来就返回 null。 */}
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
        <ContextMenu />
      </ThemeProvider>
    </SessionProvider>
  );
}
