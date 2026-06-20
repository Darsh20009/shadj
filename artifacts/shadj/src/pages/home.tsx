import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGetFeaturedWorks, useGetCategories } from "@workspace/api-client-react";
import { SplashScreen } from "@/components/SplashScreen";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("shadj_splash_seen"));
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const { data: featuredWorks = [] } = useGetFeaturedWorks();
  const { data: categories = [] } = useGetCategories();

  useEffect(() => {
    if (showSplash) return;

    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo(titleRef.current?.children || [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "back.out(1.7)", delay: 0.2 }
      );
      
      // Parallax elements
      gsap.to(".parallax-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#3730A3]">
        <div className="parallax-bg absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h1 ref={titleRef} className="text-6xl md:text-8xl font-black mb-6 leading-tight" dir="rtl">
            <span className="inline-block">إبداع</span>{" "}
            <span className="inline-block text-[#F5E6C8]">لا</span>{" "}
            <span className="inline-block">حدود</span>{" "}
            <span className="inline-block">له</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            نحول رؤيتك إلى واقع بصري يخطف الأنظار ويعزز هويتك التجارية.
          </p>
          <Link href="/order" className="inline-block bg-[#F5E6C8] text-[#1a1a2e] px-10 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-xl">
            ابدأ مشروعك
          </Link>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black text-[#1a1a2e] mb-4">أعمالنا المميزة</h2>
              <p className="text-gray-600">بعض من إبداعاتنا التي نفخر بها</p>
            </div>
            <Link href="/portfolio" className="hidden md:inline-block border-b-2 border-primary text-primary font-bold pb-1 hover:text-[#1a1a2e] hover:border-[#1a1a2e] transition-colors">
              عرض كل الأعمال
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorks.length > 0 ? featuredWorks.slice(0, 6).map((work) => (
              <div key={work.id} className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg">
                <img src={work.imageUrl} alt={work.titleAr} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{work.titleAr}</h3>
                  <p className="text-gray-300 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{work.clientName} • {work.category}</p>
                </div>
              </div>
            )) : (
              // Empty state fallbacks
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg bg-gray-100 animate-pulse">
                </div>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/portfolio" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold">
              عرض كل الأعمال
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1a1a2e] mb-10">مجالات الإبداع</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <div key={cat.category} className="bg-white px-6 py-3 rounded-full shadow-sm text-gray-700 font-medium hover:shadow-md transition-shadow hover:-translate-y-1 transform cursor-pointer border border-gray-100">
                {cat.category} <span className="text-primary mr-2 text-sm">({cat.count})</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Teaser */}
      <section className="py-32 bg-[#1a1a2e] text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-8 text-[#F5E6C8]">لماذا شدج؟</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-12">
              نحن لا نصمم فقط، بل نروي قصتك. في شدج، ندمج الفن مع الاستراتيجية لنصنع هويات تعيش في الذاكرة. فريقنا من المبدعين يعمل بشغف واهتمام بأدق التفاصيل لضمان تميز علامتك التجارية.
            </p>
            <Link href="/about" className="inline-block border border-[#F5E6C8] text-[#F5E6C8] px-8 py-3 rounded-full font-bold hover:bg-[#F5E6C8] hover:text-[#1a1a2e] transition-colors">
              تعرف على فريقنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
