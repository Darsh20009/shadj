import { useGetVisitorLogs, useGetActiveUsers } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";

export default function AdminAnalytics() {
  const { data: logs = [], isLoading: logsLoading } = useGetVisitorLogs({ limit: 50 });
  const { data: activeUsers, isLoading: activeLoading } = useGetActiveUsers({
    query: { refetchInterval: 5000 }
  });

  if (logsLoading || activeLoading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">إحصائيات وسجلات الزوار</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">زوار نشطين الآن</CardTitle>
            <Users className="text-red-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#1a1a2e]">{activeUsers?.count || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">أحدث الجلسات (آخر 50)</CardTitle>
            <Clock className="text-blue-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#1a1a2e]">{logs.length}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4">سجل الزيارات</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>معرف الجلسة</TableHead>
              <TableHead>وقت البدء</TableHead>
              <TableHead>رحلة الزائر (الصفحات)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8">لا توجد سجلات</TableCell></TableRow>
            ) : logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-sm text-gray-500">
                  {log.sessionId.substring(0, 12)}...
                </TableCell>
                <TableCell>{new Date(log.startedAt).toLocaleString("ar-SA")}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {log.journey.map((page, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs" dir="ltr">
                        {page}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
