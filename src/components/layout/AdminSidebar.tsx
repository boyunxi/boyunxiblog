"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ScrollText,
} from "lucide-react";

const navItems = [
  { label: "概览", icon: LayoutDashboard, href: "/admin" },
  { label: "文章管理", icon: FileText, href: "/admin/posts" },
  { label: "分类管理", icon: FolderTree, href: "/admin/categories" },
  { label: "标签管理", icon: Tags, href: "/admin/tags" },
  { label: "数据看板", icon: BarChart3, href: "/admin/dashboard" },
  { label: "系统日志", icon: ScrollText, href: "/admin/logs" },
  { label: "站点设置", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <h1 className="font-serif text-xl text-gold tracking-wide">
          博云隙
        </h1>
        <p className="text-ricepaper/60 text-xs mt-1 tracking-wide">内容管理</p>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 min-h-11 px-6 py-3 text-sm transition-colors ${
                active
                  ? "bg-ink/80 text-gold border-l-4 border-gold"
                  : "text-ricepaper/70 hover:bg-ink/50 hover:text-ricepaper border-l-4 border-transparent"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink/30 py-4">
        {session?.user && (
          <div className="px-6 py-2 text-xs text-ricepaper/50">
            {session.user.email}
          </div>
        )}
        <Link
          href="/"
          className="flex items-center gap-3 px-6 py-3 text-sm text-ricepaper/70 hover:bg-ink/50 hover:text-ricepaper transition-colors"
        >
          <ExternalLink size={18} />
          <span>返回前台</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-6 py-3 text-sm text-ricepaper/70 hover:bg-ink/50 hover:text-ricepaper transition-colors w-full"
        >
          <LogOut size={18} />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-ink text-ricepaper p-2 rounded-md shadow-lg"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-ink text-ricepaper z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 lg:hidden text-ricepaper/60 hover:text-ricepaper"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
