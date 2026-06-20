import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGetFeaturedWorks, useGetCategories } from "@workspace/api-client-react";
import { SplashScreen } from "@/components/SplashScreen";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_WORDS = ["إبداع","Design","شدج","Graphic","أسلوب","Identity","حرفة","Vision","جرافيك","Creative"];

export default function Home() {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("shadj_splash_seen"));
  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { data: featuredWorks = [] } = useGetFeaturedWorks();
  const { data: categories = [] } = useGetCategories();

  useEffect(() => {
    if (showSplash) return;
    const ctx = gsap.context(() => {
      // Hero chars
      gsap.fromTo(".hero-char", { opacity:0, y:80, rotateX:-60 }, { opacity:1, y:0, rotateX:0, duration:1, stagger:0.06, ease:"back.out(1.7)", delay:0.3 });
      gsap.fromTo(".hero-sub", { opacity:0, y:30 }, { opacity:1, y:0, duration:0.8, delay:0.8 });
      gsap.fromTo(".hero-cta", { opacity:0, scale:0.8 }, { opacity:1, scale:1, duration:0.6, delay:1.1, ease:"back.out(2)" });

      // Marquee infinite scroll
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, { xPercent: -50, duration: 20, ease: "none", repeat: -1 });
      }

      // Stats counter
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => {
          document.querySelectorAll(".stat-num").forEach((el) => {
            const target = parseInt(el.getAttribute("data-target") || "0");
            gsap.fromTo(el, { textContent: 0 }, {
              textContent: target, duration: 2, ease: "power2.out",
              snap: { textContent: 1 },
              onUpdate() { el.textContent = Math.round(parseFloat(el.textContent || "0")).toString() + "+"; }
            });
          });
        }
      });

      // Works reveal
      gsap.fromTo(".work-card", { opacity:0, y:60, scale:0.95 }, {
        opacity:1, y:0, scale:1, duration:0.7, stagger:0.12, ease:"power3.out",
        scrollTrigger: { trigger: ".works-grid", start: "top 75%" }
      });

      // Floating shapes
      gsap.to(".float-shape", { y:-20, duration:3, yoyo:true, repeat:-1, ease:"sine.inOut", stagger:0.5 });
    });
    return () => ctx.revert();
  }, [showSplash]);

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background:"radial-gradient(ellipse at 30% 60%, #1e1b4b 0%, #0f0e1a 55%, #1a1a2e 100%)"}}>

        {/* Floating geometric shapes */}
        <div className="float-shape absolute top-1/4 right-16 w-32 h-32 rounded-full border border-[#F5E6C8]/15" />
        <div className="float-shape absolute bottom-1/3 left-20 w-20 h-20 rounded-full bg-[#3730A3]/30 blur-xl" />
        <div className="float-shape absolute top-1/3 left-1/3 w-4 h-4 rounded-full bg-[#F5E6C8]/40" />
        <div className="float-shape absolute bottom-1/4 right-1/4 w-48 h-48 border border-[#3730A3]/30 rotate-45" />
        <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize:"50px 50px"}} />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 text-white/80 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            متاحين دلوقتي — احنا جاهزين لمشروعك
          </div>

          <h1 className="text-6xl md:text-9xl font-black text-white leading-none mb-8 perspective-[1000px]" dir="rtl">
            {"إبداع".split("").map((c,i) => <span key={i} className="hero-char inline-block" style={{display:"inline-block"}}>{c}</span>)}
            <br/>
            <span className="text-[#F5E6C8]">
              {"لا حدود له".split("").map((c,i) => <span key={i} className="hero-char inline-block">{c === " " ? "\u00A0" : c}</span>)}
            </span>
          </h1>

          <p className="hero-sub text-lg md:text-xl text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed">
            بنصمم بوسترات وهويات بصرية بتخلي الناس توقف وتبص — مش بس تعدي. شغل شدج بيتكلم عن نفسه.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/order" className="bg-[#F5E6C8] text-[#1a1a2e] px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-2xl shadow-[#F5E6C8]/20">
              ابدأ مشروعك دلوقتي
            </Link>
            <Link href="/portfolio" className="border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
              شوف شغلنا
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest">اسكرول</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="bg-[#3730A3] py-4 overflow-hidden">
        <div ref={marqueeRef} className="flex gap-12 whitespace-nowrap" style={{width:"200%"}}>
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w,i) => (
            <span key={i} className="text-white/80 font-bold text-lg shrink-0">
              {w} <span className="text-[#F5E6C8] mx-4">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== STATS ===== */}
      <section ref={statsRef} className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: 46, label: "مشروع منجز" },
              { n: 30, label: "عميل راضي" },
              { n: 3, label: "سنوات خبرة" },
              { n: 8, label: "تخصص تصميم" },
            ].map((s,i) => (
              <div key={i} className="py-8">
                <div className="stat-num text-5xl md:text-6xl font-black text-[#3730A3] mb-2" data-target={s.n}>0+</div>
                <div className="text-gray-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED WORKS ===== */}
      <section className="py-24 bg-[#f9f7f4]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-[#3730A3] font-bold text-sm tracking-widest uppercase mb-3 block">Portfolio</span>
              <h2 className="text-4xl md:text-6xl font-black text-[#1a1a2e] leading-tight">أحدث شغلنا</h2>
            </div>
            <Link href="/portfolio" className="group flex items-center gap-2 font-bold text-[#3730A3] hover:text-[#1a1a2e] transition-colors">
              شوف كل الأعمال
              <span className="group-hover:translate-x-1 transition-transform">←</span>
            </Link>
          </div>

          <div className="works-grid grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {(featuredWorks.length > 0 ? featuredWorks : Array.from({length:6}).map((_,i)=>({id:String(i),imageUrl:"",titleAr:"...",clientName:"...",category:"..."}))).slice(0,6).map((work,i) => (
              <Link href="/portfolio" key={work.id}>
                <div className={`work-card group relative overflow-hidden rounded-2xl cursor-pointer ${i === 0 ? "md:row-span-2 aspect-[3/4]" : "aspect-square"}`}
                  style={{background:"#e5e0d8"}}>
                  {work.imageUrl ? (
                    <img src={work.imageUrl} alt={work.titleAr} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-5">
                    <p className="text-[#F5E6C8] text-xs font-bold mb-1 translate-y-3 group-hover:translate-y-0 transition-transform">{work.category}</p>
                    <h3 className="text-white font-bold text-lg translate-y-3 group-hover:translate-y-0 transition-transform delay-75">{work.titleAr}</h3>
                    <p className="text-gray-300 text-sm translate-y-3 group-hover:translate-y-0 transition-transform delay-100">{work.clientName}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      {categories.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-2xl font-black text-[#1a1a2e] mb-8">بنشتغل في كل ده</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link href={`/portfolio`} key={cat.category}>
                  <div className="bg-[#f9f7f4] hover:bg-[#3730A3] hover:text-white text-[#1a1a2e] font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer border border-gray-200 hover:border-[#3730A3] text-sm">
                    {cat.category}
                    <span className="text-[#3730A3] group-hover:text-white mr-1.5 text-xs">({cat.count})</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== ABOUT TEASER ===== */}
      <section className="py-32 relative overflow-hidden" style={{background:"linear-gradient(135deg, #1e1b4b 0%, #3730A3 50%, #1e1b4b 100%)"}}>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 36px)"}} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#F5E6C8] font-bold tracking-widest text-sm mb-6 uppercase">ليه شدج؟</p>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              احنا مش بس بنصمم — <br/>
              <span className="text-[#F5E6C8]">احنا بنبني هويات</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              كل بوستر بنعمله بيحكي قصة. كل لون بيتخار بعناية. كل تفصيلة بتفرق. شدج شركة جرافيك بتؤمن إن التصميم الكويس بيبيع — مش بس بيتعلق على الحيط.
            </p>
            <Link href="/about" className="inline-block border-2 border-[#F5E6C8] text-[#F5E6C8] px-8 py-3.5 rounded-full font-bold hover:bg-[#F5E6C8] hover:text-[#1a1a2e] transition-all">
              تعرف علينا أكتر
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-[#F5E6C8]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#1a1a2e] mb-4">عندك مشروع؟</h2>
          <p className="text-[#3730A3] text-lg mb-8 font-medium">خلينا نحوله لتحفة بصرية</p>
          <Link href="/order" className="inline-block bg-[#1a1a2e] text-white px-10 py-4 rounded-full font-black text-lg hover:bg-[#3730A3] transition-colors shadow-xl">
            اطلب تصميمك دلوقتي
          </Link>
        </div>
      </section>
    </div>
  );
}
