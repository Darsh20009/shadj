import { useState } from "react";
import { ExternalLink, Search, Star, Copy, Check } from "lucide-react";

interface ResourceItem {
  name: string;
  url: string;
  desc: string;
  hot?: boolean;
}

interface ResourceCategory {
  category: string;
  icon: string;
  color: string;
  bg: string;
  items: ResourceItem[];
}

const RESOURCES: ResourceCategory[] = [
  {
    category: "مواقع الإلهام",
    icon: "✨",
    color: "#3730A3",
    bg: "#EEF2FF",
    items: [
      { name: "Behance", url: "https://behance.net", desc: "معرض أعمال المصممين حول العالم", hot: true },
      { name: "Dribbble", url: "https://dribbble.com", desc: "أفضل تصاميم UI وبراندينج" },
      { name: "Pinterest", url: "https://pinterest.com", desc: "مجموعات إلهام لا نهاية لها" },
      { name: "Awwwards", url: "https://awwwards.com", desc: "أفضل مواقع الويب تصميماً" },
      { name: "Lapa Ninja", url: "https://www.lapa.ninja", desc: "إلهام لصفحات الهبوط Landing Pages" },
      { name: "Mobbin", url: "https://mobbin.com", desc: "مكتبة تصاميم تطبيقات موبايل ضخمة" },
    ],
  },
  {
    category: "أدوات تصميم مجانية",
    icon: "🛠️",
    color: "#10b981",
    bg: "#ECFDF5",
    items: [
      { name: "Figma", url: "https://figma.com", desc: "تصميم UI وبروتوتايب احترافي", hot: true },
      { name: "Canva", url: "https://canva.com", desc: "تصميم سريع واحترافي للكل" },
      { name: "Photopea", url: "https://photopea.com", desc: "فوتوشوب اونلاين مجاني بالكامل" },
      { name: "Remove.bg", url: "https://remove.bg", desc: "إزالة الخلفية تلقائياً بذكاء اصطناعي" },
      { name: "Coolors", url: "https://coolors.co", desc: "مولّد لوحات ألوان احترافي" },
      { name: "Vectorizer.ai", url: "https://vectorizer.ai", desc: "تحويل الصور إلى SVG تلقائياً" },
    ],
  },
  {
    category: "خطوط عربية",
    icon: "🔤",
    color: "#f59e0b",
    bg: "#FFFBEB",
    items: [
      { name: "Google Fonts (عربي)", url: "https://fonts.google.com/?subset=arabic", desc: "خطوط عربية مجانية ومرخّصة", hot: true },
      { name: "Arabic Fonts Net", url: "https://arabicfonts.net", desc: "مكتبة ضخمة من الخطوط العربية" },
      { name: "Fontstyle", url: "https://fontstyle.net/arabic-fonts", desc: "خطوط عربية للتحميل" },
      { name: "Almarai Font", url: "https://fonts.google.com/specimen/Almarai", desc: "خط المراعي — أنيق ومقروء" },
      { name: "Cairo Font", url: "https://fonts.google.com/specimen/Cairo", desc: "خط القاهرة — متعدد الأوزان" },
      { name: "Tajawal", url: "https://fonts.google.com/specimen/Tajawal", desc: "خط تجوال — بسيط وعصري" },
    ],
  },
  {
    category: "صور ومتجهات مجانية",
    icon: "🖼️",
    color: "#8b5cf6",
    bg: "#F5F3FF",
    items: [
      { name: "Unsplash", url: "https://unsplash.com", desc: "صور فوتوغرافية عالية الجودة مجانية", hot: true },
      { name: "Pexels", url: "https://pexels.com", desc: "صور وفيديوهات مجانية للتجارة" },
      { name: "Freepik", url: "https://freepik.com", desc: "متجهات وصور و PSD مجانية" },
      { name: "Flaticon", url: "https://flaticon.com", desc: "مكتبة أيقونات SVG ضخمة" },
      { name: "SVG Repo", url: "https://svgrepo.com", desc: "500,000+ أيقونة SVG مجانية" },
      { name: "Storyset", url: "https://storyset.com", desc: "رسوم توضيحية قابلة للتخصيص" },
    ],
  },
  {
    category: "أدوات الذكاء الاصطناعي",
    icon: "🤖",
    color: "#ef4444",
    bg: "#FEF2F2",
    items: [
      { name: "Midjourney", url: "https://midjourney.com", desc: "توليد صور بالذكاء الاصطناعي — الأفضل", hot: true },
      { name: "Adobe Firefly", url: "https://firefly.adobe.com", desc: "ذكاء اصطناعي مدمج في أدوبي" },
      { name: "DALL-E 3", url: "https://openai.com/dall-e-3", desc: "توليد صور من OpenAI" },
      { name: "Clipdrop", url: "https://clipdrop.co", desc: "تحرير الصور وإزالة الخلفية بالذكاء الاصطناعي" },
      { name: "Runway ML", url: "https://runwayml.com", desc: "توليد وتحرير فيديوهات بالذكاء الاصطناعي" },
      { name: "Kling AI", url: "https://klingai.com", desc: "توليد فيديوهات احترافية" },
    ],
  },
  {
    category: "موارد الموشن والفيديو",
    icon: "▶️",
    color: "#0ea5e9",
    bg: "#F0F9FF",
    items: [
      { name: "LottieFiles", url: "https://lottiefiles.com", desc: "مكتبة انيميشن Lottie مجانية", hot: true },
      { name: "Motion Array", url: "https://motionarray.com", desc: "قوالب After Effects و Premiere" },
      { name: "Envato Elements", url: "https://elements.envato.com", desc: "موارد إبداعية شاملة باشتراك" },
      { name: "Mixkit", url: "https://mixkit.co", desc: "فيديوهات وموسيقى وقوالب مجانية" },
      { name: "Panzoid", url: "https://panzoid.com", desc: "انترو وانيميشن مجاني اونلاين" },
      { name: "Kapwing", url: "https://kapwing.com", desc: "تحرير فيديو بسيط اونلاين" },
    ],
  },
  {
    category: "أدوات المطبوعات",
    icon: "🖨️",
    color: "#f97316",
    bg: "#FFF7ED",
    items: [
      { name: "MockupWorld", url: "https://www.mockupworld.co", desc: "موكب موارد مجانية احترافية", hot: true },
      { name: "Smartmockups", url: "https://smartmockups.com", desc: "موكب اونلاين سريع وسهل" },
      { name: "The Noun Project", url: "https://thenounproject.com", desc: "أيقونات احترافية لكل شيء" },
      { name: "Brand Colors", url: "https://brandcolors.net", desc: "ألوان الشركات الكبرى" },
      { name: "Coolors PDF", url: "https://coolors.co/palettes", desc: "لوحات ألوان جاهزة للاستخدام" },
      { name: "Adobe Color", url: "https://color.adobe.com", desc: "مولّد ألوان وعجلة الألوان من أدوبي" },
    ],
  },
  {
    category: "مجتمعات المصممين",
    icon: "👥",
    color: "#6366f1",
    bg: "#EEF2FF",
    items: [
      { name: "Khaled Ahmed Arabic", url: "https://www.behance.net/khaledahmed", desc: "أعمال خالد أحمد — إلهام عربي" },
      { name: "Design Resources AR", url: "https://t.me/designresourcesAR", desc: "تيليجرام موارد تصميم بالعربية" },
      { name: "SiteInspire", url: "https://www.siteinspire.com", desc: "إلهام ويب متميز" },
      { name: "Designer News", url: "https://www.designernews.co", desc: "أخبار وموارد مجتمع المصممين" },
    ],
  },
];

