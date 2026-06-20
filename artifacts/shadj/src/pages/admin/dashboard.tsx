import { useEffect, useRef } from "react";
import { useGetStats, useGetActiveUsers } from "@workspace/api-client-react";
import { Users, Briefcase, ShoppingBag, Eye, Clock, Activity, TrendingUp, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const MOCK_VISITS = [
  { day: "السبت", visits: 18 },
  { day: "الأحد", visits: 32 },
  { day: "الاثنين", visits: 27 },
  { day: "الثلاثاء", visits: 45 },
  { day: "الأربعاء", visits: 38 },
  { day: "الخميس", visits: 52 },
  { day: "الجمعة", visits: 41 },
];

const PAGE_BREAKDOWN = [
  { page: "الرئيسية", views: 120, color: "#3730A3" },
  { page: "الأعمال", views: 95, color: "#6366f1" },
  { page: "عن شَـــدِج", views: 48, color: "#8b5cf6" },
  { page: "الطلبات", views: 72, color: "#F5E6C8" },
  { page: "تسجيل دخول", views: 31, color: "#a78bfa" },
];

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: activeUsers, isLoading: activeLoading } = useGetActiveUsers();

  const statCards = [
    { title: "إجمالي الزوار", value: stats?.totalVisitors ?? 0, icon: Eye, color: "#3730A3", trend: "+12%" },
    { title: "الأعمال المنشورة", value: stats?.totalWorks ?? 0, icon: Briefcase, color: "#6366f1", trend: "+3" },
    { title: "إجمالي الطلبات", value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: "#10b981", trend: "+5" },
    { title: "طلبات معلقة", value: stats?.pendingOrders ?? 0, icon: Clock, color: "#f59e0b", trend: null },
    { title: "نشطون الآن", value: activeUsers?.count ?? 0, icon: Activity, color: "#ef4444", trend: "live" },
    { title: "زوار الشهر", value: stats?.monthlyVisitors ?? 0, icon: Users, color: "#8b5cf6", trend: "+28%" },
  ];

  if (statsLoading) {
    return (
      <div className="p-8 grid grid-cols-3 gap-5">
        {Array.from({length:6}).map((_,i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a2e]">لوحة التحكم</h1>
          <p className="text-gray-400 text-sm mt-0.5">مرحباً بك في إدارة شَـــدِج للجرافيك</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          مباشر
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.color + "15" }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                {card.trend && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    card.trend === "live"
                      ? "bg-red-50 text-red-500"
                      : "bg-green-50 text-green-600"
                  }`}>
                    {card.trend === "live" ? "🔴 مباشر" : `↑ ${card.trend}`}
                  </span>
                )}
              </div>
              <div className="text-3xl font-black text-[#1a1a2e] mb-1">{card.value}</div>
              <div className="text-gray-400 text-sm">{card.title}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Line Chart - Visits */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-[#1a1a2e]">زيارات الأسبوع</h2>
            <span className="flex items-center gap-1 text-green-500 text-xs font-bold">
              <TrendingUp size={14} /> +18% مقارنة بالأسبوع الماضي
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_VISITS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="visits" stroke="#3730A3" strokeWidth={3} dot={{ fill: "#3730A3", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Pages */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-black text-[#1a1a2e] mb-6">أكثر الصفحات زيارة</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PAGE_BREAKDOWN} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <YAxis dataKey="page" type="category" tick={{ fontSize: 11, fill: "#6b7280" }} width={60} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
              <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                {PAGE_BREAKDOWN.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Sessions */}
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
                    الصفحة الحالية: <span className="text-[#3730A3] font-medium">{session.currentPage}</span>
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
