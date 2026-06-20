import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import logoWhite from "@assets/Screenshot_2026-06-20_at_1.20.57_PM_1781954838443.png";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  
  const handleCompleteRef = useRef(onComplete);
  handleCompleteRef.current = onComplete;

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("shadj_splash_seen");
    if (hasSeen) {
      handleCompleteRef.current();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("shadj_splash_seen", "true");
          handleCompleteRef.current();
        }
      });

      tl.fromTo(logoRef.current, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
      )
      .to(logoRef.current, { opacity: 0, scale: 1.1, duration: 1, delay: 2, ease: "power2.inOut" })
      .to(containerRef.current, { opacity: 0, duration: 0.5 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-[#1a1a2e] flex flex-col items-center justify-center pointer-events-auto">
      <button 
        onClick={() => {
          sessionStorage.setItem("shadj_splash_seen", "true");
          handleCompleteRef.current();
        }}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-10 px-4 py-2 border border-white/20 rounded-full text-sm"
      >
        تخطي
      </button>
      <div className="relative">
        <img ref={logoRef} src={logoWhite} alt="Shadj Logo" className="h-32 object-contain" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundSize: "200% 100%" }}></div>
      </div>
    </div>
  );
}
