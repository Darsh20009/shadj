import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useCreateOrder } from "@workspace/api-client-react";

const DESIGN_TYPES = [
  { id: "هوية بصرية", label: "هوية بصرية", icon: "◆", desc: "لوجو + ألوان + فونت + دليل هوية" },
  { id: "بوسترات", label: "بوسترات", icon: "▲", desc: "تصاميم بوسترات للطباعة أو السوشيال" },
  { id: "سوشيال ميديا", label: "سوشيال ميديا", icon: "●", desc: "باقة محتوى لمنصات التواصل" },
  { id: "حملات إعلانية", label: "حملات إعلانية", icon: "★", desc: "تصميم حملة كاملة متناسقة" },
  { id: "مطبوعات", label: "مطبوعات", icon: "■", desc: "منيو، كروت، بروشور" },
  { id: "تغليف", label: "تغليف", icon: "⬡", desc: "تصميم packaging وعبوات المنتجات" },
];

const BUDGETS = ["أقل من 500 جنيه", "500 - 1000 جنيه", "1000 - 2000 جنيه", "أكثر من 2000 جنيه", "نريد عرض سعر أولاً"];

export default function Order() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [done, setDone] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<any>();
  const createOrder = useCreateOrder();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files).slice(0, 5));
  };

  const removeFile = (i: number) => setFiles(f => f.filter((_, idx) => idx !== i));

  async function onSubmit(data: any) {
    if (!selectedType) return;
    try {
      await createOrder.mutateAsync({ data: { ...data, designType: selectedType } });
      setDone(true);
    } catch {}
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 rounded-full bg-[#3730A3] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#3730A3]/30">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-[#1a1a2e] mb-4">تم الطلب! 🎉</h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            استلمنا طلبك وفريقنا هيرد عليك خلال ٢٤ ساعة على البريد الإلكتروني. شكراً إنك اخترت شدج!
          </p>
          <a href="/" className="inline-block bg-[#3730A3] text-white px-8 py-3.5 rounded-full font-black hover:bg-[#1a1a2e] transition-colors">
            العودة للرئيسية
          </a>
        </div>
      </div>
    );
  }

  const steps = ["بياناتك", "التصميم", "الميزانية"];

  return (
    <div className="min-h-screen bg-[#f9f7f4] pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#1a1a2e] mb-3">ابدأ مشروعك</h1>
          <p className="text-gray-400">احكيلنا عن اللي في دماغك ونحوله لتحفة</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  active ? "bg-[#3730A3] text-white shadow-lg shadow-[#3730A3]/30"
                  : done ? "bg-green-100 text-green-700"
                  : "bg-white text-gray-400 border border-gray-200"
                }`}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-white/20">
                    {done ? "✓" : n}
                  </span>
                  <span className="hidden sm:block">{label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-6 h-0.5 rounded ${step > n ? "bg-green-400" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1 — Contact Info */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-[#1a1a2e] mb-6 text-right">بياناتك</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 text-right">الاسم الكامل *</label>
                  <input {...register("clientName", { required: true })}
                    placeholder="اسمك هنا"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" />
                  {errors.clientName && <p className="text-red-500 text-xs mt-1 text-right">الاسم مطلوب</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 text-right">البريد الإلكتروني *</label>
                  <input {...register("clientEmail", { required: true })} type="email"
                    placeholder="email@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" dir="ltr" />
                  {errors.clientEmail && <p className="text-red-500 text-xs mt-1 text-right">البريد مطلوب</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 text-right">رقم الواتساب (اختياري)</label>
                  <input {...register("clientPhone")} placeholder="+20 / +966 ..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 text-right">اسم الشركة أو المشروع</label>
                  <input {...register("companyName")} placeholder="شركة / مشروع / فريلانسر"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" />
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)}
                className="mt-8 w-full bg-[#3730A3] text-white py-4 rounded-xl font-black text-lg hover:bg-[#1a1a2e] transition-colors">
                التالي
              </button>
            </div>
          )}

          {/* Step 2 — Design Details */}
          {step === 2 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-[#1a1a2e] mb-6 text-right">تفاصيل التصميم</h2>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-500 mb-3 text-right">نوع التصميم *</label>
                <div className="grid grid-cols-2 gap-3">
                  {DESIGN_TYPES.map(t => (
                    <button type="button" key={t.id} onClick={() => setSelectedType(t.id)}
                      className={`p-4 rounded-xl border-2 text-right transition-all ${
                        selectedType === t.id
                          ? "border-[#3730A3] bg-[#3730A3]/5 shadow-md shadow-[#3730A3]/10"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}>
                      <span className="text-xl mb-2 block" style={{ color: "#3730A3" }}>{t.icon}</span>
                      <div className="font-bold text-[#1a1a2e] text-sm">{t.label}</div>
                      <div className="text-gray-400 text-xs mt-1 leading-tight">{t.desc}</div>
                    </button>
                  ))}
                </div>
                {!selectedType && <p className="text-amber-500 text-xs mt-2 text-right">اختر نوع التصميم للمتابعة</p>}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-500 mb-2 text-right">وصف المشروع *</label>
                <textarea {...register("description", { required: true })} rows={4}
                  placeholder="احكيلنا عن مشروعك... إيه الفكرة؟ الجمهور المستهدف إيه؟ الرسالة اللي عايز تبعتها إيه؟"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 resize-none transition-all" />
                {errors.description && <p className="text-red-500 text-xs mt-1 text-right">الوصف مطلوب</p>}
              </div>

              {/* File Upload */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-500 mb-2 text-right">مراجع وملفات (اختياري — حتى 5 ملفات)</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-[#3730A3] hover:bg-[#3730A3]/2 transition-all"
                >
                  <div className="text-3xl mb-2">📎</div>
                  <p className="text-sm text-gray-400">اضغط لرفع ملفاتك</p>
                  <p className="text-xs text-gray-300 mt-1">PDF, PNG, JPG, ZIP — حتى 10MB لكل ملف</p>
                  <input ref={fileRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.zip,.ai,.psd" onChange={handleFiles} className="hidden" />
                </div>
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                        <span className="text-lg">
                          {f.name.endsWith(".pdf") ? "📄" : f.name.match(/\.(png|jpg|jpeg)$/i) ? "🖼️" : "📦"}
                        </span>
                        <span className="flex-1 text-sm text-gray-600 truncate">{f.name}</span>
                        <span className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                        <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 text-xs font-bold">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-500 mb-2 text-right">مراجع خارجية (روابط)</label>
                <input {...register("references")} placeholder="مثال: behance.net/... أو اسم علامة تجارية بتعجبك"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                  رجوع
                </button>
                <button type="button" onClick={() => { if (!selectedType) return; setStep(3); }}
                  disabled={!selectedType}
                  className="flex-[2] bg-[#3730A3] text-white py-4 rounded-xl font-black text-lg hover:bg-[#1a1a2e] transition-colors disabled:opacity-40">
                  التالي
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Budget & Deadline */}
          {step === 3 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-[#1a1a2e] mb-6 text-right">الميزانية والموعد</h2>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-500 mb-3 text-right">الميزانية المتوقعة</label>
                <div className="space-y-2">
                  {BUDGETS.map(b => (
                    <label key={b} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-[#3730A3] hover:bg-[#3730A3]/3 transition-all has-[:checked]:border-[#3730A3] has-[:checked]:bg-[#3730A3]/5">
                      <input type="radio" {...register("budget")} value={b} className="accent-[#3730A3]" />
                      <span className="text-sm font-medium text-[#1a1a2e]">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-500 mb-2 text-right">الموعد المطلوب (اختياري)</label>
                <input {...register("deadline")} type="date"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-500 mb-2 text-right">ملاحظات إضافية</label>
                <textarea {...register("notes")} rows={3}
                  placeholder="أي تفصيلة تانية عايز نعرفها؟"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 resize-none transition-all" />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-right">
                <p className="text-blue-700 text-sm">
                  <strong>✓ تمام!</strong> هنرد عليك خلال ٢٤ ساعة على بريدك الإلكتروني بعرض سعر تفصيلي.
                </p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 border border-gray-200 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                  رجوع
                </button>
                <button type="submit" disabled={createOrder.isPending}
                  className="flex-[2] bg-[#3730A3] text-white py-4 rounded-xl font-black text-lg hover:bg-[#1a1a2e] transition-colors disabled:opacity-60">
                  {createOrder.isPending ? "جاري الإرسال..." : "ابعت الطلب 🚀"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
