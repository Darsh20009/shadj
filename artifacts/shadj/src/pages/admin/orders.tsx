import { useState } from "react";
import { useListOrders, useUpdateOrder } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { getListOrdersQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Search, Calendar, DollarSign, ChevronDown, ChevronUp, Copy, Check, Phone, Send, X, ClipboardList, FileText, RefreshCw } from "lucide-react";

const DELIVERY_CHECKLISTS: Record<string, string[]> = {
  "هوية بصرية": [
    "لوجو PNG شفاف (طولي + مربع + رمز)",
    "لوجو SVG قابل للتكبير",
    "لوجو PDF جودة طباعة",
    "لوجو على خلفية بيضاء وداكنة",
    "دليل الهوية البصرية PDF",
    "كودات الألوان HEX + RGB + CMYK",
    "اسم الخطوط المستخدمة",
    "موكب عرض للوجو (Mockup)",
    "ملفات المصدر (AI / PSD)",
  ],
  "بوسترات": [
    "ملف PDF دقة 300dpi للطباعة",
    "ملف PNG دقة عالية",
    "ملف JPG للعرض الرقمي",
    "نسخ بأحجام مختلفة إن طُلب",
    "ملف المصدر (AI / PSD / Figma)",
  ],
  "سوشيال ميديا": [
    "صور JPG/PNG بالمقاسات المطلوبة",
    "ستوري + بوست + غلاف (إن انطبق)",
    "نسخة قابلة للتعديل (Canva / Figma)",
    "ملفات المصدر (AI / PSD)",
    "دليل استخدام الألوان والخطوط",
  ],
  "حملات إعلانية": [
    "مواد الحملة الكاملة (بوسترات + ستوري + بانر)",
    "ملفات PDF للطباعة بدقة 300dpi",
    "ملفات PNG للإعلانات الرقمية",
    "نسخ بأبعاد مختلفة (Facebook / Google Ads)",
    "تقرير عناصر الحملة البصرية",
    "ملفات المصدر القابلة للتعديل",
  ],
  "تصميم فيديوهات": [
    "ملف MP4 Full HD (1080p)",
    "ملف MP4 مضغوط للسوشيال",
    "صورة ثامبنيل PNG عالية الجودة",
    "نسخ بأبعاد مختلفة (Story 9:16 / Feed 1:1 / YouTube 16:9)",
    "ملف المصدر (AE / Premiere / Resolve)",
  ],
  "مطبوعات": [
    "ملف PDF 300dpi جاهز للطباعة",
    "ملف CMYK للطباعة الاحترافية",
    "Bleed area صحيح (3mm على الأقل)",
    "ملف PNG للعرض الرقمي",
    "ملف المصدر (AI / InDesign)",
  ],
};
const DEFAULT_CHECKLIST = [
  "ملف التصميم النهائي بالجودة المطلوبة",
  "ملف المصدر القابل للتعديل",
  "تعليمات الاستخدام والتسليم",
];

