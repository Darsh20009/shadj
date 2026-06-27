import { useState } from "react";
import { useGetMe } from "@workspace/api-client-react";
import { Mail, Send, Trash2, Eye, EyeOff, RefreshCw, X, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  orderId: string | null;
  fromRole: string;
  fromName: string;
  fromEmail: string;
  toEmail: string;
  toName: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
}

function token() { return localStorage.getItem("shadj_token") || ""; }

async function fetchMessages(): Promise<Message[]> {
  const r = await fetch("/api/messages", { headers: { Authorization: `Bearer ${token()}` } });
  if (!r.ok) return [];
  return r.json();
}

async function sendMessage(data: { toEmail: string; toName: string; subject: string; content: string; orderId?: string }): Promise<boolean> {
  const r = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
    body: JSON.stringify(data),
  });
  return r.ok;
}

async function markRead(id: string) {
  await fetch(`/api/messages/${id}/read`, { method: "PATCH", headers: { Authorization: `Bearer ${token()}` } });
}

async function deleteMsg(id: string) {
  await fetch(`/api/messages/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
}

export default function AdminMessages() {
  const { data: me } = useGetMe();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");

  const [form, setForm] = useState({ toEmail: "", toName: "", subject: "", content: "", orderId: "" });
  const [sending, setSending] = useState(false);
  const [smartReplying, setSmartReplying] = useState(false);

  async function handleSmartReply() {
    if (!selected) return;
    setSmartReplying(true);
    try {
      const res = await fetch("/api/ai/smart-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ messageContent: selected.content, senderName: selected.fromName, subject: selected.subject }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm({ toEmail: selected.fromEmail, toName: selected.fromName, subject: `رداً على: ${selected.subject}`, content: data.result || "", orderId: selected.orderId || "" });
      setShowCompose(true);
      toast({ title: "✨ تم توليد الرد الذكي — راجعيه قبل الإرسال" });
    } catch {
      toast({ title: "❌ فشل توليد الرد الذكي", variant: "destructive" });
    } finally {
      setSmartReplying(false);
    }
  }

  async function load() {
    setLoading(true);
    const msgs = await fetchMessages();
    setMessages(msgs);
    setLoaded(true);
    setLoading(false);
  }

  async function handleMarkRead(msg: Message) {
    if (!msg.read) {
      await markRead(msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
    setSelected(msg);
  }

  async function handleDelete(id: string) {
    await deleteMsg(id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
    toast({ title: "تم حذف الرسالة" });
  }

  async function handleSend() {
    if (!form.toEmail.trim() || !form.subject.trim() || !form.content.trim()) {
      toast({ title: "الرجاء ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    setSending(true);
    const ok = await sendMessage(form);
    setSending(false);
    if (ok) {
      toast({ title: "✅ تم إرسال الرسالة بنجاح" });
      setForm({ toEmail: "", toName: "", subject: "", content: "", orderId: "" });
      setShowCompose(false);
      load();
    } else {
      toast({ title: "فشل إرسال الرسالة", variant: "destructive" });
    }
  }

  const filtered = messages.filter(m => {
    if (filterRead === "unread") return !m.read;
    if (filterRead === "read") return m.read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="p-6 md:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a2e]">المراسلات</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            إدارة رسائل العملاء وإرسال بريد إلكتروني
            {unreadCount > 0 && <span className="mr-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} غير مقروءة</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> تحديث
          </button>
          <button onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 bg-[#3730A3] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#1e1b4b] transition-colors shadow-md">
            <Send size={14} /> رسالة جديدة
          </button>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" dir="rtl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-black text-[#1a1a2e] flex items-center gap-2"><Send size={16} /> رسالة جديدة للعميل</h2>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">بريد العميل *</label>
                  <input value={form.toEmail} onChange={e => setForm(f => ({ ...f, toEmail: e.target.value }))}
                    placeholder="client@example.com" dir="ltr"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3730A3] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">اسم العميل</label>
                  <input value={form.toName} onChange={e => setForm(f => ({ ...f, toName: e.target.value }))}
                    placeholder="اسم العميل"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3730A3] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">موضوع الرسالة *</label>
                <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="موضوع الرسالة..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3730A3] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">رقم الطلب (اختياري)</label>
                <input value={form.orderId} onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))}
                  placeholder="ID الطلب إن وجد" dir="ltr"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3730A3] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">نص الرسالة *</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={5} placeholder="اكتب رسالتك هنا..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#3730A3] transition-colors" />
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button onClick={() => setShowCompose(false)}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
              <button onClick={handleSend} disabled={sending}
                className="flex-[2] bg-[#3730A3] text-white py-2.5 rounded-xl font-black text-sm hover:bg-[#1e1b4b] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                {sending ? "جاري الإرسال..." : "إرسال الرسالة ✉️"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load prompt */}
      {!loaded && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <Mail size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-400 mb-5">اضغط لتحميل الرسائل</p>
          <button onClick={load} disabled={loading}
            className="bg-[#3730A3] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#1e1b4b] transition-colors">
            {loading ? "جاري التحميل..." : "تحميل الرسائل"}
          </button>
        </div>
      )}

      {loaded && (
        <div className="grid md:grid-cols-5 gap-6 h-[70vh]">
          {/* Messages list */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center gap-2">
              {(["all", "unread", "read"] as const).map(f => (
                <button key={f} onClick={() => setFilterRead(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterRead === f ? "bg-[#3730A3] text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                  {f === "all" ? `الكل (${messages.length})` : f === "unread" ? `غير مقروءة (${unreadCount})` : "مقروءة"}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-gray-300 text-sm">لا توجد رسائل</div>
              ) : filtered.map(msg => (
                <div key={msg.id}
                  onClick={() => handleMarkRead(msg)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === msg.id ? "bg-[#3730A3]/5 border-r-2 border-[#3730A3]" : ""} ${!msg.read ? "bg-blue-50/30" : ""}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-[#3730A3] flex-shrink-0" />}
                      <p className={`text-sm truncate ${!msg.read ? "font-black text-[#1a1a2e]" : "font-medium text-gray-700"}`}>
                        {msg.fromRole === "admin" ? `إلى: ${msg.toName || msg.toEmail}` : `من: ${msg.fromName}`}
                      </p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}
                      className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-gray-600 truncate mb-0.5">{msg.subject}</p>
                  <p className="text-xs text-gray-400 truncate">{msg.content.slice(0, 60)}...</p>
                  <p className="text-xs text-gray-300 mt-1.5">{new Date(msg.createdAt).toLocaleDateString("ar-SA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Message detail */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                <Mail size={48} className="mb-4 opacity-40" />
                <p>اختر رسالة للعرض</p>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-[#1a1a2e] text-lg mb-1">{selected.subject}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{selected.fromRole === "admin" ? `إلى: ${selected.toName || selected.toEmail}` : `من: ${selected.fromName}`}</span>
                        <span>•</span>
                        <span dir="ltr">{selected.fromEmail}</span>
                        <span>•</span>
                        <span>{new Date(selected.createdAt).toLocaleString("ar-SA")}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(selected.id)}
                      className="text-gray-300 hover:text-red-400 p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-5 overflow-y-auto">
                  <div className="bg-gray-50 rounded-xl p-5 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.content}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-50 space-y-2">
                  {selected.fromRole !== "admin" && (
                    <button
                      onClick={handleSmartReply}
                      disabled={smartReplying}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-[#7c3aed] to-[#3730A3] text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60">
                      {smartReplying ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {smartReplying ? "الذكاء الاصطناعي يكتب الرد..." : "✨ رد ذكي بالذكاء الاصطناعي"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setForm({ toEmail: selected.fromEmail, toName: selected.fromName, subject: `رداً على: ${selected.subject}`, content: "", orderId: selected.orderId || "" });
                      setShowCompose(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#3730A3] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#1e1b4b] transition-colors">
                    <Send size={14} /> رد يدوي
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
