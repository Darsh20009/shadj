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
                <a href="https://wa.me/201129085243?text=%D8%A3%D9%87%D9%84%D8%A7%D9%8B%2C+%D8%B9%D9%86%D8%AF%D9%8A+%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1+%D8%B9%D9%86+%D8%AE%D8%AF%D9%85%D8%A7%D8%AA+%D8%B4%D9%8E%D8%AF%D8%AC" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5E6C8] transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  واتساب +20 112 908 5243
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
