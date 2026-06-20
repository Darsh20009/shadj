import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useListPortfolio, useGetCategories } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSEO } from "@/hooks/useSEO";
import { getImgUrl } from "@/lib/utils";

const GRID_PATTERNS = [
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-2",
];

const ACCENT_COLORS = [
  "from-[#F5E6C8]/40",
  "from-purple-500/40",
  "from-blue-500/40",
  "from-rose-500/40",
  "from-amber-500/40",
  "from-emerald-500/40",
  "from-cyan-500/40",
  "from-fuchsia-500/40",
];

export default function Portfolio() {
  useSEO({
    title: "أعمالنا — معرض تصاميم شدج للجرافيك",
    description: "شوف +46 مشروع حقيقي من تصاميم شدج — هوية بصرية، بوسترات إعلانية، سوشيال ميديا، مطبوعات، وتغليف.",
    keywords: "أعمال تصميم جرافيك, بوسترات, هوية بصرية, سوشيال ميديا, معرض أعمال",
    canonical: "/portfolio",
  });

  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: rawWorks, isLoading } = useListPortfolio();
  const { data: rawCategories } = useGetCategories();

  const allWorks = Array.isArray(rawWorks) ? rawWorks : [];
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  const works = activeCategory === "الكل"
    ? allWorks
    : allWorks.filter(w => w.category === activeCategory);

  const allCats = ["الكل", ...categories.map(c => c.category)];

  useEffect(() => {
    if (isLoading || !gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".pitem");
    gsap.fromTo(items,
      { opacity: 0, scale: 0.88, filter: "blur(8px)" },
      {
        opacity: 1, scale: 1, filter: "blur(0px)",
        duration: 0.6, stagger: 0.04, ease: "power3.out",
        clearProps: "all"
      }
    );
  }, [works, isLoading, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0914] pt-24 pb-20" dir="rtl">

      {/* ═══ HEADER ═══ */}
      <div className="container mx-auto px-6 mb-14 text-center relative">
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#F5E6C8]/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#F5E6C8]/50" />
            <span className="text-[#F5E6C8]/60 text-[11px] font-black tracking-[0.4em] uppercase">Our Work</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#F5E6C8]/50" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-2">
            كل <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#F5E6C8] to-[#d4b896]">شغلنا</span>
          </h1>
          <h1 className="text-6xl md:text-8xl font-black text-white/10 leading-none mb-6">هنا.</h1>
          <p className="text-gray-500 text-base">{allWorks.length}+ مشروع حقيقي مع عملاء حقيقيين</p>
        </div>
      </div>

      {/* ═══ FILTER TABS ═══ */}
      <div className="container mx-auto px-6 mb-10">
        <div className="flex flex-wrap justify-center gap-2">
          {allCats.map(cat => {
            const count = cat === "الكل" ? allWorks.length : allWorks.filter(w => w.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative group flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-[#F5E6C8] text-[#0a0914]"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/8"
                }`}
              >
                {cat}
                <span className={`text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-black ${
                  isActive ? "bg-[#0a0914]/20 text-[#0a0914]" : "bg-white/10 text-white/50"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ CREATIVE GRID ═══ */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-4 gap-2 auto-rows-[180px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`${GRID_PATTERNS[i % GRID_PATTERNS.length]} bg-white/4 rounded-2xl animate-pulse`} />
            ))}
          </div>
        ) : works.length === 0 ? (
          <div className="text-center text-gray-600 py-24">
            <div className="text-5xl mb-4">◈</div>
            <p className="text-base">لا يوجد أعمال في هذه الفئة</p>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 auto-rows-[200px] md:auto-rows-[220px]"
          >
            {works.map((work, i) => {
              const pattern = GRID_PATTERNS[i % GRID_PATTERNS.length];
              const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
              return (
                <div
                  key={work.id}
                  className={`pitem ${pattern} group relative overflow-hidden rounded-2xl cursor-pointer`}
                  onClick={() => setSelectedWork(work)}
                >
                  {/* Image */}
                  <img
                    src={getImgUrl(work.imageUrl)}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Hover: graphical overlay — NO text */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${accent} to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-400`} />

                  {/* Hover: centered icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 scale-75 group-hover:scale-100">
                    <div className="w-14 h-14 rounded-full border-2 border-white/80 backdrop-blur-sm flex items-center justify-center bg-white/10">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                      </svg>
                    </div>
                  </div>

                  {/* Hover: corner decorative lines */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white/60 rounded-tr-sm" />
                  </div>
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-5 h-5 border-b-2 border-l-2 border-white/60 rounded-bl-sm" />
                  </div>

                  {/* Featured: subtle glow badge only (no text) */}
                  {work.featured && (
                    <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#F5E6C8] shadow-[0_0_8px_3px_rgba(245,230,200,0.5)]" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ WORK DETAIL MODAL ═══ */}
      <Dialog open={!!selectedWork} onOpenChange={open => !open && setSelectedWork(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-[#0a0914] border border-white/10 rounded-3xl">
          <DialogTitle className="sr-only">{selectedWork?.titleAr}</DialogTitle>
          {selectedWork && (
            <div className="flex flex-col md:flex-row max-h-[90vh]">
              {/* Image side */}
              <div className="md:w-[60%] bg-black flex items-center justify-center min-h-[280px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6C8]/5 to-transparent" />
                <img
                  src={getImgUrl(selectedWork.imageUrl)}
                  alt={selectedWork.titleAr}
                  className="w-full h-full object-contain max-h-[90vh] relative z-10"
                />
              </div>

              {/* Info side */}
              <div className="md:w-[40%] p-8 flex flex-col text-white overflow-y-auto bg-[#0d0c1e]" dir="rtl">
                <div className="inline-flex items-center gap-2 mb-6 self-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5E6C8]" />
                  <span className="text-[#F5E6C8] text-xs font-black">{selectedWork.category}</span>
                </div>

                <h2 className="text-2xl font-black mb-2 leading-tight text-white">{selectedWork.titleAr}</h2>
                {selectedWork.title && (
                  <p className="text-gray-600 text-xs mb-6 font-medium">{selectedWork.title}</p>
                )}

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 py-3 border-b border-white/5">
                    <span className="text-gray-600 text-xs w-16 shrink-0">العميل</span>
                    <span className="font-bold text-sm">{selectedWork.clientName}</span>
                  </div>
                  {selectedWork.designer && (
                    <div className="flex items-center gap-3 py-3 border-b border-white/5">
                      <span className="text-gray-600 text-xs w-16 shrink-0">المصمم</span>
                      <span className="font-medium text-sm">{selectedWork.designer}</span>
                    </div>
                  )}
                  {selectedWork.description && (
                    <div className="py-3">
                      <span className="text-gray-600 text-xs block mb-2">التفاصيل</span>
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedWork.description}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-2">
                  <a
                    href={`https://wa.me/201129085243?text=${encodeURIComponent(`أريد تصميم مثل: ${selectedWork.titleAr}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-[#F5E6C8] hover:bg-[#e8d4b0] text-[#0a0914] text-center py-3 rounded-xl font-black text-sm transition-colors"
                  >
                    أطلب مثيل ده ←
                  </a>
                  <button
                    onClick={() => setSelectedWork(null)}
                    className="w-12 h-12 border border-white/10 hover:bg-white/8 rounded-xl flex items-center justify-center transition-colors text-gray-400 shrink-0 self-center"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
