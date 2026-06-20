import { useState } from "react";
import { useLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, navigate] = useLocation();
  const login = useLogin();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await login.mutateAsync({ data: { email, password } });
      if (res.token) {
        localStorage.setItem("shadj_token", res.token);
        localStorage.setItem("shadj_user", JSON.stringify(res.user));
        navigate("/admin");
      }
    } catch {
      setError("البريد أو كلمة المرور غلط — حاول تاني");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background:"radial-gradient(ellipse at 40% 60%, #1e1b4b 0%, #0f0e1a 70%)"}}>
      {/* BG Grid */}
      <div className="absolute inset-0 opacity-5" style={{backgroundImage:"radial-gradient(circle, white 1px, transparent 1px)", backgroundSize:"40px 40px"}} />

      {/* Decorative circles */}
      <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full border border-[#3730A3]/30 animate-pulse" />
      <div className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-[#3730A3]/10 blur-2xl" />

      <div className="relative z-10 w-full max-w-md mx-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <img src="/logo-white.png" alt="شدج" className="h-16 object-contain mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white">دخول الإدارة</h1>
            <p className="text-gray-400 text-sm mt-1">للمدراء والمصممين فقط</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2 text-right">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@shadj-graphics.space"
                required
                autoComplete="email"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F5E6C8] transition-colors"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 text-right">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F5E6C8] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm text-right">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-[#F5E6C8] text-[#1a1a2e] py-4 rounded-xl font-black text-lg hover:bg-white transition-colors disabled:opacity-60 mt-2"
            >
              {login.isPending ? "جاري الدخول..." : "دخول"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-xs">أو</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[{label:"Apple",icon:"🍎"},{label:"Google",icon:"G"}].map(s => (
              <button key={s.label} type="button" className="flex items-center justify-center gap-2 bg-white/5 border border-white/15 rounded-xl py-3 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                <span>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-xs text-center mt-6">
            shadj-graphics.space — لوحة تحكم شدج للجرافيك
          </p>
        </div>
      </div>
    </div>
  );
}
