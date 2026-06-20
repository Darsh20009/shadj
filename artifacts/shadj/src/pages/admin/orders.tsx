import { useState } from "react";
import { useListOrders, useUpdateOrder } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { getListOrdersQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Search, MessageCircle, Calendar, DollarSign, ChevronDown, ChevronUp } from "lucide-react";

const STATUS: Record<string, { label: string; color: string }> = {
  pending:     { label: "قيد الانتظار",  color: "bg-amber-100 text-amber-800 border-amber-200" },
  in_progress: { label: "جاري التنفيذ",  color: "bg-blue-100 text-blue-800 border-blue-200" },
  completed:   { label: "مكتمل",          color: "bg-green-100 text-green-800 border-green-200" },
  cancelled:   { label: "ملغي",           color: "bg-red-100 text-red-800 border-red-200" },
};

function buildWaMsg(order: any) {
  const lines = [
    `مرحباً ${order.clientName}،`,
    ``,
    `تم استلام طلبك لدى شدج للجرافيك بخصوص *${order.designType}*.`,
    ``,
    `هنتواصل معاك قريباً بعرض سعر تفصيلي.`,
    ``,
    `شكراً لاختيارك شدج! 🎨`,
  ].join("\n");
  return encodeURIComponent(lines);
}

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useListOrders();
  const updateOrder = useUpdateOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: string) => {
    updateOrder.mutate({ id, data: { status: newStatus } } as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "✅ تم تحديث حالة الطلب" });
      }
    });
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.clientName?.toLowerCase().includes(q) || o.clientEmail?.toLowerCase().includes(q) || o.designType?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts: Record<string, number> = {
    all: orders.length,
    pending:     orders.filter(o => o.status === "pending").length,
    in_progress: orders.filter(o => o.status === "in_progress").length,
    completed:   orders.filter(o => o.status === "completed").length,
    cancelled:   orders.filter(o => o.status === "cancelled").length,
  };

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="text-center text-gray-400">
        <div className="w-10 h-10 border-2 border-[#3730A3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        جاري التحميل...
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a2e]">إدارة الطلبات</h1>
          <p className="text-gray-500 mt-1">{orders.length} طلب إجمالي</p>
        </div>
        <a href={`https://wa.me/201129085243`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors shrink-0">
          <MessageCircle size={16} />
          واتساب شدج
        </a>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all",        label: "الكل" },
          { key: "pending",    label: "انتظار" },
          { key: "in_progress",label: "جاري" },
          { key: "completed",  label: "مكتمل" },
          { key: "cancelled",  label: "ملغي" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilterStatus(key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterStatus === key ? "bg-[#3730A3] text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-[#3730A3]/30"}`}>
            {label}
            <span className={`mr-1.5 text-xs ${filterStatus === key ? "text-white/70" : "text-gray-400"}`}>
              ({counts[key as keyof typeof counts] ?? 0})
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو البريد أو نوع التصميم..."
          className="w-full bg-white border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all"
        />
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const st = STATUS[order.status as keyof typeof STATUS] || STATUS.pending;
            const isOpen = expanded === order.id;
            const phone = (order as any).clientPhone;
            const waMsg = buildWaMsg(order);

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Main row */}
                <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setExpanded(isOpen ? null : order.id)}>
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-[#3730A3]/10 text-[#3730A3] font-black text-sm flex items-center justify-center shrink-0">
                    {order.clientName?.[0] || "؟"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-[#1a1a2e] text-sm">{order.clientName}</span>
                      <span className="text-gray-300 text-xs">•</span>
                      <span className="text-[#3730A3] text-xs font-bold">{order.designType}</span>
                    </div>
                    <p className="text-gray-400 text-xs truncate" dir="ltr">{order.clientEmail}</p>
                  </div>

                  {/* Status badge */}
                  <Badge variant="outline" className={`border shrink-0 text-xs font-bold px-3 py-1 ${st.color}`}>
                    {st.label}
                  </Badge>

                  {/* Date */}
                  <span className="text-gray-400 text-xs shrink-0 hidden sm:block">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </span>

                  {/* Expand */}
                  <div className="text-gray-400 shrink-0">
                    {isOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      {/* Description */}
                      {order.description && (
                        <div>
                          <p className="text-xs text-gray-400 font-bold mb-1">📝 الوصف</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{order.description}</p>
                        </div>
                      )}
                      {/* Budget & Deadline */}
                      <div className="space-y-2">
                        {order.budget && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="text-gray-600">{order.budget}</span>
                          </div>
                        )}
                        {order.deadline && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="text-gray-600">{order.deadline}</span>
                          </div>
                        )}
                        {(order as any).notes && (
                          <div className="text-sm text-gray-500">
                            <span className="font-bold">ملاحظات: </span>{(order as any).notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Status update */}
                      <Select defaultValue={order.status} onValueChange={val => handleStatusChange(order.id, val)}>
                        <SelectTrigger className="w-40 text-sm rounded-xl border-gray-200" dir="rtl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="in_progress">جاري التنفيذ</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* WhatsApp */}
                      <a
                        href={`https://wa.me/${phone ? phone.replace(/[^0-9]/g,'') : "201129085243"}?text=${waMsg}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                        <MessageCircle size={14} />
                        رد على الواتساب
                      </a>

                      {/* Email */}
                      <a href={`mailto:${order.clientEmail}?subject=طلب تصميم — شدج للجرافيك`}
                        className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                        📧 رد بالبريد
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
