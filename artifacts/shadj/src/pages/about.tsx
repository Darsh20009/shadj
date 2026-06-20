import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "wouter";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".fade-up", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, scrollTrigger: { trigger: ".fade-up", start: "top 80%" } }
      );

      // Animated counters
      const counters = document.querySelectorAll(".counter");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target") || "0");
        ScrollTrigger.create({
          trigger: counter,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              innerHTML: target,
              duration: 2.5,
              snap: { innerHTML: 1 },
              ease: "power2.out"
            });
          }
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        
        {/* Story Section */}
        <section className="mb-32">
          <div className="max-w-4xl mx-auto text-center fade-up">
            <h1 className="text-5xl md:text-7xl font-black text-[#1a1a2e] mb-8">نحن شدج</h1>
            <p className="text-2xl text-gray-600 leading-relaxed">
              وكالة تصميم إبداعية سعودية، نؤمن بأن التصميم الجيد ليس مجرد مظهر جميل، بل هو حل استراتيجي يروي قصة ويخلق تواصلاً عميقاً مع الجمهور.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section ref={statsRef} className="mb-32 bg-[#1a1a2e] rounded-3xl p-12 md:p-20 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-[#F5E6C8] mb-2"><span className="counter" data-target="150">0</span>+</div>
              <p className="text-gray-400">مشروع ناجح</p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#F5E6C8] mb-2"><span className="counter" data-target="85">0</span></div>
              <p className="text-gray-400">عميل سعيد</p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#F5E6C8] mb-2"><span className="counter" data-target="12">0</span></div>
              <p className="text-gray-400">خبير مبدع</p>
            </div>
            <div>
              <div className="text-5xl font-black text-[#F5E6C8] mb-2"><span className="counter" data-target="5">0</span></div>
              <p className="text-gray-400">سنوات خبرة</p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="mb-32 grid md:grid-cols-2 gap-16">
          <div className="fade-up">
            <h2 className="text-3xl font-black text-[#1a1a2e] mb-6">رؤيتنا</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              أن نكون الوجهة الأولى للعلامات التجارية التي تبحث عن التميز البصري والابتكار في العالم العربي، عبر تقديم تصاميم تتجاوز التوقعات وتصنع تأثيراً مستداماً.
            </p>
          </div>
          <div className="fade-up">
            <h2 className="text-3xl font-black text-[#1a1a2e] mb-6">مهمتنا</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              تحويل الأفكار المجردة إلى هويات بصرية قوية وتجارب رقمية لا تُنسى، من خلال دمج الشغف الفني مع التفكير الاستراتيجي والاحترافية التقنية.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gray-50 py-20 rounded-3xl fade-up">
          <h2 className="text-4xl font-black text-[#1a1a2e] mb-6">جاهز للبدء؟</h2>
          <p className="text-xl text-gray-600 mb-10">دعنا نصنع شيئاً رائعاً معاً.</p>
          <Link href="/order" className="inline-block bg-primary text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-colors shadow-lg">
            ابدأ مشروعك الآن
          </Link>
        </section>

      </div>
    </div>
  );
}
