import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { LayoutDashboard, Image as ImageIcon, ShoppingBag, Users, BarChart3, LogOut, Loader2 } from "lucide-react";
import logoWhite from "@assets/Screenshot_2026-06-20_at_1.20.57_PM_1781954838443.png";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, error } = useGetMe();
  const logout = useLogout();

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      setLocation("/login");
    }
  }, [user, isLoading, error, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/admin/portfolio", label: "الأعمال", icon: ImageIcon },
    { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
    { href: "/admin/users", label: "المستخدمين", icon: Users },
    { href: "/admin/analytics", label: "الإحصائيات", icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout.mutate({}, {
      onSuccess: () => setLocation("/login")
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-[#1a1a2e]" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a2e] text-white flex flex-col fixed h-full shrink-0 shadow-2xl z-20">
        <div className="p-6 pb-8 border-b border-white/10 flex justify-center">
          <Link href="/">
            <img src={logoWhite} alt="Shadj" className="h-10 object-contain hover:scale-105 transition-transform" />
          </Link>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-[#F5E6C8] font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                  isActive ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors font-medium"
          >
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64">
        {children}
      </main>
    </div>
  );
}
