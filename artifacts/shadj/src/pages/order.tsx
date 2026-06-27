import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useCreateOrder } from "@workspace/api-client-react";
import { useSEO } from "@/hooks/useSEO";
import { Link, useLocation } from "wouter";

const DESIGN_TYPES = [
  { id: "هوية بصرية",    label: "هوية بصرية",    icon: "◆", desc: "لوجو + ألوان + فونت + دليل هوية" },
  { id: "بوسترات",       label: "بوسترات",        icon: "▲", desc: "تصاميم للطباعة أو السوشيال" },
  { id: "سوشيال ميديا", label: "سوشيال ميديا",  icon: "●", desc: "باقة محتوى للمنصات" },
  { id: "حملات إعلانية",label: "حملات إعلانية",  icon: "★", desc: "حملة كاملة متناسقة" },
  { id: "مطبوعات",      label: "مطبوعات",         icon: "■", desc: "منيو، كروت، بروشور" },
  { id: "تغليف",        label: "تغليف",           icon: "⬡", desc: "Packaging وعبوات المنتجات" },
];

const BUDGETS = [
  "أقل من 500 جنيه",
  "500 – 1000 جنيه",
  "1000 – 2000 جنيه",
  "أكثر من 2000 جنيه",
  "نريد عرض سعر أولاً",
];

type FormData = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  description: string;
  references: string;
  budget: string;
  deadline: string;
  notes: string;
  password: string;
  confirmPassword: string;
};

