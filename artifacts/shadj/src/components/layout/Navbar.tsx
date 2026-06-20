import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const darkPages = ["/", "/about"];
  const dark = !scrolled && darkPages.includes(location);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/portfolio", label: "أعمالنا" },
    { href: "/about", label: "عن شدج" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/96 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between" dir="rtl">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src={dark ? "/logo-white.png" : "/logo-transparent.png"}
            alt="شدج للجرافيك"
            className={`h-11 w-auto object-contain transition-all duration-300 ${dark ? "rounded-xl" : ""}`}
            style={dark ? { borderRadius: "10px" } : {}}
          />
        </Link>

        {/* Desktop nav */}
        <div className={`hidden md:flex items-center gap-7 font-semibold text-[14px] ${dark ? "text-white/85" : "text-[#1a1a2e]"}`}>
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`hover:text-[#3730A3] transition-colors ${location === l.href ? (dark ? "text-[#F5E6C8]" : "text-[#3730A3]") : ""}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
            className={`font-semibold text-sm transition-colors px-4 py-2 rounded-full ${dark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-[#1a1a2e] hover:bg-gray-100"}`}>
            دخول
          </Link>
          <Link href="/order"
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 ${dark ? "bg-[#F5E6C8] text-[#1a1a2e] hover:bg-white shadow-lg" : "bg-[#3730A3] text-white hover:bg-[#1e1b4b] shadow-lg shadow-[#3730A3]/20"}`}>
            ابدأ مشروعك
          </Link>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors ${dark ? "text-white hover:bg-white/10" : "text-[#1a1a2e] hover:bg-gray-100"}`}
          aria-label="فتح القائمة">
          <span className={`block h-0.5 w-6 bg-current transition-all origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition-all ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition-all origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full right-0 left-0 bg-white shadow-2xl border-t border-gray-100 py-6 px-6 flex flex-col gap-2" dir="rtl">
          {/* Logo in mobile menu */}
          <div className="flex justify-center pb-4 border-b border-gray-100 mb-2">
            <img src="/logo-transparent.png" alt="شدج" className="h-12 w-auto object-contain" />
          </div>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className={`py-3 px-4 rounded-xl font-semibold transition-colors ${location === l.href ? "bg-[#3730A3]/8 text-[#3730A3]" : "text-[#1a1a2e] hover:bg-gray-50"}`}>
              {l.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-4 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMenuOpen(false)}
              className="py-3 px-4 rounded-xl font-semibold text-gray-500 hover:bg-gray-50 transition-colors text-center border border-gray-200">
              تسجيل الدخول
            </Link>
            <Link href="/order" onClick={() => setMenuOpen(false)}
              className="bg-[#3730A3] text-white text-center py-3.5 rounded-xl font-black hover:bg-[#1e1b4b] transition-colors">
              ابدأ مشروعك ←
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
