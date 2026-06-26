import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#0f0e1a] text-white pt-20 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <img src="/logo-white.png" alt="شدج" className="h-14 object-contain mb-5" />
            <p className="text-gray-400 leading-relaxed text-sm max-w-xs">شَـــدِج للجرافيك — بنعمل تصاميم بتنطق بالإبداع وتفرق مع كل عميل. شغلنا بيتكلم عن نفسه.</p>
            <p className="text-[#F5E6C8]/60 text-xs mt-4">shadj-graphics.space</p>
          </div>
          <div>
            <h3 className="font-bold mb-5 text-[#F5E6C8] text-sm">الموقع</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition-colors">شغلنا</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">عن شَـــدِج</Link></li>
              <li><Link href="/order" className="hover:text-white transition-colors">ابدأ مشروعك</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-5 text-[#F5E6C8] text-sm">تواصل معنا</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="mailto:gfx@shadj-graphics.space" className="hover:text-[#F5E6C8] transition-colors">
                  gfx@shadj-graphics.space
                </a>
              </li>
              <li>shadj-graphics.space</li>
              <li>مصر · السعودية</li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-xs">IG</a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-xs">TW</a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-xs">BE</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} شَـــدِج للجرافيك — جميع الحقوق محفوظة</p>
          <p>
            صُنع بحب عبر{" "}
            <a
              href="https://qiroxstudio.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5E6C8] hover:text-white transition-colors font-medium"
            >
              كيروكس ستوديو
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
