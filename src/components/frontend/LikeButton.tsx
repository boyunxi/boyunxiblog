"use client";

import { Heart } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

export default function LikeButton({ postId }: { postId: number }) {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    fetch(`/api/posts/${postId}/like`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && mounted.current) {
          setLikesCount(data.data.likesCount);
          setLiked(data.data.liked);
        }
      });
    return () => { mounted.current = false; };
  }, [postId]);

  const toggleLike = useCallback(async () => {
    setAnimating(true);
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    const data = await res.json();
    if (data.success && mounted.current) {
      setLiked(data.data.liked);
      setLikesCount(data.data.likesCount);
    }
    setTimeout(() => { if (mounted.current) setAnimating(false); }, 300);
  }, [postId]);

  return (
    <button
      onClick={toggleLike}
      className={`inline-flex items-center gap-1.5 text-xs transition-all duration-300 ${
        liked
          ? "text-[rgba(var(--gold-rgb),0.7)]"
          : "text-[var(--text-ghost)] hover:text-[rgba(var(--gold-rgb),0.5)]"
      }`}
    >
      <Heart
        size={14}
        className={`transition-all duration-300 ${liked ? "fill-current" : ""} ${animating ? "scale-125" : ""}`}
      />
      <span className="font-serif tracking-wide">
        {likesCount > 0 ? likesCount : "赞"}
      </span>
    </button>
  );
}
