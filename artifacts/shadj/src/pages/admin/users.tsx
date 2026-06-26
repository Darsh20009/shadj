import { useState } from "react";
import { useListUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { getListUsersQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

type AllowedRole = "admin" | "designer" | "writer";

const userSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().optional(),
  role: z.enum(["admin", "designer", "writer"]),
});

type UserFormData = z.infer<typeof userSchema>;

const roleMap: Record<AllowedRole, string> = {
  admin: "مدير",
  designer: "مصمم",
  writer: "كاتب محتوى",
};

export default function AdminUsers() {
  const { data: users = [], isLoading } = useListUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", password: "", role: "designer" },
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: (user.role as AllowedRole) || "designer",
      password: "",
    });
    setIsOpen(true);
  };

  const handleCreateNew = () => {
    setEditingUser(null);
    form.reset({ name: "", email: "", password: "", role: "designer" });
    setIsOpen(true);
  };

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      const payload = { id: editingUser.id, data: { name: data.name, role: data.role } };
      (updateUser.mutate as any)(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
          setIsOpen(false);
          toast({ title: "✅ تم تحديث المستخدم بنجاح" });
        },
        onError: () => {
          toast({ title: "❌ فشل تحديث المستخدم", variant: "destructive" });
        },
      });
    } else {
      if (!data.password) {
        toast({ title: "كلمة المرور مطلوبة", variant: "destructive" });
        return;
      }
      const payload = { data: { name: data.name, email: data.email, password: data.password, role: data.role } };
      (createUser.mutate as any)(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
          setIsOpen(false);
          toast({ title: "✅ تم إنشاء المستخدم بنجاح" });
        },
        onError: () => {
          toast({ title: "❌ فشل إنشاء المستخدم", variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    deleteUser.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        toast({ title: "✅ تم حذف المستخدم" });
      },
      onError: () => {
        toast({ title: "❌ فشل حذف المستخدم", variant: "destructive" });
      },
    });
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
    <div className="p-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a2e]">فريق العمل</h1>
          <p className="text-gray-400 mt-1">{users.length} مستخدم</p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-[#3730A3] hover:bg-[#1e1b4b] text-white gap-2 rounded-xl"
        >
          <Plus size={16} /> إضافة مستخدم
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "تعديل مستخدم" : "إضافة مستخدم جديد"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4" dir="rtl">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl><Input {...field} placeholder="اسم المستخدم" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input dir="ltr" disabled={!!editingUser} {...field} placeholder="user@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {!editingUser && (
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" dir="ltr" {...field} placeholder="6 أحرف على الأقل" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>الدور</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger dir="rtl"><SelectValue placeholder="اختر الدور" /></SelectTrigger>
                    </FormControl>
                    <SelectContent dir="rtl">
                      <SelectItem value="admin">مدير</SelectItem>
                      <SelectItem value="designer">مصمم</SelectItem>
                      <SelectItem value="writer">كاتب محتوى</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
                <Button
                  type="submit"
                  className="bg-[#3730A3] hover:bg-[#1e1b4b] text-white"
                  disabled={createUser.isPending || updateUser.isPending}
                >
                  {createUser.isPending || updateUser.isPending ? "جاري الحفظ..." : "حفظ"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="text-right font-bold text-gray-600">المستخدم</TableHead>
              <TableHead className="text-right font-bold text-gray-600">البريد الإلكتروني</TableHead>
              <TableHead className="text-right font-bold text-gray-600">الدور</TableHead>
              <TableHead className="text-right font-bold text-gray-600">تاريخ الانضمام</TableHead>
              <TableHead className="text-left font-bold text-gray-600">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-400">لا يوجد مستخدمون</TableCell>
              </TableRow>
            ) : users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#3730A3]/10 flex items-center justify-center text-sm font-black text-[#3730A3]">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-bold text-[#1a1a2e]">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell dir="ltr" className="text-gray-500 text-sm">{user.email}</TableCell>
                <TableCell>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    user.role === "admin" ? "bg-red-50 text-red-600" :
                    user.role === "designer" ? "bg-[#3730A3]/10 text-[#3730A3]" :
                    "bg-purple-50 text-purple-600"
                  }`}>
                    {roleMap[user.role as AllowedRole] || user.role}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="rounded-xl hover:border-[#3730A3]/30" onClick={() => handleEdit(user)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl text-red-500 hover:text-red-600 hover:border-red-200" onClick={() => handleDelete(user.id)}>
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
