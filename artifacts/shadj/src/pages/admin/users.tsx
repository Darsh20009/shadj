import { useState } from "react";
import { useListUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { getListUsersQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const userSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد غير صالح"),
  password: z.string().optional(),
  role: z.enum(["admin", "designer", "writer"]),
});

const roleMap = {
  admin: "مدير",
  designer: "مصمم",
  writer: "كاتب محتوى"
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

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "", email: "", password: "", role: "designer"
    }
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role as any,
      password: "" // Keep empty for edit
    });
    setIsOpen(true);
  };

  const handleCreateNew = () => {
    setEditingUser(null);
    form.reset({ name: "", email: "", password: "", role: "designer" });
    setIsOpen(true);
  };

  const onSubmit = (data: z.infer<typeof userSchema>) => {
    if (editingUser) {
      // @ts-ignore
      updateUser.mutate({ id: editingUser.id, data: { name: data.name, role: data.role } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
          setIsOpen(false);
          toast({ title: "تم تحديث المستخدم" });
        }
      });
    } else {
      if (!data.password) {
        toast({ title: "كلمة المرور مطلوبة", variant: "destructive" });
        return;
      }
      // @ts-ignore
      createUser.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
          setIsOpen(false);
          toast({ title: "تم إنشاء المستخدم" });
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      deleteUser.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
          toast({ title: "تم حذف المستخدم" });
        }
      });
    }
  };

  if (isLoading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">المستخدمين</h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Plus size={16} /> إضافة مستخدم
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? "تعديل مستخدم" : "مستخدم جديد"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>الاسم</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl><Input dir="ltr" disabled={!!editingUser} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {!editingUser && (
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>كلمة المرور</FormLabel><FormControl><Input type="password" dir="ltr" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                )}
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>الدور</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger dir="rtl"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent dir="rtl">
                        <SelectItem value="admin">مدير</SelectItem>
                        <SelectItem value="designer">مصمم</SelectItem>
                        <SelectItem value="writer">كاتب محتوى</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
                    {createUser.isPending || updateUser.isPending ? "جاري الحفظ..." : "حفظ"}
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
              <TableHead>الاسم</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>تاريخ الانضمام</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">لا يوجد مستخدمين</TableCell></TableRow>
            ) : users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell dir="ltr" className="text-right">{user.email}</TableCell>
                <TableCell>{roleMap[user.role as keyof typeof roleMap] || user.role}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString("ar-SA")}</TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(user)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(user.id)}>
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
