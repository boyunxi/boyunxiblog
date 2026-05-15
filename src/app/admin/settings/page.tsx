"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

interface Settings {
  siteName: string;
  siteDescription: string;
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  archiveLabel: string;
  emptyStateText: string;
  authorName: string;
  authorBio: string;
  contactEmail: string;
  githubUrl: string;
  copyrightText: string;
  icpNumber: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  aboutContent: string;
}

const defaultSettings: Settings = {
  siteName: "薄云隙",
  siteDescription: "窥见世界裂隙",
  logoText: "隙",
  heroTitle: "薄云隙",
  heroSubtitle: "窥见世界裂隙 · 数字古风档案馆",
  archiveLabel: "云 海 档 案 馆",
  emptyStateText: "档案馆中尚无卷宗",
  authorName: "",
  authorBio: "",
  contactEmail: "",
  githubUrl: "",
  copyrightText: "薄云隙 · 数字古风档案馆",
  icpNumber: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  aboutContent: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings({ ...defaultSettings, ...data.data });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateField = (field: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-serif text-ink">站点设置</h1>
        <p className="text-inkGray/60">加载中...</p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50 transition-colors";
  const labelClass = "block text-sm font-serif text-ink mb-1.5";
  const sectionClass = "scroll-card p-6 space-y-5";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-ink">站点设置</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-sm transition-colors ${
            saved
              ? "bg-green-600 text-white"
              : "bg-ink text-ricepaper hover:bg-ink/90"
          }`}
        >
          <Save className="w-4 h-4" />
          {saving ? "保存中..." : saved ? "已保存" : "保存设置"}
        </button>
      </div>

      <div className={sectionClass}>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">基本信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>站点名称</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => updateField("siteName", e.target.value)}
              className={inputClass}
              placeholder="薄云隙"
            />
          </div>
          <div>
            <label className={labelClass}>站点标语</label>
            <input
              type="text"
              value={settings.siteDescription}
              onChange={(e) => updateField("siteDescription", e.target.value)}
              className={inputClass}
              placeholder="窥见世界裂隙"
            />
          </div>
          <div>
            <label className={labelClass}>Logo 文字</label>
            <input
              type="text"
              value={settings.logoText}
              onChange={(e) => updateField("logoText", e.target.value)}
              className={inputClass}
              placeholder="隙"
              maxLength={4}
            />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">首页文案</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Hero 大标题</label>
            <input
              type="text"
              value={settings.heroTitle}
              onChange={(e) => updateField("heroTitle", e.target.value)}
              className={inputClass}
              placeholder="薄云隙"
            />
          </div>
          <div>
            <label className={labelClass}>Hero 副标题</label>
            <input
              type="text"
              value={settings.heroSubtitle}
              onChange={(e) => updateField("heroSubtitle", e.target.value)}
              className={inputClass}
              placeholder="窥见世界裂隙 · 数字古风档案馆"
            />
          </div>
          <div>
            <label className={labelClass}>文章列表区标签</label>
            <input
              type="text"
              value={settings.archiveLabel}
              onChange={(e) => updateField("archiveLabel", e.target.value)}
              className={inputClass}
              placeholder="云 海 档 案 馆"
            />
          </div>
          <div>
            <label className={labelClass}>空状态提示文字</label>
            <input
              type="text"
              value={settings.emptyStateText}
              onChange={(e) => updateField("emptyStateText", e.target.value)}
              className={inputClass}
              placeholder="档案馆中尚无卷宗"
            />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">作者信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>作者名称</label>
            <input
              type="text"
              value={settings.authorName}
              onChange={(e) => updateField("authorName", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>联系邮箱</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>GitHub 地址</label>
            <input
              type="url"
              value={settings.githubUrl}
              onChange={(e) => updateField("githubUrl", e.target.value)}
              className={inputClass}
              placeholder="https://github.com/username"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>作者简介</label>
          <textarea
            value={settings.authorBio}
            onChange={(e) => updateField("authorBio", e.target.value)}
            className={inputClass}
            rows={3}
          />
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">页脚设置</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>版权文字</label>
            <input
              type="text"
              value={settings.copyrightText}
              onChange={(e) => updateField("copyrightText", e.target.value)}
              className={inputClass}
              placeholder="薄云隙 · 数字古风档案馆"
            />
          </div>
          <div>
            <label className={labelClass}>ICP 备案号</label>
            <input
              type="text"
              value={settings.icpNumber}
              onChange={(e) => updateField("icpNumber", e.target.value)}
              className={inputClass}
              placeholder="京ICP备XXXXXXXX号"
            />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">SEO 设置</h2>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>SEO 标题</label>
            <input
              type="text"
              value={settings.seoTitle}
              onChange={(e) => updateField("seoTitle", e.target.value)}
              className={inputClass}
              placeholder="留空则使用站点名称"
            />
          </div>
          <div>
            <label className={labelClass}>SEO 描述</label>
            <textarea
              value={settings.seoDescription}
              onChange={(e) => updateField("seoDescription", e.target.value)}
              className={inputClass}
              rows={2}
              placeholder="留空则使用站点标语"
            />
          </div>
          <div>
            <label className={labelClass}>SEO 关键词</label>
            <input
              type="text"
              value={settings.seoKeywords}
              onChange={(e) => updateField("seoKeywords", e.target.value)}
              className={inputClass}
              placeholder="多个关键词用逗号分隔"
            />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">关于页内容</h2>
        <p className="text-inkGray/60 text-sm">使用 HTML 格式编写，可参考初始内容的结构</p>
        <textarea
          value={settings.aboutContent}
          onChange={(e) => updateField("aboutContent", e.target.value)}
          className={inputClass + " font-mono text-sm"}
          rows={20}
        />
      </div>

      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-sm transition-colors ${
            saved
              ? "bg-green-600 text-white"
              : "bg-ink text-ricepaper hover:bg-ink/90"
          }`}
        >
          <Save className="w-4 h-4" />
          {saving ? "保存中..." : saved ? "已保存" : "保存设置"}
        </button>
      </div>
    </div>
  );
}