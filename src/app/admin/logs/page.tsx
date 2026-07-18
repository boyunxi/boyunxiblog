"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Trash2, RefreshCw, Filter } from "lucide-react";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import AdminButton from "@/components/ui/AdminButton";
import AdminTable, { AdminTableHeader, AdminTableHeaderCell, AdminTableRow, AdminTableCell } from "@/components/ui/AdminTable";
import AdminBadge from "@/components/ui/AdminBadge";
import AdminConfirmDialog from "@/components/ui/AdminConfirmDialog";

interface LogEntry {
  id: number;
  level: string;
  category: string;
  action: string;
  message: string;
  meta: string | null;
  ip: string | null;
  geo: string | null;
  userId: number | null;
  createdAt: string;
}

interface LogStats {
  level: string;
  count: number;
}

interface CategoryStats {
  category: string;
  count: number;
}

const levelColors: Record<string, "default" | "warning"> = {
  debug: "default",
  info: "default",
  warn: "warning",
  error: "warning",
};

const levelLabels: Record<string, string> = {
  debug: "调试",
  info: "信息",
  warn: "警告",
  error: "错误",
};

const categoryLabels: Record<string, string> = {
  api: "接口",
  auth: "认证",
  post: "文章",
  category: "分类",
  tag: "标签",
  setting: "设置",
  view: "访问",
  system: "系统",
};

function formatGeo(geo: string | null): string {
  if (!geo) return "—";
  try {
    const g = JSON.parse(geo);
    const parts = [g.country, g.region, g.city].filter((p) => p && p !== "未知");
    return parts.length > 0 ? parts.join(" ") : "—";
  } catch {
    return "—";
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<LogStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [showClean, setShowClean] = useState(false);
  const [cleanDays, setCleanDays] = useState(30);
  const pageSize = 50;

  const fetchLogs = useCallback(() => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (level) params.set("level", level);
    if (category) params.set("category", category);
    if (search) params.set("search", search);

    fetch(`/api/logs?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data.logs);
          setTotal(data.data.total);
          setTotalPages(Math.ceil(data.data.total / pageSize) || 1);
          setStats(data.data.stats);
          setCategoryStats(data.data.categoryStats);
        }
      });
  }, [page, level, category, search]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleClean = async () => {
    await fetch(`/api/logs?days=${cleanDays}`, { method: "DELETE" });
    setShowClean(false);
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="系统日志"
        action={
          <div className="flex gap-3">
            <AdminButton variant="secondary" onClick={fetchLogs}>
              <RefreshCw className="w-4 h-4" />
              刷新
            </AdminButton>
            <AdminButton variant="danger" onClick={() => setShowClean(true)}>
              <Trash2 className="w-4 h-4" />
              清理
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.level} className="scroll-card p-4 text-center">
            <p className="text-2xl font-serif text-ink">{s.count}</p>
            <p className="text-xs text-inkGray">{levelLabels[s.level] || s.level}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inkGray/50" />
          <input
            type="text"
            placeholder="搜索日志内容..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray focus:outline-none focus:border-ink/50"
          />
        </div>
        <select
          value={level}
          onChange={(e) => { setLevel(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray text-sm focus:outline-none focus:border-ink/50"
        >
          <option value="">全部级别</option>
          <option value="info">信息</option>
          <option value="warn">警告</option>
          <option value="error">错误</option>
          <option value="debug">调试</option>
        </select>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-ink/20 rounded-sm bg-ricepaper text-inkGray text-sm focus:outline-none focus:border-ink/50"
        >
          <option value="">全部分类</option>
          {categoryStats.map((cs) => (
            <option key={cs.category} value={cs.category}>
              {categoryLabels[cs.category] || cs.category}
            </option>
          ))}
        </select>
      </div>

      <div className="text-xs text-inkGray/60">
        共 {total} 条日志
      </div>

      <AdminTable>
        <AdminTableHeader>
          <AdminTableHeaderCell>级别</AdminTableHeaderCell>
          <AdminTableHeaderCell>分类</AdminTableHeaderCell>
          <AdminTableHeaderCell>操作</AdminTableHeaderCell>
          <AdminTableHeaderCell>信息</AdminTableHeaderCell>
          <AdminTableHeaderCell>IP</AdminTableHeaderCell>
          <AdminTableHeaderCell>位置</AdminTableHeaderCell>
          <AdminTableHeaderCell>时间</AdminTableHeaderCell>
        </AdminTableHeader>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-inkGray/60">暂无日志</td>
            </tr>
          ) : (
            logs.map((log) => (
              <AdminTableRow key={log.id}>
                <AdminTableCell>
                  <AdminBadge variant={levelColors[log.level] || "default"}>
                    {levelLabels[log.level] || log.level}
                  </AdminBadge>
                </AdminTableCell>
                <AdminTableCell className="text-xs">
                  {categoryLabels[log.category] || log.category}
                </AdminTableCell>
                <AdminTableCell className="text-xs font-mono">
                  {log.action}
                </AdminTableCell>
                <AdminTableCell className="text-xs max-w-[300px] truncate">
                  {log.message}
                </AdminTableCell>
                <AdminTableCell className="text-xs text-inkGray/50">
                  {log.ip || "—"}
                </AdminTableCell>
                <AdminTableCell className="text-xs text-inkGray/50">
                  {formatGeo(log.geo)}
                </AdminTableCell>
                <AdminTableCell className="text-xs text-inkGray/50 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString("zh-CN")}
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </tbody>
      </AdminTable>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
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

      <AdminConfirmDialog
        open={showClean}
        title="清理日志"
        message={`确定要清理 ${cleanDays} 天前的日志吗？此操作不可撤销。`}
        onConfirm={handleClean}
        onCancel={() => setShowClean(false)}
      />
    </div>
  );
}
