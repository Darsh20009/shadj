import { useGetStats, useGetActiveUsers, useGetVisitorLogs, useGetMe } from "@workspace/api-client-react";
import { getTimeGreeting } from "@/lib/greeting";
import { Users, Briefcase, ShoppingBag, Eye, Clock, Activity, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const PAGE_LABELS: Record<string, string> = {
  "/": "الرئيسية",
  "/portfolio": "أعمالنا",
  "/about": "عن شَدِج",
  "/order": "الطلبات",
  "/login": "تسجيل دخول",
};
const PAGE_COLORS = ["#3730A3", "#6366f1", "#8b5cf6", "#F5E6C8", "#a78bfa"];

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: activeUsers } = useGetActiveUsers();
  const { data: logs = [] } = useGetVisitorLogs({ limit: 500 });
  const { data: me } = useGetMe();

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { day: DAYS_AR[d.getDay()], date: d.toDateString(), visits: 0 };
  });
  logs.forEach(log => {
    const logDate = new Date(log.startedAt).toDateString();
    const entry = weekData.find(d => d.date === logDate);
    if (entry) entry.visits++;
  });

  const pageFreq: Record<string, number> = {};
  logs.forEach(log => {
    (log.journey as string[]).forEach(page => {
      pageFreq[page] = (pageFreq[page] || 0) + 1;
    });
  });
  const pageData = Object.entries(pageFreq)
    .map(([page, views]) => ({ page: PAGE_LABELS[page] || page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((p, i) => ({ ...p, color: PAGE_COLORS[i] }));

  const statCards = [
    { title: "إجمالي الزوار",   value: stats?.totalVisitors ?? 0,  icon: Eye,       color: "#3730A3", trend: null },
    { title: "الأعمال المنشورة", value: stats?.totalWorks ?? 0,     icon: Briefcase, color: "#6366f1", trend: null },
    { title: "إجمالي الطلبات",  value: stats?.totalOrders ?? 0,    icon: ShoppingBag,color: "#10b981", trend: null },
    { title: "طلبات معلقة",     value: stats?.pendingOrders ?? 0,  icon: Clock,     color: "#f59e0b", trend: null },
    { title: "نشطون الآن",      value: activeUsers?.count ?? 0,    icon: Activity,  color: "#ef4444", trend: "live" },
    { title: "زوار الشهر",      value: stats?.monthlyVisitors ?? 0,icon: Users,     color: "#8b5cf6", trend: null },
  ];

  if (statsLoading) {
    return (
      <div className="p-8 grid grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          {me ? (() => { const g = getTimeGreeting(me.name); return (
            <>
              <h1 className="text-2xl font-black text-[#1a1a2e]">{g.headline}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{g.sub}</p>
            </>
          ); })() : <h1 className="text-2xl font-black text-[#1a1a2e]">لوحة التحكم</h1>}
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          مباشر
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.color + "15" }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                {card.trend === "live" && (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-50 text-red-500">🔴 مباشر</span>
                )}
              </div>
              <div className="text-3xl font-black text-[#1a1a2e] mb-1">{card.value}</div>
              <div className="text-gray-400 text-sm">{card.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-[#1a1a2e]">زيارات آخر 7 أيام</h2>
            <span className="flex items-center gap-1 text-[#3730A3] text-xs font-bold bg-[#3730A3]/5 px-3 py-1 rounded-full">
              <TrendingUp size={12} /> بيانات حقيقية
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="visits" stroke="#3730A3" strokeWidth={3} dot={{ fill: "#3730A3", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-black text-[#1a1a2e] mb-6">أكثر الصفحات زيارة</h2>
          {pageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pageData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} allowDecimals={false} />
                <YAxis dataKey="page" type="category" tick={{ fontSize: 11, fill: "#6b7280" }} width={65} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                  {pageData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-300 text-sm">
              لا توجد بيانات بعد
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-black text-[#1a1a2e]">الزوار النشطون الآن</h2>
          <span className="bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-full">
            {activeUsers?.count ?? 0} زائر
          </span>
        </div>
        {!activeUsers?.sessions?.length ? (
          <div className="py-16 text-center text-gray-400">
            <Activity size={32} className="mx-auto mb-3 opacity-30" />
            <p>لا يوجد زوار نشطون حالياً</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {activeUsers.sessions.map((session) => (
              <div key={session.sessionId} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-xl bg-[#3730A3]/10 flex items-center justify-center shrink-0">
                  <Activity size={16} className="text-[#3730A3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1a2e] truncate font-mono">
                    {session.sessionId.substring(0, 12)}...
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    الصفحة الحالية: <span className="text-[#3730A3] font-medium">{PAGE_LABELS[session.currentPage] || session.currentPage}</span>
                  </p>
                </div>
                <div className="text-xs text-gray-400 shrink-0">
                  {new Date(session.startedAt).toLocaleTimeString("ar-SA")}
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
