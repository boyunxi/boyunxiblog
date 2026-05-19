"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    const lower = value.trim().toLowerCase();
    if (lower === "hello" || lower === "你好") {
      window.dispatchEvent(new CustomEvent("search-easter-egg", { detail: lower }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="寻章摘句..."
        className="w-full bg-transparent border-b border-[rgba(var(--gold-rgb),0.1)] font-serif text-[var(--text)] placeholder:text-[var(--text-ghost)] py-3 pr-10 focus:outline-none transition-colors duration-500 focus:border-[rgba(var(--gold-rgb),0.3)] rounded-none"
      />
      <button
        type="submit"
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[rgba(var(--gold-rgb),0.4)] hover:text-[rgba(var(--gold-rgb),0.7)] transition-colors duration-500"
      >
        <Search size={18} />
      </button>
    </form>
  );
}
