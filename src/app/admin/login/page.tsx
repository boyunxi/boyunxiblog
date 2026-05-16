"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("邮箱或密码错误");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{backgroundColor: "#FAF8F3"}}>
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full -translate-x-1/2 -translate-y-1/2" style={{backgroundColor: "rgba(26,26,26,0.03)"}} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full translate-x-1/3 translate-y-1/3" style={{backgroundColor: "rgba(26,26,26,0.03)"}} />
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full" style={{backgroundColor: "rgba(184,150,15,0.05)"}} />
      <div className="absolute bottom-1/4 left-10 w-48 h-48 rounded-full" style={{backgroundColor: "rgba(184,150,15,0.05)"}} />

      <div className="shadow-xl rounded-sm w-full max-w-md mx-4 relative z-10" style={{backgroundColor: "#FAF8F3", border: "1px solid rgba(184,150,15,0.1)", boxShadow: "0 0 40px rgba(184,150,15,0.03)"}}>
        <div className="h-1" style={{background: "linear-gradient(to right, transparent, #B8960F, transparent)"}} />

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl tracking-wider" style={{color: "#1a1a1a"}}>
              墨韵随笔
            </h1>
            <div className="w-16 h-0.5 mx-auto my-3" style={{backgroundColor: "#B8960F"}} />
            <p className="text-sm" style={{color: "rgba(26,26,26,0.5)"}}>管理后台登录</p>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm rounded-sm text-center" style={{backgroundColor: "rgba(180,120,30,0.1)", border: "1px solid rgba(180,120,30,0.3)", color: "#a0752a"}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{color: "rgba(26,26,26,0.35)"}}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱"
                required
                className="w-full pl-10 pr-4 py-3 rounded-sm text-sm transition-colors focus:outline-none"
                style={{backgroundColor: "#fff", border: "1px solid rgba(26,26,26,0.15)", color: "#1a1a1a"}}
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{color: "rgba(26,26,26,0.35)"}}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                required
                className="w-full pl-10 pr-4 py-3 rounded-sm text-sm transition-colors focus:outline-none"
                style={{backgroundColor: "#fff", border: "1px solid rgba(26,26,26,0.15)", color: "#1a1a1a"}}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{backgroundColor: "#1a1a1a", color: "#FAF8F3", border: "1px solid rgba(184,150,15,0.3)"}}
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>
        </div>

        <div className="h-1" style={{background: "linear-gradient(to right, transparent, #B8960F, transparent)"}} />
      </div>
    </div>
  );
}
