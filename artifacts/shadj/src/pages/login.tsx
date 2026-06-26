import { useState, useRef, useEffect } from "react";
import { useLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";

type Step = "form" | "otp";

export default function Login() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [step, setStep] = useState<Step>("form");

  // Login fields
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(600); // 10 min
  const [, navigate] = useLocation();
  const login = useLogin();

  // OTP countdown
  useEffect(() => {
    if (step !== "otp") return;
    setOtpTimer(600);
    const iv = setInterval(() => setOtpTimer(t => {
      if (t <= 1) { clearInterval(iv); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(iv);
  }, [step]);

  function formatTimer(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  // ── Login ─────────────────────────────────────────────────
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

  // ── Register Step 1: send OTP ──────────────────────────────
  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (regPassword !== confirmPassword) { setError("كلمتا المرور غير متطابقتين"); return; }
    if (regPassword.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    if (!name.trim()) { setError("الاسم مطلوب"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.toLowerCase().trim(), password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ في الإرسال");
      setStep("otp");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  // ── OTP input handling ─────────────────────────────────────
  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      e.preventDefault();
    }
  }

  // ── Register Step 2: verify OTP ────────────────────────────
  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) { setError("أدخل الرمز المكون من 6 أرقام"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "رمز خاطئ");
      if (data.token) {
        localStorage.setItem("shadj_token", data.token);
        localStorage.setItem("shadj_user", JSON.stringify(data.user));
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] placeholder:text-gray-400 focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-sm";

  return (
    <div className="min-h-screen flex relative overflow-hidden" dir="rtl">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-16"
        style={{ background: "linear-gradient(135deg, #0f0e1a 0%, #1e1b4b 50%, #3730A3 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "35px 35px" }} />
        <div className="absolute top-1/4 right-10 w-48 h-48 rounded-full border border-[#F5E6C8]/15 animate-pulse" />
        <div className="absolute bottom-1/3 left-10 w-32 h-32 rounded-full bg-[#6366f1]/15 blur-2xl" />
        <div className="relative z-10 text-center">
          <img src="/logo-white.png" alt="شدج" className="h-20 object-contain mx-auto mb-10 drop-shadow-2xl" />
          <h2 className="text-4xl font-black text-white mb-4">وكالة تصميم<br /><span className="text-[#F5E6C8]">بلا حدود</span></h2>
          <p className="text-gray-400 text-lg leading-loose max-w-sm mx-auto">
            انضم لمئات العملاء اللي اختاروا شَـــدِج لتحويل أفكارهم لتحف بصرية.
          </p>
          <div className="flex justify-center gap-8 mt-10">
            {[["46+", "مشروع"], ["30+", "عميل"], ["3+", "سنة"]].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-black text-[#F5E6C8]">{n}</div>
                <div className="text-gray-500 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16"
        style={{ background: "#f9f7f4" }}>
        <div className="w-full max-w-md">

          <div className="lg:hidden text-center mb-8">
            <img src="/logo-dark.png" alt="شدج" className="h-12 object-contain mx-auto mb-2" />
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/80 p-8 border border-gray-100">

            {/* ── OTP Verification Screen ── */}
            {tab === "register" && step === "otp" ? (
              <div>
                <button onClick={() => { setStep("form"); setError(""); }}
                  className="text-gray-400 hover:text-gray-600 text-sm mb-6 flex items-center gap-1 transition-colors">
                  → العودة
                </button>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#3730A3]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📧</span>
                  </div>
                  <h1 className="text-2xl font-black text-[#1a1a2e] mb-2">تحقق من بريدك</h1>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    أرسلنا رمز التحقق إلى<br />
                    <span className="font-bold text-[#3730A3]" dir="ltr">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP}>
                  {/* OTP boxes */}
                  <div className="flex gap-3 justify-center mb-2" dir="ltr" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-black border-2 rounded-xl focus:outline-none focus:border-[#3730A3] transition-colors bg-gray-50"
                        style={{ borderColor: digit ? "#3730A3" : "#e5e7eb" }}
                      />
                    ))}
                  </div>

                  <p className="text-center text-sm text-gray-400 mb-6">
                    {otpTimer > 0
                      ? <span>ينتهي خلال <span className="font-bold text-[#3730A3]">{formatTimer(otpTimer)}</span></span>
                      : <span className="text-red-500">انتهت صلاحية الرمز</span>}
                  </p>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm flex items-center gap-2 mb-4">
                      <span>⚠</span> {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading || otp.join("").length !== 6 || otpTimer === 0}
                    className="w-full bg-[#3730A3] text-white py-4 rounded-2xl font-black text-base hover:bg-[#1e1b4b] transition-colors disabled:opacity-50 shadow-lg shadow-[#3730A3]/25">
                    {loading ? "جاري التحقق..." : "تفعيل الحساب ←"}
                  </button>

                  {otpTimer === 0 && (
                    <button type="button" onClick={() => { setStep("form"); setError(""); }}
                      className="w-full mt-3 py-3 text-[#3730A3] font-bold text-sm hover:underline">
                      إعادة الإرسال
                    </button>
                  )}
                </form>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-black text-[#1a1a2e] mb-2 text-right">
                  {tab === "login" ? "أهلاً بعودتك 👋" : "انضم لشَـــدِج 🎨"}
                </h1>
                <p className="text-gray-400 text-sm mb-7 text-right">
                  {tab === "login" ? "سجّل دخولك لمتابعة مشاريعك" : "أنشئ حسابك وابدأ رحلتك الإبداعية"}
                </p>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-7">
                  <button onClick={() => { setTab("login"); setError(""); setStep("form"); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "login" ? "bg-[#3730A3] text-white shadow-lg shadow-[#3730A3]/25" : "text-gray-500 hover:text-gray-700"}`}>
                    تسجيل الدخول
                  </button>
                  <button onClick={() => { setTab("register"); setError(""); setStep("form"); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "register" ? "bg-[#3730A3] text-white shadow-lg shadow-[#3730A3]/25" : "text-gray-500 hover:text-gray-700"}`}>
                    حساب جديد
                  </button>
                </div>

                {/* Login form */}
                {tab === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-[#1a1a2e] text-sm font-bold mb-2">رقم الهاتف</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+20 11 2908 5243" required autoComplete="tel"
                        className={inputClass} dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-[#1a1a2e] text-sm font-bold mb-2">كلمة المرور</label>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" required autoComplete="current-password"
                        className={inputClass} />
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

                {/* Register form */}
                {tab === "register" && (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                      <label className="block text-[#1a1a2e] text-sm font-bold mb-2">الاسم الكامل</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="اسمك هنا" required
                        className={inputClass + " text-right"} />
                    </div>
                    <div>
                      <label className="block text-[#1a1a2e] text-sm font-bold mb-2">البريد الإلكتروني</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="example@email.com" required autoComplete="email"
                        className={inputClass} dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-[#1a1a2e] text-sm font-bold mb-2">كلمة المرور</label>
                      <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                        placeholder="6 أحرف على الأقل" required
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[#1a1a2e] text-sm font-bold mb-2">تأكيد كلمة المرور</label>
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••" required
                        className={inputClass} />
                    </div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                        <span>⚠</span> {error}
                      </div>
                    )}
                    <button type="submit" disabled={loading}
                      className="w-full bg-[#3730A3] text-white py-4 rounded-2xl font-black text-base hover:bg-[#1e1b4b] transition-colors disabled:opacity-60 shadow-lg shadow-[#3730A3]/25">
                      {loading ? "جاري الإرسال..." : "إرسال رمز التحقق 📧"}
                    </button>
                  </form>
                )}

                <div className="flex items-center gap-3 mt-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-gray-400 text-xs">أو</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <a href="/order"
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-[#3730A3]/5 border border-[#3730A3]/20 text-[#3730A3] py-3 rounded-2xl font-bold text-sm hover:bg-[#3730A3]/10 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  ابدأ مشروعك الآن
                </a>
              </>
            )}
          </div>
          <p className="text-center text-gray-400 text-xs mt-6">shadj-graphics.space</p>
        </div>
      </div>
    </div>
  );
}
