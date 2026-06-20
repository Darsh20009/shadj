import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGetFeaturedWorks, useGetCategories } from "@workspace/api-client-react";
import { SplashScreen } from "@/components/SplashScreen";
import { useSEO } from "@/hooks/useSEO";
import { getImgUrl } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_WORDS = ["إبداع","Design","شَـــدِج","Graphic","أسلوب","Identity","حرفة","Vision","جرافيك","Creative"];

const SERVICES = [
  { icon: "◆", title: "هوية بصرية", desc: "شعار + ألوان + خطوط + دليل هوية متكامل يعكس شخصية علامتك", color: "#3730A3" },
  { icon: "▲", title: "بوسترات إعلانية", desc: "بوسترات تلفت الأنظار وتوصّل رسالتك بقوة وأسلوب", color: "#6366f1" },
  { icon: "●", title: "سوشيال ميديا", desc: "محتوى بصري متناسق يجعل صفحتك تبرز في كل المنصات", color: "#8b5cf6" },
  { icon: "■", title: "تغليف وعبوات", desc: "تصاميم تغليف فاخرة تزيد من قيمة منتجك وجاذبيته", color: "#F5E6C8" },
];

export default function Home() {
  useSEO({
    title: "وكالة تصميم جرافيك احترافية | Shadj Graphics",
    description: "شدج — وكالة تصميم جرافيك احترافية في مصر والسعودية. متخصصة في الهوية البصرية، البوسترات، السوشيال ميديا، والتغليف. +46 مشروع ناجح.",
    keywords: "شدج, شدج للجرافيك, shadj, shadj graphics, تصميم جرافيك, هوية بصرية, بوستر, سوشيال ميديا, وكالة تصميم, مصر, السعودية",
    canonical: "/",
  });

  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("shadj_splash_seen"));
  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { data: rawFeaturedWorks } = useGetFeaturedWorks();
  const { data: categories = [] } = useGetCategories();

  const featuredWorks = Array.isArray(rawFeaturedWorks) ? rawFeaturedWorks : [];

  // Group works by client
  const brandGroups: Record<string, typeof featuredWorks> = {};
  featuredWorks.forEach(w => {
    const key = w.clientName || "شدج";
    if (!brandGroups[key]) brandGroups[key] = [];
    brandGroups[key].push(w);
  });
  const brands = Object.entries(brandGroups).slice(0, 4);

  useEffect(() => {
    if (showSplash) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-word", { opacity:0, y:80, rotateX:-60 }, { opacity:1, y:0, rotateX:0, duration:1, stagger:0.18, ease:"back.out(1.7)", delay:0.3 });
      gsap.fromTo(".hero-sub", { opacity:0, y:30 }, { opacity:1, y:0, duration:0.8, delay:0.9 });
      gsap.fromTo(".hero-cta", { opacity:0, scale:0.85 }, { opacity:1, scale:1, duration:0.6, delay:1.2, ease:"back.out(2)" });
      gsap.fromTo(".hero-badge", { opacity:0, y:-20 }, { opacity:1, y:0, duration:0.5, delay:0.2 });

      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
      }

      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => {
          document.querySelectorAll(".stat-num").forEach((el) => {
            const target = parseInt(el.getAttribute("data-target") || "0");
            gsap.fromTo(el, { textContent: 0 }, {
              textContent: target, duration: 2.2, ease: "power2.out",
              snap: { textContent: 1 },
              onUpdate() { el.textContent = Math.round(parseFloat(el.textContent || "0")).toString() + "+"; }
            });
          });
        }
      });

      gsap.fromTo(".work-brand", { opacity:0, y:50 }, {
        opacity:1, y:0, duration:0.7, stagger:0.18, ease:"power3.out",
        scrollTrigger: { trigger: ".brands-section", start: "top 75%" }
      });

      gsap.fromTo(".service-card", { opacity:0, x:40 }, {
        opacity:1, x:0, duration:0.6, stagger:0.12, ease:"power2.out",
        scrollTrigger: { trigger: ".services-section", start: "top 78%" }
      });

      gsap.to(".float-shape", { y:-18, duration:3, yoyo:true, repeat:-1, ease:"sine.inOut", stagger:0.6 });
    });
    return () => ctx.revert();
  }, [showSplash]);

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden" dir="rtl">

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{background:"radial-gradient(ellipse at 25% 55%, #1e1b4b 0%, #0f0e1a 50%, #120d24 100%)"}}>

        {/* Decorative shapes */}
        <div className="float-shape absolute top-1/4 left-16 w-40 h-40 rounded-full border border-[#F5E6C8]/10" />
        <div className="float-shape absolute bottom-1/3 right-20 w-24 h-24 rounded-full bg-[#3730A3]/25 blur-2xl" />
        <div className="float-shape absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-[#F5E6C8]/60" />
        <div className="float-shape absolute bottom-1/4 left-1/4 w-56 h-56 border border-[#3730A3]/20 rotate-12" />
        <div className="float-shape absolute top-20 right-1/4 w-2 h-2 rounded-full bg-[#6366f1]/80" />
        <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize:"55px 55px"}} />

        {/* Glowing circle behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#3730A3]/8 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="hero-badge inline-flex items-center gap-2 bg-white/8 backdrop-blur border border-white/15 rounded-full px-5 py-2 mb-10 text-white/70 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            متاحين دلوقتي — نستقبل مشاريعك الآن
          </div>

          <h1 className="text-7xl md:text-[120px] font-black text-white leading-[0.9] mb-10 tracking-tight" style={{fontFamily:"inherit", wordSpacing:"-0.05em"}}>
            <div className="overflow-hidden pb-2">
              <span className="hero-word inline-block">إبداع</span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-word inline-block text-[#F5E6C8]">لا حدود له</span>
            </div>
          </h1>

          <p className="hero-sub text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-12 leading-loose">
            بنصمم بوسترات وهويات بصرية بتوقف الناس — مش بس تعدي. شغل شَـــدِج بيتكلم عن نفسه.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/order"
              className="bg-[#F5E6C8] text-[#1a1a2e] px-10 py-4 rounded-full font-black text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(245,230,200,0.3)] transition-all shadow-2xl shadow-[#F5E6C8]/15">
              ابدأ مشروعك دلوقتي ←
            </Link>
            <Link href="/portfolio"
              className="border border-white/25 text-white px-10 py-4 rounded-full font-bold hover:bg-white/8 hover:border-white/50 transition-all">
              شوف شغلنا
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] tracking-[0.3em] uppercase">scroll</span>
          <div className="w-px h-14 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="bg-[#3730A3] py-5 overflow-hidden select-none">
        <div ref={marqueeRef} className="flex gap-10 whitespace-nowrap" style={{width:"200%"}} dir="ltr">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w,i) => (
            <span key={i} className="text-white/75 font-bold text-base shrink-0">
              {w} <span className="text-[#F5E6C8] mx-3 opacity-70">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== STATS ===== */}
      <section ref={statsRef} className="py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { n: 46, label: "مشروع منجز", sub: "لعملاء من مصر والسعودية" },
              { n: 30, label: "عميل راضي", sub: "يثقون في شَـــدِج" },
              { n: 3, label: "سنوات خبرة", sub: "في عالم الجرافيك" },
              { n: 8, label: "تخصص تصميم", sub: "من هوية لتغليف" },
            ].map((s,i) => (
              <div key={i} className="text-center p-8 rounded-3xl bg-[#f9f7f4] hover:bg-[#3730A3]/5 transition-colors group">
                <div className="stat-num text-5xl md:text-6xl font-black text-[#3730A3] mb-1 group-hover:scale-110 transition-transform" data-target={s.n}>0+</div>
                <div className="text-[#1a1a2e] font-black text-base mb-1">{s.label}</div>
                <div className="text-gray-400 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="services-section py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#3730A3] font-bold text-sm tracking-[0.25em] uppercase mb-3 block">Services</span>
            <h2 className="text-4xl md:text-6xl font-black text-[#1a1a2e]">بنشتغل في</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => (
              <div key={i} className="service-card group relative bg-[#f9f7f4] rounded-3xl p-8 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 cursor-default border border-transparent hover:border-[#3730A3]/15">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity" style={{background:s.color}} />
                <div className="text-3xl mb-5 font-black" style={{color:s.color === "#F5E6C8" ? "#b8a882" : s.color}}>{s.icon}</div>
                <h3 className="font-black text-[#1a1a2e] text-lg mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO BY BRAND ===== */}
      <section className="brands-section py-24 bg-[#f9f7f4]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-[#3730A3] font-bold text-sm tracking-[0.25em] uppercase mb-3 block">Portfolio</span>
              <h2 className="text-4xl md:text-6xl font-black text-[#1a1a2e] leading-tight">أحدث شغلنا</h2>
              <p className="text-gray-500 mt-3">منظم حسب البراند — كل مشروع له قصة</p>
            </div>
            <Link href="/portfolio" className="group flex items-center gap-2 font-black text-[#3730A3] hover:text-[#1a1a2e] transition-colors text-sm bg-white border border-[#3730A3]/20 px-5 py-3 rounded-full hover:bg-[#3730A3] hover:text-white">
              كل الأعمال
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
            </Link>
          </div>

          {brands.length > 0 ? (
            <div className="space-y-12">
              {brands.map(([brand, works], bi) => (
                <div key={brand} className="work-brand">
                  {/* Brand header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-lg"
                        style={{background: ["#3730A3","#6366f1","#8b5cf6","#1e1b4b"][bi % 4]}}>
                        {brand[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-[#1a1a2e] text-lg">{brand}</h3>
                        <span className="text-gray-400 text-xs">{works[0]?.category}</span>
                      </div>
                    </div>
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-gray-400 text-xs font-medium">{works.length} أعمال</span>
                  </div>
                  {/* Works grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {works.slice(0, 4).map((work, wi) => (
                      <Link href="/portfolio" key={work.id}>
                        <div className={`group relative overflow-hidden rounded-2xl cursor-pointer ${wi === 0 && works.length > 2 ? "md:col-span-2 md:row-span-2" : ""}`}
                          style={{aspectRatio: wi === 0 && works.length > 2 ? "auto" : "1/1", minHeight: wi === 0 && works.length > 2 ? "280px" : "160px"}}>
                          {work.imageUrl ? (
                            <img
                              src={getImgUrl(work.imageUrl)}
                              alt={work.titleAr}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-108"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 animate-pulse" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4">
                            <p className="text-[#F5E6C8] text-[10px] font-bold mb-1">{work.category}</p>
                            <h3 className="text-white font-bold text-sm">{work.clientName}</h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Fallback: show placeholder grid while loading
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({length:6}).map((_,i) => (
                <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          )}

          {/* Categories quick filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-14">
              {categories.map(cat => (
                <Link href="/portfolio" key={cat.category}>
                  <div className="bg-white hover:bg-[#3730A3] hover:text-white text-[#1a1a2e] font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer border border-gray-200 hover:border-[#3730A3] text-sm shadow-sm">
                    {cat.category}
                    <span className="text-[#3730A3]/60 hover:text-white/70 mr-1.5 text-xs font-normal">({cat.count})</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== ABOUT TEASER ===== */}
      <section className="py-32 relative overflow-hidden" style={{background:"linear-gradient(135deg, #0f0e1a 0%, #1e1b4b 40%, #3730A3 100%)"}}>
        <div className="absolute inset-0 opacity-8" style={{backgroundImage:"repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,.06) 40px, rgba(255,255,255,.06) 41px)"}} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#F5E6C8]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#6366f1]/10 blur-3xl" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <p className="text-[#F5E6C8]/70 font-bold tracking-[0.3em] text-xs mb-6 uppercase">ليه شَـــدِج؟</p>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
            احنا مش بس بنصمم<br/>
            <span className="text-[#F5E6C8]">احنا بنبني هويات</span>
          </h2>
          <p className="text-gray-300 text-lg leading-loose mb-12 max-w-2xl mx-auto">
            كل بوستر بيحكي قصة. كل لون بيتخار بعناية. كل تفصيلة بتفرق. شَـــدِج شركة جرافيك بتؤمن إن التصميم الكويس بيبيع — مش بس بيتعلق على الحيط.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="inline-block border-2 border-[#F5E6C8] text-[#F5E6C8] px-10 py-4 rounded-full font-bold hover:bg-[#F5E6C8] hover:text-[#1a1a2e] transition-all">
              تعرف علينا أكتر
            </Link>
            <a href="https://wa.me/201129085243" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-green-500/20 border border-green-400/30 text-green-300 px-10 py-4 rounded-full font-bold hover:bg-green-500 hover:text-white transition-all">
              تواصل معنا مباشرة
            </a>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-black text-[#1a1a2e] mb-10 text-center">أسئلة شائعة</h2>
          <div className="space-y-3">
            {[
              { q: "ما هو شَـــدِج؟", a: "شَـــدِج وكالة تصميم جرافيك عربية احترافية في مصر والسعودية، متخصصة في الهوية البصرية والبوسترات وسوشيال ميديا والتغليف." },
              { q: "كيف أبدأ مشروعي؟", a: "سهل جداً — ادخل على صفحة 'ابدأ مشروعك' واملأ التفاصيل وفريق شَـــدِج هيتواصل معاك في أسرع وقت ممكن." },
              { q: "ما هي أوقات العمل؟", a: "شَـــدِج متاحة لاستقبال مشاريعك 24 ساعة عبر الواتساب والنموذج الإلكتروني." },
            ].map((faq, i) => (
              <details key={i} className="bg-[#f9f7f4] rounded-2xl p-5 group cursor-pointer border border-transparent hover:border-[#3730A3]/15 transition-colors">
                <summary className="font-black text-[#1a1a2e] flex justify-between items-center list-none text-base">
                  <span>{faq.q}</span>
                  <span className="text-[#3730A3] text-xl group-open:rotate-45 transition-transform duration-300 mr-4 shrink-0">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-loose text-sm border-t border-gray-200 pt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-[#F5E6C8]">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[#3730A3]/60 font-bold tracking-[0.2em] text-xs uppercase mb-4">Start Now</p>
          <h2 className="text-4xl md:text-6xl font-black text-[#1a1a2e] mb-4">عندك مشروع؟</h2>
          <p className="text-[#3730A3] text-lg mb-10 font-medium">خلينا نحوله لتحفة بصرية مع شَـــدِج</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order" className="inline-block bg-[#1a1a2e] text-white px-12 py-5 rounded-full font-black text-lg hover:bg-[#3730A3] transition-colors shadow-xl shadow-[#1a1a2e]/20">
              اطلب تصميمك دلوقتي
            </Link>
            <a href="https://wa.me/201129085243?text=مرحباً،أريد الاستفسار عن تصميم" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border-2 border-[#1a1a2e]/20 text-[#1a1a2e] px-10 py-5 rounded-full font-bold hover:border-[#1a1a2e] transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              واتساب مباشرة
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
