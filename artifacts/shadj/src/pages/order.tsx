import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateOrder } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Palette, PenTool, Layout, Image as ImageIcon } from "lucide-react";

const DESIGN_TYPES = [
  { id: "branding", name: "هوية بصرية", icon: Palette, desc: "شعار متكامل مع تطبيقات الهوية" },
  { id: "social", name: "تصاميم سوشيال ميديا", icon: Layout, desc: "قوالب وبوستات للمنصات المختلفة" },
  { id: "print", name: "مطبوعات", icon: PenTool, desc: "بروشورات، فلاير، كتيبات" },
  { id: "packaging", name: "تصميم تغليف", icon: ImageIcon, desc: "تغليف منتجات وعلب" },
  { id: "other", name: "أخرى", icon: PenTool, desc: "تصاميم مخصصة أخرى" },
];

const formSchema = z.object({
  clientName: z.string().min(2, "الاسم مطلوب"),
  clientEmail: z.string().email("بريد إلكتروني غير صالح"),
  clientPhone: z.string().optional(),
  designType: z.string().min(1, "نوع التصميم مطلوب"),
  description: z.string().min(10, "يرجى وصف المشروع (10 أحرف على الأقل)"),
  references: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Order() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const createOrder = useCreateOrder();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      designType: "",
      description: "",
      references: "",
      budget: "",
      deadline: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createOrder.mutate({ data }, {
      onSuccess: () => {
        setIsSuccess(true);
        window.scrollTo(0, 0);
      },
      onError: () => {
        toast({
          title: "حدث خطأ",
          description: "لم نتمكن من إرسال طلبك. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      }
    });
  };

  const nextStep = async () => {
    const fields = step === 1 
      ? ["clientName", "clientEmail"] as const
      : step === 2 
        ? ["designType", "description"] as const 
        : [];
        
    const isValid = await form.trigger(fields);
    if (isValid) {
      setStep(s => Math.min(s + 1, 3));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo(0, 0);
  };

  if (isSuccess) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg mx-auto w-full mx-6">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-[#1a1a2e] mb-4">تم إرسال طلبك بنجاح!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            شكراً لثقتك بشدج. فريقنا سيقوم بمراجعة تفاصيل مشروعك والتواصل معك في أقرب وقت ممكن لمناقشة الخطوات التالية.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="bg-[#1a1a2e] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1a1a2e]/90 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1a1a2e] mb-4">ابدأ مشروعك الإبداعي</h1>
          <p className="text-gray-600">اخبرنا عن مشروعك ودعنا نحوله إلى واقع بصري مبهر.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 right-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors duration-500 ${
                step >= s ? "bg-primary border-primary text-white" : "bg-white border-gray-200 text-gray-400"
              }`}>
                {step > s ? <Check size={16} /> : s}
              </div>
              <span className={`text-xs mt-2 font-bold ${step >= s ? "text-primary" : "text-gray-400"}`}>
                {s === 1 ? "معلوماتك" : s === 2 ? "تفاصيل المشروع" : "الميزانية"}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Step 1 */}
              <div className={step === 1 ? "block animate-in fade-in slide-in-from-right-4 duration-500" : "hidden"}>
                <h3 className="text-2xl font-bold mb-6 text-[#1a1a2e]">معلومات التواصل</h3>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل *</FormLabel>
                        <FormControl>
                          <Input placeholder="أحمد محمد" className="bg-gray-50 border-transparent focus:bg-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني *</FormLabel>
                          <FormControl>
                            <Input placeholder="example@email.com" className="bg-gray-50 border-transparent focus:bg-white" dir="ltr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف</FormLabel>
                          <FormControl>
                            <Input placeholder="+966 5x xxx xxxx" className="bg-gray-50 border-transparent focus:bg-white" dir="ltr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={step === 2 ? "block animate-in fade-in slide-in-from-right-4 duration-500" : "hidden"}>
                <h3 className="text-2xl font-bold mb-6 text-[#1a1a2e]">عن المشروع</h3>
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="designType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع التصميم المطلوب *</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            {DESIGN_TYPES.map((type) => {
                              const Icon = type.icon;
                              const isSelected = field.value === type.name;
                              return (
                                <div 
                                  key={type.id}
                                  onClick={() => field.onChange(type.name)}
                                  className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-4 transition-all ${
                                    isSelected ? "border-primary bg-primary/5 shadow-md" : "border-gray-100 hover:border-primary/30 hover:bg-gray-50"
                                  }`}
                                >
                                  <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                                    <Icon size={20} />
                                  </div>
                                  <div>
                                    <h4 className={`font-bold ${isSelected ? "text-primary" : "text-gray-800"}`}>{type.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف المشروع *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="صِف مشروعك بدقة، ما هو النشاط التجاري؟ من هو الجمهور المستهدف؟..." 
                            className="bg-gray-50 border-transparent focus:bg-white min-h-[120px] resize-y" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="references"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>أعمال مرجعية (اختياري)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="روابط لتصاميم تعجبك وتريد شيء مشابه لها" 
                            className="bg-gray-50 border-transparent focus:bg-white min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Step 3 */}
              <div className={step === 3 ? "block animate-in fade-in slide-in-from-right-4 duration-500" : "hidden"}>
                <h3 className="text-2xl font-bold mb-6 text-[#1a1a2e]">التفاصيل الأخيرة</h3>
                <div className="space-y-6 mb-10">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الميزانية المتوقعة (اختياري)</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-transparent focus:bg-white"
                            {...field}
                          >
                            <option value="">اختر الميزانية</option>
                            <option value="500-1000">500 - 1,000 ريال</option>
                            <option value="1000-3000">1,000 - 3,000 ريال</option>
                            <option value="3000-5000">3,000 - 5,000 ريال</option>
                            <option value="5000+">أكثر من 5,000 ريال</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الوقت المتوقع للتسليم (اختياري)</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-transparent focus:bg-white"
                            {...field}
                          >
                            <option value="">اختر الوقت المتوقع</option>
                            <option value="urgent">عاجل جداً (أقل من أسبوع)</option>
                            <option value="1-2weeks">1 - 2 أسابيع</option>
                            <option value="1month">شهر</option>
                            <option value="flexible">مرن</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-4">ملخص الطلب:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong className="text-gray-800">الاسم:</strong> {form.watch("clientName") || "-"}</li>
                    <li><strong className="text-gray-800">البريد:</strong> {form.watch("clientEmail") || "-"}</li>
                    <li><strong className="text-gray-800">نوع التصميم:</strong> {form.watch("designType") || "-"}</li>
                  </ul>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-8">
                {step > 1 ? (
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a2e] font-bold transition-colors"
                  >
                    <ChevronRight size={18} />
                    السابق
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-[#1a1a2e] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1a1a2e]/90 transition-colors"
                  >
                    التالي
                    <ChevronLeft size={18} />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={createOrder.isPending}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50"
                  >
                    {createOrder.isPending ? "جاري الإرسال..." : "تأكيد وإرسال"}
                    <Check size={18} />
                  </button>
                )}
              </div>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
