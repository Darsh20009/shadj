import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import logoWhite from "@assets/Screenshot_2026-06-20_at_1.20.57_PM_1781954838443.png";
import logoBlue from "@assets/Screenshot_2026-06-20_at_1.20.48_PM_1781954838431.png";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location === "/";
  const useDarkNav = !scrolled && isHome;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src={useDarkNav ? logoWhite : logoBlue} alt="Shadj Logo" className="h-10 object-contain" />
        </Link>
        <div className={`hidden md:flex items-center space-x-8 space-x-reverse ${useDarkNav ? 'text-white' : 'text-foreground'}`}>
          <Link href="/" className="hover:text-primary transition-colors font-medium">الرئيسية</Link>
          <Link href="/portfolio" className="hover:text-primary transition-colors font-medium">أعمالنا</Link>
          <Link href="/about" className="hover:text-primary transition-colors font-medium">من نحن</Link>
        </div>
        <div>
          <Link href="/order" className={`px-6 py-2 rounded-full font-medium transition-all ${useDarkNav ? 'bg-white text-primary hover:bg-gray-100' : 'bg-primary text-white hover:bg-primary/90'}`}>
            ابدأ مشروعك
          </Link>
        </div>
      </div>
    </nav>
  );
}
