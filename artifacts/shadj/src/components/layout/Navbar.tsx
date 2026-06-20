import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = !scrolled && (location === "/" || location === "/about");

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <img src={dark ? "/logo-white.png" : "/logo-dark.png"} alt="شدج" className="h-10 object-contain" />
        </Link>
        <div className={`hidden md:flex items-center gap-8 font-semibold text-[15px] ${dark ? "text-white" : "text-[#1a1a2e]"}`}>
          <Link href="/" className="hover:text-[#3730A3] transition-colors">الرئيسية</Link>
          <Link href="/portfolio" className="hover:text-[#3730A3] transition-colors">شغلنا</Link>
          <Link href="/about" className="hover:text-[#3730A3] transition-colors">عن شدج</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/order" className={`hidden md:inline-block px-6 py-2.5 rounded-full font-bold text-sm transition-all ${dark ? "bg-[#F5E6C8] text-[#1a1a2e] hover:bg-white" : "bg-[#3730A3] text-white hover:bg-[#1a1a2e]"}`}>
            ابدأ دلوقتي
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden flex flex-col gap-1.5 p-2 ${dark ? "text-white" : "text-[#1a1a2e]"}`}>
            <span className={`block h-0.5 w-6 transition-all bg-current ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 transition-all bg-current ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-full right-0 left-0 bg-white shadow-xl border-t py-6 px-6 flex flex-col gap-4 text-[#1a1a2e] font-semibold">
          <Link href="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
          <Link href="/portfolio" onClick={() => setMenuOpen(false)}>شغلنا</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>عن شدج</Link>
          <Link href="/order" onClick={() => setMenuOpen(false)} className="bg-[#3730A3] text-white text-center py-3 rounded-full">ابدأ مشروعك</Link>
        </div>
      )}
    </nav>
  );
}
