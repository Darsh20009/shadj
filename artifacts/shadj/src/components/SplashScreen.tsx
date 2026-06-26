import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef(onComplete);
  handleRef.current = onComplete;

  function skip() {
    sessionStorage.setItem("shadj_splash_seen", "1");
    gsap.to(containerRef.current, { opacity: 0, duration: 0.3, onComplete: () => handleRef.current() });
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

      gsap.set(".splash-logo", { scale: 0.7, opacity: 0, filter: "blur(12px)" });
      gsap.set(".splash-ring", { scale: 0, opacity: 0 });
      gsap.set(".splash-particle", { opacity: 0 });
      gsap.set(".splash-brand", { opacity: 0, y: 24 });
      gsap.set(".splash-tagline", { opacity: 0, y: 14 });
      gsap.set(".splash-line", { scaleX: 0 });

      tl.to(containerRef.current, { opacity: 1, duration: 0.25 })
        .to(".splash-ring", {
          scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.4)", stagger: 0.12
        }, 0.05)
        .to(".splash-logo", {
          scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out"
        }, 0.2)
        .to(".splash-particle", {
          opacity: 1, duration: 0.3, stagger: { each: 0.04, from: "random" }
        }, 0.5)
        .to(".splash-brand", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.6)
        .to(".splash-line", { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 1.0)
        .to(".splash-tagline", { opacity: 1, y: 0, duration: 0.5 }, 1.2)
        .to({}, { duration: 1.4 })
        .to(containerRef.current, { opacity: 0, scale: 1.03, duration: 0.5, ease: "power2.inOut" });

      gsap.to(".splash-ring-1", { rotation: 360, duration: 20, repeat: -1, ease: "none", transformOrigin: "center" });
      gsap.to(".splash-ring-2", { rotation: -360, duration: 28, repeat: -1, ease: "none", transformOrigin: "center" });
      gsap.to(".splash-glow", { scale: 1.25, opacity: 0.12, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut" });

      const particles = document.querySelectorAll(".splash-particle");
      particles.forEach((p) => {
        gsap.to(p, {
          y: gsap.utils.random(-25, 25),
          x: gsap.utils.random(-15, 15),
          duration: gsap.utils.random(2.5, 4),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 1.5),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const particles = Array.from({ length: 14 });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #16133a 0%, #0a0816 100%)",
        opacity: 0,
        willChange: "opacity, transform",
      }}
      onClick={skip}
    >
      <button
        onClick={(e) => { e.stopPropagation(); skip(); }}
        className="absolute top-6 left-6 z-10 text-white/30 hover:text-white/80 text-sm border border-white/10 rounded-full px-4 py-1.5 transition-all hover:border-white/30 backdrop-blur-sm"
      >
        تخطي
      </button>

      {/* Ambient glow */}
      <div className="splash-glow absolute w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)", willChange: "transform, opacity" }} />

      {/* Floating particles — reduced count for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((_, i) => {
          const size = i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1;
          const isGold = i % 3 !== 0;
          return (
            <div
              key={i}
              className="splash-particle absolute rounded-full"
              style={{
                width: size + "px",
                height: size + "px",
                left: (8 + (i / particles.length) * 84) + "%",
                top: (10 + ((i * 37) % 80)) + "%",
                background: isGold ? "#F5E6C8" : "#6366f1",
                boxShadow: isGold ? "0 0 5px #F5E6C8" : "0 0 5px #6366f1",
                willChange: "transform",
              }}
            />
          );
        })}
      </div>

      {/* Rotating rings */}
      <div className="absolute flex items-center justify-center pointer-events-none">
        <div className="splash-ring splash-ring-1 absolute w-[320px] h-[320px] rounded-full border border-[#F5E6C8]/10" style={{ willChange: "transform" }} />
        <div className="splash-ring splash-ring-2 absolute w-[460px] h-[460px] rounded-full"
          style={{ border: "1px dashed rgba(99,102,241,0.18)", willChange: "transform" }} />
        <div className="splash-ring absolute w-[210px] h-[210px] rounded-full border border-white/5" />
      </div>

      {/* Main logo */}
      <div className="relative flex flex-col items-center z-10">
        <div className="splash-logo mb-6 relative" style={{ willChange: "transform, opacity, filter" }}>
          <div className="absolute inset-0 rounded-2xl blur-xl opacity-35"
            style={{ background: "radial-gradient(circle, #4f46e5, transparent)" }} />
          <img
            src="/logo-white.png"
            alt="شدج"
            className="relative h-28 md:h-36 w-auto object-contain drop-shadow-2xl rounded-2xl"
            style={{ filter: "drop-shadow(0 0 24px rgba(99,102,241,0.45))" }}
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Brand name */}
        <div className="splash-brand text-center" style={{ willChange: "transform, opacity" }}>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
            شـدج
          </h1>
        </div>

        {/* Divider line */}
        <div className="splash-line w-24 h-px my-4 origin-center" style={{ background: "linear-gradient(90deg, transparent, #F5E6C8, transparent)" }} />

        {/* Tagline */}
        <p className="splash-tagline text-[#F5E6C8]/60 text-sm tracking-[0.3em] font-light uppercase" style={{ willChange: "transform, opacity" }}>
          SHADJ GRAPHICS
        </p>
      </div>

      <p className="absolute bottom-6 text-white/20 text-xs">
        اضغط في أي مكان للتخطي
      </p>
    </div>
  );
}
