import { useState } from "react";
import { Sparkles, Lightbulb, Palette, Share2, Zap, Copy, Check, RefreshCw, ChevronDown, Tag, Calculator, Ruler, Type } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function token() { return localStorage.getItem("shadj_token") || ""; }

async function callAI(endpoint: string, body: object): Promise<string> {
  const r = await fetch(`/api/ai/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "خطأ في الخدمة");
  return data.result || data.brief || "";
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#3730A3] transition-colors px-2 py-1 rounded-lg hover:bg-[#3730A3]/5">
      {copied ? <><Check size={12} className="text-green-500" /> نُسخ</> : <><Copy size={12} /> نسخ</>}
    </button>
  );
}

function ResultBox({ result }: { result: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-[#3730A3]/20 bg-[#3730A3]/3 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#3730A3]/10 bg-[#3730A3]/5">
        <span className="text-xs font-bold text-[#3730A3] flex items-center gap-1.5"><Sparkles size={12} /> النتيجة</span>
        <CopyBtn text={result} />
      </div>
      <div className="p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">{result}</div>
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all text-sm";
const btnCls = "w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md";

function ToolCard({ icon, color, title, desc, children }: { icon: React.ReactNode; color: string; title: string; desc: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 p-5 text-right hover:bg-gray-50 transition-colors">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: color + "18" }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-[#1a1a2e] text-base">{title}</p>
          <p className="text-gray-400 text-sm mt-0.5">{desc}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-50 pt-4">{children}</div>}
    </div>
  );
}

export default function AdminAITools() {
  const { toast } = useToast();

  const [briefForm, setBriefForm] = useState({ clientName: "", industry: "", designType: "", goals: "" });
  const [briefResult, setBriefResult] = useState("");
  const [briefLoading, setBriefLoading] = useState(false);

  const [ideasForm, setIdeasForm] = useState({ designType: "", industry: "", brand: "" });
  const [ideasResult, setIdeasResult] = useState("");
  const [ideasLoading, setIdeasLoading] = useState(false);

  const [colorForm, setColorForm] = useState({ brand: "", mood: "", industry: "" });
  const [colorResult, setColorResult] = useState("");
  const [colorLoading, setColorLoading] = useState(false);

  const [socialForm, setSocialForm] = useState({ platform: "إنستقرام", topic: "", tone: "احترافي ومميز", brand: "" });
  const [socialResult, setSocialResult] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);

  const [brandForm, setBrandForm] = useState({ brandName: "", description: "", competitors: "" });
  const [brandResult, setBrandResult] = useState("");
  const [brandLoading, setBrandLoading] = useState(false);

  const [taglineForm, setTaglineForm] = useState({ brandName: "", industry: "", tone: "جريء وملهم" });
  const [taglineResult, setTaglineResult] = useState("");
  const [taglineLoading, setTaglineLoading] = useState(false);

  const [fontForm, setFontForm] = useState({ brandStyle: "أنيق وراقي", industry: "", language: "عربي" });
  const [fontResult, setFontResult] = useState("");
  const [fontLoading, setFontLoading] = useState(false);

  const PRICING_TYPES: Record<string, [number, number]> = {
    "هوية بصرية": [1500, 5000],
    "بوسترات": [200, 800],
    "سوشيال ميديا": [800, 3000],
    "حملات إعلانية": [2000, 8000],
    "تصميم فيديوهات": [1500, 6000],
    "مطبوعات": [300, 1500],
  };
  const COMPLEXITY_MUL = [1, 1.3, 1.7, 2.2, 3];
  const [priceType, setPriceType] = useState("هوية بصرية");
  const [priceComplexity, setPriceComplexity] = useState(2);
  const [priceUrgent, setPriceUrgent] = useState(false);
  const [priceRevisions, setPriceRevisions] = useState(2);

  const calcPrice = () => {
    const [low, high] = PRICING_TYPES[priceType] || [500, 2000];
    const mul = COMPLEXITY_MUL[priceComplexity - 1] || 1;
    const urgencyMul = priceUrgent ? 1.5 : 1;
    const revisionMul = priceRevisions > 2 ? 1 + (priceRevisions - 2) * 0.1 : 1;
    return {
      min: Math.round(low * mul * urgencyMul * revisionMul / 50) * 50,
      max: Math.round(high * mul * urgencyMul * revisionMul / 50) * 50,
    };
  };

  const PLATFORM_SIZES = [
    { platform: "إنستقرام", icon: "📸", sizes: [
      { name: "بوست مربع", dims: "1080 × 1080", note: "1:1" },
      { name: "بوست عمودي", dims: "1080 × 1350", note: "4:5" },
      { name: "ستوري / ريلز", dims: "1080 × 1920", note: "9:16" },
    ]},
    { platform: "فيسبوك", icon: "👤", sizes: [
      { name: "بوست شير", dims: "1200 × 628", note: "1.91:1" },
      { name: "غلاف الصفحة", dims: "820 × 312", note: "—" },
      { name: "ستوري", dims: "1080 × 1920", note: "9:16" },
    ]},
    { platform: "تيك توك", icon: "🎵", sizes: [
      { name: "فيديو", dims: "1080 × 1920", note: "9:16" },
      { name: "صورة غلاف", dims: "800 × 800", note: "1:1" },
    ]},
    { platform: "لينكدإن", icon: "💼", sizes: [
      { name: "بوست", dims: "1200 × 627", note: "1.91:1" },
      { name: "غلاف الشركة", dims: "1128 × 191", note: "—" },
    ]},
    { platform: "يوتيوب", icon: "▶️", sizes: [
      { name: "ثامبنيل", dims: "1280 × 720", note: "16:9" },
      { name: "غلاف القناة", dims: "2560 × 1440", note: "—" },
    ]},
    { platform: "مطبوعات", icon: "🖨️", sizes: [
      { name: "A4", dims: "2480 × 3508 px", note: "210×297mm" },
      { name: "A3", dims: "3508 × 4961 px", note: "297×420mm" },
      { name: "كارت شخصي", dims: "1004 × 650 px", note: "85×55mm" },
      { name: "بانر 3×1م", dims: "3000 × 1000 mm", note: "300dpi" },
    ]},
  ];

  async function run(endpoint: string, body: object, setResult: (v: string) => void, setLoading: (v: boolean) => void) {
    setLoading(true);
    setResult("");
    try {
      const res = await callAI(endpoint, body);
      setResult(res);
    } catch (e: any) {
      toast({ title: e.message || "خطأ في الخدمة", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8" dir="rtl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3730A3] to-[#7c3aed] flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1a1a2e]">أدوات شدجتي الذكية</h1>
            <p className="text-gray-400 text-sm">ذكاء اصطناعي متخصص في التصميم الجرافيكي</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 bg-gradient-to-l from-[#3730A3]/5 to-[#7c3aed]/5 border border-[#3730A3]/15 rounded-2xl px-4 py-3">
          <Zap size={16} className="text-[#7c3aed]" />
          <p className="text-sm text-[#3730A3] font-medium">مدعوم بـ Moonshot AI — متخصص في الإبداع البصري والتصميم بالعربية</p>
        </div>
      </div>

      <div className="space-y-4">

        {/* 1. Design Brief */}
        <ToolCard icon={<Sparkles size={22} />} color="#3730A3" title="موجز التصميم الذكي" desc="اكتب موجز تصميم احترافي لأي عميل في ثوانٍ">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">اسم العميل</label>
              <input value={briefForm.clientName} onChange={e => setBriefForm(f => ({ ...f, clientName: e.target.value }))} placeholder="اسم العميل" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">نوع التصميم</label>
              <input value={briefForm.designType} onChange={e => setBriefForm(f => ({ ...f, designType: e.target.value }))} placeholder="مثال: هوية بصرية" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">المجال</label>
              <input value={briefForm.industry} onChange={e => setBriefForm(f => ({ ...f, industry: e.target.value }))} placeholder="مثال: مطاعم، عقارات" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">الهدف</label>
              <input value={briefForm.goals} onChange={e => setBriefForm(f => ({ ...f, goals: e.target.value }))} placeholder="مثال: بناء ثقة العملاء" className={inputCls} />
            </div>
          </div>
          <button onClick={() => run("brief", briefForm, setBriefResult, setBriefLoading)} disabled={briefLoading}
            className={btnCls} style={{ background: "linear-gradient(135deg,#3730A3,#6366f1)" }}>
            {briefLoading ? <><RefreshCw size={14} className="animate-spin" /> جاري التوليد...</> : <><Sparkles size={14} /> توليد الموجز</>}
          </button>
          {briefResult && <ResultBox result={briefResult} />}
        </ToolCard>

        {/* 2. Creative Ideas */}
        <ToolCard icon={<Lightbulb size={22} />} color="#f59e0b" title="مولّد الأفكار الإبداعية" desc="5 أفكار جريئة وغير تقليدية لأي تصميم">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">نوع التصميم</label>
              <input value={ideasForm.designType} onChange={e => setIdeasForm(f => ({ ...f, designType: e.target.value }))} placeholder="بوسترات، هوية..." className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">المجال</label>
              <input value={ideasForm.industry} onChange={e => setIdeasForm(f => ({ ...f, industry: e.target.value }))} placeholder="فاشون، تقنية..." className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">اسم البراند</label>
              <input value={ideasForm.brand} onChange={e => setIdeasForm(f => ({ ...f, brand: e.target.value }))} placeholder="اسم العلامة" className={inputCls} />
            </div>
          </div>
          <button onClick={() => run("ideas", ideasForm, setIdeasResult, setIdeasLoading)} disabled={ideasLoading}
            className={btnCls} style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
            {ideasLoading ? <><RefreshCw size={14} className="animate-spin" /> جاري التوليد...</> : <><Lightbulb size={14} /> توليد الأفكار</>}
          </button>
          {ideasResult && <ResultBox result={ideasResult} />}
        </ToolCard>

        {/* 3. Color Palette */}
        <ToolCard icon={<Palette size={22} />} color="#10b981" title="مقترح لوحة الألوان" desc="ألوان احترافية مع كودات HEX ونسب الاستخدام">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">اسم البراند</label>
              <input value={colorForm.brand} onChange={e => setColorForm(f => ({ ...f, brand: e.target.value }))} placeholder="اسم البراند" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">المزاج / الإحساس</label>
              <input value={colorForm.mood} onChange={e => setColorForm(f => ({ ...f, mood: e.target.value }))} placeholder="مثال: فاخر، عصري" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">المجال</label>
              <input value={colorForm.industry} onChange={e => setColorForm(f => ({ ...f, industry: e.target.value }))} placeholder="مثال: رعاية صحية" className={inputCls} />
            </div>
          </div>
          <button onClick={() => run("colors", colorForm, setColorResult, setColorLoading)} disabled={colorLoading}
            className={btnCls} style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
            {colorLoading ? <><RefreshCw size={14} className="animate-spin" /> جاري التوليد...</> : <><Palette size={14} /> اقتراح الألوان</>}
          </button>
          {colorResult && <ResultBox result={colorResult} />}
        </ToolCard>

        {/* 4. Social Content */}
        <ToolCard icon={<Share2 size={22} />} color="#8b5cf6" title="كاتب محتوى السوشيال" desc="3 نسخ محتوى جاهزة مع هاشتاجات لأي منصة">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">المنصة</label>
              <select value={socialForm.platform} onChange={e => setSocialForm(f => ({ ...f, platform: e.target.value }))} className={inputCls}>
                {["إنستقرام", "تيك توك", "لينكدإن", "فيسبوك", "تويتر X", "بينتيريست"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">الأسلوب</label>
              <select value={socialForm.tone} onChange={e => setSocialForm(f => ({ ...f, tone: e.target.value }))} className={inputCls}>
                {["احترافي ومميز", "مرح وخفيف", "ملهم وعاطفي", "مثير وجريء", "بسيط وواضح"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">موضوع المنشور</label>
              <input value={socialForm.topic} onChange={e => setSocialForm(f => ({ ...f, topic: e.target.value }))} placeholder="مثال: إطلاق منتج جديد" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">اسم البراند</label>
              <input value={socialForm.brand} onChange={e => setSocialForm(f => ({ ...f, brand: e.target.value }))} placeholder="اسم العلامة التجارية" className={inputCls} />
            </div>
          </div>
          <button onClick={() => run("social", socialForm, setSocialResult, setSocialLoading)} disabled={socialLoading}
            className={btnCls} style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)" }}>
            {socialLoading ? <><RefreshCw size={14} className="animate-spin" /> جاري التوليد...</> : <><Share2 size={14} /> توليد المحتوى</>}
          </button>
          {socialResult && <ResultBox result={socialResult} />}
        </ToolCard>

        {/* 5. Brand Analysis */}
        <ToolCard icon={<Zap size={22} />} color="#ef4444" title="محلّل الهوية البصرية" desc="تحليل براندينج احترافي مع توصيات إبداعية وتاجلاين مقترح">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">اسم البراند</label>
              <input value={brandForm.brandName} onChange={e => setBrandForm(f => ({ ...f, brandName: e.target.value }))} placeholder="اسم العلامة التجارية" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">المنافسون</label>
              <input value={brandForm.competitors} onChange={e => setBrandForm(f => ({ ...f, competitors: e.target.value }))} placeholder="أسماء المنافسين" className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1.5">وصف النشاط والرسالة</label>
              <textarea value={brandForm.description} onChange={e => setBrandForm(f => ({ ...f, description: e.target.value }))}
                rows={2} placeholder="اوصف النشاط التجاري ورسالة البراند..."
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3730A3] resize-none transition-all text-sm" />
            </div>
          </div>
          <button onClick={() => run("brand-analysis", brandForm, setBrandResult, setBrandLoading)} disabled={brandLoading}
            className={btnCls} style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}>
            {brandLoading ? <><RefreshCw size={14} className="animate-spin" /> جاري التحليل...</> : <><Zap size={14} /> تحليل البراند</>}
          </button>
          {brandResult && <ResultBox result={brandResult} />}
        </ToolCard>

        {/* 6. Tagline Generator */}
        <ToolCard icon={<Tag size={22} />} color="#0ea5e9" title="مولّد التاج لاين والشعار" desc="7 خيارات تاج لاين مبدعة وقوية تحفر في ذاكرة العملاء">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">اسم البراند</label>
              <input value={taglineForm.brandName} onChange={e => setTaglineForm(f => ({ ...f, brandName: e.target.value }))} placeholder="مثال: شدج" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">المجال</label>
              <input value={taglineForm.industry} onChange={e => setTaglineForm(f => ({ ...f, industry: e.target.value }))} placeholder="مثال: تصميم جرافيك" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">الطابع</label>
              <select value={taglineForm.tone} onChange={e => setTaglineForm(f => ({ ...f, tone: e.target.value }))} className={inputCls}>
                {["جريء وملهم", "بسيط وأنيق", "مرح وقريب", "فاخر وحصري", "إبداعي وغير تقليدي"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button onClick={() => run("tagline", taglineForm, setTaglineResult, setTaglineLoading)} disabled={taglineLoading}
            className={btnCls} style={{ background: "linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
            {taglineLoading ? <><RefreshCw size={14} className="animate-spin" /> جاري التوليد...</> : <><Tag size={14} /> توليد التاج لاين</>}
          </button>
          {taglineResult && <ResultBox result={taglineResult} />}
        </ToolCard>

        {/* 7. Pricing Calculator */}
        <ToolCard icon={<Calculator size={22} />} color="#f97316" title="حاسبة أسعار التصميم" desc="احسب السعر المقترح لأي مشروع بناءً على التعقيد والإلحاح والمراجعات">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">نوع التصميم</label>
                <select value={priceType} onChange={e => setPriceType(e.target.value)} className={inputCls}>
                  {Object.keys(PRICING_TYPES).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">عدد المراجعات المسموحة</label>
                <select value={priceRevisions} onChange={e => setPriceRevisions(Number(e.target.value))} className={inputCls}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} مراجعة{n === 1 ? "" : n === 2 ? "ان" : "ات"}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">مستوى التعقيد — {["بسيط جداً","بسيط","متوسط","معقد","معقد جداً"][priceComplexity-1]}</label>
              <input type="range" min={1} max={5} value={priceComplexity} onChange={e => setPriceComplexity(Number(e.target.value))}
                className="w-full accent-[#f97316]" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>بسيط جداً</span><span>متوسط</span><span>معقد جداً</span>
              </div>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input type="checkbox" checked={priceUrgent} onChange={e => setPriceUrgent(e.target.checked)}
                className="w-4 h-4 accent-[#f97316] rounded" />
              <span className="text-sm font-bold text-gray-600">تسليم عاجل خلال 3 أيام (+50%)</span>
            </label>
            {(() => {
              const { min, max } = calcPrice();
              return (
                <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)" }}>
                  <p className="text-xs font-bold text-orange-400 mb-1">السعر المقترح</p>
                  <p className="text-3xl font-black text-orange-600">{min.toLocaleString("ar-EG")} – {max.toLocaleString("ar-EG")}</p>
                  <p className="text-sm text-orange-400 font-medium mt-0.5">جنيه مصري</p>
                  <p className="text-[11px] text-gray-400 mt-3">هذا تقدير استرشادي • الأسعار النهائية تحدد بعد معرفة تفاصيل المشروع الكاملة</p>
                </div>
              );
            })()}
          </div>
        </ToolCard>

        {/* 9. Font Pairing */}
        <ToolCard icon={<Type size={22} />} color="#14b8a6" title="مزاوج الخطوط العربية" desc="4 تركيبات خطوط احترافية مقترحة حسب طابع براندك ومجالك">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">أسلوب البراند</label>
              <select value={fontForm.brandStyle} onChange={e => setFontForm(f => ({ ...f, brandStyle: e.target.value }))} className={inputCls}>
                {["أنيق وراقي", "عصري وجريء", "بسيط ومينيمال", "مرح وشبابي", "تراثي وعربي", "فاخر وحصري", "ودود ومحلي"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">المجال</label>
              <input value={fontForm.industry} onChange={e => setFontForm(f => ({ ...f, industry: e.target.value }))} placeholder="مثال: مطعم، عيادة، أزياء" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">اللغة الرئيسية</label>
              <select value={fontForm.language} onChange={e => setFontForm(f => ({ ...f, language: e.target.value }))} className={inputCls}>
                {["عربي", "إنجليزي", "ثنائي (عربي + إنجليزي)"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <button onClick={() => run("font-pairing", fontForm, setFontResult, setFontLoading)} disabled={fontLoading}
            className={btnCls} style={{ background: "linear-gradient(135deg,#14b8a6,#0d9488)" }}>
            {fontLoading ? <><RefreshCw size={14} className="animate-spin" /> جاري الاقتراح...</> : <><Type size={14} /> اقتراح مزاوجة الخطوط</>}
          </button>
          {fontResult && <ResultBox result={fontResult} />}
        </ToolCard>

        {/* 8. Platform Sizes Reference */}
        <ToolCard icon={<Ruler size={22} />} color="#7c3aed" title="مرجع مقاسات المنصات" desc="كل مقاسات السوشيال ميديا والمطبوعات في مكان واحد — جاهز للنسخ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PLATFORM_SIZES.map(({ platform, icon, sizes }) => (
              <div key={platform} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-base">{icon}</span>
                  <span className="font-black text-[#1a1a2e] text-sm">{platform}</span>
                </div>
                <div className="space-y-1.5">
                  {sizes.map(s => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{s.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#3730A3] text-[11px]">{s.dims}</span>
                        {s.note !== "—" && <span className="text-gray-300 text-[10px]">{s.note}</span>}
                        <button onClick={() => navigator.clipboard.writeText(s.dims)}
                          className="text-gray-300 hover:text-[#3730A3] transition-colors p-0.5 rounded">
                          <Copy size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ToolCard>

      </div>
    </div>
  );
}
