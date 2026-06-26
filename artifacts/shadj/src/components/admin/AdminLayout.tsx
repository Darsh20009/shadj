import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { LayoutDashboard, Image as ImageIcon, ShoppingBag, Users, BarChart3, LogOut, Loader2, ExternalLink, Menu } from "lucide-react";
import { AdminWelcomeJoke } from "./AdminWelcomeJoke";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showJoke, setShowJoke] = useState(false);
  const { data: user, isLoading, error } = useGetMe();
  const logout = useLogout();

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      setLocation("/login");
    }
  }, [user, isLoading, error, setLocation]);

  useEffect(() => {
    if (!isLoading && user && (user.role === "admin" || user.role === "designer" || user.role === "writer")) {
      const key = `shadj_admin_joked_${user.email}`;
      if (!sessionStorage.getItem(key)) {
        setShowJoke(true);
      }
    }
  }, [user, isLoading]);

  const handleJokeEnter = useCallback(() => {
    if (user) {
      sessionStorage.setItem(`shadj_admin_joked_${user.email}`, "1");
    }
    setShowJoke(false);
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0e1a]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F5E6C8]" />
      </div>
    );
  }

  if (showJoke) {
    return <AdminWelcomeJoke name={user.name} onEnter={handleJokeEnter} />;
  }

  const navItems = [
    { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/admin/portfolio", label: "الأعمال", icon: ImageIcon },
    { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
    { href: "/admin/users", label: "المستخدمين", icon: Users },
    { href: "/admin/analytics", label: "الإحصائيات", icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => setLocation("/login") });
  };

  const roleLabels: Record<string, string> = {
    admin: "مدير",
    designer: "مصمم",
    writer: "كاتب محتوى",
  };

  const Sidebar = () => (
    <aside className="w-64 bg-[#0f0e1a] text-white flex flex-col h-full shadow-2xl border-l border-white/5">
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/">
          <img src="/logo-white.png" alt="شدج" className="h-9 object-contain hover:opacity-80 transition-opacity" />
        </Link>
        <Link href="/" className="text-gray-500 hover:text-white transition-colors">
          <ExternalLink size={16} />
        </Link>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3730A3] flex items-center justify-center text-[#F5E6C8] font-black text-base">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm text-white">{user.name}</p>
            <p className="text-xs text-gray-500">{roleLabels[user.role] || user.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = location === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? "bg-[#3730A3] text-white shadow-lg shadow-[#3730A3]/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {label}
              {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-[#F5E6C8]" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-medium text-sm"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 text-[#1a1a2e]" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed right-0 top-0 h-full w-64 z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex" dir="rtl">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 mr-auto">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:mr-64 min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0f0e1a] border-b border-white/10">
          <img src="/logo-white.png" alt="شدج" className="h-8 object-contain" />
          <button onClick={() => setSidebarOpen(true)} className="text-white p-2">
            <Menu size={20} />
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
