import { useState } from "react";
import { useListOrders, useUpdateOrder } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { getListOrdersQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Search, Calendar, DollarSign, ChevronDown, ChevronUp, Copy, Check, Phone } from "lucide-react";

const STATUS: Record<string, { label: string; color: string }> = {
  pending:     { label: "قيد الانتظار",  color: "bg-amber-100 text-amber-800 border-amber-200" },
  in_progress: { label: "جاري التنفيذ",  color: "bg-blue-100 text-blue-800 border-blue-200" },
  completed:   { label: "مكتمل",          color: "bg-green-100 text-green-800 border-green-200" },
  cancelled:   { label: "ملغي",           color: "bg-red-100 text-red-800 border-red-200" },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-500 hover:text-[#3730A3] hover:border-[#3730A3]/30 px-3 py-2 rounded-xl text-xs font-medium transition-all"
      title="نسخ"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {copied ? "تم النسخ!" : "نسخ"}
    </button>
  );
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
      },
      onError: () => {
        toast({ title: "❌ فشل تحديث الحالة", variant: "destructive" });
      },
    });
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || o.clientName?.toLowerCase().includes(q)
      || o.clientEmail?.toLowerCase().includes(q)
      || o.designType?.toLowerCase().includes(q);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a2e]">إدارة الطلبات</h1>
          <p className="text-gray-500 mt-1">{orders.length} طلب إجمالي</p>
        </div>
        <div className="flex items-center gap-2 bg-[#3730A3]/5 border border-[#3730A3]/20 text-[#3730A3] px-4 py-2.5 rounded-xl text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-[#3730A3] animate-pulse" />
          كل الطلبات تصلك إشعار فوري على بريدك
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all",         label: "الكل" },
          { key: "pending",     label: "انتظار" },
          { key: "in_progress", label: "جاري" },
          { key: "completed",   label: "مكتمل" },
          { key: "cancelled",   label: "ملغي" },
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

      <div className="relative mb-6">
        <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو البريد أو نوع التصميم..."
          className="w-full bg-white border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition-all"
        />
      </div>

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

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setExpanded(isOpen ? null : order.id)}>
                  <div className="w-10 h-10 rounded-xl bg-[#3730A3]/10 text-[#3730A3] font-black text-sm flex items-center justify-center shrink-0">
                    {order.clientName?.[0] || "؟"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-[#1a1a2e] text-sm">{order.clientName}</span>
                      <span className="text-gray-300 text-xs">•</span>
                      <span className="text-[#3730A3] text-xs font-bold">{order.designType}</span>
                    </div>
                    <p className="text-gray-400 text-xs truncate" dir="ltr">{order.clientEmail}</p>
                  </div>
                  <Badge variant="outline" className={`border shrink-0 text-xs font-bold px-3 py-1 ${st.color}`}>
                    {st.label}
                  </Badge>
                  <span className="text-gray-400 text-xs shrink-0 hidden sm:block">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                  <div className="text-gray-400 shrink-0">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      {order.description && (
                        <div>
                          <p className="text-xs text-gray-400 font-bold mb-1">📝 الوصف</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{order.description}</p>
                        </div>
                      )}
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

                    <div className="flex flex-wrap items-center gap-3">
                      <Select defaultValue={order.status} onValueChange={val => handleStatusChange(order.id, val)}>
                        <SelectTrigger className="w-44 text-sm rounded-xl border-gray-200" dir="rtl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="in_progress">جاري التنفيذ</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>

                      {!order.clientPhone && (
                        <a href={`https://wa.me/201129085243?text=${encodeURIComponent(`طلب جديد من ${order.clientName} — ${order.designType}`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          واتساب
                        </a>
                      )}

                      {order.clientPhone && (() => {
                        const clean = String(order.clientPhone).replace(/\s|-/g, "").replace(/^00/, "+").replace(/^\+/, "");
                        const waLink = `https://wa.me/${clean}?text=${encodeURIComponent(`أهلاً ${order.clientName}! 👋\nأنا شهد من شَدِج للتصميم، بخصوص طلبك (${order.designType}) 🎨\nهتكلمك عن التفاصيل إن شاء الله.`)}`;
                        return (
                          <a href={waLink} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                            <Phone size={14} />
                            واتساب
                          </a>
                        );
                      })()}

                      <CopyButton text={`${order.clientName} | ${order.clientEmail} | ${order.designType}`} />
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
