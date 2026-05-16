"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface TagItem {
  id: number;
  name: string;
  _count: { posts: number };
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTags = useCallback(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data.data ?? []));
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setShowModal(true);
  };

  const openEdit = (tag: TagItem) => {
    setEditingId(tag.id);
    setName(tag.name);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    const body = { name };
    if (editingId) {
      await fetch(`/api/tags/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setShowModal(false);
    fetchTags();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/tags/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchTags();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-ink">标签管理</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-ink text-ricepaper rounded-sm hover:bg-ink/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建标签
        </button>
      </div>

      <div className="scroll-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink/10 bg-ricepaper/50">
              <th className="text-left px-4 py-3 text-sm font-serif text-ink">名称</th>
              <th className="text-left px-4 py-3 text-sm font-serif text-ink">文章数</th>
              <th className="text-left px-4 py-3 text-sm font-serif text-ink">操作</th>
            </tr>
          </thead>
          <tbody>
            {tags.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-inkGray/60">
                  暂无标签
                </td>
              </tr>
            ) : (
              tags.map((tag) => (
                <tr key={tag.id} className="border-b border-ink/5 hover:bg-ricepaper/30">
                  <td className="px-4 py-3 text-inkGray">{tag.name}</td>
                  <td className="px-4 py-3 text-inkGray/70">{tag._count?.posts ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(tag)}
                        className="p-1.5 text-ink/60 hover:text-ink hover:bg-ink/5 rounded-sm transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(tag.id)}
                        className="p-1.5 text-ochre/60 hover:text-ochre hover:bg-ochre/5 rounded-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-ink/30 flex items-center justify-center z-50">
          <div className="bg-ricepaper p-6 rounded-sm shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-ink text-lg">
                {editingId ? "编辑标签" : "新建标签"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-inkGray/60 hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-serif text-ink mb-1">名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-ink/20 text-inkGray rounded-sm hover:bg-ink/5 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-ink text-ricepaper rounded-sm hover:bg-ink/90 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-ink/30 flex items-center justify-center z-50">
          <div className="bg-ricepaper p-6 rounded-sm shadow-lg max-w-sm w-full mx-4">
            <h3 className="font-serif text-ink text-lg mb-3">确认删除</h3>
            <p className="text-inkGray text-sm mb-6">确定要删除此标签吗？</p>
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
