import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  { name: "سارة المصممة", role: "Creative Director", emoji: "🎨" },
  { name: "محمد الجرافيك", role: "Senior Designer", emoji: "✏️" },
  { name: "فريدة", role: "Brand Strategist", emoji: "💡" },
];

const VALUES = [
  { title: "الإبداع أولاً", desc: "كل مشروع بنتعامل معاه كأنه أول مشروع — بأفكار جديدة وطازة." },
  { title: "التفاصيل مهمة", desc: "بنؤمن إن الكمال في التفاصيل الصغيرة اللي الناس بتحس بيها حتى لو ما شافتهاش." },
  { title: "نتيجة حقيقية", desc: "شغلنا مش للزينة بس — هو أداة بتبيع وبتعزز الهوية وبتفرق." },
  { title: "سرعة مع الجودة", desc: "بنشتغل بسرعة لأننا بنعرف شغلنا — بدون تضحية بأي تفصيلة." },
];

export default function About() {
  useSEO({
    title: "عن شدج — قصة وكالة التصميم الإبداعية",
    description: "تعرف على شدج للجرافيك — فريق صغير بشغف كبير بالتصميم والإبداع. بنؤمن إن كل علامة تجارية تستحق هوية بصرية تعكسها صح.",
    keywords: "عن شدج, فريق التصميم, وكالة جرافيك, هوية بصرية, مصممين مصر, مصممين سعودية",
    canonical: "/about",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "عن شدج للجرافيك",
      "url": "https://shadj-graphics.space/about",
      "description": "وكالة تصميم جرافيك احترافية — فريق إبداعي في مصر والسعودية"
    }
  });

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-hero-text > *", { opacity:0, y:60 }, { opacity:1, y:0, stagger:0.15, duration:0.9, ease:"power3.out", delay:0.3 });

      gsap.fromTo(".value-card", { opacity:0, y:40 }, {
        opacity:1, y:0, duration:0.6, stagger:0.12, ease:"power2.out",
        scrollTrigger: { trigger:".values-grid", start:"top 75%" }
      });

      gsap.fromTo(".team-card", { opacity:0, scale:0.9 }, {
        opacity:1, scale:1, duration:0.5, stagger:0.1, ease:"back.out(1.5)",
        scrollTrigger: { trigger:".team-grid", start:"top 80%" }
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen">

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background:"radial-gradient(ellipse at 70% 50%, #1e1b4b 0%, #0f0e1a 60%)"}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"repeating-linear-gradient(-45deg, transparent, transparent 40px, white 40px, white 41px)"}} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="about-hero-text max-w-4xl mx-auto text-center">
            <span className="inline-block text-[#F5E6C8] text-sm font-bold tracking-widest uppercase mb-6">Our Story</span>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8">
              شدج<br/>
              <span className="text-[#F5E6C8]">قصة إبداع</span>
            </h1>
            <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
              اتأسست شدج من شغفنا بالجرافيك والإبداع. احنا فريق صغير بتصميم ضخم — بنصدق إن كل علامة تجارية تستحق هوية بصرية تعكسها صح.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#3730A3] font-bold text-sm tracking-widest uppercase mb-4 block">قصتنا</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1a1a2e] mb-6 leading-tight">من الشغف للاحتراف</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>شدج بدأت من غرفة صغيرة وحلم كبير — إننا نثبت إن الجرافيك المصري والسعودي يقدر يكون في مستوى عالمي.</p>
                <p>دلوقتي بعد ما عملنا أكتر من ٤٦ مشروع لعملاء من مصر والسعودية ودول عربية تانية، شدج بقت اسم ليه ثقل في السوق.</p>
                <p>هدفنا بسيط: كل عميل يشوف شغلنا ويقول "ده اللي كنت عايزه بالضبط."</p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-[#1a1a2e] flex items-center justify-center">
                <img src="/logo-white.png" alt="شدج" className="w-2/3 object-contain" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#F5E6C8] rounded-2xl p-5 shadow-xl">
                <div className="text-3xl font-black text-[#1a1a2e]">٤٦+</div>
                <div className="text-sm text-gray-600">مشروع منجز</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#f9f7f4]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#3730A3] font-bold text-sm tracking-widest uppercase mb-4 block">قيمنا</span>
            <h2 className="text-4xl font-black text-[#1a1a2e]">اللي بيميزنا</h2>
          </div>
          <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="value-card bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
                <div className="w-10 h-10 rounded-xl bg-[#3730A3]/10 mb-4 group-hover:bg-[#3730A3] transition-colors flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#3730A3] group-hover:bg-white transition-colors" />
                </div>
                <h3 className="font-black text-[#1a1a2e] text-lg mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[#1a1a2e]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#F5E6C8] font-bold text-sm tracking-widest uppercase mb-4 block">الفريق</span>
            <h2 className="text-4xl font-black text-white">العقول اللي وراء شدج</h2>
          </div>
          <div className="team-grid grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM.map((m, i) => (
              <div key={i} className="team-card bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4">{m.emoji}</div>
                <h3 className="text-white font-bold text-lg mb-1">{m.name}</h3>
                <p className="text-[#F5E6C8]/70 text-sm">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F5E6C8] text-center">
        <h2 className="text-4xl font-black text-[#1a1a2e] mb-4">جاهز تشتغل معنا؟</h2>
        <p className="text-gray-600 mb-8 text-lg">ابعتلنا تفاصيل مشروعك ونبدأ بكرة</p>
        <Link href="/order" className="inline-block bg-[#3730A3] text-white px-10 py-4 rounded-full font-black text-lg hover:bg-[#1a1a2e] transition-colors">
          ابدأ مشروعك
        </Link>
      </section>
    </div>
  );
}
