"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, Timer } from "lucide-react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}分${s}秒`;
  return `${s}秒`;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutEnd, setLockoutEnd] = useState<number>(0);
  const [countdown, setCountdown] = useState(0);

  const checkLockout = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/lockout-status");
      const data = await res.json();
      if (data.locked && data.remainingMs > 0) {
        setLockoutEnd(Date.now() + data.remainingMs);
        return true;
      }
    } catch {}
    setLockoutEnd(0);
    return false;
  }, []);

  useEffect(() => {
    checkLockout();
  }, [checkLockout]);

  useEffect(() => {
    if (!lockoutEnd) {
      setCountdown(0);
      return;
    }
    const update = () => {
      const remaining = Math.max(0, Math.ceil((lockoutEnd - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) setLockoutEnd(0);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [lockoutEnd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (countdown > 0) return;
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      const isLocked = await checkLockout();
      if (!isLocked) {
        setError("用户名或密码错误");
      }
    } else {
      router.push("/admin");
    }
  };

  const isLocked = countdown > 0;

  return (
    <div className="min-h-screen bg-ricepaper flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-ink/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-ink/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-gold/5 rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-ochre/5 rounded-full" />

      <div className="scroll-card bg-ricepaper shadow-xl rounded-sm w-full max-w-md mx-4 relative z-10">
        <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-ink tracking-wider">
              墨韵随笔
            </h1>
            <div className="w-16 h-0.5 bg-gold mx-auto my-3" />
            <p className="text-inkGray text-sm">管理后台登录</p>
          </div>

          {isLocked && (
            <div className="mb-4 p-3 bg-ink/10 border border-ink/30 text-ink text-sm rounded-sm text-center flex items-center justify-center gap-2">
              <Timer size={16} />
              <span>登录尝试过多，请 {formatTime(countdown)} 后重试</span>
            </div>
          )}

          {!isLocked && error && (
            <div className="mb-4 p-3 bg-ochre/10 border border-ochre/30 text-ochre text-sm rounded-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-inkGray/50"
              />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="用户名"
                required
                disabled={isLocked}
                className="w-full pl-10 pr-4 py-3 bg-cloudWhite border border-ink/20 rounded-sm text-ink text-sm placeholder:text-inkGray/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-inkGray/50"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                required
                disabled={isLocked}
                className="w-full pl-10 pr-4 py-3 bg-cloudWhite border border-ink/20 rounded-sm text-ink text-sm placeholder:text-inkGray/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full py-3 bg-ink text-ricepaper text-sm rounded-sm border border-gold/50 hover:bg-ochre transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "登录中..." : isLocked ? `请等待 ${formatTime(countdown)}` : "登录"}
            </button>
          </form>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>
    </div>
  );
}
