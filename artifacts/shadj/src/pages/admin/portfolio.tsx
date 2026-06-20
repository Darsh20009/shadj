import { useState } from "react";
import { useListPortfolio, useCreatePortfolioWork, useUpdatePortfolioWork, useDeletePortfolioWork } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Check, X, LayoutGrid, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { getListPortfolioQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

// All 46 real posters
const REAL_POSTERS = Array.from({ length: 46 }, (_, i) => `/posters/poster_${String(i + 1).padStart(2, "0")}.png`);

const CATEGORIES = ["هوية بصرية", "بوسترات", "سوشيال ميديا", "حملات إعلانية", "مطبوعات", "تغليف", "لوحات إعلانية"];

type WorkForm = {
  title: string; titleAr: string; clientName: string;
  category: string; imageUrl: string; description: string;
  featured: boolean; designer: string;
};

function ImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = REAL_POSTERS.filter((_, i) =>
    `poster_${String(i + 1).padStart(2, "0")}`.includes(search) || !search
  );

  return (
    <div>
      <div
        className="border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-[#3730A3] transition-colors flex items-center gap-3"
        onClick={() => setOpen(true)}
      >
        {value ? (
          <>
            <img src={value} alt="selected" className="w-14 h-14 object-cover rounded-lg" />
            <div>
              <p className="text-sm font-medium text-[#1a1a2e]">{value.split("/").pop()}</p>
              <p className="text-xs text-gray-400">اضغط لتغيير الصورة</p>
            </div>
          </>
        ) : (
          <div className="flex-1 text-center py-2">
            <p className="text-sm text-gray-400">اضغط لاختيار صورة من الـ 46 بوستر</p>
          </div>
        )}
      </div>
      <div className="mt-2">
        <Input
          placeholder="أو أدخل رابط خارجي..."
          value={value.startsWith("/posters/") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          dir="ltr"
          className="text-sm"
        />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b">
              <h3 className="font-black text-[#1a1a2e] mb-3">اختر بوستر من الأعمال الحقيقية</h3>
              <Input
                placeholder="ابحث..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-4 gap-3">
                {filtered.map((poster) => (
                  <div
                    key={poster}
                    onClick={() => { onChange(poster); setOpen(false); }}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${
                      value === poster ? "border-[#3730A3] shadow-lg shadow-[#3730A3]/30" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={poster} alt={poster} className="w-full h-full object-cover" loading="lazy" />
                    {value === poster && (
                      <div className="absolute inset-0 bg-[#3730A3]/20 flex items-center justify-center">
                        <Check className="text-white" size={20} />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                      <p className="text-white text-[9px] font-medium">{poster.split("/").pop()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPortfolio() {
  const { data: works = [], isLoading } = useListPortfolio();
  const createWork = useCreatePortfolioWork();
  const updateWork = useUpdatePortfolioWork();
  const deleteWork = useDeletePortfolioWork();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<WorkForm>({
    defaultValues: { title:"", titleAr:"", clientName:"", category:"هوية بصرية", imageUrl:"", description:"", featured:false, designer:"" }
  });

  const imageUrl = watch("imageUrl");
  const featured = watch("featured");

  const handleEdit = (work: any) => {
    setEditingId(work.id);
    reset({ title:work.title, titleAr:work.titleAr, clientName:work.clientName, category:work.category, imageUrl:work.imageUrl, description:work.description||"", featured:work.featured, designer:work.designer||"" });
    setIsOpen(true);
  };

  const handleNew = () => {
    setEditingId(null);
    reset({ title:"", titleAr:"", clientName:"", category:"هوية بصرية", imageUrl:"", description:"", featured:false, designer:"" });
    setIsOpen(true);
  };

  const onSubmit = (data: WorkForm) => {
    if (editingId) {
      updateWork.mutate({ id: editingId, data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() }); setIsOpen(false); toast({ title: "✓ تم التحديث" }); }
      });
    } else {
      createWork.mutate({ data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() }); setIsOpen(false); toast({ title: "✓ تمت الإضافة" }); }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العمل؟")) return;
    deleteWork.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() }); toast({ title: "تم الحذف" }); }
    });
  };

  if (isLoading) return <div className="p-8 text-center text-gray-400">جاري التحميل...</div>;

  return (
    <div className="p-6 md:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a2e]">إدارة الأعمال</h1>
          <p className="text-gray-400 text-sm mt-0.5">{works.length} عمل منشور</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#3730A3] text-white" : "text-gray-400 hover:bg-gray-50"}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode("table")} className={`p-2 transition-colors ${viewMode === "table" ? "bg-[#3730A3] text-white" : "text-gray-400 hover:bg-gray-50"}`}><List size={16} /></button>
          </div>
          <Button onClick={handleNew} className="bg-[#3730A3] hover:bg-[#1a1a2e] text-white gap-2 rounded-xl">
            <Plus size={16} /> إضافة عمل
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {works.map((work) => (
            <div key={work.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
              <div className="relative aspect-square">
                <img src={work.imageUrl} alt={work.titleAr} className="w-full h-full object-cover" loading="lazy" />
                {work.featured && (
                  <div className="absolute top-2 right-2 bg-[#F5E6C8] text-[#1a1a2e] text-[10px] font-black px-2 py-0.5 rounded-full">مميز</div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleEdit(work)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Edit2 size={14} className="text-[#3730A3]" />
                  </button>
                  <button onClick={() => handleDelete(work.id)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold text-[#3730A3] uppercase tracking-wider">{work.category}</span>
                <p className="font-bold text-[#1a1a2e] text-sm mt-0.5 truncate">{work.titleAr}</p>
                <p className="text-gray-400 text-xs truncate">{work.clientName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>الصورة</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>مميز</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.map((work) => (
                <TableRow key={work.id}>
                  <TableCell><img src={work.imageUrl} alt={work.titleAr} className="w-14 h-12 object-cover rounded-lg" /></TableCell>
                  <TableCell className="font-medium">{work.titleAr}</TableCell>
                  <TableCell className="text-gray-500">{work.clientName}</TableCell>
                  <TableCell><span className="bg-[#3730A3]/10 text-[#3730A3] px-2 py-0.5 rounded-full text-xs font-medium">{work.category}</span></TableCell>
                  <TableCell>{work.featured ? <Check className="text-green-500" size={16} /> : <X className="text-gray-300" size={16} />}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleEdit(work)}><Edit2 size={13} /></Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600" onClick={() => handleDelete(work.id)}><Trash2 size={13} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingId ? "تعديل العمل" : "إضافة عمل جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">العنوان بالعربي *</label>
                <Input {...register("titleAr", { required: true })} placeholder="هوية نور" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">العنوان بالإنجليزي *</label>
                <Input {...register("title", { required: true })} placeholder="Noor Brand Identity" dir="ltr" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">اسم العميل *</label>
                <Input {...register("clientName", { required: true })} placeholder="نور للتجزئة" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">التصنيف *</label>
                <select {...register("category")} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3730A3]/20">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">صورة العمل *</label>
              <ImagePicker value={imageUrl} onChange={(v) => setValue("imageUrl", v)} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">الوصف</label>
              <Textarea {...register("description")} rows={3} placeholder="وصف مختصر للمشروع..." />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">المصمم</label>
              <Input {...register("designer")} placeholder="اسم المصمم المسؤول" />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Checkbox
                id="featured"
                checked={featured}
                onCheckedChange={(c) => setValue("featured", !!c)}
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
                عمل مميز — سيظهر في الصفحة الرئيسية
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">إلغاء</Button>
              <Button type="submit" className="flex-[2] bg-[#3730A3] hover:bg-[#1a1a2e] text-white" disabled={createWork.isPending || updateWork.isPending}>
                {createWork.isPending || updateWork.isPending ? "جاري الحفظ..." : "حفظ العمل"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
