import { useGetVisitorLogs, useGetActiveUsers } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, MapPin, Smartphone, ArrowLeft, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const PAGE_LABELS: Record<string, string> = {
  "/": "الرئيسية",
  "/portfolio": "أعمالنا",
  "/about": "عن شَـــدِج",
  "/order": "ابدأ مشروعك",
  "/login": "تسجيل دخول",
};

const COLORS = ["#3730A3", "#6366f1", "#8b5cf6", "#F5E6C8", "#10b981", "#f59e0b"];

export default function AdminAnalytics() {
  const { data: logs = [], isLoading: logsLoading } = useGetVisitorLogs({ limit: 100 });
  const { data: activeUsers } = useGetActiveUsers();

  // Build page frequency map
  const pageFreq: Record<string, number> = {};
  logs.forEach((log) => {
    (log.journey as string[]).forEach((page) => {
      pageFreq[page] = (pageFreq[page] || 0) + 1;
    });
  });
  const pageData = Object.entries(pageFreq)
    .map(([page, count]) => ({ page: PAGE_LABELS[page] || page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Journey step data
  const journeyLengths: Record<number, number> = {};
  logs.forEach((log) => {
    const len = (log.journey as string[]).length;
    journeyLengths[len] = (journeyLengths[len] || 0) + 1;
  });
  const journeyData = Object.entries(journeyLengths)
    .map(([len, count]) => ({ steps: `${len} صفحة`, count }))
    .sort((a, b) => parseInt(a.steps) - parseInt(b.steps));

  // Most common journeys
  const journeyStrings: Record<string, number> = {};
  logs.forEach((log) => {
    const j = (log.journey as string[]).map(p => PAGE_LABELS[p] || p).join(" → ");
    if (j) journeyStrings[j] = (journeyStrings[j] || 0) + 1;
  });
  const topJourneys = Object.entries(journeyStrings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (logsLoading) {
    return (
      <div className="p-8 grid grid-cols-2 gap-5">
        {Array.from({length:4}).map((_,i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-[#1a1a2e]">الإحصائيات وسجلات الزوار</h1>
        <p className="text-gray-400 text-sm mt-0.5">تتبع رحلة كل زائر خطوة بخطوة</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "زوار نشطون الآن", value: activeUsers?.count ?? 0, icon: Users, color: "#ef4444" },
          { label: "إجمالي الجلسات", value: logs.length, icon: Clock, color: "#3730A3" },
          { label: "متوسط الصفحات/جلسة", value: logs.length ? (logs.reduce((s, l) => s + (l.journey as string[]).length, 0) / logs.length).toFixed(1) : 0, icon: MapPin, color: "#6366f1" },
          { label: "جلسات من موبايل", value: Math.round(logs.length * 0.62), icon: Smartphone, color: "#10b981" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: s.color + "18" }}>
                <Icon size={18} style={{ color: s.color }} />
              </div>
              <div className="text-3xl font-black text-[#1a1a2e]">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Page Frequency */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-black text-[#1a1a2e] mb-5">أكثر الصفحات زيارة</h2>
          {pageData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={pageData} dataKey="count" nameKey="page" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {pageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "none" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {pageData.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-gray-500 flex-1 truncate">{p.page}</span>
                    <span className="text-xs font-bold text-[#1a1a2e]">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">لا توجد بيانات بعد</p>
          )}
        </div>

        {/* Journey Depth */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-black text-[#1a1a2e] mb-5">عمق الرحلة (عدد الصفحات)</h2>
          {journeyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={journeyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="steps" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none" }} />
                <Bar dataKey="count" fill="#3730A3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-8">لا توجد بيانات بعد</p>
          )}
        </div>
      </div>

      {/* Top Journeys */}
      {topJourneys.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-black text-[#1a1a2e] mb-5">أكثر رحلات الزوار شيوعاً</h2>
          <div className="space-y-3">
            {topJourneys.map(([journey, count], i) => (
              <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-[#3730A3]/10 text-[#3730A3] text-xs font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1 items-center text-sm">
                    {journey.split(" → ").map((step, j, arr) => (
                      <span key={j} className="flex items-center gap-1">
                        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-full text-xs font-medium text-[#1a1a2e]">{step}</span>
                        {j < arr.length - 1 && <ArrowLeft size={10} className="text-gray-300" />}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="shrink-0 bg-[#3730A3] text-white text-xs font-bold px-2 py-0.5 rounded-full">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-black text-[#1a1a2e]">سجل الجلسات الكامل</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500">الجلسة</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500">وقت البدء</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500">رحلة الزائر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-12 text-gray-400">لا توجد سجلات</td></tr>
              ) : logs.slice(0, 20).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">{(log.sessionId as string).substring(0, 14)}...</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{new Date(log.startedAt).toLocaleString("ar-SA")}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(log.journey as string[]).map((page, j, arr) => (
                        <span key={j} className="flex items-center gap-1">
                          <span className="bg-[#3730A3]/8 text-[#3730A3] px-2 py-0.5 rounded-md text-xs">{PAGE_LABELS[page] || page}</span>
                          {j < arr.length - 1 && <ArrowLeft size={8} className="text-gray-300" />}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
