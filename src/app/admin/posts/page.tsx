"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import AdminButton from "@/components/ui/AdminButton";
import AdminTable, { AdminTableHeader, AdminTableHeaderCell, AdminTableRow, AdminTableCell } from "@/components/ui/AdminTable";
import AdminBadge from "@/components/ui/AdminBadge";
import AdminConfirmDialog from "@/components/ui/AdminConfirmDialog";

interface Post {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  views: number;
  createdAt: string;
  category: { id: number; name: string } | null;
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const perPage = 10;

  const fetchPosts = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(perPage), search });
    fetch(`/api/posts?${params}`)
      .then((res) => res.json())
      .then((res) => {
        setPosts(res.data?.posts ?? []);
        const total = res.data?.total ?? 0;
        setTotalPages(Math.ceil(total / perPage) || 1);
      });
  }, [page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchPosts();
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="文章管理"
        action={
          <AdminButton onClick={() => router.push("/admin/posts/new")}>
            <Plus className="w-4 h-4" />
            新建
          </AdminButton>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inkGray/50" />
        <input
          type="text"
          placeholder="搜索文章标题..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="scroll-card p-12 text-center">
          <p className="text-inkGray/60 mb-4">暂无文章，点击新建开始创作</p>
          <AdminButton onClick={() => router.push("/admin/posts/new")}>新建文章</AdminButton>
        </div>
      ) : (
        <>
          <AdminTable>
            <AdminTableHeader>
              <AdminTableHeaderCell>标题</AdminTableHeaderCell>
              <AdminTableHeaderCell>分类</AdminTableHeaderCell>
              <AdminTableHeaderCell>状态</AdminTableHeaderCell>
              <AdminTableHeaderCell>浏览量</AdminTableHeaderCell>
              <AdminTableHeaderCell>创建时间</AdminTableHeaderCell>
              <AdminTableHeaderCell>操作</AdminTableHeaderCell>
            </AdminTableHeader>
            <tbody>
              {filtered.map((post) => (
                <AdminTableRow key={post.id}>
                  <AdminTableCell className="text-inkGray">{post.title}</AdminTableCell>
                  <AdminTableCell>{post.category?.name ?? "—"}</AdminTableCell>
                  <AdminTableCell>
                    <AdminBadge variant={post.published ? "default" : "warning"}>
                      {post.published ? "已发布" : "草稿"}
                    </AdminBadge>
                  </AdminTableCell>
                  <AdminTableCell>{post.views}</AdminTableCell>
                  <AdminTableCell>
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
                        className="p-1.5 text-ink/60 hover:text-ink hover:bg-ink/5 rounded-sm transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="p-1.5 text-ochre/60 hover:text-ochre hover:bg-ochre/5 rounded-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded-sm text-sm ${
                    p === page
                      ? "bg-ink text-ricepaper"
                      : "border border-ink/20 text-inkGray hover:bg-ink/5"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <AdminConfirmDialog
        open={deleteId !== null}
        title="确认删除"
        message="确定要删除这篇文章吗？此操作不可撤销。"
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
