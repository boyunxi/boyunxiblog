"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import AdminButton from "@/components/ui/AdminButton";
import AdminTable, { AdminTableHeader, AdminTableHeaderCell, AdminTableRow, AdminTableCell } from "@/components/ui/AdminTable";
import AdminConfirmDialog from "@/components/ui/AdminConfirmDialog";

interface Category {
  id: number;
  name: string;
  slug: string;
  _count: { posts: number };
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const inputClass = "w-full px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50 transition-colors";
const labelClass = "block text-sm font-serif text-ink mb-1";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchCategories = useCallback(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data ?? []));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setShowModal(true);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingId) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    const body = { name, slug: slug || generateSlug(name) };
    if (editingId) {
      await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setShowModal(false);
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="分类管理"
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="w-4 h-4" />
            新建分类
          </AdminButton>
        }
      />

      <AdminTable>
        <AdminTableHeader>
          <AdminTableHeaderCell>名称</AdminTableHeaderCell>
          <AdminTableHeaderCell>Slug</AdminTableHeaderCell>
          <AdminTableHeaderCell>文章数</AdminTableHeaderCell>
          <AdminTableHeaderCell>操作</AdminTableHeaderCell>
        </AdminTableHeader>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-8 text-inkGray/60">暂无分类</td>
            </tr>
          ) : (
            categories.map((cat) => (
              <AdminTableRow key={cat.id}>
                <AdminTableCell className="text-inkGray">{cat.name}</AdminTableCell>
                <AdminTableCell className="text-sm">{cat.slug}</AdminTableCell>
                <AdminTableCell>{cat._count?.posts ?? 0}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(cat)} className="p-1.5 text-ink/60 hover:text-ink hover:bg-ink/5 rounded-sm transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(cat.id)} className="p-1.5 text-ochre/60 hover:text-ochre hover:bg-ochre/5 rounded-sm transition-colors">
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
              <h3 className="font-serif text-ink text-lg">{editingId ? "编辑分类" : "新建分类"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-inkGray/60 hover:text-ink transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>名称</label>
                <input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
              </div>
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
        message="确定要删除此分类吗？"
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
