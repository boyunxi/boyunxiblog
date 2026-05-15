"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { RefreshCw, ImageIcon, Bold, Italic, Heading1, Heading2, List, LinkIcon, Quote, Code, ImagePlus, Trash2 } from "lucide-react";

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "开始写作..." }),
    ],
    content: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? data ?? []));
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data.tags ?? data ?? []));
  }, []);

  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then((res) => res.json())
      .then((data: PostData) => {
        setTitle(data.title);
        setSlug(data.slug);
        setCoverImage(data.coverImage ?? "");
        setCategoryId(data.categoryId ? String(data.categoryId) : "");
        setExcerpt(data.excerpt ?? "");
        setPublished(data.published);
        setSelectedTags(data.tags.map((t) => t.tagId));
        editor?.commands.setContent(data.content);
        setLoading(false);
      });
  }, [postId, editor]);

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
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
      content: editor?.getHTML() ?? "",
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
          <label className="block text-sm font-serif text-ink mb-2">内容</label>
          <div className="border border-ink/20 rounded-sm bg-ricepaper overflow-hidden">
            <div className="flex gap-1 p-2 border-b border-ink/10 bg-ricepaper/50 flex-wrap">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded-sm hover:bg-ink/10 ${editor?.isActive("bold") ? "bg-ink/10 text-ink" : "text-inkGray"}`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded-sm hover:bg-ink/10 ${editor?.isActive("italic") ? "bg-ink/10 text-ink" : "text-inkGray"}`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-1.5 rounded-sm hover:bg-ink/10 ${editor?.isActive("heading", { level: 1 }) ? "bg-ink/10 text-ink" : "text-inkGray"}`}
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded-sm hover:bg-ink/10 ${editor?.isActive("heading", { level: 2 }) ? "bg-ink/10 text-ink" : "text-inkGray"}`}
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded-sm hover:bg-ink/10 ${editor?.isActive("bulletList") ? "bg-ink/10 text-ink" : "text-inkGray"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt("输入链接URL:");
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                }}
                className={`p-1.5 rounded-sm hover:bg-ink/10 ${editor?.isActive("link") ? "bg-ink/10 text-ink" : "text-inkGray"}`}
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt("输入图片URL:");
                  if (url) editor?.chain().focus().setImage({ src: url }).run();
                }}
                className="p-1.5 rounded-sm hover:bg-ink/10 text-inkGray"
              >
                <ImagePlus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded-sm hover:bg-ink/10 ${editor?.isActive("blockquote") ? "bg-ink/10 text-ink" : "text-inkGray"}`}
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={`p-1.5 rounded-sm hover:bg-ink/10 ${editor?.isActive("codeBlock") ? "bg-ink/10 text-ink" : "text-inkGray"}`}
              >
                <Code className="w-4 h-4" />
              </button>
            </div>
            <EditorContent editor={editor} className="prose prose-sm max-w-none p-4 min-h-[300px] [&_.tiptap]:min-h-[280px] [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:text-inkGray/40 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]" />
          </div>
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