function DeliveryChecklistModal({ designType, clientName, onClose }: { designType: string; clientName: string; onClose: () => void }) {
  const items = DELIVERY_CHECKLISTS[designType] || DEFAULT_CHECKLIST;
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const allDone = checked.every(Boolean);
  const doneCount = checked.filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100" style={{ background: "linear-gradient(135deg,#0f0e1a,#1a1a2e)" }}>
          <div>
            <h2 className="font-black text-base text-white flex items-center gap-2">
              <ClipboardList size={16} className="text-[#F5E6C8]" />
              قائمة التسليم
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{clientName} — {designType}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">تأكدي من تسليم كل البنود:</p>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${allDone ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {doneCount} / {items.length}
            </span>
          </div>
          <div className="space-y-2.5 mb-5">
            {items.map((item, i) => (
              <label key={i} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${checked[i] ? "bg-green-50 border border-green-100" : "bg-gray-50 border border-transparent hover:border-gray-200"}`}>
                <input type="checkbox" checked={checked[i]} onChange={() => setChecked(c => c.map((v, j) => j === i ? !v : v))}
                  className="mt-0.5 w-4 h-4 accent-green-500 rounded" />
                <span className={`text-sm leading-snug ${checked[i] ? "line-through text-gray-400" : "text-gray-700 font-medium"}`}>{item}</span>
              </label>
            ))}
          </div>
          {allDone ? (
            <div className="text-center py-3 bg-green-50 rounded-xl border border-green-100">
              <p className="text-green-700 font-black text-sm">🎉 ممتاز! كل عناصر التسليم مكتملة</p>
            </div>
          ) : (
            <p className="text-center text-xs text-gray-400">باقي {items.length - doneCount} بنود</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface QuoteModal { clientName: string; designType: string; description: string; budget: string; deadline: string; }

function QuoteGeneratorModal({ data, onClose }: { data: QuoteModal; onClose: () => void }) {
  const { toast } = useToast();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const token = localStorage.getItem("shadj_token") || "";
      const res = await fetch("/api/ai/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setResult(json.result || "");
    } catch {
      toast({ title: "❌ فشل توليد عرض السعر", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-l from-[#3730A3] to-[#1a1a2e]">
          <div>
            <h2 className="font-black text-base text-white flex items-center gap-2">
              <FileText size={16} className="text-[#F5E6C8]" />
              مولّد عرض السعر الاحترافي
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">{data.clientName} — {data.designType}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          {!result ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">📄</div>
              <p className="text-gray-600 font-medium mb-2">سيتم توليد عرض سعر احترافي كامل بالعربية</p>
              <p className="text-sm text-gray-400 mb-6">يشمل: نطاق العمل، الجدول الزمني، التسعير، والشروط</p>
              <button onClick={generate} disabled={loading}
                className="flex items-center gap-2 mx-auto bg-[#3730A3] hover:bg-[#1a1a2e] text-white px-8 py-3 rounded-xl font-black text-sm transition-colors disabled:opacity-60">
                {loading ? <><RefreshCw size={15} className="animate-spin" /> جاري التوليد بالذكاء الاصطناعي...</> : <><FileText size={15} /> توليد عرض السعر</>}
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 rounded-xl p-4 max-h-80 overflow-y-auto mb-4 border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={copy}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all border ${copied ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-gray-200 text-gray-700 hover:border-[#3730A3]/30"}`}>
                  {copied ? <><Check size={14} /> تم النسخ!</> : <><Copy size={14} /> نسخ العرض</>}
                </button>
                <button onClick={() => setResult("")}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium text-sm transition-colors">
                  <RefreshCw size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const STATUS: Record<string, { label: string; color: string }> = {
  pending:     { label: "قيد الانتظار",  color: "bg-amber-100 text-amber-800 border-amber-200" },
  in_progress: { label: "جاري التنفيذ",  color: "bg-blue-100 text-blue-800 border-blue-200" },
  completed:   { label: "مكتمل",          color: "bg-green-100 text-green-800 border-green-200" },
  cancelled:   { label: "ملغي",           color: "bg-red-100 text-red-800 border-red-200" },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-500 hover:text-[#3730A3] hover:border-[#3730A3]/30 px-3 py-2 rounded-xl text-xs font-medium transition-all"
      title="نسخ"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {copied ? "تم النسخ!" : "نسخ"}
    </button>
  );
}

interface QuickMsgModal {
  toEmail: string;
  toName: string;
  orderId: string;
  designType: string;
}

function QuickMessageModal({ data, onClose }: { data: QuickMsgModal; onClose: () => void }) {
  const { toast } = useToast();
  const [subject, setSubject] = useState(`بخصوص طلبك: ${data.designType}`);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const TEMPLATES = [
    {
      label: "استلام الطلب",
      subject: `تم استلام طلبك: ${data.designType}`,
      body: `أهلاً ${data.toName}! 👋\n\nأردنا أن نُعلمك أنه تم استلام طلبك (${data.designType}) بنجاح، وفريقنا يراجعه الآن.\n\nسنتواصل معك قريباً بمزيد من التفاصيل.\n\nشكراً لثقتك في شَدِج 🎨`,
    },
    {
      label: "بدء التنفيذ",
      subject: `بدأنا العمل على تصميمك: ${data.designType}`,
      body: `أهلاً ${data.toName}! 🎨\n\nيسعدنا إخبارك أن فريقنا بدأ العمل على تصميمك (${data.designType}).\n\nسنرسل لك النتائج فور الانتهاء. يمكنك متابعة الحالة من لوحة التحكم.\n\nفريق شَدِج للجرافيكس`,
    },
    {
      label: "اكتمال التصميم",
      subject: `✅ تم إنجاز تصميمك: ${data.designType}`,
      body: `أهلاً ${data.toName}! 🎉\n\nيسعدنا إخبارك بأن تصميمك (${data.designType}) قد اكتمل!\n\nيُرجى مراجعة البريد الإلكتروني لاستلام الملفات، أو تواصل معنا إذا أردت أي تعديلات.\n\nشكراً لاختيارك شَدِج 🌟`,
    },
    {
      label: "طلب معلومات إضافية",
      subject: `نحتاج بعض المعلومات بخصوص: ${data.designType}`,
      body: `أهلاً ${data.toName}!\n\nبخصوص طلبك (${data.designType}), نود الاستفسار عن بعض التفاصيل لنتمكن من تقديم أفضل نتيجة.\n\nالرجاء الرد على هذه الرسالة أو التواصل معنا.\n\nفريق شَدِج`,
    },
  ];

  async function handleSend() {
    if (!subject.trim() || !content.trim()) {
      toast({ title: "الموضوع والمحتوى مطلوبان", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const token = localStorage.getItem("shadj_token") || "";
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ toEmail: data.toEmail, toName: data.toName, subject, content, orderId: data.orderId }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "✅ تم إرسال الرسالة بنجاح" });
      onClose();
    } catch {
      toast({ title: "❌ فشل الإرسال", variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#0f0e1a] text-white">
          <div>
            <h2 className="font-black text-base">إرسال رسالة</h2>
            <p className="text-xs text-gray-400 mt-0.5">{data.toName} — {data.toEmail}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs text-gray-400 font-bold mb-2">قوالب سريعة:</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => { setSubject(t.subject); setContent(t.body); }}
                  className="text-xs bg-[#3730A3]/5 hover:bg-[#3730A3]/10 text-[#3730A3] font-medium px-3 py-1.5 rounded-lg border border-[#3730A3]/15 transition-colors">
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">الموضوع</label>
            <input
              value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10"
              placeholder="موضوع الرسالة..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">المحتوى</label>
            <textarea
              value={content} onChange={e => setContent(e.target.value)}
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 resize-none"
              placeholder="اكتب رسالتك هنا..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSend} disabled={sending}
              className="flex-1 flex items-center justify-center gap-2 bg-[#3730A3] hover:bg-[#1a1a2e] disabled:opacity-60 text-white py-2.5 rounded-xl font-bold text-sm transition-colors">
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {sending ? "جاري الإرسال..." : "إرسال الرسالة"}
            </button>
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useListOrders();
  const updateOrder = useUpdateOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [msgModal, setMsgModal] = useState<QuickMsgModal | null>(null);
  const [checklistModal, setChecklistModal] = useState<{ designType: string; clientName: string } | null>(null);
  const [quoteModal, setQuoteModal] = useState<QuoteModal | null>(null);

  const handleStatusChange = (id: string, newStatus: string) => {
    updateOrder.mutate({ id, data: { status: newStatus } } as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "✅ تم تحديث حالة الطلب" });
      },
      onError: () => {
        toast({ title: "❌ فشل تحديث الحالة", variant: "destructive" });
      },
    });
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || o.clientName?.toLowerCase().includes(q)
      || o.clientEmail?.toLowerCase().includes(q)
      || o.designType?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts: Record<string, number> = {
    all: orders.length,
    pending:     orders.filter(o => o.status === "pending").length,
    in_progress: orders.filter(o => o.status === "in_progress").length,
    completed:   orders.filter(o => o.status === "completed").length,
    cancelled:   orders.filter(o => o.status === "cancelled").length,
  };

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="text-center text-gray-400">
        <div className="w-10 h-10 border-2 border-[#3730A3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        جاري التحميل...
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl" dir="rtl">
      {msgModal && <QuickMessageModal data={msgModal} onClose={() => setMsgModal(null)} />}
      {checklistModal && <DeliveryChecklistModal {...checklistModal} onClose={() => setChecklistModal(null)} />}
      {quoteModal && <QuoteGeneratorModal data={quoteModal} onClose={() => setQuoteModal(null)} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a2e]">إدارة الطلبات</h1>
          <p className="text-gray-500 mt-1">{orders.length} طلب إجمالي</p>
        </div>
        <div className="flex items-center gap-2 bg-[#3730A3]/5 border border-[#3730A3]/20 text-[#3730A3] px-4 py-2.5 rounded-xl text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-[#3730A3] animate-pulse" />
          كل الطلبات تصلك إشعار فوري على بريدك
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all",         label: "الكل" },
          { key: "pending",     label: "انتظار" },
          { key: "in_progress", label: "جاري" },
          { key: "completed",   label: "مكتمل" },
          { key: "cancelled",   label: "ملغي" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilterStatus(key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterStatus === key ? "bg-[#3730A3] text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-[#3730A3]/30"}`}>
            {label}
            <span className={`mr-1.5 text-xs ${filterStatus === key ? "text-white/70" : "text-gray-400"}`}>
              ({counts[key as keyof typeof counts] ?? 0})
            </span>
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو البريد أو نوع التصميم..."
          className="w-full bg-white border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const st = STATUS[order.status as keyof typeof STATUS] || STATUS.pending;
            const isOpen = expanded === order.id;

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setExpanded(isOpen ? null : order.id)}>
                  <div className="w-10 h-10 rounded-xl bg-[#3730A3]/10 text-[#3730A3] font-black text-sm flex items-center justify-center shrink-0">
                    {order.clientName?.[0] || "؟"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-[#1a1a2e] text-sm">{order.clientName}</span>
                      <span className="text-gray-300 text-xs">•</span>
                      <span className="text-[#3730A3] text-xs font-bold">{order.designType}</span>
                    </div>
                    <p className="text-gray-400 text-xs truncate" dir="ltr">{order.clientEmail}</p>
                  </div>
                  <Badge variant="outline" className={`border shrink-0 text-xs font-bold px-3 py-1 ${st.color}`}>
                    {st.label}
                  </Badge>
                  <span className="text-gray-400 text-xs shrink-0 hidden sm:block">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                  <div className="text-gray-400 shrink-0">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      {order.description && (
                        <div>
                          <p className="text-xs text-gray-400 font-bold mb-1">📝 الوصف</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{order.description}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {order.budget && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="text-gray-600">{order.budget}</span>
                          </div>
                        )}
                        {order.deadline && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="text-gray-600">{order.deadline}</span>
                          </div>
                        )}
                        {(order as any).notes && (
                          <div className="text-sm text-gray-500">
                            <span className="font-bold">ملاحظات: </span>{(order as any).notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Select defaultValue={order.status} onValueChange={val => handleStatusChange(order.id, val)}>
                        <SelectTrigger className="w-44 text-sm rounded-xl border-gray-200" dir="rtl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="in_progress">جاري التنفيذ</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Quick send message button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMsgModal({
                            toEmail: order.clientEmail || "",
                            toName: order.clientName || "",
                            orderId: order.id,
                            designType: order.designType || "",
                          });
                        }}
                        className="inline-flex items-center gap-2 bg-[#3730A3] hover:bg-[#1a1a2e] text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                      >
                        <Send size={14} />
                        إرسال رسالة
                      </button>

                      {order.clientPhone && (() => {
                        const clean = String(order.clientPhone).replace(/\s|-/g, "").replace(/^00/, "+").replace(/^\+/, "");
                        const waLink = `https://wa.me/${clean}?text=${encodeURIComponent(`أهلاً ${order.clientName}! 👋\nأنا شهد من شَدِج للتصميم، بخصوص طلبك (${order.designType}) 🎨\nهتكلمك عن التفاصيل إن شاء الله.`)}`;
                        return (
                          <a href={waLink} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                            <Phone size={14} />
                            واتساب
                          </a>
                        );
                      })()}

                      <button
                        onClick={(e) => { e.stopPropagation(); setChecklistModal({ designType: order.designType || "", clientName: order.clientName || "" }); }}
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                      >
                        <ClipboardList size={14} />
                        قائمة التسليم
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); setQuoteModal({ clientName: order.clientName || "", designType: order.designType || "", description: order.description || "", budget: (order as any).budget || "", deadline: (order as any).deadline || "" }); }}
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                      >
                        <FileText size={14} />
                        عرض السعر
                      </button>

                      <CopyButton text={`${order.clientName} | ${order.clientEmail} | ${order.designType}`} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
