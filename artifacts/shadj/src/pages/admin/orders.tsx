import { useListOrders, useUpdateOrder } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { getListOrdersQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const statusMap: Record<string, { label: string, color: string }> = {
  pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
  in_progress: { label: "قيد التنفيذ", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  completed: { label: "مكتمل", color: "bg-green-100 text-green-800 hover:bg-green-200" },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800 hover:bg-red-200" },
};

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useListOrders();
  const updateOrder = useUpdateOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = (id: string, newStatus: string) => {
    // @ts-ignore - The types are slightly mismatched in the generated code
    updateOrder.mutate({ id, data: { status: newStatus } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "تم تحديث حالة الطلب" });
      }
    });
  };

  if (isLoading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العميل</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>نوع التصميم</TableHead>
              <TableHead>تاريخ الطلب</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left">تحديث الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">لا يوجد طلبات</TableCell></TableRow>
            ) : orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.clientName}</TableCell>
                <TableCell dir="ltr" className="text-right">{order.clientEmail}</TableCell>
                <TableCell>{order.designType}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString("ar-SA")}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border-none ${statusMap[order.status]?.color || ""}`}>
                    {statusMap[order.status]?.label || order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-left">
                  <Select 
                    defaultValue={order.status} 
                    onValueChange={(val) => handleStatusChange(order.id, val)}
                  >
                    <SelectTrigger className="w-[140px] mr-auto text-right" dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="pending">قيد الانتظار</SelectItem>
                      <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
