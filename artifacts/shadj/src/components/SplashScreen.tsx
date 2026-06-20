import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef(onComplete);
  handleRef.current = onComplete;

  function skip() {
    sessionStorage.setItem("shadj_splash_seen", "1");
    gsap.to(containerRef.current, { opacity: 0, duration: 0.4, onComplete: () => handleRef.current() });
  }

  useEffect(() => {
    const seen = sessionStorage.getItem("shadj_splash_seen");
    if (seen) { handleRef.current(); return; }

    const paths = containerRef.current?.querySelectorAll(".draw-path");
    if (!paths || paths.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("shadj_splash_seen", "1");
          handleRef.current();
        }
      });

      // Fade in background
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });

      // Animate each SVG path (draw stroke effect)
      paths.forEach((path) => {
        const len = (path as SVGPathElement).getTotalLength?.() || 500;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      });

      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 2.2,
        stagger: 0.3,
        ease: "power2.inOut",
      }, 0.3);

      // Fill with color after draw
      tl.to(paths, {
        fill: "#ffffff",
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }, "-=0.5");

      // Subtitle fade in
      tl.fromTo(".splash-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");

      // Hold then fade out
      tl.to({}, { duration: 1.5 });
      tl.to(containerRef.current, { opacity: 0, scale: 1.02, duration: 0.8, ease: "power2.inOut" });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center cursor-pointer"
      style={{ background: "radial-gradient(ellipse at center, #1e1b4b 0%, #0a0918 100%)", opacity: 0 }}
      onClick={skip}
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full border border-white/5 animate-ping" style={{ animationDuration: "4s" }} />
        <div className="absolute w-64 h-64 rounded-full border border-white/8 animate-ping" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
      </div>

      {/* Skip button */}
      <button
        onClick={(e) => { e.stopPropagation(); skip(); }}
        className="absolute top-6 left-6 text-white/30 hover:text-white/80 text-sm border border-white/10 rounded-full px-4 py-1.5 transition-all hover:border-white/30 backdrop-blur-sm"
      >
        تخطي
      </button>

      {/* Logo icon */}
      <div className="mb-8">
        <img src="/logo-white.png" alt="شدج" className="h-16 object-contain opacity-60" />
      </div>

      {/* SVG Draw Animation — شدج */}
      <svg viewBox="0 0 700 180" className="w-[500px] md:w-[700px] max-w-[90vw]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Letter ش */}
        <path className="draw-path" d="M 60 140 C 60 140 50 100 70 80 C 85 65 105 72 110 90 C 115 108 100 130 85 140 C 70 150 55 145 55 130 C 55 115 70 108 85 110" stroke="#F5E6C8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle className="draw-path" cx="40" cy="155" r="5" stroke="#F5E6C8" strokeWidth="4" fill="none"/>
        <circle className="draw-path" cx="60" cy="162" r="5" stroke="#F5E6C8" strokeWidth="4" fill="none"/>
        <circle className="draw-path" cx="80" cy="157" r="5" stroke="#F5E6C8" strokeWidth="4" fill="none"/>

        {/* Connector */}
        <path className="draw-path" d="M 110 90 L 160 90" stroke="#F5E6C8" strokeWidth="5" strokeLinecap="round" fill="none"/>

        {/* Letter د */}
        <path className="draw-path" d="M 160 90 L 200 90 C 220 90 230 100 230 120 C 230 140 215 150 195 145 L 160 135" stroke="#F5E6C8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

        {/* Connector */}
        <path className="draw-path" d="M 230 120 L 270 90" stroke="#F5E6C8" strokeWidth="5" strokeLinecap="round" fill="none"/>

        {/* Letter ج */}
        <path className="draw-path" d="M 270 90 C 270 90 310 80 330 100 C 350 120 340 150 320 160 C 300 170 275 160 270 140 C 265 120 278 108 295 108" stroke="#F5E6C8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle className="draw-path" cx="310" cy="175" r="6" stroke="#F5E6C8" strokeWidth="4" fill="none"/>

        {/* Decorative line */}
        <path className="draw-path" d="M 50 165 L 350 165" stroke="#F5E6C8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 6" fill="none"/>
      </svg>

      <p className="splash-sub text-[#F5E6C8]/50 text-sm mt-6 tracking-[0.4em] font-light uppercase opacity-0">
        SHADJ GRAPHICS
      </p>

      <p className="splash-sub absolute bottom-6 text-white/20 text-xs opacity-0">
        اضغط في أي مكان للتخطي
      </p>
    </div>
  );
}
