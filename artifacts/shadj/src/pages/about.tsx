import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  { icon: "◆", title: "الإبداع أولاً",   desc: "كل مشروع بنتعامل معاه كأنه أول مشروع — بأفكار جديدة وطازة.",         color: "#3730A3" },
  { icon: "▲", title: "التفاصيل مهمة",    desc: "بنؤمن إن الكمال في التفاصيل الصغيرة اللي الناس بتحس بيها.",          color: "#6366f1" },
  { icon: "●", title: "نتيجة حقيقية",     desc: "شغلنا مش للزينة — هو أداة بتبيع وبتعزز الهوية وبتفرق.",              color: "#8b5cf6" },
  { icon: "■", title: "سرعة مع الجودة",   desc: "بنشتغل بسرعة لأننا بنعرف شغلنا — بدون تضحية بأي تفصيلة.",           color: "#F5E6C8" },
];

const PROCESS = [
  { n: "١", title: "الاستماع",    desc: "بنسمع منك كل تفصيلة — الفكرة، الجمهور، الرسالة.",    time: "اليوم الأول" },
  { n: "٢", title: "التخطيط",    desc: "بنحدد الاتجاه الإبداعي والمقترح البصري المناسب.",      time: "٢٤–٤٨ ساعة" },
  { n: "٣", title: "التصميم",    desc: "بنشتغل على التصميم بأعلى مستوى من الاحترافية.",         time: "٣–٧ أيام" },
  { n: "٤", title: "التسليم",    desc: "بنسلّم الملفات بكل الصيغ وبنتابع رضاك الكامل.",        time: "حسب المشروع" },
];

const TEAM = [
  { name: "فريق التصميم",      role: "Creative Team",    icon: "🎨", desc: "مصممين محترفين بخبرة +3 سنوات" },
  { name: "إدارة المشاريع",    role: "Project Management", icon: "📋", desc: "تنسيق وتواصل مستمر مع العميل" },
  { name: "ضمان الجودة",       role: "Quality Assurance",  icon: "✅", desc: "مراجعة دقيقة لكل تفصيلة قبل التسليم" },
];

