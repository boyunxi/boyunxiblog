"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Upload,
  Trash2,
  Search,
  Copy,
  Check,
  Pencil,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import AdminButton from "@/components/ui/AdminButton";
import AdminConfirmDialog from "@/components/ui/AdminConfirmDialog";

interface ImageItem {
  id: number;
  name: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function uploadFile(file: File, onProgress: (pct: number) => void): Promise<ImageItem> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        if (data.success) resolve(data.data);
        else reject(new Error(data.error || "Upload failed"));
      } else {
        reject(new Error(`HTTP ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(formData);
  });
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showDelete, setShowDelete] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCurrent, setUploadCurrent] = useState("");
  const [uploadQueue, setUploadQueue] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [previewId, setPreviewId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (keyword) params.set("keyword", keyword);
    fetch(`/api/images?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setImages(d.data.images ?? []);
        setTotal(d.data.total ?? 0);
      });
  }, [page, keyword]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    setUploading(true);
    setUploadQueue(fileArray.length);
    setUploadProgress(0);
    setUploadCurrent(fileArray[0].name);

    let completed = 0;
    for (const file of fileArray) {
      setUploadCurrent(file.name);
      try {
        await uploadFile(file, (pct) => setUploadProgress(pct));
        completed++;
      } catch (err) {
        console.error("Upload failed:", file.name, err);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    setUploadCurrent("");
    setUploadQueue(0);
    fetchImages();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  };

  const handleBulkDelete = async () => {
    await fetch("/api/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    setSelected(new Set());
    setShowDelete(false);
    fetchImages();
  };

  const handleDeleteSingle = async (id: number) => {
    await fetch(`/api/images/${id}`, { method: "DELETE" });
    fetchImages();
  };

  const handleRename = async (id: number) => {
    if (!editName.trim()) return;
    await fetch(`/api/images/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setEditingId(null);
    fetchImages();
  };

  const copyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === images.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(images.map((img) => img.id)));
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="图片管理"
        action={
          selected.size > 0 && (
            <AdminButton variant="danger" onClick={() => setShowDelete(true)}>
              <Trash2 className="w-4 h-4" />
              删除选中 ({selected.size})
            </AdminButton>
          )
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
            placeholder="搜索图片名称..."
            className="w-full pl-9 pr-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray text-sm focus:outline-none focus:border-ink/50"
          />
        </div>
        <div>
          <AdminButton
            variant="primary"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                上传图片
              </>
            )}
          </AdminButton>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-inkGray/60">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              {uploadCurrent}
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-ink/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-300 ease-out rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${
          dragOver
            ? "border-gold bg-gold/5"
            : "border-ink/10 bg-ricepaper/50"
        }`}
      >
        {uploading ? (
          <div className="space-y-2">
            <Loader2 className="w-6 h-6 mx-auto animate-spin text-gold" />
            <p className="text-inkGray/60 font-serif">{uploadCurrent}</p>
            <p className="text-inkGray/40 text-xs">{uploadProgress}%</p>
          </div>
        ) : (
          <p className="text-inkGray/40 font-serif">
            <ImageIcon className="w-6 h-6 mx-auto mb-2 opacity-40" />
            拖拽图片到此处上传，或点击上方"上传图片"按钮
          </p>
        )}
      </div>

      {/* Image grid */}
      {images.length > 0 ? (
        <>
          <div className="flex items-center gap-2 text-sm text-inkGray/60">
            <input
              type="checkbox"
              checked={selected.size === images.length && images.length > 0}
              onChange={toggleAll}
              className="accent-ink"
            />
            <span>全选 · 共 {total} 张</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative group border rounded-sm overflow-hidden bg-ricepaper transition-all ${
                  selected.has(img.id) ? "border-gold ring-2 ring-gold/30" : "border-ink/10 hover:border-ink/30"
                }`}
              >
                {/* Checkbox overlay */}
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="checkbox"
                    checked={selected.has(img.id)}
                    onChange={() => toggleSelect(img.id)}
                    className="accent-gold w-4 h-4 rounded"
                  />
                </div>

                {/* Preview */}
                <div
                  className="aspect-square bg-ink/5 cursor-pointer flex items-center justify-center"
                  onClick={() => setPreviewId(previewId === img.id ? null : img.id)}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect fill='%23eee' width='100' height='100'/><text x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999'>?</text></svg>";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-2 text-xs">
                  {editingId === img.id ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleRename(img.id); if (e.key === "Escape") setEditingId(null); }}
                        className="flex-1 px-1 py-0.5 border border-ink/20 rounded text-xs bg-ricepaper"
                        autoFocus
                      />
                      <button onClick={() => handleRename(img.id)} className="p-0.5 text-green-600 hover:bg-green-50 rounded"><Check className="w-3 h-3" /></button>
                      <button onClick={() => setEditingId(null)} className="p-0.5 text-inkGray/50 hover:bg-ink/5 rounded"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="truncate text-inkGray flex-1" title={img.name}>{img.name}</span>
                      <div className="flex gap-0.5 ml-1">
                        <button
                          onClick={() => { setEditingId(img.id); setEditName(img.name); }}
                          className="p-0.5 text-inkGray/40 hover:text-ink rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="重命名"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-0.5 text-inkGray/40">
                    <span>{formatSize(img.size)}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyUrl(img.url, img.id)}
                        className="p-0.5 hover:text-ink rounded"
                        title="复制链接"
                      >
                        {copied === img.id ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => handleDeleteSingle(img.id)}
                        className="p-0.5 hover:text-red-600 rounded"
                        title="删除"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded preview */}
                {previewId === img.id && (
                  <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-8"
                    onClick={() => setPreviewId(null)}
                  >
                    <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
                      <img src={img.url} alt={img.name} className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl" />
                      <div className="mt-3 text-center text-ricepaper/80 text-sm">
                        {img.name} · {formatSize(img.size)}
                        {editingId === null && (
                          <span className="ml-3">
                            <button
                              onClick={() => { setEditingId(img.id); setEditName(img.name); }}
                              className="text-ricepaper/60 hover:text-ricepaper mr-2"
                            >重命名</button>
                            <button
                              onClick={() => { copyUrl(img.url, img.id); }}
                              className="text-ricepaper/60 hover:text-ricepaper mr-2"
                            >{copied === img.id ? "已复制" : "复制链接"}</button>
                            <button
                              onClick={() => { setPreviewId(null); handleDeleteSingle(img.id); }}
                              className="text-red-400 hover:text-red-300"
                            >删除</button>
                          </span>
                        )}
                      </div>
                      {editingId === img.id && (
                        <div className="mt-2 flex justify-center gap-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleRename(img.id); if (e.key === "Escape") setEditingId(null); }}
                            className="px-2 py-1 border border-ricepaper/20 rounded bg-ink text-ricepaper text-sm"
                            autoFocus
                          />
                          <button onClick={() => handleRename(img.id)} className="px-2 py-1 bg-gold text-ink rounded text-sm">保存</button>
                          <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-inkGray/30 text-ricepaper rounded text-sm">取消</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-sm text-sm border transition-colors ${
                    page === i + 1
                      ? "bg-ink text-ricepaper border-ink"
                      : "border-ink/20 text-inkGray hover:bg-ink/5"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <ImageIcon className="w-12 h-12 mx-auto text-inkGray/20 mb-4" />
          <p className="text-inkGray/40 font-serif">暂无图片</p>
        </div>
      )}

      <AdminConfirmDialog
        open={showDelete}
        title="确认删除"
        message={`确定要删除选中的 ${selected.size} 张图片吗？此操作不可撤销。`}
        onConfirm={handleBulkDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
