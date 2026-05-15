"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full group">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="寻章摘句..."
        className="w-full bg-transparent border-b-2 border-ink/10 font-serif text-ink placeholder:text-ink-faint/30 py-3 pr-10 focus:outline-none transition-colors duration-500 focus:border-gold"
      />
      <span
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold transition-all duration-500 ${focused ? "w-full" : "w-0"}`}
      />
      <button
        type="submit"
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-ink-faint/30 hover:text-gold transition-colors"
      >
        <Search size={18} />
      </button>
    </form>
  );
}
