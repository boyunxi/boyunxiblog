"use client";

import { useEffect, useState, useRef } from "react";
import { X, Search, Upload, Copy, Check, RefreshCw, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageItem {
  id: number;
  name: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (markdown: string) => void;
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

export default function ImagePickerModal({ open, onClose, onSelect }: Props) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCurrent, setUploadCurrent] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: "1", pageSize: "50" });
    if (keyword) params.set("keyword", keyword);
    fetch(`/api/images?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setImages(d.data.images ?? []);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (open) fetchImages();
  }, [open, keyword]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      setUploadCurrent(file.name);
      setUploadProgress(0);
      try {
        await uploadFile(file, (pct) => setUploadProgress(pct));
      } catch (err) {
        console.error("Upload failed:", file.name, err);
      }
    }
    setUploading(false);
    setUploadProgress(0);
    setUploadCurrent("");
    if (e.target) e.target.value = "";
    fetchImages();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    setUploading(true);
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      setUploadCurrent(file.name);
      setUploadProgress(0);
      try {
        await uploadFile(file, (pct) => setUploadProgress(pct));
      } catch (err) {
        console.error("Upload failed:", file.name, err);
      }
    }
    setUploading(false);
    setUploadProgress(0);
    setUploadCurrent("");
    fetchImages();
  };

  const copyUrl = async (url: string, id: number) => {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-ricepaper rounded-sm w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ink/10">
          <h2 className="font-serif text-lg text-ink">选择图片</h2>
          <button onClick={onClose} className="p-1 hover:bg-ink/5 rounded text-inkGray/60 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 p-3 border-b border-ink/5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索..."
              className="w-full pl-9 pr-3 py-1.5 border border-ink/10 rounded-sm text-sm bg-white text-inkGray focus:outline-none focus:border-ink/30"
            />
          </div>
          <button onClick={fetchImages} className="p-1.5 text-inkGray/60 hover:text-ink rounded border border-ink/10" title="刷新">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-ink text-ricepaper rounded-sm text-sm hover:bg-ink/90 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                上传
              </>
            )}
          </button>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="mx-3 mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs text-inkGray/60">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                {uploadCurrent}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-ink/5 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-300 ease-out rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="mx-3 mt-2 border border-dashed border-ink/10 rounded-sm p-4 text-center text-xs text-inkGray/40"
        >
          {uploading ? "上传中..." : "拖拽图片到此处上传"}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <p className="text-center py-12 text-inkGray/40">加载中...</p>
          ) : images.length === 0 ? (
            <p className="text-center py-12 text-inkGray/40">暂无图片</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="group border border-ink/10 rounded-sm overflow-hidden bg-white hover:border-ink/30 transition-colors">
                  <div
                    className="aspect-square cursor-pointer flex items-center justify-center bg-ink/[0.02]"
                    onClick={() => onSelect(`![${img.name.replace(/\.[^.]+$/, "")}](${img.url})`)}
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
                  <div className="p-1.5 text-[10px] leading-tight">
                    <p className="truncate text-inkGray" title={img.name}>{img.name}</p>
                    <div className="flex items-center justify-between text-inkGray/40 mt-0.5">
                      <span>{formatSize(img.size)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyUrl(img.url, img.id); }}
                        className="p-0.5 hover:text-ink opacity-0 group-hover:opacity-100 transition-opacity"
                        title="复制链接"
                      >
                        {copied === img.id ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-ink/10 text-xs text-inkGray/40 text-center">
          点击图片直接插入 Markdown 语法到编辑器中
        </div>
      </div>
    </div>
  );
}
