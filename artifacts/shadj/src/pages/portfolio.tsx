import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useListPortfolio, useGetCategories } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<string>("الكل");
  const [selectedWork, setSelectedWork] = useState<any>(null);

  const { data: categories = [], isLoading: catsLoading } = useGetCategories();
  const { data: works = [], isLoading: worksLoading } = useListPortfolio(
    activeCategory !== "الكل" ? { category: activeCategory } : {}
  );

  useEffect(() => {
    if (worksLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".portfolio-item",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, [works, worksLoading]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-black text-[#1a1a2e] mb-12 text-center">معرض الأعمال</h1>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveCategory("الكل")}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeCategory === "الكل" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            الكل
          </button>
          {categories.map(cat => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                activeCategory === cat.category ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Grid */}
        {worksLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-gray-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work) => (
              <div 
                key={work.id} 
                className="portfolio-item group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                onClick={() => setSelectedWork(work)}
              >
                <img src={work.imageUrl} alt={work.titleAr} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/90 via-[#1a1a2e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{work.titleAr}</h3>
                  <p className="text-[#F5E6C8] translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{work.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {works.length === 0 && !worksLoading && (
          <div className="text-center text-gray-500 py-20">لا توجد أعمال في هذا التصنيف حالياً.</div>
        )}

        {/* Modal */}
        <Dialog open={!!selectedWork} onOpenChange={(open) => !open && setSelectedWork(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#1a1a2e] text-white border-none rounded-2xl">
            <DialogTitle className="sr-only">{selectedWork?.titleAr}</DialogTitle>
            {selectedWork && (
              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                <div className="md:w-2/3 bg-black">
                  <img src={selectedWork.imageUrl} alt={selectedWork.titleAr} className="w-full h-full object-contain" />
                </div>
                <div className="md:w-1/3 p-8 flex flex-col overflow-y-auto">
                  <span className="text-[#F5E6C8] text-sm font-bold mb-2">{selectedWork.category}</span>
                  <h2 className="text-3xl font-black mb-6">{selectedWork.titleAr}</h2>
                  
                  <div className="space-y-6 flex-1">
                    <div>
                      <h4 className="text-gray-400 text-sm mb-1">العميل</h4>
                      <p className="font-medium text-lg">{selectedWork.clientName}</p>
                    </div>
                    {selectedWork.description && (
                      <div>
                        <h4 className="text-gray-400 text-sm mb-2">عن المشروع</h4>
                        <p className="text-gray-300 leading-relaxed">{selectedWork.description}</p>
                      </div>
                    )}
                    {selectedWork.designer && (
                      <div>
                        <h4 className="text-gray-400 text-sm mb-1">المصمم</h4>
                        <p className="font-medium">{selectedWork.designer}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <button onClick={() => setSelectedWork(null)} className="w-full py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors">إغلاق</button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
