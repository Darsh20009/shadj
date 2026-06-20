import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useCreateOrder } from "@workspace/api-client-react";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";

const DESIGN_TYPES = [
  { id: "هوية بصرية",     label: "هوية بصرية",     icon: "◆", desc: "لوجو + ألوان + فونت + دليل هوية" },
  { id: "بوسترات",        label: "بوسترات",         icon: "▲", desc: "تصاميم للطباعة أو السوشيال" },
  { id: "سوشيال ميديا",  label: "سوشيال ميديا",   icon: "●", desc: "باقة محتوى للمنصات" },
  { id: "حملات إعلانية", label: "حملات إعلانية",   icon: "★", desc: "حملة كاملة متناسقة" },
  { id: "مطبوعات",       label: "مطبوعات",          icon: "■", desc: "منيو، كروت، بروشور" },
  { id: "تغليف",         label: "تغليف",            icon: "⬡", desc: "Packaging وعبوات المنتجات" },
];

const BUDGETS = [
  "أقل من 500 جنيه",
  "500 – 1000 جنيه",
  "1000 – 2000 جنيه",
  "أكثر من 2000 جنيه",
  "نريد عرض سعر أولاً",
];

const PHONE = "201129085243";

function buildWhatsAppMsg(data: any, designType: string) {
  const lines = [
    "🎨 *طلب تصميم جديد — شدج*",
    "",
    `👤 *الاسم:* ${data.clientName}`,
    `📧 *البريد:* ${data.clientEmail}`,
    data.clientPhone ? `📱 *الواتساب:* ${data.clientPhone}` : "",
    data.companyName ? `🏢 *الشركة:* ${data.companyName}` : "",
    "",
    `🖌️ *نوع التصميم:* ${designType}`,
    `📝 *الوصف:*\n${data.description}`,
    data.references ? `🔗 *مراجع:* ${data.references}` : "",
    "",
    data.budget ? `💰 *الميزانية:* ${data.budget}` : "",
    data.deadline ? `📅 *الموعد:* ${data.deadline}` : "",
    data.notes ? `📌 *ملاحظات:* ${data.notes}` : "",
  ].filter(Boolean).join("\n");
  return encodeURIComponent(lines);
}