export default function About() {
  useSEO({
    title: "عن شدج — قصة وكالة التصميم الإبداعية",
    description: "تعرف على شدج للجرافيك — فريق إبداعي بشغف بالتصميم. بنؤمن إن كل علامة تجارية تستحق هوية بصرية تعكسها صح.",
    keywords: "عن شدج, فريق التصميم, وكالة جرافيك, هوية بصرية, مصممين مصر",
    canonical: "/about",
  });

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-hero > *", { opacity:0, y:60 }, { opacity:1, y:0, stagger:0.15, duration:0.9, ease:"power3.out", delay:0.3 });

      gsap.fromTo(".value-card", { opacity:0, y:40 }, {
        opacity:1, y:0, duration:0.6, stagger:0.12, ease:"power2.out",
        scrollTrigger: { trigger:".values-grid", start:"top 78%" }
      });

      gsap.fromTo(".process-step", { opacity:0, x:40 }, {
        opacity:1, x:0, duration:0.6, stagger:0.15, ease:"power2.out",
        scrollTrigger: { trigger:".process-grid", start:"top 80%" }
      });

      gsap.fromTo(".stat-block", { opacity:0, scale:0.85 }, {
        opacity:1, scale:1, duration:0.5, stagger:0.1, ease:"back.out(1.4)",
        scrollTrigger: { trigger:".stats-row", start:"top 82%" }
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen" dir="rtl">

      {/* ===== HERO ===== */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{background:"radial-gradient(ellipse at 65% 45%, #1e1b4b 0%, #0f0e1a 60%)"}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"repeating-linear-gradient(-45deg, transparent, transparent 40px, white 40px, white 41px)"}} />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#3730A3]/15 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#F5E6C8]/5 blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="about-hero max-w-4xl mx-auto text-center">
            <span className="inline-block text-[#F5E6C8]/70 text-xs font-bold tracking-[0.3em] uppercase mb-8">Our Story</span>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-8">
              شَـــدِج<br/>
              <span className="text-[#F5E6C8]">قصة إبداع</span>
            </h1>
            <p className="text-gray-300 text-xl leading-loose max-w-2xl mx-auto mb-12">
              اتأسست شَـــدِج من شغفنا بالجرافيك والإبداع. فريق صغير بتصميم ضخم — بنصدق إن كل علامة تجارية تستحق هوية بصرية تعكسها صح.
            </p>
            <div className="stats-row flex flex-wrap justify-center gap-6">
              {[["٤٦+","مشروع منجز"],["٣٠+","عميل راضي"],["٣+","سنوات خبرة"],["٨+","تخصص"]].map(([n,l]) => (
                <div key={l} className="stat-block bg-white/8 border border-white/10 rounded-2xl px-6 py-4 text-center backdrop-blur">
                  <div className="text-3xl font-black text-[#F5E6C8] mb-1">{n}</div>
                  <div className="text-gray-400 text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ===== STORY ===== */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <span className="text-[#3730A3] font-bold text-xs tracking-[0.25em] uppercase mb-4 block">قصتنا</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1a1a2e] mb-8 leading-tight">من الشغف<br/>للاحتراف</h2>
              <div className="space-y-5 text-gray-600 leading-loose text-[17px]">
                <p>شَـــدِج بدأت من غرفة صغيرة وحلم كبير — إننا نثبت إن الجرافيك المصري والعربي يقدر يكون في مستوى عالمي.</p>
                <p>بعد أكتر من <strong className="text-[#1a1a2e]">٤٦ مشروع</strong> لعملاء من مصر والسعودية ودول عربية، شَـــدِج بقت اسم ليه ثقل وقيمة في السوق.</p>
                <p>هدفنا بسيط: كل عميل يشوف شغلنا ويقول <strong className="text-[#3730A3]">"ده اللي كنت عايزه بالضبط."</strong></p>
              </div>
              <Link href="/order"
                className="inline-block mt-8 bg-[#3730A3] text-white px-8 py-4 rounded-full font-black hover:bg-[#1e1b4b] transition-colors shadow-lg shadow-[#3730A3]/20">
                ابدأ مشروعك معنا ←
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-[#1a1a2e] flex items-center justify-center relative">
                <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 30% 70%, #3730A3 0%, #1a1a2e 60%)"}} />
                <div className="relative z-10 text-center">
                  <div className="text-8xl font-black text-white mb-2">شَـــدِج</div>
                  <div className="text-[#F5E6C8]/60 text-sm tracking-widest uppercase">Shadj Graphics</div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 bg-[#F5E6C8] rounded-2xl p-5 shadow-xl">
                <div className="text-3xl font-black text-[#1a1a2e]">٤٦+</div>
                <div className="text-sm text-gray-600 font-medium">مشروع منجز</div>
              </div>
              <div className="absolute -top-5 -right-5 bg-[#3730A3] rounded-2xl p-4 shadow-xl text-white text-center">
                <div className="text-2xl font-black">٣+</div>
                <div className="text-xs text-white/70">سنوات</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="py-24 bg-[#f9f7f4]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#3730A3] font-bold text-xs tracking-[0.25em] uppercase mb-3 block">قيمنا</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1a2e]">اللي بيميزنا</h2>
          </div>
          <div className="values-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <div key={i} className="value-card group bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-transparent hover:border-gray-100 cursor-default">
                <div className="text-2xl font-black mb-5" style={{color: v.color === "#F5E6C8" ? "#b8a882" : v.color}}>{v.icon}</div>
                <h3 className="font-black text-[#1a1a2e] text-lg mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#3730A3] font-bold text-xs tracking-[0.25em] uppercase mb-3 block">طريقة شغلنا</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1a2e]">إزاي بنشتغل معاك؟</h2>
          </div>
          <div className="process-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {PROCESS.map((p, i) => (
              <div key={i} className="process-step relative">
                {i < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-0 w-full h-px bg-gray-200 -z-0" style={{left:"60%"}} />
                )}
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#3730A3] text-white font-black text-xl flex items-center justify-center mb-5 shadow-lg shadow-[#3730A3]/25">
                    {p.n}
                  </div>
                  <div className="inline-block bg-[#F5E6C8]/50 text-[#1a1a2e] text-xs font-bold px-3 py-1 rounded-full mb-3">{p.time}</div>
                  <h3 className="font-black text-[#1a1a2e] text-lg mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="py-24 bg-[#1a1a2e]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#F5E6C8]/60 font-bold text-xs tracking-[0.25em] uppercase mb-3 block">الفريق</span>
            <h2 className="text-4xl md:text-5xl font-black text-white">العقول اللي وراء شَـــدِج</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {TEAM.map((m, i) => (
              <div key={i} className="group bg-white/5 border border-white/8 rounded-3xl p-8 text-center hover:bg-white/10 hover:border-white/15 transition-all hover:-translate-y-1">
                <div className="text-4xl mb-4">{m.icon}</div>
                <h3 className="text-white font-black text-lg mb-1">{m.name}</h3>
                <p className="text-[#F5E6C8]/60 text-sm mb-3 font-medium">{m.role}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-[#F5E6C8]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#1a1a2e] mb-4">جاهز تشتغل معنا؟</h2>
          <p className="text-gray-600 mb-10 text-lg max-w-md mx-auto leading-relaxed">ابعتلنا تفاصيل مشروعك وفريق شَـــدِج هيتواصل معاك في أسرع وقت</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order"
              className="inline-block bg-[#3730A3] text-white px-12 py-5 rounded-full font-black text-lg hover:bg-[#1e1b4b] transition-colors shadow-xl shadow-[#3730A3]/20">
              ابدأ مشروعك ←
            </Link>
            <a href="https://wa.me/201129085243?text=%D8%A3%D9%87%D9%84%D8%A7%D9%8B%2C+%D8%B9%D9%86%D8%AF%D9%8A+%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1+%D8%B9%D9%86+%D8%AE%D8%AF%D9%85%D8%A7%D8%AA+%D8%B4%D9%8E%D8%AF%D8%AC" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-[#1a1a2e]/25 text-[#1a1a2e] px-10 py-5 rounded-full font-bold hover:border-[#1a1a2e] transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              تواصل بالواتساب
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
