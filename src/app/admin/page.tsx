"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, FolderOpen, Tag, Eye, Plus, List } from "lucide-react";
import ScrollCard from "@/components/ui/ScrollCard";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import AdminButton from "@/components/ui/AdminButton";
import AdminTable, { AdminTableHeader, AdminTableHeaderCell, AdminTableRow, AdminTableCell } from "@/components/ui/AdminTable";
import AdminBadge from "@/components/ui/AdminBadge";

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
      <AdminPageHeader
        title="欢迎回来"
        action={
          <div className="flex gap-3">
            <AdminButton onClick={() => router.push("/admin/posts/new")}>
              <Plus className="w-4 h-4" />
              新建文章
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => router.push("/admin/categories")}>
              <List className="w-4 h-4" />
              管理分类
            </AdminButton>
          </div>
        }
      />

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

      <div>
        <h2 className="text-xl font-serif text-ink mb-4">最近文章</h2>
        <AdminTable>
          <AdminTableHeader>
            <AdminTableHeaderCell>标题</AdminTableHeaderCell>
            <AdminTableHeaderCell>状态</AdminTableHeaderCell>
            <AdminTableHeaderCell>日期</AdminTableHeaderCell>
            <AdminTableHeaderCell>浏览量</AdminTableHeaderCell>
          </AdminTableHeader>
          <tbody>
            {recentPosts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-inkGray/60">
                  暂无文章
                </td>
              </tr>
            ) : (
              recentPosts.map((post) => (
                <AdminTableRow key={post.id}>
                  <AdminTableCell className="text-inkGray">{post.title}</AdminTableCell>
                  <AdminTableCell>
                    <AdminBadge variant={post.published ? "default" : "warning"}>
                      {post.published ? "已发布" : "草稿"}
                    </AdminBadge>
                  </AdminTableCell>
                  <AdminTableCell>
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </AdminTableCell>
                  <AdminTableCell>{post.views}</AdminTableCell>
                </AdminTableRow>
              ))
            )}
          </tbody>
        </AdminTable>
      </div>
    </div>
  );
}