export default function Order() {
  useSEO({
    title: "ابدأ مشروعك — اطلب تصميمك من شدج",
    description: "عايز تصميم احترافي؟ ابعتلنا تفاصيل مشروعك وهنرد عليك في أسرع وقت. هوية بصرية، بوسترات، سوشيال ميديا، وأكتر.",
    keywords: "طلب تصميم, تصميم هوية بصرية, بوستر إعلاني, سوشيال ميديا, ابدأ مشروعك",
    canonical: "/order",
  });

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [done, setDone] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<any>();
  const createOrder = useCreateOrder();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files).slice(0, 5));
  };
  const removeFile = (i: number) => setFiles(f => f.filter((_, idx) => idx !== i));

  async function onSubmit(data: any) {
    if (!selectedType) return;
    try {
      await createOrder.mutateAsync({ data: { ...data, designType: selectedType } });
      const msg = buildWhatsAppMsg(data, selectedType);
      const url = `https://wa.me/${PHONE}?text=${msg}`;
      setWaUrl(url);
      setSubmittedData(data);
      setDone(true);
    } catch {
      alert("حدث خطأ، حاول مرة أخرى أو تواصل معنا مباشرة على الواتساب.");
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center pt-20 pb-20 px-6" dir="rtl">
        <div className="text-center max-w-lg mx-auto">
          {/* Success icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3730A3] to-[#6366f1] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#3730A3]/30">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-4xl font-black text-[#1a1a2e] mb-3">تم استلام طلبك! 🎉</h2>
          <p className="text-gray-500 text-lg mb-3 leading-relaxed">
            شكراً <strong>{submittedData?.clientName}</strong>! استلمنا طلبك بخصوص <strong>{selectedType}</strong>.
          </p>
          <p className="text-gray-400 mb-10">
            للتواصل السريع والمتابعة — اضغط على زر الواتساب بالأسفل وهيوصلنا تفاصيل طلبك فوراً.
          </p>

          {/* WhatsApp CTA */}
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-500/30 hover:scale-105 transition-all mb-5 w-full justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            تواصل على الواتساب الآن
          </a>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-right">
            <p className="text-amber-700 text-sm">
              <strong>⚡ سريع:</strong> اضغط الزر للتواصل الفوري — سيُرسل تفاصيل طلبك تلقائياً لفريق شدج.
            </p>
          </div>

          <Link href="/" className="inline-block border border-gray-200 text-gray-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const steps = ["بياناتك", "التصميم", "الميزانية"];

  return (
    <div className="min-h-screen bg-[#f9f7f4] pt-28 pb-20" dir="rtl">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[#3730A3] font-bold text-xs tracking-[0.25em] uppercase mb-3">Start Your Project</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a1a2e] mb-3">ابدأ مشروعك</h1>
          <p className="text-gray-400">احكيلنا عن اللي في دماغك ونحوله لتحفة بصرية</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const isDone = step > n;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  active ? "bg-[#3730A3] text-white shadow-lg shadow-[#3730A3]/25"
                  : isDone ? "bg-green-100 text-green-700"
                  : "bg-white text-gray-400 border border-gray-200"
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${active ? "bg-white/20" : isDone ? "bg-green-200" : "bg-gray-100"}`}>
                    {isDone ? "✓" : n}
                  </span>
                  <span className="hidden sm:block">{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 rounded transition-colors ${step > n ? "bg-green-300" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Step 1 — Contact */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#3730A3] flex items-center justify-center text-white font-black text-sm">١</div>
                <h2 className="text-xl font-black text-[#1a1a2e]">بياناتك</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">الاسم الكامل *</label>
                  <input {...register("clientName", { required: true })}
                    placeholder="اسمك هنا"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-right" />
                  {errors.clientName && <p className="text-red-500 text-xs mt-1">الاسم مطلوب</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">البريد الإلكتروني *</label>
                  <input {...register("clientEmail", { required: true })} type="email"
                    placeholder="email@example.com"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all"
                    dir="ltr" />
                  {errors.clientEmail && <p className="text-red-500 text-xs mt-1">البريد مطلوب</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">رقم الواتساب</label>
                  <div className="relative">
                    <input {...register("clientPhone")} placeholder="+20 112 908 5243"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all"
                      dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">اسم الشركة أو المشروع</label>
                  <input {...register("companyName")} placeholder="شركة / مشروع / فريلانسر"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1a1a2e] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-right" />
                </div>
              </div>
              <button type="button" onClick={() => { const v = getValues(); if (!v.clientName || !v.clientEmail) { return; } setStep(2); }}
                className="mt-8 w-full bg-[#3730A3] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#1e1b4b] transition-colors shadow-lg shadow-[#3730A3]/20">
                التالي ←
              </button>
            </div>
          )}

          {/* Step 2 — Design Details */}
          {step === 2 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#3730A3] flex items-center justify-center text-white font-black text-sm">٢</div>
                <h2 className="text-xl font-black text-[#1a1a2e]">تفاصيل التصميم</h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-600 mb-3">نوع التصميم *</label>
                <div className="grid grid-cols-2 gap-3">
                  {DESIGN_TYPES.map(t => (
                    <button type="button" key={t.id} onClick={() => setSelectedType(t.id)}
                      className={`p-4 rounded-2xl border-2 text-right transition-all ${
                        selectedType === t.id
                          ? "border-[#3730A3] bg-[#3730A3]/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white"
                      }`}>
                      <span className="text-xl mb-2 block text-[#3730A3]">{t.icon}</span>
                      <div className="font-bold text-[#1a1a2e] text-sm">{t.label}</div>
                      <div className="text-gray-400 text-xs mt-0.5 leading-snug">{t.desc}</div>
                    </button>
                  ))}
                </div>
                {!selectedType && <p className="text-amber-500 text-xs mt-2">اختر نوع التصميم للمتابعة</p>}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-600 mb-2">وصف المشروع *</label>
                <textarea {...register("description", { required: true })} rows={4}
                  placeholder="احكيلنا عن مشروعك... إيه الفكرة؟ الجمهور المستهدف؟ الرسالة اللي عايز تبعتها؟"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 resize-none transition-all text-right" />
                {errors.description && <p className="text-red-500 text-xs mt-1">الوصف مطلوب</p>}
              </div>

              {/* File Upload */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-600 mb-2">مراجع وملفات (اختياري — حتى 5 ملفات)</label>
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#3730A3] hover:bg-[#3730A3]/2 transition-all group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📎</div>
                  <p className="text-sm text-gray-500 font-medium">اضغط لرفع ملفاتك</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG, ZIP, AI, PSD — حتى 10MB</p>
                  <input ref={fileRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.zip,.ai,.psd" onChange={handleFiles} className="hidden" />
                </div>
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                        <span className="text-lg">{f.name.endsWith(".pdf") ? "📄" : f.name.match(/\.(png|jpg|jpeg)$/i) ? "🖼️" : "📦"}</span>
                        <span className="flex-1 text-sm text-gray-600 truncate text-right">{f.name}</span>
                        <span className="text-xs text-gray-400">{(f.size/1024/1024).toFixed(1)} MB</span>
                        <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 font-bold text-xs w-5 h-5 flex items-center justify-center">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-600 mb-2">مراجع خارجية (روابط)</label>
                <input {...register("references")} placeholder="behance.net/... أو اسم براند بيعجبك"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-right" />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors text-gray-600">
                  → رجوع
                </button>
                <button type="button" onClick={() => { if (!selectedType) return; setStep(3); }}
                  disabled={!selectedType}
                  className="flex-[2] bg-[#3730A3] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#1e1b4b] transition-colors disabled:opacity-40 shadow-lg shadow-[#3730A3]/20">
                  التالي ←
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Budget & Deadline */}
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
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-600 mb-2">ملاحظات إضافية</label>
                <textarea {...register("notes")} rows={3}
                  placeholder="أي تفصيلة تانية عايز نعرفها؟"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 resize-none transition-all text-right" />
              </div>

              {/* WhatsApp note */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-500 shrink-0 mt-0.5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <p className="text-green-700 text-sm leading-relaxed">
                    <strong>بعد الإرسال</strong> — هيفتح واتساب تلقائياً بتفاصيل طلبك لفريق شدج.
                    هيردوا عليك بأسرع وقت!
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 border border-gray-200 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors text-gray-600">
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

        {/* Process steps */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-gray-100">
          <h3 className="font-black text-[#1a1a2e] text-lg mb-6 text-center">إيه اللي هيحصل بعدين؟</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { n:"١", t:"نستلم طلبك", d:"فريقنا بيراجع كل التفاصيل" },
              { n:"٢", t:"نتواصل معاك", d:"خلال ٢٤ ساعة بعرض سعر" },
              { n:"٣", t:"نبدأ التصميم", d:"بعد موافقتك على العرض" },
            ].map((s,i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-[#3730A3]/10 text-[#3730A3] font-black text-lg flex items-center justify-center mx-auto mb-3">{s.n}</div>
                <div className="font-bold text-[#1a1a2e] text-sm mb-1">{s.t}</div>
                <div className="text-gray-400 text-xs">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
