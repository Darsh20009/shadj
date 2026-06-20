import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useListPortfolio, useGetCategories } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [cols, setCols] = useState(3);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useGetCategories();
  const { data: works = [], isLoading } = useListPortfolio(
    activeCategory !== "الكل" ? { category: activeCategory } : {}
  );

  useEffect(() => {
    if (isLoading || !gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".pitem");
    gsap.fromTo(items,
      { opacity: 0, y: 50, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.07, ease: "power3.out", clearProps: "all" }
    );
  }, [works, isLoading, activeCategory]);

  const allCats = ["الكل", ...categories.map(c => c.category)];

  return (
    <div className="min-h-screen bg-[#0f0e1a] pt-28 pb-20">
      {/* Header */}
      <div className="container mx-auto px-6 mb-12 text-center">
        <span className="inline-block text-[#F5E6C8] text-sm font-bold tracking-widest uppercase mb-4">Our Work</span>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4">كل شغلنا هنا</h1>
        <p className="text-gray-400 text-lg">٤٦+ مشروع — من هويات لبوسترات لسوشيال ميديا</p>
      </div>

      {/* Category Filters */}
      <div className="container mx-auto px-6 mb-10">
        <div className="flex flex-wrap justify-center gap-3">
          {allCats.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeCategory === cat
                  ? "bg-[#F5E6C8] text-[#1a1a2e] shadow-lg shadow-[#F5E6C8]/20"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({length:12}).map((_,i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {works.map((work, i) => {
              const tall = i % 7 === 0 || i % 11 === 0;
              return (
                <div
                  key={work.id}
                  className={`pitem group relative overflow-hidden rounded-xl cursor-pointer ${tall ? "row-span-2" : ""}`}
                  style={{aspectRatio: tall ? "3/4" : "1/1"}}
                  onClick={() => setSelectedWork(work)}
                >
                  <img
                    src={work.imageUrl}
                    alt={work.titleAr}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-[#F5E6C8] text-[10px] font-bold uppercase tracking-wider mb-0.5">{work.category}</p>
                    <h3 className="text-white font-bold text-sm leading-tight">{work.titleAr}</h3>
                    <p className="text-gray-300 text-xs mt-0.5">{work.clientName}</p>
                  </div>
                  {work.featured && (
                    <div className="absolute top-3 right-3 bg-[#F5E6C8] text-[#1a1a2e] text-[10px] font-black px-2 py-0.5 rounded-full">مميز</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {works.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-20 text-lg">مفيش أعمال في الفئة دي حالياً</div>
        )}
      </div>

      {/* Work Detail Modal */}
      <Dialog open={!!selectedWork} onOpenChange={(open) => !open && setSelectedWork(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-[#0f0e1a] border border-white/10 rounded-2xl">
          <DialogTitle className="sr-only">{selectedWork?.titleAr}</DialogTitle>
          {selectedWork && (
            <div className="flex flex-col md:flex-row max-h-[90vh]">
              <div className="md:w-2/3 bg-black flex items-center justify-center">
                <img src={selectedWork.imageUrl} alt={selectedWork.titleAr} className="w-full h-full object-contain max-h-[90vh]" />
              </div>
              <div className="md:w-1/3 p-8 flex flex-col text-white overflow-y-auto">
                <div className="inline-block bg-[#F5E6C8] text-[#1a1a2e] text-xs font-black px-3 py-1 rounded-full mb-4 self-start">{selectedWork.category}</div>
                <h2 className="text-3xl font-black mb-2">{selectedWork.titleAr}</h2>
                <p className="text-gray-400 text-sm mb-6">{selectedWork.title}</p>
                <div className="space-y-4 flex-1">
                  <div><p className="text-gray-500 text-xs mb-1">العميل</p><p className="font-bold">{selectedWork.clientName}</p></div>
                  {selectedWork.designer && <div><p className="text-gray-500 text-xs mb-1">المصمم</p><p className="font-medium">{selectedWork.designer}</p></div>}
                  {selectedWork.description && <div><p className="text-gray-500 text-xs mb-1">تفاصيل</p><p className="text-gray-300 text-sm leading-relaxed">{selectedWork.description}</p></div>}
                </div>
                <button onClick={() => setSelectedWork(null)} className="mt-8 w-full py-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors text-sm font-medium">إغلاق</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
