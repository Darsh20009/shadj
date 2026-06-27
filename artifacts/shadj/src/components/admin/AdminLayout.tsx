import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { LayoutDashboard, Image as ImageIcon, ShoppingBag, Users, BarChart3, LogOut, Loader2, ExternalLink, Menu, Mail, Sparkles, BookOpen, Coins } from "lucide-react";
import { AdminWelcomeJoke } from "./AdminWelcomeJoke";

function useUnreadCount(token: string | null) {
  const [count, setCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!token) return;
    const fetch_ = () =>
      fetch("/api/messages/unread-count", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(d => setCount(d.count ?? 0)).catch(() => {});
    fetch_();
    timerRef.current = setInterval(fetch_, 30_000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [token]);
  return count;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  badge: number;
}

interface SidebarProps {
  navItems: NavItem[];
  user: { name: string; role: string };
  location: string;
  onClose: () => void;
  onLogout: () => void;
}

function AdminSidebar({ navItems, user, location, onClose, onLogout }: SidebarProps) {
  const roleLabels: Record<string, string> = {
    admin: "مدير",
    designer: "مصمم",
    writer: "كاتب محتوى",
  };

  return (
    <aside className="w-64 bg-[#0f0e1a] text-white flex flex-col h-full shadow-2xl border-l border-white/5">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/">
          <img src="/logo-white.png" alt="شدج" className="h-9 object-contain hover:opacity-80 transition-opacity" />
        </Link>
        <Link href="/" className="text-gray-500 hover:text-white transition-colors">
          <ExternalLink size={16} />
        </Link>
      </div>

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

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive = location === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? "bg-[#3730A3] text-white shadow-lg shadow-[#3730A3]/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center leading-none shadow-md">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
              {isActive && badge === 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#F5E6C8]" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-medium text-sm"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showJoke, setShowJoke] = useState(false);
  const { data: user, isLoading, error } = useGetMe();
  const logout = useLogout();
  const token = typeof window !== "undefined" ? localStorage.getItem("shadj_token") : null;
  const unreadCount = useUnreadCount(token);

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

  const handleLogout = useCallback(() => {
    logout.mutate(undefined, { onSuccess: () => setLocation("/login") });
  }, [logout, setLocation]);

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

  const navItems: NavItem[] = [
    { href: "/admin",            label: "لوحة التحكم",            icon: LayoutDashboard, badge: 0 },
    { href: "/admin/portfolio",  label: "الأعمال",                icon: ImageIcon,       badge: 0 },
    { href: "/admin/orders",     label: "الطلبات",                icon: ShoppingBag,     badge: 0 },
    { href: "/admin/messages",   label: "المراسلات",              icon: Mail,            badge: unreadCount },
    { href: "/admin/finances",   label: "المكاسب المالية",        icon: Coins,           badge: 0 },
    { href: "/admin/ai-tools",   label: "أدوات الذكاء الاصطناعي", icon: Sparkles,        badge: 0 },
    { href: "/admin/resources",  label: "موارد المصمم",           icon: BookOpen,        badge: 0 },
    { href: "/admin/users",      label: "المستخدمين",             icon: Users,           badge: 0 },
    { href: "/admin/analytics",  label: "الإحصائيات",             icon: BarChart3,       badge: 0 },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-[#1a1a2e]" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed right-0 top-0 h-full w-64 z-20">
        <AdminSidebar
          navItems={navItems}
          user={user}
          location={location}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex" dir="rtl">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full mr-auto">
            <AdminSidebar
              navItems={navItems}
              user={user}
              location={location}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
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
