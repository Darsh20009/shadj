import { useState } from "react";
import { useLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";

export default function Login() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingReg, setLoadingReg] = useState(false);
  const [, navigate] = useLocation();
  const login = useLogin();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await login.mutateAsync({ data: { email: phone, password } });
      if (res.token) {
        localStorage.setItem("shadj_token", res.token);
        localStorage.setItem("shadj_user", JSON.stringify(res.user));
        const adminRoles = ["admin", "designer", "writer"];
        navigate(adminRoles.includes(res.user.role) ? "/admin" : "/dashboard");
      }
    } catch {
      setError("رقم الهاتف أو كلمة المرور غير صحيحة");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("كلمتا المرور غير متطابقتين"); return; }
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    if (!name.trim()) { setError("الاسم مطلوب"); return; }
    setLoadingReg(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ في التسجيل");
      if (data.token) {
        localStorage.setItem("shadj_token", data.token);
        localStorage.setItem("shadj_user", JSON.stringify(data.user));
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoadingReg(false);
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden" dir="rtl">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-16"
        style={{background:"linear-gradient(135deg, #0f0e1a 0%, #1e1b4b 50%, #3730A3 100%)"}}>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle, white 1px, transparent 1px)", backgroundSize:"35px 35px"}} />
        <div className="absolute top-1/4 right-10 w-48 h-48 rounded-full border border-[#F5E6C8]/15 animate-pulse" />
        <div className="absolute bottom-1/3 left-10 w-32 h-32 rounded-full bg-[#6366f1]/15 blur-2xl" />
        <div className="relative z-10 text-center">
          <img src="/logo-white.png" alt="شدج" className="h-20 object-contain mx-auto mb-10 drop-shadow-2xl" />
          <h2 className="text-4xl font-black text-white mb-4">وكالة تصميم<br/><span className="text-[#F5E6C8]">بلا حدود</span></h2>
          <p className="text-gray-400 text-lg leading-loose max-w-sm mx-auto">
            انضم لمئات العملاء اللي اختاروا شَـــدِج لتحويل أفكارهم لتحف بصرية.
          </p>
          <div className="flex justify-center gap-8 mt-10">
            {[["46+","مشروع"],["30+","عميل"],["3+","سنة"]].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-black text-[#F5E6C8]">{n}</div>
                <div className="text-gray-500 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16"
        style={{background:"#f9f7f4"}}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/logo-dark.png" alt="شدج" className="h-12 object-contain mx-auto mb-2" />
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/80 p-8 border border-gray-100">
            <h1 className="text-2xl font-black text-[#1a1a2e] mb-2 text-right">
              {tab === "login" ? "أهلاً بعودتك 👋" : "انضم لشَـــدِج 🎨"}
            </h1>
            <p className="text-gray-400 text-sm mb-7 text-right">
              {tab === "login" ? "سجّل دخولك لمتابعة مشاريعك" : "أنشئ حسابك وابدأ رحلتك الإبداعية"}
            </p>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-7">
              <button onClick={() => { setTab("login"); setError(""); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "login" ? "bg-[#3730A3] text-white shadow-lg shadow-[#3730A3]/25" : "text-gray-500 hover:text-gray-700"}`}>
                تسجيل الدخول
              </button>
              <button onClick={() => { setTab("register"); setError(""); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "register" ? "bg-[#3730A3] text-white shadow-lg shadow-[#3730A3]/25" : "text-gray-500 hover:text-gray-700"}`}>
                حساب جديد
              </button>
            </div>

            {/* Login Form */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[#1a1a2e] text-sm font-bold mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+20 11 2908 5243"
                    required
                    autoComplete="tel"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] placeholder:text-gray-400 focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-sm"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[#1a1a2e] text-sm font-bold mb-2">كلمة المرور</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required autoComplete="current-password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] placeholder:text-gray-400 focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-sm" />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                    <span>⚠</span> {error}
                  </div>
                )}
                <button type="submit" disabled={login.isPending}
                  className="w-full bg-[#3730A3] text-white py-4 rounded-2xl font-black text-base hover:bg-[#1e1b4b] transition-colors disabled:opacity-60 shadow-lg shadow-[#3730A3]/25 mt-2">
                  {login.isPending ? "جاري الدخول..." : "دخول ←"}
                </button>
              </form>
            )}

            {/* Register Form */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-[#1a1a2e] text-sm font-bold mb-2">الاسم الكامل</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="اسمك هنا" required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] placeholder:text-gray-400 focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-sm text-right" />
                </div>
                <div>
                  <label className="block text-[#1a1a2e] text-sm font-bold mb-2">البريد الإلكتروني</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="example@email.com" required autoComplete="email"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] placeholder:text-gray-400 focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-sm"
                    dir="ltr" />
                </div>
                <div>
                  <label className="block text-[#1a1a2e] text-sm font-bold mb-2">كلمة المرور</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="6 أحرف على الأقل" required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] placeholder:text-gray-400 focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[#1a1a2e] text-sm font-bold mb-2">تأكيد كلمة المرور</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] placeholder:text-gray-400 focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-sm" />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                    <span>⚠</span> {error}
                  </div>
                )}
                <button type="submit" disabled={loadingReg}
                  className="w-full bg-[#3730A3] text-white py-4 rounded-2xl font-black text-base hover:bg-[#1e1b4b] transition-colors disabled:opacity-60 shadow-lg shadow-[#3730A3]/25">
                  {loadingReg ? "جاري التسجيل..." : "إنشاء حساب ←"}
                </button>
              </form>
            )}

            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs">أو</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <a href="https://wa.me/201129085243?text=مرحباً،أريد الاستفسار عن تصميم من شدج"
              target="_blank" rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 py-3 rounded-2xl font-bold text-sm hover:bg-green-100 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              تواصل مباشرة على الواتساب
            </a>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">shadj-graphics.space</p>
        </div>
      </div>
    </div>
  );
}
