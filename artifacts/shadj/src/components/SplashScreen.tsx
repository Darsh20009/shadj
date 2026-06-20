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

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("shadj_splash_seen", "1");
          handleRef.current();
        }
      });

      gsap.set(".splash-logo", { scale: 0.6, opacity: 0, filter: "blur(20px)" });
      gsap.set(".splash-ring", { scale: 0, opacity: 0 });
      gsap.set(".splash-particle", { opacity: 0 });
      gsap.set(".splash-brand", { opacity: 0, y: 30 });
      gsap.set(".splash-tagline", { opacity: 0, y: 20 });
      gsap.set(".splash-line", { scaleX: 0 });

      tl.to(containerRef.current, { opacity: 1, duration: 0.3 })
        .to(".splash-ring", {
          scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1,0.7)", stagger: 0.15
        }, 0.1)
        .to(".splash-logo", {
          scale: 1, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out"
        }, 0.3)
        .to(".splash-particle", {
          opacity: 1, duration: 0.4, stagger: { each: 0.05, from: "random" }
        }, 0.8)
        .to(".splash-brand", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.9)
        .to(".splash-line", { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 1.3)
        .to(".splash-tagline", { opacity: 1, y: 0, duration: 0.6 }, 1.5)
        .to({}, { duration: 1.8 })
        .to(containerRef.current, { opacity: 0, scale: 1.04, duration: 0.7, ease: "power2.inOut" });

      gsap.to(".splash-ring-1", { rotation: 360, duration: 18, repeat: -1, ease: "none", transformOrigin: "center" });
      gsap.to(".splash-ring-2", { rotation: -360, duration: 24, repeat: -1, ease: "none", transformOrigin: "center" });
      gsap.to(".splash-glow", { scale: 1.3, opacity: 0.15, duration: 2.5, yoyo: true, repeat: -1, ease: "sine.inOut" });

      const particles = document.querySelectorAll(".splash-particle");
      particles.forEach((p) => {
        gsap.to(p, {
          y: gsap.utils.random(-30, 30),
          x: gsap.utils.random(-20, 20),
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 2),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const particles = Array.from({ length: 24 });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #16133a 0%, #0a0816 100%)", opacity: 0 }}
      onClick={skip}
    >
      <button
        onClick={(e) => { e.stopPropagation(); skip(); }}
        className="absolute top-6 left-6 z-10 text-white/30 hover:text-white/80 text-sm border border-white/10 rounded-full px-4 py-1.5 transition-all hover:border-white/30 backdrop-blur-sm"
      >
        تخطي
      </button>

      {/* Ambient glow */}
      <div className="splash-glow absolute w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)" }} />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((_, i) => {
          const size = Math.random() > 0.7 ? 3 : Math.random() > 0.5 ? 2 : 1;
          const isGold = Math.random() > 0.6;
          return (
            <div
              key={i}
              className="splash-particle absolute rounded-full"
              style={{
                width: size + "px",
                height: size + "px",
                left: (5 + Math.random() * 90) + "%",
                top: (5 + Math.random() * 90) + "%",
                background: isGold ? "#F5E6C8" : "#6366f1",
                boxShadow: isGold ? "0 0 6px #F5E6C8" : "0 0 6px #6366f1",
              }}
            />
          );
        })}
      </div>

      {/* Rotating rings */}
      <div className="absolute flex items-center justify-center pointer-events-none">
        <div className="splash-ring splash-ring-1 absolute w-[340px] h-[340px] rounded-full border border-[#F5E6C8]/10" />
        <div className="splash-ring splash-ring-2 absolute w-[480px] h-[480px] rounded-full"
          style={{ border: "1px dashed rgba(99,102,241,0.2)" }} />
        <div className="splash-ring absolute w-[220px] h-[220px] rounded-full border border-white/5" />
      </div>

      {/* Main logo */}
      <div className="relative flex flex-col items-center z-10">
        <div className="splash-logo mb-6 relative">
          <div className="absolute inset-0 rounded-2xl blur-2xl opacity-40"
            style={{ background: "radial-gradient(circle, #4f46e5, transparent)" }} />
          <img
            src="/logo-white.png"
            alt="شدج"
            className="relative h-28 md:h-36 w-auto object-contain drop-shadow-2xl rounded-2xl"
            style={{ filter: "drop-shadow(0 0 30px rgba(99,102,241,0.5))" }}
          />
        </div>

        {/* Brand name */}
        <div className="splash-brand text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-1" style={{ fontFamily: "'Cairo', sans-serif", letterSpacing: "0" }}>
            شـدج
          </h1>
        </div>

        {/* Divider line */}
        <div className="splash-line w-24 h-px my-4 origin-center" style={{ background: "linear-gradient(90deg, transparent, #F5E6C8, transparent)" }} />

        {/* Tagline */}
        <p className="splash-tagline text-[#F5E6C8]/60 text-sm tracking-[0.3em] font-light uppercase">
          SHADJ GRAPHICS
        </p>
      </div>

      <p className="absolute bottom-6 text-white/20 text-xs">
        اضغط في أي مكان للتخطي
      </p>
    </div>
  );
}
