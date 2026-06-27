import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, Plus, Trash2, Target, ChevronRight, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MILESTONES = [
  { target: 13_000,    label: "الانطلاقة",    color: "#3730A3", glow: "#3730A3" },
  { target: 50_000,    label: "النمو",         color: "#7c3aed", glow: "#7c3aed" },
  { target: 250_000,   label: "التوسع",        color: "#db2777", glow: "#db2777" },
  { target: 1_000_000, label: "المليون 🏆",    color: "#d97706", glow: "#d97706" },
];

function fmt(n: number) {
  return n.toLocaleString("ar-EG") + " ج.م";
}

function token() { return localStorage.getItem("shadj_token") || ""; }

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  type: "income" | "expense";
  orderId?: string;
  date: string;
}

interface Summary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  milestones: {
    target: number;
    reached: boolean;
    progress: number;
    remaining: number;
    current: boolean;
  }[];
}

async function fetchSummary(): Promise<Summary> {
  const r = await fetch("/api/finances/summary", { headers: { Authorization: `Bearer ${token()}` } });
  return r.json();
}

async function fetchTransactions(): Promise<Transaction[]> {
  const r = await fetch("/api/finances/transactions", { headers: { Authorization: `Bearer ${token()}` } });
  return r.json();
}

export default function AdminFinances() {
  const { toast } = useToast();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ amount: "", description: "", type: "income" as "income" | "expense", date: new Date().toISOString().slice(0, 10) });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [s, t] = await Promise.all([fetchSummary(), fetchTransactions()]);
      setSummary(s);
      setTransactions(t);
    } catch {
      toast({ title: "خطأ في التحميل", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    setSubmitting(true);
    try {
      const r = await fetch("/api/finances/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      if (!r.ok) throw new Error();
      toast({ title: form.type === "income" ? "✅ تم تسجيل الدخل" : "✅ تم تسجيل المصروف" });
      setForm({ amount: "", description: "", type: "income", date: new Date().toISOString().slice(0, 10) });
      setShowAdd(false);
      load();
    } catch {
      toast({ title: "خطأ في الحفظ", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/finances/transactions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
    load();
  }

  const net = summary?.netProfit ?? 0;
  const currentMilestoneIndex = MILESTONES.findIndex(m => net < m.target);
  const currentMilestone = currentMilestoneIndex >= 0 ? MILESTONES[currentMilestoneIndex] : null;
  const currentData = summary?.milestones[currentMilestoneIndex] ?? null;

  if (loading && !summary) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-[#3730A3]" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a2e]">المكاسب المالية</h1>
          <p className="text-gray-500 mt-1">تتبّع أرباحك وأهدافك</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-[#3730A3] hover:bg-[#1a1a2e] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-[#3730A3]/25"
          >
            <Plus size={16} />
            تسجيل معاملة
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <span className="text-sm font-semibold text-gray-500">إجمالي الدخل</span>
          </div>
          <p className="text-2xl font-black text-green-600">{fmt(summary?.totalIncome ?? 0)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <TrendingDown size={18} className="text-red-500" />
            </div>
            <span className="text-sm font-semibold text-gray-500">إجمالي المصروف</span>
          </div>
          <p className="text-2xl font-black text-red-500">{fmt(summary?.totalExpense ?? 0)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#3730A3]/10 flex items-center justify-center">
              <Wallet size={18} className="text-[#3730A3]" />
            </div>
            <span className="text-sm font-semibold text-gray-500">صافي الربح</span>
          </div>
          <p className="text-2xl font-black text-[#1a1a2e]">{fmt(net)}</p>
        </div>
      </div>

      {/* Current Goal Hero */}
      {currentMilestone && currentData && (
        <div
          className="rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${currentMilestone.color}ee, ${currentMilestone.color}99)` }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-40 h-40 rounded-full border-4 border-white" />
            <div className="absolute bottom-4 right-12 w-24 h-24 rounded-full border-4 border-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="opacity-80" />
              <span className="text-sm font-bold opacity-80">الهدف الحالي — {currentMilestone.label}</span>
            </div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-4xl font-black mb-1">{fmt(currentData.remaining)}</p>
                <p className="text-sm opacity-70">متبقي للوصول لـ {fmt(currentMilestone.target)}</p>
              </div>
              <div className="text-left">
                <p className="text-5xl font-black opacity-90">{currentData.progress}%</p>
                <p className="text-xs opacity-60 text-left">تم إنجازه</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${currentData.progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs opacity-70">
              <span>{fmt(net)} محقق</span>
              <span>الهدف: {fmt(currentMilestone.target)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Milestones Roadmap */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-black text-[#1a1a2e] mb-6 flex items-center gap-2">
          <Target size={18} className="text-[#3730A3]" />
          خريطة الأهداف
        </h2>
        <div className="space-y-4">
          {MILESTONES.map((milestone, idx) => {
            const data = summary?.milestones[idx];
            const isReached = data?.reached ?? false;
            const isCurrent = data?.current ?? false;
            const progress = data?.progress ?? 0;
            const remaining = data?.remaining ?? milestone.target;

            return (
              <div
                key={milestone.target}
                className={`rounded-2xl p-5 border-2 transition-all ${
                  isReached
                    ? "border-green-200 bg-green-50"
                    : isCurrent
                    ? "border-[#3730A3]/30 bg-[#3730A3]/3"
                    : "border-gray-100 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                        isReached ? "bg-green-500 text-white" : isCurrent ? "text-white" : "bg-gray-300 text-white"
                      }`}
                      style={isCurrent ? { backgroundColor: milestone.color } : {}}
                    >
                      {isReached ? "✓" : idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a2e] text-sm">{milestone.label}</p>
                      <p className="text-xs text-gray-500">{fmt(milestone.target)}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    {isReached ? (
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">✅ تم التحقيق</span>
                    ) : isCurrent ? (
                      <span className="text-xs font-bold text-white px-3 py-1 rounded-full" style={{ backgroundColor: milestone.color }}>
                        متبقي {fmt(remaining)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">لم يُبدأ بعد</span>
                    )}
                  </div>
                </div>
                {(isCurrent || isReached) && (
                  <div className="bg-white rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: isReached ? "#22c55e" : milestone.color,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-black text-[#1a1a2e]">سجل المعاملات</h2>
          <span className="text-sm text-gray-400">{transactions.length} معاملة</span>
        </div>
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Wallet size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">لا توجد معاملات مسجلة بعد</p>
            <p className="text-sm mt-1">اضغط "تسجيل معاملة" لإضافة أول إيراد</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map(t => (
              <div key={t._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                    {t.type === "income" ? <TrendingUp size={16} className="text-green-600" /> : <TrendingDown size={16} className="text-red-500" />}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a2e] text-sm">{t.description}</p>
                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-black text-sm ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </p>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-xl font-black text-[#1a1a2e] mb-6">تسجيل معاملة جديدة</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: "income" }))}
                  className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${form.type === "income" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500"}`}
                >
                  💰 دخل
                </button>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: "expense" }))}
                  className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${form.type === "expense" ? "border-red-500 bg-red-50 text-red-600" : "border-gray-200 text-gray-500"}`}
                >
                  💸 مصروف
                </button>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">المبلغ (ج.م)</label>
                <input
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="مثال: 1500"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right font-bold text-lg focus:outline-none focus:border-[#3730A3]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الوصف</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="مثال: تصميم لوجو عميل أحمد"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#3730A3]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">التاريخ</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3730A3]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-[#3730A3] text-white font-bold hover:bg-[#1a1a2e] transition-colors disabled:opacity-50"
                >
                  {submitting ? "جارٍ الحفظ..." : "💾 حفظ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
