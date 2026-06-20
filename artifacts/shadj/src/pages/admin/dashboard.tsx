import { useGetStats, useGetActiveUsers } from "@workspace/api-client-react";
import { Users, Briefcase, ShoppingBag, Eye, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: activeUsers, isLoading: activeLoading } = useGetActiveUsers({
    query: { refetchInterval: 5000 }
  });

  if (statsLoading || activeLoading) {
    return <div className="p-8 text-center text-gray-500">جاري التحميل...</div>;
  }

  const statCards = [
    { title: "إجمالي الزوار", value: stats?.totalVisitors || 0, icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "الأعمال", value: stats?.totalWorks || 0, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "إجمالي الطلبات", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-green-500", bg: "bg-green-50" },
    { title: "الطلبات المعلقة", value: stats?.pendingOrders || 0, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
    { title: "المستخدمين النشطين (الآن)", value: activeUsers?.count || 0, icon: Activity, color: "text-red-500", bg: "bg-red-50" },
    { title: "زوار الشهر", value: stats?.monthlyVisitors || 0, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          مباشر (يتم التحديث تلقائياً)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#1a1a2e]">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>الزوار النشطين حالياً</CardTitle>
          </CardHeader>
          <CardContent>
            {activeUsers?.sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا يوجد زوار نشطين حالياً.</p>
            ) : (
              <div className="space-y-4">
                {activeUsers?.sessions.map((session) => (
                  <div key={session.sessionId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Activity size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">الجلسة: {session.sessionId.substring(0, 8)}...</p>
                        <p className="text-xs text-gray-500 mt-1">الصفحة: {session.currentPage}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(session.startedAt).toLocaleTimeString("ar-SA")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
