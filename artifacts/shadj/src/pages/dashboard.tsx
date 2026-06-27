import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useListOrders } from "@workspace/api-client-react";
import {
  Package, Clock, CheckCircle, LogOut, User, Home,
  PlusCircle, ChevronDown, ChevronUp, Mail, Phone,
  Calendar, DollarSign, FileText, Link2, AlertCircle,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; dot: string; step: number }> = {
  pending:     { label: "قيد المراجعة",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200", dot: "bg-amber-400",  step: 1 },
  "in-progress":{ label: "جاري التنفيذ", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  dot: "bg-blue-500",   step: 2 },
  in_progress:  { label: "جاري التنفيذ", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  dot: "bg-blue-500",   step: 2 },
  completed:    { label: "مكتمل ✓",      color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200", dot: "bg-green-500",  step: 3 },
  cancelled:    { label: "ملغي",          color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",   dot: "bg-red-400",    step: 0 },
};

const TIMELINE_STEPS = [
  { label: "استُلم الطلب",   key: "pending"     },
  { label: "جاري التنفيذ",   key: "in_progress" },
  { label: "مكتمل",           key: "completed"   },
];

function StatusTimeline({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  if (cfg.step === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-red-500 font-bold">
        <AlertCircle size={13} /> الطلب ملغي
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 mt-3">
      {TIMELINE_STEPS.map((s, i) => {
        const done   = cfg.step > i;
        const active = cfg.step === i + 1;
        return (
          <div key={i} className="flex items-center gap-1 flex-1">
            <div className={`flex flex-col items-center flex-1 ${i === 0 ? "" : ""}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                done   ? "bg-green-500 text-white"
                : active ? "bg-[#3730A3] text-white shadow-md shadow-[#3730A3]/30"
                : "bg-gray-200 text-gray-400"}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-[9px] mt-0.5 font-bold leading-tight text-center ${
                done ? "text-green-600" : active ? "text-[#3730A3]" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mb-4 rounded transition-colors ${done || (active && i < cfg.step) ? "bg-green-300" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${open ? "border-[#3730A3]/30 shadow-md" : "border-gray-100"}`}>
      {/* Card header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-4 flex items-center gap-4 text-right hover:bg-gray-50/70 transition-colors">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
        <div className="flex-1 min-w-0 text-right">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#1a1a2e] text-sm">{order.designType}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400 text-xs font-mono">#{String(order.id || "").slice(-6)}</span>
          </div>
          <p className="text-gray-400 text-xs mt-0.5 truncate">{order.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
            {cfg.label}
          </span>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded details */}
      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 bg-gray-50/30">
          <StatusTimeline status={order.status} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <Detail icon={<FileText size={13} />} label="وصف المشروع" value={order.description} multiline />
            {order.budget && <Detail icon={<DollarSign size={13} />} label="الميزانية" value={order.budget} />}
            {order.deadline && <Detail icon={<Calendar size={13} />} label="الموعد المطلوب" value={order.deadline} />}
            {order.references && <Detail icon={<Link2 size={13} />} label="مراجع الإلهام" value={order.references} />}
            {order.clientPhone && <Detail icon={<Phone size={13} />} label="رقم التواصل" value={order.clientPhone} />}
            <Detail icon={<Clock size={13} />} label="تاريخ الطلب" value={createdAt} />
          </div>

          {order.adminNotes && (
            <div className="mt-4 bg-[#3730A3]/5 border border-[#3730A3]/20 rounded-xl p-4">
              <p className="text-xs font-bold text-[#3730A3] mb-1.5">💬 ملاحظات من الفريق</p>
              <p className="text-sm text-[#1a1a2e] leading-relaxed">{order.adminNotes}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
            <a href={`mailto:gfx@shadj-graphics.space?subject=استفسار بخصوص طلب %23${String(order.id || "").slice(-6)}`}
              className="flex items-center gap-2 text-xs font-bold text-[#3730A3] hover:underline">
              <Mail size={13} /> تواصل بخصوص هذا الطلب
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ icon, label, value, multiline = false }: { icon: React.ReactNode; label: string; value: string; multiline?: boolean }) {
  return (
    <div className="bg-white rounded-xl p-3.5 border border-gray-100">
      <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold mb-1.5">
        {icon} {label}
      </div>
      <p className={`text-sm text-[#1a1a2e] font-medium leading-relaxed ${multiline ? "" : "truncate"}`}>
        {value || "—"}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token    = localStorage.getItem("shadj_token");
    const userData = localStorage.getItem("shadj_user");
    if (!token || !userData) { navigate("/login"); return; }
    const parsed   = JSON.parse(userData);
    if (["admin", "designer", "writer"].includes(parsed.role)) { navigate("/admin"); return; }
    setUser(parsed);
    setReady(true);
  }, [navigate]);

  const { data: orders = [], isLoading } = useListOrders({ query: { enabled: ready } } as any);

  function handleLogout() {
    localStorage.removeItem("shadj_token");
    localStorage.removeItem("shadj_user");
    navigate("/login");
  }

  if (!user) return null;

  const total     = orders.length;
  const pending   = orders.filter(o => o.status === "pending").length;
  const inProg    = orders.filter(o => ["in_progress", "in-progress"].includes(o.status)).length;
  const completed = orders.filter(o => o.status === "completed").length;

  const stats = [
    { label: "إجمالي الطلبات", value: total,     color: "text-[#3730A3]",  bg: "bg-[#3730A3]/5"  },
    { label: "قيد المراجعة",   value: pending,   color: "text-amber-600",  bg: "bg-amber-50"     },
    { label: "جاري التنفيذ",   value: inProg,    color: "text-blue-600",   bg: "bg-blue-50"      },
    { label: "مكتملة",         value: completed, color: "text-green-600",  bg: "bg-green-50"     },
  ];

  return (
    <div className="min-h-screen bg-[#f9f7f4]" dir="rtl">
      {/* Header */}
      <header className="bg-[#1a1a2e] text-white px-6 py-4 flex items-center justify-between shadow-xl sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo-white.png" alt="شدج" className="h-7 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="font-black text-[#F5E6C8] text-base">شَـدِج</span>
          <span className="text-white/30 hidden sm:block">|</span>
          <span className="text-white/40 text-xs hidden sm:block">لوحة العميل</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
            <User size={13} className="text-[#F5E6C8]" />
            <span className="text-xs font-medium text-white">{user.name}</span>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
            <Home size={17} />
          </Link>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/5">
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl">
        {/* Welcome */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1a1a2e] mb-1">أهلاً، {user.name}! 👋</h1>
            <p className="text-gray-400 text-sm">{user.email} — تقدر تتابع كل طلباتك من هنا</p>
          </div>
          <Link href="/order"
            className="flex items-center gap-2 bg-[#3730A3] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1a1a2e] transition-colors shadow-lg shadow-[#3730A3]/20">
            <PlusCircle size={15} />
            طلب جديد
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-5 border border-transparent text-center`}>
              <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-black text-[#1a1a2e]">طلباتي</h2>
            {!isLoading && orders.length > 0 && (
              <span className="text-xs text-gray-400">{orders.length} طلب — اضغط لتفاصيل كل طلب</span>
            )}
          </div>

          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-[#3730A3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">جاري التحميل...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center px-6">
              <Package size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="font-bold text-gray-500 mb-2">لا توجد طلبات بعد</h3>
              <p className="text-gray-400 text-sm mb-6">ابدأ مشروعك الأول مع شَـدِج الآن!</p>
              <Link href="/order"
                className="inline-block bg-[#3730A3] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1a1a2e] transition-colors">
                اطلب تصميمك الأول
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Help card */}
        <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white"
          style={{ background: "linear-gradient(135deg,#3730A3,#1e1b4b)" }}>
          <div>
            <h3 className="font-black text-lg mb-1">محتاج مساعدة؟</h3>
            <p className="text-white/60 text-sm">فريقنا جاهز للرد على أي استفسار</p>
          </div>
          <div className="flex gap-3">
            <a href="mailto:gfx@shadj-graphics.space"
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors">
              <Mail size={14} /> راسلنا
            </a>
            <Link href="/order"
              className="flex items-center gap-2 bg-[#F5E6C8] text-[#1a1a2e] px-5 py-2.5 rounded-xl text-sm font-black hover:bg-white transition-colors">
              <PlusCircle size={14} /> طلب جديد
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
