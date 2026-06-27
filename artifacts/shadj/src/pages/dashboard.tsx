import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useListOrders } from "@workspace/api-client-react";
import {
  Package, Clock, CheckCircle, LogOut, User, Home,
  PlusCircle, ChevronDown, ChevronUp, Mail, Phone,
  Calendar, DollarSign, FileText, Link2, AlertCircle,
  MessageSquare, Bell,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  fromName: string;
  fromEmail: string;
  toEmail: string;
  read: boolean;
  createdAt: string;
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
            <div className={`flex flex-col items-center flex-1`}>
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
            <a href={`https://wa.me/201129085243?text=${encodeURIComponent(`أهلاً، عندي استفسار بخصوص طلبي #${String(order.id || "").slice(-6)} (${order.designType})`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-[#25D366] hover:underline">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              تواصل بالواتساب بخصوص هذا الطلب
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

function MessageCard({ msg, token, onRead }: { msg: Message; token: string; onRead: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(o => !o);
    if (!msg.read && !open) {
      fetch(`/api/messages/${msg.id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => onRead(msg.id)).catch(() => {});
    }
  };

  const date = new Date(msg.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${!msg.read ? "border-[#3730A3]/30 bg-[#3730A3]/2" : "border-gray-100"}`}>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full px-5 py-4 flex items-center gap-4 text-right hover:bg-gray-50/70 transition-colors">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${msg.read ? "bg-gray-300" : "bg-[#3730A3] animate-pulse"}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-bold ${msg.read ? "text-gray-700" : "text-[#1a1a2e]"}`}>{msg.subject}</span>
            {!msg.read && (
              <span className="text-[10px] bg-[#3730A3] text-white px-2 py-0.5 rounded-full font-bold">جديد</span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-0.5">من {msg.fromName} • {date}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 bg-gray-50/30">
          <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-sm text-[#1a1a2e] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-left" dir="ltr">{date}</p>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(false);

  useEffect(() => {
    const t    = localStorage.getItem("shadj_token") || "";
    const userData = localStorage.getItem("shadj_user");
    if (!t || !userData) { navigate("/login"); return; }
    const parsed   = JSON.parse(userData);
    if (["admin", "designer", "writer"].includes(parsed.role)) { navigate("/admin"); return; }
    setUser(parsed);
    setToken(t);
    setReady(true);
  }, [navigate]);

  useEffect(() => {
    if (!token) return;
    setMsgsLoading(true);
    fetch("/api/messages", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setMsgsLoading(false));
  }, [token]);

  const { data: orders = [], isLoading } = useListOrders({ query: { enabled: ready } } as any);

  function handleLogout() {
    localStorage.removeItem("shadj_token");
    localStorage.removeItem("shadj_user");
    navigate("/login");
  }

  function markRead(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  }

  if (!user) return null;

  const total     = orders.length;
  const pending   = orders.filter(o => o.status === "pending").length;
  const inProg    = orders.filter(o => ["in_progress", "in-progress"].includes(o.status)).length;
  const completed = orders.filter(o => o.status === "completed").length;
  const unreadMsgs = messages.filter(m => !m.read).length;

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
          {unreadMsgs > 0 && (
            <div className="relative">
              <div className="flex items-center gap-1.5 bg-[#3730A3] border border-[#3730A3]/60 rounded-full px-3 py-1.5">
                <Bell size={13} className="text-[#F5E6C8]" />
                <span className="text-xs font-bold text-white">{unreadMsgs} رسالة جديدة</span>
              </div>
            </div>
          )}
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

        {/* Messages section */}
        {(messages.length > 0 || msgsLoading) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-[#3730A3]" />
                <h2 className="font-black text-[#1a1a2e]">رسائل الفريق</h2>
                {unreadMsgs > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {unreadMsgs}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{messages.length} رسالة</span>
            </div>

            {msgsLoading ? (
              <div className="py-10 text-center">
                <div className="w-6 h-6 border-2 border-[#3730A3] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-400 text-xs">جاري التحميل...</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {messages.map(msg => (
                  <MessageCard key={msg.id} msg={msg} token={token} onRead={markRead} />
                ))}
              </div>
            )}
          </div>
        )}

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
            <a href={`mailto:gfx@shadj-graphics.space?subject=استفسار من ${encodeURIComponent(user.name)}`}
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors">
              <Mail size={14} />
              راسلنا
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
