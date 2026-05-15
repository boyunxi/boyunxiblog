"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { transformPost } from "@/lib/types";
import SearchBar from "@/components/ui/SearchBar";
import PostList from "@/components/frontend/PostList";
import CloudDivider from "@/components/ui/InkDivider";
import { Search } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults((data.data || []).map(transformPost));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  return (
    <div className="max-w-3xl mx-auto">
      <header className="text-center mb-14">
        <div
          className="flex items-center justify-center gap-4 mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <Search size={16} className="text-gold/40" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>

        <h1 className="font-display text-4xl text-ink tracking-wider mb-8 opacity-0 animate-fade-up">
          寻章摘句
        </h1>

        <div className="max-w-lg mx-auto">
          <SearchBar />
        </div>
      </header>

      {query && (
        <>
          <CloudDivider />
          <p className="text-ink-muted text-sm text-center my-8 font-serif tracking-wider">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-gold-breathe" />
                搜索中...
              </span>
            ) : (
              <>找到 <span className="text-ink font-serif">{results.length}</span> 篇与「<span className="text-gold">{query}</span>」相关的文章</>
            )}
          </p>
        </>
      )}

      {!query && (
        <div className="text-center py-16 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="relative inline-block mb-6">
            <span className="font-display text-8xl text-ink/5">云</span>
            <span className="absolute inset-0 flex items-center justify-center font-display text-8xl text-ink/10 animate-gold-breathe">云</span>
          </div>
          <p className="font-serif text-ink-muted text-sm tracking-wider">输入关键词，开始探索</p>
        </div>
      )}

      {results.length > 0 && <PostList posts={results} />}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center text-ink-muted py-24 font-serif">加载中...</div>}>
      <SearchContent />
    </Suspense>
  );
}
