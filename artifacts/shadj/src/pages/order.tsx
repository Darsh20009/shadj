import { useState } from "react";
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

export default function Order() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [done, setDone] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<any>();
  const createOrder = useCreateOrder();

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
          <div className="w-24 h-24 bg-[#3730A3] rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-white text-4xl">✓</span>
          </div>
          <h2 className="text-4xl font-black text-[#1a1a2e] mb-4">تم الطلب!</h2>
          <p className="text-gray-600 text-lg mb-8">استلمنا طلبك وهنرد عليك خلال ٢٤ ساعة إن شاء الله. شكراً إنك اخترت شدج!</p>
          <a href="/" className="inline-block bg-[#3730A3] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#1a1a2e] transition-colors">
            العودة للرئيسية
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f7f4] pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-[#1a1a2e] mb-3">ابدأ مشروعك</h1>
          <p className="text-gray-500 text-lg">احكيلنا عن اللي في دماغك ونحوله لتحفة</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-12 justify-center">
          {[1,2,3].map(n => (
            <div key={n} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${step >= n ? "bg-[#3730A3] text-white shadow-lg shadow-[#3730A3]/30" : "bg-gray-200 text-gray-400"}`}>
                {step > n ? "✓" : n}
              </div>
              {n < 3 && <div className={`w-16 h-0.5 transition-all ${step > n ? "bg-[#3730A3]" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-[#1a1a2e] mb-8 text-right">بياناتك</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 text-right">الاسم الكامل *</label>
                  <input {...register("clientName",{required:true})} placeholder="اسمك هنا" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" />
                  {errors.clientName && <p className="text-red-500 text-xs mt-1 text-right">الاسم مطلوب</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 text-right">البريد الإلكتروني *</label>
                  <input {...register("clientEmail",{required:true})} type="email" placeholder="email@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" dir="ltr" />
                  {errors.clientEmail && <p className="text-red-500 text-xs mt-1 text-right">البريد مطلوب</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 text-right">رقم الهاتف (اختياري)</label>
                  <input {...register("clientPhone")} placeholder="+20 / +966 ..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" dir="ltr" />
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} className="mt-8 w-full bg-[#3730A3] text-white py-4 rounded-xl font-black text-lg hover:bg-[#1a1a2e] transition-colors">
                التالي
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-[#1a1a2e] mb-8 text-right">تفاصيل التصميم</h2>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-600 mb-4 text-right">نوع التصميم *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DESIGN_TYPES.map(t => (
                    <button type="button" key={t.id} onClick={() => setSelectedType(t.id)}
                      className={`p-4 rounded-xl border-2 text-right transition-all ${selectedType === t.id ? "border-[#3730A3] bg-[#3730A3]/5 shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
                      <span className="text-2xl mb-2 block text-[#3730A3]">{t.icon}</span>
                      <div className="font-bold text-[#1a1a2e] text-sm">{t.label}</div>
                      <div className="text-gray-400 text-xs mt-1">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2 text-right">وصف المشروع *</label>
                <textarea {...register("description",{required:true})} rows={4} placeholder="احكيلنا عن مشروعك... شركة إيه؟ تصمم إيه؟ الجمهور المستهدف إيه؟" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 resize-none transition-all" />
                {errors.description && <p className="text-red-500 text-xs mt-1 text-right">الوصف مطلوب</p>}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-600 mb-2 text-right">مراجع أو أمثلة (اختياري)</label>
                <input {...register("references")} placeholder="لينكات أو أسماء علامات تجارية بتعجبك" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                  رجوع
                </button>
                <button type="button" onClick={() => { if (!selectedType) return; setStep(3); }} className="flex-[2] bg-[#3730A3] text-white py-4 rounded-xl font-black text-lg hover:bg-[#1a1a2e] transition-colors">
                  التالي
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-[#1a1a2e] mb-8 text-right">الميزانية والموعد</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 text-right">الميزانية (بالجنيه/الريال — اختياري)</label>
                  <input {...register("budget")} placeholder="مثال: 500 جنيه / 200 ريال" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 text-right">الموعد المطلوب (اختياري)</label>
                  <input {...register("deadline")} type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" />
                </div>
              </div>
              <div className="mt-6 p-4 bg-[#f9f7f4] rounded-xl text-right text-sm text-gray-500">
                <strong className="text-[#1a1a2e]">ملحوظة:</strong> هنرد عليك خلال ٢٤ ساعة على البريد الإلكتروني اللي كتبته.
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-200 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                  رجوع
                </button>
                <button type="submit" disabled={createOrder.isPending} className="flex-[2] bg-[#3730A3] text-white py-4 rounded-xl font-black text-lg hover:bg-[#1a1a2e] transition-colors disabled:opacity-60">
                  {createOrder.isPending ? "بنبعت..." : "ابعت الطلب"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
