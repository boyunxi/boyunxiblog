"use client";

import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/components/ui/ThemeProvider";
import ContextMenu from "@/components/ui/ContextMenu";
import NavigationLoader from "@/components/ui/NavigationLoader";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        <NavigationLoader />
        <ContextMenu />
      </ThemeProvider>
    </SessionProvider>
  );
}
