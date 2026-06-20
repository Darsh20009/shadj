import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Package, Clock, CheckCircle, LogOut, User, Home } from "lucide-react";

interface Order {
  id: string;
  designType: string;
  description: string;
  status: string;
  budget: string | null;
  deadline: string | null;
  createdAt: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:     { label: "قيد المراجعة", color: "text-amber-600 bg-amber-50 border-amber-200",   icon: <Clock size={14} /> },
  "in-progress": { label: "جاري التنفيذ", color: "text-blue-600 bg-blue-50 border-blue-200",   icon: <Package size={14} /> },
  completed:   { label: "مكتمل",         color: "text-green-600 bg-green-50 border-green-200",   icon: <CheckCircle size={14} /> },
  cancelled:   { label: "ملغي",          color: "text-red-500 bg-red-50 border-red-200",          icon: <Clock size={14} /> },
};

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("shadj_token");
    const userData = localStorage.getItem("shadj_user");
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(userData);
    const adminRoles = ["admin", "designer", "writer"];
    if (adminRoles.includes(parsed.role)) {
      navigate("/admin");
      return;
    }
    setUser(parsed);

    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const myOrders = data.filter((o: Order) => true);
          setOrders(myOrders);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("shadj_token");
    localStorage.removeItem("shadj_user");
    navigate("/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f9f7f4]" dir="rtl">
      {/* Header */}
      <header className="bg-[#1a1a2e] text-white px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <img src="/logo-white.png" alt="شدج" className="h-8 object-contain" />
          <span className="text-white/40 text-sm hidden sm:block">لوحة العميل</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <User size={14} className="text-[#F5E6C8]" />
            <span className="text-sm font-medium text-white">{user.name}</span>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <Home size={18} />
          </Link>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#1a1a2e] mb-1">أهلاً، {user.name}! 👋</h1>
          <p className="text-gray-500">هنا تقدر تتابع طلباتك وحالتها</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "إجمالي الطلبات", value: orders.length, color: "text-[#3730A3]" },
            { label: "قيد المراجعة",  value: orders.filter(o => o.status === "pending").length,     color: "text-amber-600" },
            { label: "جاري التنفيذ",  value: orders.filter(o => o.status === "in-progress").length, color: "text-blue-600" },
            { label: "مكتملة",        value: orders.filter(o => o.status === "completed").length,   color: "text-green-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-black text-[#1a1a2e] text-lg">طلباتي</h2>
            <Link href="/order" className="bg-[#3730A3] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#1a1a2e] transition-colors">
              + طلب جديد
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-400">جاري التحميل...</div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-500 mb-2">لا توجد طلبات بعد</h3>
              <p className="text-gray-400 text-sm mb-6">ابدأ مشروعك الأول مع شَـــدِج الآن!</p>
              <Link href="/order" className="inline-block bg-[#3730A3] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1a1a2e] transition-colors">
                اطلب تصميمك الأول
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.map(order => {
                const st = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
                return (
                  <div key={order.id} className="px-6 py-5 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[#1a1a2e]">{order.designType}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-400 text-xs">#{order.id}</span>
                        </div>
                        <p className="text-gray-500 text-sm truncate mb-2">{order.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          {order.budget && <span>💰 {order.budget}</span>}
                          {order.deadline && <span>📅 {order.deadline}</span>}
                          <span>{new Date(order.createdAt).toLocaleDateString("ar-EG")}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shrink-0 ${st.color}`}>
                        {st.icon}
                        {st.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-l from-[#3730A3] to-[#1e1b4b] rounded-2xl p-8 text-center text-white">
          <h3 className="font-black text-xl mb-2">محتاج تصميم جديد؟</h3>
          <p className="text-white/70 text-sm mb-5">فريقنا جاهز لمساعدتك في أي وقت</p>
          <Link href="/order" className="inline-block bg-[#F5E6C8] text-[#1a1a2e] px-6 py-3 rounded-xl font-black hover:bg-white transition-colors">
            ابدأ مشروع جديد
          </Link>
        </div>
      </main>
    </div>
  );
}