export default function Order() {
  useSEO({
    title: "ابدأ مشروعك — اطلب تصميمك من شدج",
    description: "عايز تصميم احترافي؟ ابعتلنا تفاصيل مشروعك وهنرد عليك في أسرع وقت.",
    keywords: "طلب تصميم, تصميم هوية بصرية, بوستر إعلاني, سوشيال ميديا",
    canonical: "/order",
  });

  const [step, setStep]                   = useState(1);
  const [selectedType, setSelectedType]   = useState("");
  const [done, setDone]                   = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [files, setFiles]                 = useState<File[]>([]);
  const [stepError, setStepError]         = useState("");
  const [submitError, setSubmitError]     = useState("");
  const [registeredOk, setRegisteredOk]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const { register, handleSubmit, getValues, watch } = useForm<FormData>();
  const createOrder = useCreateOrder();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files).slice(0, 5));
  };
  const removeFile = (i: number) => setFiles(f => f.filter((_, idx) => idx !== i));

  function goStep2() {
    setStepError("");
    const v = getValues();
    if (!v.clientName?.trim())  { setStepError("الاسم الكامل مطلوب"); return; }
    if (!v.clientEmail?.trim()) { setStepError("البريد الإلكتروني مطلوب"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.clientEmail)) { setStepError("البريد الإلكتروني غير صحيح"); return; }
    if (!v.password?.trim())                         { setStepError("كلمة السر مطلوبة لإنشاء حسابك"); return; }
    if (v.password.length < 6)                       { setStepError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    if (v.password !== v.confirmPassword)            { setStepError("كلمتا المرور غير متطابقتين"); return; }
    setStep(2);
  }

  function goStep3() {
    setStepError("");
    if (!selectedType)              { setStepError("اختر نوع التصميم أولاً"); return; }
    if (!getValues("description")?.trim()) { setStepError("وصف المشروع مطلوب"); return; }
    setStep(3);
  }

  async function onSubmit(data: FormData) {
    if (!selectedType)             { setStepError("اختر نوع التصميم"); setStep(2); return; }
    if (!data.description?.trim()) { setStepError("وصف المشروع مطلوب"); setStep(2); return; }
    if (!data.password?.trim() || data.password.length < 6) { setStepError("كلمة السر مطلوبة"); setStep(1); return; }
    setSubmitError("");

    try {
      await createOrder.mutateAsync({
        data: {
          clientName:  data.clientName.trim(),
          clientEmail: data.clientEmail.toLowerCase().trim(),
          clientPhone: data.clientPhone?.trim() || undefined,
          designType:  selectedType,
          description: data.description.trim(),
          references:  data.references?.trim() || undefined,
          budget:      data.budget || undefined,
          deadline:    data.deadline || undefined,
        },
      });

      if (data.password?.trim() && data.password.length >= 6) {
        try {
          const res = await fetch("/api/auth/register/direct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name:     data.clientName.trim(),
              email:    data.clientEmail.toLowerCase().trim(),
              password: data.password,
            }),
          });
          const json = await res.json();
          if (res.ok && json.token) {
            localStorage.setItem("shadj_token", json.token);
            localStorage.setItem("shadj_user", JSON.stringify(json.user));
            setRegisteredOk(true);
          }
        } catch {
          // account creation failed silently — order was still submitted
        }
      }

      setSubmittedData(data);
      setDone(true);
    } catch {
      setSubmitError("حدث خطأ أثناء إرسال الطلب — تحقق من البيانات وحاول مرة أخرى");
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center pt-20 pb-20 px-6" dir="rtl">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#3730A3]/30"
            style={{ background: "linear-gradient(135deg,#3730A3,#6366f1)" }}>
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-[#1a1a2e] mb-3">تم استلام طلبك! 🎉</h2>
          <p className="text-gray-500 text-lg mb-3 leading-relaxed">
            شكراً <strong>{submittedData?.clientName}</strong>! استلمنا طلبك بخصوص <strong>{selectedType}</strong>.
          </p>
          <p className="text-gray-400 mb-6 leading-relaxed">
            سيتواصل معك فريق شَـدِج على <strong dir="ltr">{submittedData?.clientEmail}</strong> خلال 24 ساعة.
          </p>

          {registeredOk && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-right">
              <p className="text-green-700 font-bold text-sm mb-1">✅ تم إنشاء حسابك بنجاح!</p>
              <p className="text-green-600 text-sm">يمكنك الآن متابعة طلبك من لوحة التحكم في أي وقت.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/"
              className="inline-block border border-gray-200 text-gray-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium">
              الرئيسية
            </Link>
            {registeredOk ? (
              <button onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#3730A3,#6366f1)" }}>
                تابع طلبك من الداشبورد ←
              </button>
            ) : (
              <Link href="/login"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#3730A3,#6366f1)" }}>
                سجّل دخولك لمتابعة طلبك ←
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const steps   = ["بياناتك", "التصميم", "الميزانية"];
  const inputCls = "w-full border border-gray-200 rounded-2xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-sm";

  return (
    <div className="min-h-screen bg-[#f9f7f4] pt-28 pb-20" dir="rtl">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-10">
          <span className="inline-block text-[#3730A3] font-bold text-xs tracking-[0.25em] uppercase mb-3">Start Your Project</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a1a2e] mb-3">ابدأ مشروعك</h1>
          <p className="text-gray-400">احكيلنا عن اللي في دماغك ونحوله لتحفة بصرية</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const isDone = step > n;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  active ? "bg-[#3730A3] text-white shadow-lg shadow-[#3730A3]/25"
                  : isDone ? "bg-green-100 text-green-700"
                  : "bg-white text-gray-400 border border-gray-200"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${active ? "bg-white/20" : isDone ? "bg-green-200" : "bg-gray-100"}`}>
                    {isDone ? "✓" : n}
                  </span>
                  <span className="hidden sm:block">{label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 rounded ${step > n ? "bg-green-300" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>

        {stepError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm flex items-center gap-2 mb-4">
            <span>⚠</span> {stepError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>

          {step === 1 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#3730A3] flex items-center justify-center text-white font-black text-sm">١</div>
                <h2 className="text-xl font-black text-[#1a1a2e]">بياناتك</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">الاسم الكامل *</label>
                  <input {...register("clientName")} placeholder="اسمك هنا" className={inputCls + " text-right"} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">البريد الإلكتروني *</label>
                  <input {...register("clientEmail")} type="email" placeholder="email@example.com"
                    className={inputCls} dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">رقم الواتساب</label>
                  <input {...register("clientPhone")} placeholder="+20 1XX XXX XXXX"
                    className={inputCls} dir="ltr" />
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">🔐</span>
                    <p className="text-sm font-bold text-gray-700">كلمة سر لحسابك *</p>
                    <span className="text-xs text-white bg-[#3730A3] px-2 py-0.5 rounded-full">مطلوب</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                    سنُنشئ لك حساباً تلقائياً تتابع من خلاله حالة طلبك وتتواصل مع فريقنا في أي وقت.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">كلمة السر *</label>
                      <input {...register("password")} type="password" placeholder="6 أحرف على الأقل" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">تأكيد كلمة السر *</label>
                      <input {...register("confirmPassword")} type="password" placeholder="••••••" className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>
              <button type="button" onClick={goStep2}
                className="mt-8 w-full bg-[#3730A3] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#1e1b4b] transition-colors shadow-lg shadow-[#3730A3]/20">
                التالي ←
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#3730A3] flex items-center justify-center text-white font-black text-sm">٢</div>
                <h2 className="text-xl font-black text-[#1a1a2e]">تفاصيل التصميم</h2>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-600 mb-3">نوع التصميم *</label>
                <div className="grid grid-cols-2 gap-3">
                  {DESIGN_TYPES.map(t => (
                    <button type="button" key={t.id}
                      onClick={() => { setSelectedType(t.id); setStepError(""); }}
                      className={`p-4 rounded-2xl border-2 text-right transition-all ${
                        selectedType === t.id
                          ? "border-[#3730A3] bg-[#3730A3]/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white"}`}>
                      <span className="text-xl mb-2 block text-[#3730A3]">{t.icon}</span>
                      <div className="font-bold text-[#1a1a2e] text-sm">{t.label}</div>
                      <div className="text-gray-400 text-xs mt-0.5 leading-snug">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-600 mb-2">وصف المشروع *</label>
                <textarea {...register("description")} rows={4}
                  placeholder="احكيلنا عن مشروعك... إيه الفكرة؟ الجمهور المستهدف؟ الرسالة اللي عايز تبعتها؟"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 resize-none transition-all text-right text-sm" />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-600 mb-2">ملفات مرجعية (حتى 5 ملفات)</label>
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center cursor-pointer hover:border-[#3730A3] transition-all group">
                  <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">📎</div>
                  <p className="text-sm text-gray-500 font-medium">اضغط لرفع ملفاتك</p>
                  <p className="text-xs text-gray-400 mt-0.5">PDF, PNG, JPG, ZIP, AI, PSD</p>
                  <input ref={fileRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.zip,.ai,.psd" onChange={handleFiles} className="hidden" />
                </div>
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                        <span className="text-lg">{f.name.endsWith(".pdf") ? "📄" : f.name.match(/\.(png|jpg|jpeg)$/i) ? "🖼️" : "📦"}</span>
                        <span className="flex-1 text-sm text-gray-600 truncate">{f.name}</span>
                        <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 font-bold text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-600 mb-2">مراجع إلهام</label>
                <input {...register("references")} placeholder="Behance, Dribbble، أو اسم براند يعجبك" className={inputCls + " text-right"} />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setStepError(""); setStep(1); }}
                  className="flex-1 border border-gray-200 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors text-gray-600 text-sm">
                  → رجوع
                </button>
                <button type="button" onClick={goStep3}
                  className="flex-[2] bg-[#3730A3] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#1e1b4b] transition-colors shadow-lg shadow-[#3730A3]/20">
                  التالي ←
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#3730A3] flex items-center justify-center text-white font-black text-sm">٣</div>
                <h2 className="text-xl font-black text-[#1a1a2e]">الميزانية والموعد</h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-600 mb-3">الميزانية المتوقعة</label>
                <div className="space-y-2">
                  {BUDGETS.map(b => (
                    <label key={b} className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 cursor-pointer hover:border-[#3730A3] hover:bg-[#3730A3]/3 transition-all has-[:checked]:border-[#3730A3] has-[:checked]:bg-[#3730A3]/5">
                      <input type="radio" {...register("budget")} value={b} className="accent-[#3730A3]" />
                      <span className="text-sm font-medium text-[#1a1a2e]">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-600 mb-2">الموعد المطلوب (اختياري)</label>
                <input {...register("deadline")} type="date"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-sm" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-600 mb-2">ملاحظات إضافية</label>
                <textarea {...register("notes")} rows={3} placeholder="أي تفصيلة تانية عايز نعرفها؟"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 resize-none transition-all text-right text-sm" />
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm flex items-center gap-2 mb-4">
                  <span>⚠</span> {submitError}
                </div>
              )}

              <div className="bg-[#3730A3]/5 border border-[#3730A3]/20 rounded-2xl p-4 mb-6">
                <p className="text-[#3730A3] text-sm leading-relaxed">
                  <strong>بعد إرسال الطلب</strong> — سيصلك إيميل تأكيد ويتواصل معك فريقنا خلال <strong>24 ساعة</strong>.
                </p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setStepError(""); setStep(2); }}
                  className="flex-1 border border-gray-200 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors text-gray-600 text-sm">
                  → رجوع
                </button>
                <button type="submit" disabled={createOrder.isPending}
                  className="flex-[2] bg-[#3730A3] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#1e1b4b] transition-colors disabled:opacity-60 shadow-lg shadow-[#3730A3]/20">
                  {createOrder.isPending ? "جاري الإرسال..." : "ابعت الطلب 🚀"}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-10 bg-white rounded-3xl p-6 border border-gray-100 text-center">
          <h3 className="font-black text-[#1a1a2e] text-base mb-4">إيه اللي هيحصل بعدين؟</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { n: "١", t: "نستلم طلبك",   d: "فريقنا بيراجع كل التفاصيل" },
              { n: "٢", t: "نتواصل معاك",  d: "خلال ٢٤ ساعة بعرض سعر" },
              { n: "٣", t: "نبدأ التصميم", d: "بعد موافقتك على العرض" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-9 h-9 rounded-full bg-[#3730A3]/10 text-[#3730A3] font-black flex items-center justify-center mx-auto mb-2">{s.n}</div>
                <div className="font-bold text-[#1a1a2e] text-xs mb-1">{s.t}</div>
                <div className="text-gray-400 text-xs">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
