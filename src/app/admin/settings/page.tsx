"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import AdminButton from "@/components/ui/AdminButton";
import AdminCard from "@/components/ui/AdminCard";

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
  policeNumber: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  aboutContent: string;
  easterEggLogoEnabled: boolean;
  easterEggLogoClicks: number;
  easterEggLogoText: string;
  easterEggLogoDuration: number;
  easterEggConsoleEnabled: boolean;
  easterEggConsoleText: string;
  easterEggKonamiEnabled: boolean;
  easterEggKonamiText: string;
  easterEggSearchHello: string;
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
  policeNumber: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  aboutContent: "",
  easterEggLogoEnabled: true,
  easterEggLogoClicks: 5,
  easterEggLogoText: "云深不知处,只在此山中,欲穷千里目,更上一层楼,海内存知己,天涯若比邻",
  easterEggLogoDuration: 3,
  easterEggConsoleEnabled: true,
  easterEggConsoleText: "欢迎来到薄云隙 · 窥见世界裂隙",
  easterEggKonamiEnabled: true,
  easterEggKonamiText: "道可道，非常道。名可名，非常名。",
  easterEggSearchHello: "你好，有缘人！既然寻到了此处，便留下吧。",
};

const inputClass = "w-full px-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50 transition-colors";
const labelClass = "block text-sm font-serif text-ink mb-1.5";

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

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="站点设置"
        action={
          <AdminButton onClick={handleSave} disabled={saving} className={saved ? "bg-green-600 text-white hover:bg-green-600" : ""}>
            <Save className="w-4 h-4" />
            {saving ? "保存中..." : saved ? "已保存" : "保存设置"}
          </AdminButton>
        }
      />

      <AdminCard>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">基本信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>站点名称</label>
            <input type="text" value={settings.siteName} onChange={(e) => updateField("siteName", e.target.value)} className={inputClass} placeholder="薄云隙" />
          </div>
          <div>
            <label className={labelClass}>站点标语</label>
            <input type="text" value={settings.siteDescription} onChange={(e) => updateField("siteDescription", e.target.value)} className={inputClass} placeholder="窥见世界裂隙" />
          </div>
          <div>
            <label className={labelClass}>Logo 文字</label>
            <input type="text" value={settings.logoText} onChange={(e) => updateField("logoText", e.target.value)} className={inputClass} placeholder="隙" maxLength={4} />
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">首页文案</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Hero 大标题</label>
            <input type="text" value={settings.heroTitle} onChange={(e) => updateField("heroTitle", e.target.value)} className={inputClass} placeholder="薄云隙" />
          </div>
          <div>
            <label className={labelClass}>Hero 副标题</label>
            <input type="text" value={settings.heroSubtitle} onChange={(e) => updateField("heroSubtitle", e.target.value)} className={inputClass} placeholder="窥见世界裂隙 · 数字古风档案馆" />
          </div>
          <div>
            <label className={labelClass}>文章列表区标签</label>
            <input type="text" value={settings.archiveLabel} onChange={(e) => updateField("archiveLabel", e.target.value)} className={inputClass} placeholder="云 海 档 案 馆" />
          </div>
          <div>
            <label className={labelClass}>空状态提示文字</label>
            <input type="text" value={settings.emptyStateText} onChange={(e) => updateField("emptyStateText", e.target.value)} className={inputClass} placeholder="档案馆中尚无卷宗" />
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">作者信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>作者名称</label>
            <input type="text" value={settings.authorName} onChange={(e) => updateField("authorName", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>联系邮箱</label>
            <input type="email" value={settings.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>GitHub 地址</label>
            <input type="url" value={settings.githubUrl} onChange={(e) => updateField("githubUrl", e.target.value)} className={inputClass} placeholder="https://github.com/username" />
          </div>
        </div>
        <div>
          <label className={labelClass}>作者简介</label>
          <textarea value={settings.authorBio} onChange={(e) => updateField("authorBio", e.target.value)} className={inputClass} rows={3} />
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">页脚设置</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>版权文字</label>
            <input type="text" value={settings.copyrightText} onChange={(e) => updateField("copyrightText", e.target.value)} className={inputClass} placeholder="薄云隙 · 数字古风档案馆" />
          </div>
          <div>
            <label className={labelClass}>ICP 备案号</label>
            <input type="text" value={settings.icpNumber} onChange={(e) => updateField("icpNumber", e.target.value)} className={inputClass} placeholder="京ICP备XXXXXXXX号" />
          </div>
          <div>
            <label className={labelClass}>公安备案号</label>
            <input type="text" value={settings.policeNumber} onChange={(e) => updateField("policeNumber", e.target.value)} className={inputClass} placeholder="京公网安备XXXXXXXXXXXX号" />
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">SEO 设置</h2>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>SEO 标题</label>
            <input type="text" value={settings.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} className={inputClass} placeholder="留空则使用站点名称" />
          </div>
          <div>
            <label className={labelClass}>SEO 描述</label>
            <textarea value={settings.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} className={inputClass} rows={2} placeholder="留空则使用站点标语" />
          </div>
          <div>
            <label className={labelClass}>SEO 关键词</label>
            <input type="text" value={settings.seoKeywords} onChange={(e) => updateField("seoKeywords", e.target.value)} className={inputClass} placeholder="多个关键词用逗号分隔" />
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3">关于页内容</h2>
        <p className="text-inkGray/60 text-sm">使用 HTML 格式编写，可参考初始内容的结构</p>
        <textarea value={settings.aboutContent} onChange={(e) => updateField("aboutContent", e.target.value)} className={inputClass + " font-mono text-sm"} rows={20} />
      </AdminCard>

      <AdminCard>
        <h2 className="font-serif text-ink text-lg border-b border-ink/10 pb-3 flex items-center gap-2">
          <span>彩蛋设置</span>
          <span className="text-xs text-inkGray/40 font-sans">Easter Eggs</span>
        </h2>

        <div className="space-y-6">
          <div className="p-4 border border-ink/10 rounded-sm bg-ink/[0.02]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-serif text-ink text-sm">Logo 点击彩蛋</h3>
                <p className="text-inkGray/50 text-xs mt-0.5">连续点击网站 Logo 触发诗词飘落效果</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.easterEggLogoEnabled} onChange={(e) => setSettings((prev) => ({ ...prev, easterEggLogoEnabled: e.target.checked }))} className="sr-only peer" />
                <div className="w-9 h-5 bg-ink/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ochre"></div>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>触发点击次数</label>
                <input type="number" min={2} max={20} value={settings.easterEggLogoClicks} onChange={(e) => setSettings((prev) => ({ ...prev, easterEggLogoClicks: parseInt(e.target.value) || 5 }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>飘落持续(秒)</label>
                <input type="number" min={1} max={10} value={settings.easterEggLogoDuration} onChange={(e) => setSettings((prev) => ({ ...prev, easterEggLogoDuration: parseInt(e.target.value) || 3 }))} className={inputClass} />
              </div>
              <div className="md:col-span-3">
                <label className={labelClass}>飘落文字（逗号分隔）</label>
                <textarea value={settings.easterEggLogoText} onChange={(e) => updateField("easterEggLogoText", e.target.value)} className={inputClass} rows={2} placeholder="云深不知处,只在此山中,欲穷千里目" />
              </div>
            </div>
          </div>

          <div className="p-4 border border-ink/10 rounded-sm bg-ink/[0.02]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-serif text-ink text-sm">控制台彩蛋</h3>
                <p className="text-inkGray/50 text-xs mt-0.5">打开浏览器开发者工具时显示欢迎语</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.easterEggConsoleEnabled} onChange={(e) => setSettings((prev) => ({ ...prev, easterEggConsoleEnabled: e.target.checked }))} className="sr-only peer" />
                <div className="w-9 h-5 bg-ink/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ochre"></div>
              </label>
            </div>
            <div>
              <label className={labelClass}>控制台显示文字</label>
              <input type="text" value={settings.easterEggConsoleText} onChange={(e) => updateField("easterEggConsoleText", e.target.value)} className={inputClass} placeholder="欢迎来到薄云隙 · 窥见世界裂隙" />
            </div>
          </div>

          <div className="p-4 border border-ink/10 rounded-sm bg-ink/[0.02]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-serif text-ink text-sm">Konami Code 彩蛋</h3>
                <p className="text-inkGray/50 text-xs mt-0.5">输入 ↑↑↓↓←→←→BA 触发墨迹涟漪</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.easterEggKonamiEnabled} onChange={(e) => setSettings((prev) => ({ ...prev, easterEggKonamiEnabled: e.target.checked }))} className="sr-only peer" />
                <div className="w-9 h-5 bg-ink/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ochre"></div>
              </label>
            </div>
            <div>
              <label className={labelClass}>触发后显示的箴言</label>
              <input type="text" value={settings.easterEggKonamiText} onChange={(e) => updateField("easterEggKonamiText", e.target.value)} className={inputClass} placeholder="道可道，非常道。名可名，非常名。" />
            </div>
          </div>

          <div className="p-4 border border-ink/10 rounded-sm bg-ink/[0.02]">
            <h3 className="font-serif text-ink text-sm mb-1">搜索彩蛋</h3>
            <p className="text-inkGray/50 text-xs mb-3">在搜索框输入 "hello" 或 "你好" 时触发特殊问候</p>
            <div>
              <label className={labelClass}>问候文字</label>
              <input type="text" value={settings.easterEggSearchHello} onChange={(e) => updateField("easterEggSearchHello", e.target.value)} className={inputClass} placeholder="你好，有缘人！既然寻到了此处，便留下吧。" />
            </div>
          </div>
        </div>
      </AdminCard>

      <div className="flex justify-end pb-8">
        <AdminButton onClick={handleSave} disabled={saving} className={`px-6 py-3 ${saved ? "bg-green-600 text-white hover:bg-green-600" : ""}`}>
          <Save className="w-4 h-4" />
          {saving ? "保存中..." : saved ? "已保存" : "保存设置"}
        </AdminButton>
      </div>
    </div>
  );
}
