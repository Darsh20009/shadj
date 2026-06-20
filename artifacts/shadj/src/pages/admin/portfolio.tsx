import { useState } from "react";
import { useListPortfolio, useCreatePortfolioWork, useUpdatePortfolioWork, useDeletePortfolioWork } from "@workspace/api-client-react";
import type { PortfolioWork } from "@workspace/api-client-react/src/generated/api.schemas";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { getListPortfolioQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const workSchema = z.object({
  title: z.string().min(1, "مطلوب"),
  titleAr: z.string().min(1, "مطلوب"),
  clientName: z.string().min(1, "مطلوب"),
  category: z.string().min(1, "مطلوب"),
  imageUrl: z.string().url("رابط صورة غير صالح"),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  designer: z.string().optional(),
});

export default function AdminPortfolio() {
  const { data: works = [], isLoading } = useListPortfolio();
  const createWork = useCreatePortfolioWork();
  const updateWork = useUpdatePortfolioWork();
  const deleteWork = useDeletePortfolioWork();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<PortfolioWork | null>(null);

  const form = useForm<z.infer<typeof workSchema>>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      title: "",
      titleAr: "",
      clientName: "",
      category: "",
      imageUrl: "",
      description: "",
      featured: false,
      designer: "",
    }
  });

  const handleEdit = (work: PortfolioWork) => {
    setEditingWork(work);
    form.reset({
      title: work.title,
      titleAr: work.titleAr,
      clientName: work.clientName,
      category: work.category,
      imageUrl: work.imageUrl,
      description: work.description || "",
      featured: work.featured,
      designer: work.designer || "",
    });
    setIsOpen(true);
  };

  const handleCreateNew = () => {
    setEditingWork(null);
    form.reset({
      title: "", titleAr: "", clientName: "", category: "", imageUrl: "", description: "", featured: false, designer: ""
    });
    setIsOpen(true);
  };

  const onSubmit = (data: z.infer<typeof workSchema>) => {
    if (editingWork) {
      updateWork.mutate({ id: editingWork.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() });
          setIsOpen(false);
          toast({ title: "تم تحديث العمل بنجاح" });
        }
      });
    } else {
      createWork.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() });
          setIsOpen(false);
          toast({ title: "تمت إضافة العمل بنجاح" });
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العمل؟")) {
      deleteWork.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() });
          toast({ title: "تم حذف العمل بنجاح" });
        }
      });
    }
  };

  if (isLoading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">إدارة الأعمال</h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Plus size={16} />
              إضافة عمل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingWork ? "تعديل العمل" : "إضافة عمل جديد"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="titleAr" render={({ field }) => (
                    <FormItem><FormLabel>العنوان (عربي) *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>العنوان (إنجليزي) *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="clientName" render={({ field }) => (
                    <FormItem><FormLabel>اسم العميل *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>التصنيف *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>رابط الصورة *</FormLabel><FormControl><Input dir="ltr" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>الوصف</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="designer" render={({ field }) => (
                  <FormItem><FormLabel>المصمم</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="featured" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>عمل مميز (Featured)</FormLabel>
                      <p className="text-sm text-muted-foreground">سيظهر في الصفحة الرئيسية</p>
                    </div>
                  </FormItem>
                )} />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createWork.isPending || updateWork.isPending}>
                    {createWork.isPending || updateWork.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصورة</TableHead>
              <TableHead>العنوان</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>مميز</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {works.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">لا يوجد أعمال</TableCell></TableRow>
            ) : works.map((work) => (
              <TableRow key={work.id}>
                <TableCell>
                  <img src={work.imageUrl} alt={work.titleAr} className="w-16 h-12 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{work.titleAr}</TableCell>
                <TableCell>{work.clientName}</TableCell>
                <TableCell>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{work.category}</span>
                </TableCell>
                <TableCell>
                  {work.featured ? <Check className="text-green-500" size={16} /> : <X className="text-gray-300" size={16} />}
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(work)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(work.id)}>
                      <Trash2 size={14} />
                    </Button>
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
