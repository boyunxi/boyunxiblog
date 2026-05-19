"use client";

import { useEffect, useState } from "react";
import { FileText, FolderOpen, Tag, Eye } from "lucide-react";
import ScrollCard from "@/components/ui/ScrollCard";
import AdminPageHeader from "@/components/ui/AdminPageHeader";

interface Stats {
  totalPosts: number;
  totalCategories: number;
  totalTags: number;
  totalViews: number;
  postsByMonth: { month: string; count: number }[];
  viewsByMonth: { month: string; views: number }[];
  categoryDistribution: { name: string; count: number }[];
  topPosts: { id: number; title: string; views: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalViews: 0,
    postsByMonth: [],
    viewsByMonth: [],
    categoryDistribution: [],
    topPosts: [],
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((res) => {
        if (res.data) setStats(res.data);
      });
  }, []);

  const statCards = [
    { icon: FileText, label: "文章总数", value: stats.totalPosts, color: "text-ink" },
    { icon: FolderOpen, label: "分类数", value: stats.totalCategories, color: "text-ochre" },
    { icon: Tag, label: "标签数", value: stats.totalTags, color: "text-gold" },
    { icon: Eye, label: "总浏览量", value: stats.totalViews, color: "text-ink" },
  ];

  const maxPostsByMonth = Math.max(...stats.postsByMonth.map((d) => d.count), 1);
  const maxViewsByMonth = Math.max(...stats.viewsByMonth.map((d) => d.views), 1);
  const maxCategoryDistribution = Math.max(...stats.categoryDistribution.map((d) => d.count), 1);

  return (
    <div className="space-y-8">
      <AdminPageHeader title="数据看板" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <ScrollCard key={card.label}>
            <div className="flex items-center gap-4">
              <card.icon className={`w-10 h-10 ${card.color}/60`} />
              <div>
                <p className="text-4xl font-serif text-ink">{card.value}</p>
                <p className="text-sm text-inkGray">{card.label}</p>
              </div>
            </div>
          </ScrollCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="scroll-card p-6">
          <h2 className="text-lg font-serif text-ink mb-6">文章发布趋势</h2>
          <div className="flex items-end gap-3 h-48">
            {stats.postsByMonth.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-inkGray/70">{d.count}</span>
                <div
                  className="w-full bg-ink/70 rounded-t-sm min-h-[4px] transition-all"
                  style={{ height: `${(d.count / maxPostsByMonth) * 140}px` }}
                />
                <span className="text-xs text-inkGray/50 mt-1">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-card p-6">
          <h2 className="text-lg font-serif text-ink mb-6">浏览量趋势</h2>
          <svg viewBox="0 0 300 160" className="w-full h-48">
            {stats.viewsByMonth.length > 1 && (
              <>
                <polyline
                  fill="none"
                  stroke="#2D5A4A"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  points={stats.viewsByMonth
                    .map((d, i) => {
                      const x = (i / (stats.viewsByMonth.length - 1)) * 270 + 15;
                      const y = 140 - (d.views / maxViewsByMonth) * 120;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
                {stats.viewsByMonth.map((d, i) => {
                  const x = (i / (stats.viewsByMonth.length - 1)) * 270 + 15;
                  const y = 140 - (d.views / maxViewsByMonth) * 120;
                  return (
                    <g key={d.month}>
                      <circle cx={x} cy={y} r="3" fill="#D4AF37" />
                      <text x={x} y={155} textAnchor="middle" className="text-[8px]" fill="#4A4A4A">
                        {d.month}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="scroll-card p-6">
          <h2 className="text-lg font-serif text-ink mb-6">分类分布</h2>
          <div className="space-y-3">
            {stats.categoryDistribution.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="text-sm text-inkGray w-20 shrink-0 truncate">{d.name}</span>
                <div className="flex-1 h-6 bg-ink/5 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-ink/60 to-ochre/60 rounded-sm transition-all"
                    style={{ width: `${(d.count / maxCategoryDistribution) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-inkGray/70 w-8 text-right">{d.count}</span>
              </div>
            ))}
            {stats.categoryDistribution.length === 0 && (
              <p className="text-inkGray/50 text-sm text-center py-4">暂无数据</p>
            )}
          </div>
        </div>

        <div className="scroll-card p-6">
          <h2 className="text-lg font-serif text-ink mb-6">热门文章排行</h2>
          <div className="space-y-3">
            {stats.topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-sm text-sm font-serif ${
                    index === 0
                      ? "bg-gold text-ricepaper"
                      : index === 1
                      ? "bg-ochre/80 text-ricepaper"
                      : index === 2
                      ? "bg-ink/60 text-ricepaper"
                      : "bg-ink/10 text-inkGray"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="flex-1 text-sm text-inkGray truncate">{post.title}</span>
                <span className="text-sm text-inkGray/70">{post.views}</span>
              </div>
            ))}
            {stats.topPosts.length === 0 && (
              <p className="text-inkGray/50 text-sm text-center py-4">暂无数据</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
