"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import CloudBackdrop from "@/components/ui/CloudBackdrop";

const COLLAPSE_KEY = "boyunxi-admin-sidebar-collapsed";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
    } catch {}
    setMounted(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  return (
    <div className="bg-ricepaper font-sans min-h-screen">
      <AdminSidebar collapsed={collapsed} onToggle={toggleCollapsed} />
      <main
        className={`bg-ricepaper-dark min-h-screen relative overflow-hidden transition-[margin] duration-300 ${
          mounted && collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <CloudBackdrop className="opacity-35" />
        <div className="relative z-10 p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
