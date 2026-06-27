import { useState, useEffect } from "react";

interface Props {
  name: string;
  onEnter: () => void;
}

export function AdminWelcomeJoke({ name, onEnter }: Props) {
  const [stage, setStage] = useState<"banned" | "laugh" | "enter">("banned");
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setDots(d => (d + 1) % 4), 500);
    const t1 = setTimeout(() => setStage("laugh"), 2200);
    return () => { clearInterval(iv); clearTimeout(t1); };
  }, []);

  useEffect(() => {
    if (stage === "enter") {
      const t = setTimeout(onEnter, 600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [stage, onEnter]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0f0e1a 0%, #1e1b4b 60%, #0f0e1a 100%)" }}
      dir="rtl"
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 5 === 0 ? "2px" : "1px",
              height: i % 5 === 0 ? "2px" : "1px",
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              opacity: 0.1 + (i % 4) * 0.08,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">

        {/* Stage: Banned */}
        {stage === "banned" && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="text-8xl mb-6 animate-bounce">🚫</div>
            <h1 className="text-3xl font-black text-red-400 mb-3">
              ممـنـوع الـدخـول
            </h1>
            <p className="text-white/40 text-sm">
              جاري فحص الهوية{".".repeat(dots)}
            </p>
          </div>
        )}

        {/* Stage: Laugh */}
        {stage === "laugh" && (
          <div className="animate-in fade-in zoom-in-90 duration-500 flex flex-col items-center gap-5">
            <div className="text-7xl">😂</div>
            <div className="space-y-3">
              <p className="text-xl font-black text-[#F5E6C8] leading-relaxed">
                وانتِ زعلانة ابتسمي يا {name} 😄
              </p>
              <p className="text-base text-white/70 leading-loose">
                الله يهديكي خلي ربنا يرزقنا 🤲
              </p>
              <p className="text-sm text-[#e2b979]/70">
                يلا ادخلي يا صاحبة الملايين 💎
              </p>
            </div>
            <button
              onClick={() => setStage("enter")}
              className="mt-2 px-8 py-3.5 rounded-2xl font-black text-base transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: "linear-gradient(135deg,#e2b979,#c9973a)", color: "#0d0d0d" }}
            >
              يلا أدخل 😂 ←
            </button>
          </div>
        )}

        {/* Stage: Enter */}
        {stage === "enter" && (
          <div className="animate-in fade-in duration-300">
            <div className="text-5xl mb-3">✨</div>
            <p className="text-[#F5E6C8] font-black text-lg">أهلاً يا {name}!</p>
          </div>
        )}
      </div>
    </div>
  );
}
