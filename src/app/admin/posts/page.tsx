"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

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
    const params = new URLSearchParams({ page: String(page), perPage: String(perPage), search });
    fetch(`/api/posts?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts ?? []);
        setTotalPages(data.totalPages ?? 1);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-ink">文章管理</h1>
        <button
          onClick={() => router.push("/admin/posts/new")}
          className="flex items-center gap-2 px-4 py-2 bg-ink text-ricepaper rounded-sm hover:bg-ink/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建
        </button>
      </div>

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
          <button
            onClick={() => router.push("/admin/posts/new")}
            className="px-4 py-2 bg-ink text-ricepaper rounded-sm hover:bg-ink/90 transition-colors"
          >
            新建文章
          </button>
        </div>
      ) : (
        <>
          <div className="scroll-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/10 bg-ricepaper/50">
                  <th className="text-left px-4 py-3 text-sm font-serif text-ink">标题</th>
                  <th className="text-left px-4 py-3 text-sm font-serif text-ink">分类</th>
                  <th className="text-left px-4 py-3 text-sm font-serif text-ink">状态</th>
                  <th className="text-left px-4 py-3 text-sm font-serif text-ink">浏览量</th>
                  <th className="text-left px-4 py-3 text-sm font-serif text-ink">创建时间</th>
                  <th className="text-left px-4 py-3 text-sm font-serif text-ink">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="border-b border-ink/5 hover:bg-ricepaper/30">
                    <td className="px-4 py-3 text-inkGray">{post.title}</td>
                    <td className="px-4 py-3 text-inkGray/70">
                      {post.category?.name ?? "—"}
                    </td>
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
                    <td className="px-4 py-3 text-inkGray/70">{post.views}</td>
                    <td className="px-4 py-3 text-inkGray/70 text-sm">
                      {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      {deleteId !== null && (
        <div className="fixed inset-0 bg-ink/30 flex items-center justify-center z-50">
          <div className="bg-ricepaper p-6 rounded-sm shadow-lg max-w-sm w-full mx-4">
            <h3 className="font-serif text-ink text-lg mb-3">确认删除</h3>
            <p className="text-inkGray text-sm mb-6">确定要删除这篇文章吗？此操作不可撤销。</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-ink/20 text-inkGray rounded-sm hover:bg-ink/5 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-ochre text-ricepaper rounded-sm hover:bg-ochre/90 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
