"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { transformPost } from "@/lib/types";
import SearchBar from "@/components/ui/SearchBar";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <div className="relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[40%] w-[350px] h-[200px] rounded-full bg-gold/[0.015] blur-[80px] animate-fog-drift" />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16 relative z-10">
        <header className="text-center mb-16">
          <div className="rift-line animate-rift-glow mb-10" />
          <h1 className="font-serif text-2xl text-pale tracking-[0.2em] gold-text-glow">寻章摘句</h1>
          <p className="text-pale-ghost text-xs tracking-[0.3em] font-serif mt-3">于卷宗中寻觅</p>
          <div className="rift-line animate-rift-glow mt-10" style={{ animationDelay: "-2s" }} />
        </header>

        <div className="max-w-md mx-auto mb-16">
          <SearchBar />
        </div>

        {query && (
          <div className="rift-horizontal mb-12" />
        )}

        {query && (
          <p className="text-pale-ghost text-xs text-center mb-12 font-serif tracking-wider">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold/40 animate-gold-breathe" />
                搜索中...
              </span>
            ) : (
              <>于档案馆中寻得 <span className="text-gold/60">{results.length}</span> 卷宗</>
            )}
          </p>
        )}

        {!query && (
          <div className="text-center py-20">
            <div className="rift-line mx-auto animate-gold-breathe mb-8" />
            <p className="text-pale-ghost text-xs font-serif tracking-[0.3em]">输入关键词，开始寻觅</p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((post: any, index: number) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="scroll-vessel incomplete-border block p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-pale-soft text-sm tracking-wider mb-1 hover:text-gold/70 transition-colors duration-500 line-clamp-1">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-pale-ghost text-xs line-clamp-1">{post.excerpt}</p>
                  )}
                </div>
                <ArrowRight size={12} className="text-pale-ghost shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center text-pale-ghost py-24 font-serif text-xs tracking-wider">加载中...</div>}>
      <SearchContent />
    </Suspense>
  );
}
