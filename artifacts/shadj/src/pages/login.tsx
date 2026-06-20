import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin, useGetMe } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import logoWhite from "@assets/Screenshot_2026-06-20_at_1.20.57_PM_1781954838443.png";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useLogin();
  const { data: user, isLoading } = useGetMe();

  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/admin");
    }
  }, [user, isLoading, setLocation]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginValues) => {
    login.mutate({ data }, {
      onSuccess: () => {
        setLocation("/admin");
      },
      onError: () => {
        toast({
          title: "فشل تسجيل الدخول",
          description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] relative overflow-hidden p-6">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <img src={logoWhite} alt="Shadj" className="h-16 object-contain" />
        </div>
        
        <h2 className="text-2xl font-bold text-white text-center mb-8">تسجيل الدخول للإدارة</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="admin@shadj.com" 
                      className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/20 focus:border-white/30 transition-colors" 
                      dir="ltr"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">كلمة المرور</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/20 focus:border-white/30 transition-colors" 
                      dir="ltr"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <button 
              type="submit" 
              disabled={login.isPending}
              className="w-full bg-[#F5E6C8] text-[#1a1a2e] py-3 rounded-xl font-bold hover:bg-white transition-colors disabled:opacity-50"
            >
              {login.isPending ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </Form>

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl transition-colors text-sm font-medium">
              <FcGoogle size={20} />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl transition-colors text-sm font-medium">
              <FaApple size={20} />
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