function ResourceCard({ item, color }: { item: ResourceItem; color: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group flex items-start justify-between gap-2 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            className="font-bold text-sm hover:underline transition-colors"
            style={{ color }}>
            {item.name}
          </a>
          {item.hot && (
            <span className="flex items-center gap-0.5 text-[10px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-100">
              <Star size={8} fill="currentColor" /> hot
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
      </div>
      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => { navigator.clipboard.writeText(item.url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="نسخ الرابط">
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
        </button>
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

export default function AdminResources() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = RESOURCES.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.includes(search)
    ),
  })).filter(cat =>
    (!activeCategory || cat.category === activeCategory) && cat.items.length > 0
  );

  const totalItems = RESOURCES.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a2e]">موارد المصمم</h1>
          <p className="text-gray-500 mt-1">{totalItems} مورد منظّم في {RESOURCES.length} تصنيفات — كل ما تحتاجه في مكان واحد</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ابحث في الموارد..."
            className="w-full bg-white border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!activeCategory ? "bg-[#1a1a2e] text-white shadow" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
          الكل
        </button>
        {RESOURCES.map(cat => (
          <button key={cat.category} onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === cat.category ? "text-white shadow" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
            style={activeCategory === cat.category ? { background: cat.color } : {}}>
            <span>{cat.icon}</span>
            <span>{cat.category}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-400 font-medium">لا توجد نتائج للبحث "{search}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(cat => (
            <div key={cat.category} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50" style={{ background: cat.bg }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm bg-white/70">
                  {cat.icon}
                </div>
                <div>
                  <h2 className="font-black text-sm" style={{ color: cat.color }}>{cat.category}</h2>
                  <p className="text-xs text-gray-400">{cat.items.length} مورد</p>
                </div>
              </div>
              <div className="p-2">
                {cat.items.map(item => (
                  <ResourceCard key={item.name} item={item} color={cat.color} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-gray-300 mt-10 pb-4">
        جميع الموارد مختارة بعناية لدعم مصممي شَدِج ✨
      </p>
    </div>
  );
}
