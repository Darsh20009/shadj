import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef(onComplete);
  handleRef.current = onComplete;

  function skip() {
    sessionStorage.setItem("shadj_splash_seen", "1");
    gsap.to(containerRef.current, { opacity: 0, duration: 0.4, onComplete: () => handleRef.current() });
  }

  useEffect(() => {
    const seen = sessionStorage.getItem("shadj_splash_seen");
    if (seen) { handleRef.current(); return; }

    const chars = textRef.current?.querySelectorAll(".char") || [];
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("shadj_splash_seen", "1");
          handleRef.current();
        }
      });

      tl.fromTo(circleRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2)" }
      )
      .fromTo(chars,
        { opacity: 0, y: 40, rotateX: -90 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)" },
        "-=0.3"
      )
      .to({}, { duration: 1.8 })
      .to(containerRef.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "radial-gradient(ellipse at center, #1e1b4b 0%, #0f0e1a 100%)" }}
    >
      {/* Particle dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-pulse"
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: (Math.random() * 3 + 2) + "s",
            }}
          />
        ))}
      </div>

      <button
        onClick={skip}
        className="absolute top-6 left-6 text-white/40 hover:text-white text-sm border border-white/20 rounded-full px-4 py-1.5 transition-colors"
      >
        تخطي
      </button>

      <div ref={circleRef} className="mb-8 relative">
        <div className="w-32 h-32 rounded-full border-2 border-[#F5E6C8]/30 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border border-[#F5E6C8]/50 flex items-center justify-center">
            <img src="/logo-white.png" alt="Shadj" className="w-16 h-16 object-contain" />
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border border-[#F5E6C8]/20 animate-ping" style={{ animationDuration: "2s" }} />
      </div>

      <div ref={textRef} className="flex gap-1 perspective-[600px]" dir="rtl">
        {["ش","ـ","د","ج"].map((c, i) => (
          <span
            key={i}
            className="char text-6xl md:text-8xl font-black text-white"
            style={{ fontFamily: "'Cairo', sans-serif", display: "inline-block" }}
          >
            {c}
          </span>
        ))}
      </div>
      <p className="text-[#F5E6C8]/60 text-sm mt-4 tracking-widest">SHADJ GRAPHICS</p>
    </div>
  );
}
