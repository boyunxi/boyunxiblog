"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { transformPost } from "@/lib/types";
import SearchBar from "@/components/ui/SearchBar";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import PostCard from "@/components/frontend/PostCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults((data.data || []).map(transformPost));
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { search(query); }, [query, search]);

  return (
    <PageShell>
      <PageHeader title="寻章摘句" subtitle="于卷宗中寻觅" />

      <div className="max-w-md mx-auto mb-16">
        <SearchBar />
      </div>

      {query && (
        <div className="rift-horizontal mb-12" />
      )}

      {query && (
        <p className="text-[var(--text-ghost)] text-xs text-center mb-12 font-serif tracking-wider">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full animate-gold-breathe" style={{backgroundColor: "rgba(var(--gold-rgb),0.4)"}} />
              搜索中...
            </span>
          ) : (
            <>于档案馆中寻得 <span style={{color: "rgba(var(--gold-rgb),0.6)"}}>{results.length}</span> 卷宗</>
          )}
        </p>
      )}

      {!query && (
        <EmptyState text="输入关键词，开始寻觅" />
      )}

      <div className="space-y-4">
        {results.map((post: any) => (
          <PostCard key={post.id} post={post} variant="compact" />
        ))}
      </div>
    </PageShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center text-[var(--text-ghost)] py-24 font-serif text-xs tracking-wider">加载中...</div>}>
      <SearchContent />
    </Suspense>
  );
}
