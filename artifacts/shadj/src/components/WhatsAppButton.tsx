import { useEffect, useState } from "react";
import { Link } from "wouter";

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <Link href="/order" aria-label="ابدأ مشروعك الآن" className="fixed bottom-6 left-6 z-50 group">
      <div className="relative">
        <span className="absolute inset-0 rounded-full opacity-30 animate-ping"
          style={{ background: "linear-gradient(135deg,#e2b979,#c9973a)" }} />
        <div
          className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ background: "linear-gradient(135deg,#3730A3,#6366f1)", boxShadow: "0 8px 32px rgba(55,48,163,0.45)" }}
        >
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="absolute bottom-16 left-0 bg-[#1a1a2e] text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10">
          ابدأ مشروعك الآن
          <div className="absolute bottom-[-4px] left-5 w-2 h-2 bg-[#1a1a2e] rotate-45 border-b border-r border-white/10" />
        </div>
      </div>
    </Link>
  );
}
