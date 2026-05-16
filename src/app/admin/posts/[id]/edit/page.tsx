"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { RefreshCw, ImageIcon, Bold, Italic, Heading1, Heading2, List, LinkIcon, Quote, Code, ImagePlus, Trash2, Eye, Edit2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface TagItem {
  id: number;
  name: string;
}

interface PostData {
  id: number;
  title: string;
  slug: string;
  coverImage: string | null;
  categoryId: number | null;
  excerpt: string | null;
  content: string;
  published: boolean;
  tags: { tagId: number }[];
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data ?? []));
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data.data ?? []));
  }, []);

  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then((res) => res.json())
      .then((res) => {
        const data: PostData = res.data;
        setTitle(data.title);
        setSlug(data.slug);
        setCoverImage(data.coverImage ?? "");
        setCategoryId(data.categoryId ? String(data.categoryId) : "");
        setExcerpt(data.excerpt ?? "");
        setPublished(data.published);
        setSelectedTags(data.tags.map((t) => t.tagId));
        setContent(data.content);
        setLoading(false);
      });
  }, [postId]);

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("md-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = prefix + (selected || "文本") + suffix;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || "文本").length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      title,
      slug,
      coverImage: coverImage || null,
      categoryId: categoryId ? Number(categoryId) : null,
      tagIds: selectedTags,
      excerpt: excerpt || null,
      content,
      published,
    };
    await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.push("/admin/posts");
  };

  const handleDelete = async () => {
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    router.push("/admin/posts");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-inkGray/60 font-serif">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-ink">编辑文章</h1>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-ochre hover:bg-ochre/5 rounded-sm transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          删除
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-serif text-ink mb-1">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(generateSlug(e.target.value));
            }}
            className="w-full px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray font-serif focus:outline-none focus:border-ink/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-serif text-ink mb-1">Slug</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50"
            />
            <button
              type="button"
              onClick={() => setSlug(generateSlug(title))}
              className="px-3 py-2 border border-ink/20 rounded-sm text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-serif text-ink mb-1">封面图</label>
          <div className="flex gap-2">
            <ImageIcon className="w-5 h-5 text-ink/40 mt-2" />
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="输入图片URL"
              className="flex-1 px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-serif text-ink mb-1">分类</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50"
          >
            <option value="">选择分类</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-serif text-ink mb-2">标签</label>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  className="accent-ink"
                />
                <span className="text-sm text-inkGray">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-serif text-ink mb-1">摘要</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50 resize-y"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-serif text-ink">内容（Markdown / MDX）</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs transition-colors ${!showPreview ? "bg-ink/10 text-ink" : "text-inkGray hover:bg-ink/5"}`}
              >
                <Edit2 className="w-3 h-3" /> 编辑
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs transition-colors ${showPreview ? "bg-ink/10 text-ink" : "text-inkGray hover:bg-ink/5"}`}
              >
                <Eye className="w-3 h-3" /> 预览
              </button>
            </div>
          </div>

          {!showPreview ? (
            <div className="border border-ink/20 rounded-sm bg-ricepaper overflow-hidden">
              <div className="flex gap-1 p-2 border-b border-ink/10 bg-ricepaper/50 flex-wrap">
                <button type="button" onClick={() => insertMarkdown("**", "**")} className="p-1.5 rounded-sm hover:bg-ink/10 text-inkGray" title="加粗">
                  <Bold className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertMarkdown("*", "*")} className="p-1.5 rounded-sm hover:bg-ink/10 text-inkGray" title="斜体">
                  <Italic className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertMarkdown("# ")} className="p-1.5 rounded-sm hover:bg-ink/10 text-inkGray" title="一级标题">
                  <Heading1 className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertMarkdown("## ")} className="p-1.5 rounded-sm hover:bg-ink/10 text-inkGray" title="二级标题">
                  <Heading2 className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertMarkdown("- ")} className="p-1.5 rounded-sm hover:bg-ink/10 text-inkGray" title="无序列表">
                  <List className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertMarkdown("[", "](url)")} className="p-1.5 rounded-sm hover:bg-ink/10 text-inkGray" title="链接">
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertMarkdown("![alt](", ")")} className="p-1.5 rounded-sm hover:bg-ink/10 text-inkGray" title="图片">
                  <ImagePlus className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertMarkdown("> ")} className="p-1.5 rounded-sm hover:bg-ink/10 text-inkGray" title="引用">
                  <Quote className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertMarkdown("```\n", "\n```")} className="p-1.5 rounded-sm hover:bg-ink/10 text-inkGray" title="代码块">
                  <Code className="w-4 h-4" />
                </button>
              </div>
              <textarea
                id="md-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="使用 Markdown 或 MDX 语法编写文章内容..."
                className="w-full p-4 min-h-[400px] font-mono text-sm text-inkGray bg-transparent resize-y focus:outline-none"
              />
            </div>
          ) : (
            <div className="border border-ink/20 rounded-sm bg-ricepaper p-6 min-h-[400px] prose prose-sm max-w-none">
              {content ? (
                <div className="whitespace-pre-wrap text-sm text-inkGray">{content}</div>
              ) : (
                <p className="text-inkGray/40 text-sm">暂无内容，请先在编辑模式下编写</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-serif text-ink mb-2">状态</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setPublished(false)}
              className={`px-4 py-2 rounded-sm border transition-colors ${
                !published
                  ? "bg-ochre text-ricepaper border-ochre"
                  : "border-ink/20 text-inkGray hover:bg-ink/5"
              }`}
            >
              草稿
            </button>
            <button
              type="button"
              onClick={() => setPublished(true)}
              className={`px-4 py-2 rounded-sm border transition-colors ${
                published
                  ? "bg-ink text-ricepaper border-ink"
                  : "border-ink/20 text-inkGray hover:bg-ink/5"
              }`}
            >
              发布
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-ink text-ricepaper rounded-sm hover:bg-ink/90 transition-colors"
          >
            保存更改
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="px-6 py-2.5 border border-ink/20 text-inkGray rounded-sm hover:bg-ink/5 transition-colors"
          >
            取消
          </button>
        </div>
      </form>

      {showDelete && (
        <div className="fixed inset-0 bg-ink/30 flex items-center justify-center z-50">
          <div className="bg-ricepaper p-6 rounded-sm shadow-lg max-w-sm w-full mx-4">
            <h3 className="font-serif text-ink text-lg mb-3">确认删除</h3>
            <p className="text-inkGray text-sm mb-6">确定要删除这篇文章吗？此操作不可撤销。</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 border border-ink/20 text-inkGray rounded-sm hover:bg-ink/5 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
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
