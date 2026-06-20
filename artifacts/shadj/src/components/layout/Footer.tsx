import { Link } from "wouter";
import logoWhite from "@assets/Screenshot_2026-06-20_at_1.20.57_PM_1781954838443.png";

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white py-16">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <img src={logoWhite} alt="Shadj Logo" className="h-12 object-contain mb-6" />
          <p className="text-gray-400 leading-relaxed max-w-sm">
            وكالة شدج للتصميم الجرافيكي. نصنع هوية بصرية تترك أثراً، ونبني علامات تجارية تنبض بالحياة.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-6 font-serif">روابط سريعة</h3>
          <ul className="space-y-4 text-gray-400">
            <li><Link href="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
            <li><Link href="/portfolio" className="hover:text-white transition-colors">أعمالنا</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">من نحن</Link></li>
            <li><Link href="/order" className="hover:text-white transition-colors">ابدأ مشروعك</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-6 font-serif">تواصل معنا</h3>
          <ul className="space-y-4 text-gray-400">
            <li>info@shadj.com</li>
            <li>+966 50 123 4567</li>
            <li>الرياض، المملكة العربية السعودية</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        جميع الحقوق محفوظة © {new Date().getFullYear()} وكالة شدج
      </div>
    </footer>
  );
}
