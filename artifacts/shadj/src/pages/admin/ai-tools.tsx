import { useState } from "react";
import { Sparkles, Lightbulb, Palette, Share2, Zap, Copy, Check, RefreshCw, ChevronDown } from "lucide-react";
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

      </div>
    </div>
  );
}
