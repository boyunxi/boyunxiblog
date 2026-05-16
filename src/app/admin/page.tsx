"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, FolderOpen, Tag, Eye, Plus, List } from "lucide-react";
import ScrollCard from "@/components/ui/ScrollCard";

interface Stats {
  totalPosts: number;
  totalCategories: number;
  totalTags: number;
  totalViews: number;
}

interface RecentPost {
  id: number;
  title: string;
  published: boolean;
  createdAt: string;
  views: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalViews: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((res) => {
        const data = res.data;
        if (data) {
          setStats({
            totalPosts: data.totalPosts ?? 0,
            totalCategories: data.totalCategories ?? 0,
            totalTags: data.totalTags ?? 0,
            totalViews: data.totalViews ?? 0,
          });
          setRecentPosts(data.recentPosts ?? []);
        }
      });
  }, []);

  const statCards = [
    { icon: FileText, label: "文章总数", value: stats.totalPosts },
    { icon: FolderOpen, label: "分类数", value: stats.totalCategories },
    { icon: Tag, label: "标签数", value: stats.totalTags },
    { icon: Eye, label: "总浏览量", value: stats.totalViews },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif text-ink">欢迎回来</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <ScrollCard key={card.label}>
            <div className="flex items-center gap-4">
              <card.icon className="w-8 h-8 text-ink/60" />
              <div>
                <p className="text-3xl font-serif text-ink">{card.value}</p>
                <p className="text-sm text-inkGray">{card.label}</p>
              </div>
            </div>
          </ScrollCard>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/admin/posts/new")}
          className="flex items-center gap-2 px-5 py-2.5 bg-ink text-ricepaper rounded-sm hover:bg-ink/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建文章
        </button>
        <button
          onClick={() => router.push("/admin/categories")}
          className="flex items-center gap-2 px-5 py-2.5 border border-ink/30 text-ink rounded-sm hover:bg-ink/5 transition-colors"
        >
          <List className="w-4 h-4" />
          管理分类
        </button>
      </div>

      <div>
        <h2 className="text-xl font-serif text-ink mb-4">最近文章</h2>
        <div className="scroll-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink/10 bg-ricepaper/50">
                <th className="text-left px-4 py-3 text-sm font-serif text-ink">标题</th>
                <th className="text-left px-4 py-3 text-sm font-serif text-ink">状态</th>
                <th className="text-left px-4 py-3 text-sm font-serif text-ink">日期</th>
                <th className="text-left px-4 py-3 text-sm font-serif text-ink">浏览量</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-inkGray/60">
                    暂无文章
                  </td>
                </tr>
              ) : (
                recentPosts.map((post) => (
                  <tr key={post.id} className="border-b border-ink/5 hover:bg-ricepaper/30">
                    <td className="px-4 py-3 text-inkGray">{post.title}</td>
                    <td className="px-4 py-3">
                      {post.published ? (
                        <span className="inline-block px-2 py-0.5 text-xs bg-ink/10 text-ink rounded-sm">
                          已发布
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-xs bg-ochre/10 text-ochre rounded-sm">
                          草稿
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-inkGray/70 text-sm">
                      {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-4 py-3 text-inkGray/70">{post.views}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
