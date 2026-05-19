"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import AdminButton from "@/components/ui/AdminButton";
import AdminTable, { AdminTableHeader, AdminTableHeaderCell, AdminTableRow, AdminTableCell } from "@/components/ui/AdminTable";
import AdminConfirmDialog from "@/components/ui/AdminConfirmDialog";

interface TagItem {
  id: number;
  name: string;
  _count: { posts: number };
}

const inputClass = "w-full px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50 transition-colors";
const labelClass = "block text-sm font-serif text-ink mb-1";

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
      <AdminPageHeader
        title="标签管理"
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="w-4 h-4" />
            新建标签
          </AdminButton>
        }
      />

      <AdminTable>
        <AdminTableHeader>
          <AdminTableHeaderCell>名称</AdminTableHeaderCell>
          <AdminTableHeaderCell>文章数</AdminTableHeaderCell>
          <AdminTableHeaderCell>操作</AdminTableHeaderCell>
        </AdminTableHeader>
        <tbody>
          {tags.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-8 text-inkGray/60">暂无标签</td>
            </tr>
          ) : (
            tags.map((tag) => (
              <AdminTableRow key={tag.id}>
                <AdminTableCell className="text-inkGray">{tag.name}</AdminTableCell>
                <AdminTableCell>{tag._count?.posts ?? 0}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(tag)} className="p-1.5 text-ink/60 hover:text-ink hover:bg-ink/5 rounded-sm transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(tag.id)} className="p-1.5 text-ochre/60 hover:text-ochre hover:bg-ochre/5 rounded-sm transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </tbody>
      </AdminTable>

      {showModal && (
        <div className="fixed inset-0 bg-ink/30 flex items-center justify-center z-50">
          <div className="bg-ricepaper p-6 rounded-sm shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-ink text-lg">{editingId ? "编辑标签" : "新建标签"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-inkGray/60 hover:text-ink transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className={labelClass}>名称</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <AdminButton variant="secondary" onClick={() => setShowModal(false)}>取消</AdminButton>
              <AdminButton onClick={handleSave}>保存</AdminButton>
            </div>
          </div>
        </div>
      )}

      <AdminConfirmDialog
        open={deleteId !== null}
        title="确认删除"
        message="确定要删除此标签吗？"
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
