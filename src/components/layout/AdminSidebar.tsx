"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Image,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  ScrollText,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems = [
  { label: "概览", icon: LayoutDashboard, href: "/admin" },
  { label: "文章管理", icon: FileText, href: "/admin/posts" },
  { label: "分类管理", icon: FolderTree, href: "/admin/categories" },
  { label: "标签管理", icon: Tags, href: "/admin/tags" },
  { label: "图片管理", icon: Image, href: "/admin/images" },
  { label: "数据看板", icon: BarChart3, href: "/admin/dashboard" },
  { label: "系统日志", icon: ScrollText, href: "/admin/logs" },
  { label: "站点设置", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // 构建期注入的部署版本号（deploy.sh 传入 git 短哈希），本地开发为空
  const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "";

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center gap-3 border-b border-white/10 ${
          collapsed ? "flex-col justify-center py-5" : "justify-between p-6"
        }`}
      >
        <div className="text-center">
          <h1 className="font-serif text-xl text-gold tracking-wide">
            {collapsed ? "隙" : "博云隙"}
          </h1>
          {!collapsed && (
            <p className="text-ricepaper/60 text-xs mt-1 tracking-wide">
              内容管理
            </p>
          )}
        </div>
        <button
          onClick={onToggle}
          title={collapsed ? "展开侧栏" : "收起侧栏"}
          aria-label={collapsed ? "展开侧栏" : "收起侧栏"}
          className="flex items-center justify-center w-8 h-8 rounded text-ricepaper/60 hover:text-gold hover:bg-white/10 transition-colors"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center min-h-11 text-sm transition-colors ${
                collapsed ? "justify-center px-0" : "gap-3 px-6"
              } ${
                active
                  ? collapsed
                    ? "bg-ink/80 text-gold"
                    : "bg-ink/80 text-gold border-l-4 border-gold"
                  : "text-ricepaper/70 hover:bg-ink/50 hover:text-ricepaper border-l-4 border-transparent"
              }`}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink/30 py-4">
        {session?.user && !collapsed && (
          <div className="px-6 py-2 text-xs text-ricepaper/50 truncate">
            {session.user.email}
          </div>
        )}
        <Link
          href="/"
          title={collapsed ? "返回前台" : undefined}
          className={`flex items-center min-h-11 text-sm text-ricepaper/70 hover:bg-ink/50 hover:text-ricepaper transition-colors ${
            collapsed ? "justify-center px-0" : "gap-3 px-6"
          }`}
        >
          <ExternalLink size={18} />
          {!collapsed && <span>返回前台</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title={collapsed ? "退出登录" : undefined}
          className={`flex items-center min-h-11 text-sm text-ricepaper/70 hover:bg-ink/50 hover:text-ricepaper transition-colors w-full ${
            collapsed ? "justify-center px-0" : "gap-3 px-6"
          }`}
        >
          <LogOut size={18} />
          {!collapsed && <span>退出登录</span>}
        </button>

        {!collapsed && APP_VERSION && (
          <div className="px-6 pt-3 text-[10px] text-ricepaper/30 tracking-wider">
            构建 {APP_VERSION}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-ink text-ricepaper z-50 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {sidebarContent}
    </aside>
  );
}
