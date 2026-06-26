import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AUTO_POPUPS = [
  "يسطا... عندك مشروع ولا لسه بتفكر؟ 🤔",
  "والله الوقت بيعدي! مشروعك مش هيعمل نفسه 😅",
  "كنت هقولك بكرة بس فضلت خايف عليك 😂",
  "اسمعني... التصميم اللي في دماغك ده، شَدِج هيعمله أحسن من اللي تتخيله! 🎨",
  "ولا تعبك ولا إيه؟ قولنا عايز إيه وإحنا نتكفل 💪",
  "عارف إيه الفرق بين شدج والباقيين؟ إحنا بنفكر زيك بالظبط 🔥",
  "لو عندك حاجة في دماغك، قولهالي دلوقتي وهأقولك إزاي نعملها! ✨",
  "مش لازم تقولي كل حاجة، بس قولي 'ابدأ' وبقية القصة علينا 😎",
];

const WELCOME_MSG: Message = {
  role: "assistant",
  content: "أهلاً وسهلاً يسطا! 🎉\nأنا مساعد شَدِج الذكي المصري الأصيل 😄\nقولي عايز إيه وهنعمل لك تصميم يقلب الدنيا!",
};

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "order">("chat");
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [popupIdx, setPopupIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const showNextPopup = useCallback(() => {
    if (open) return;
    setPopup(AUTO_POPUPS[popupIdx % AUTO_POPUPS.length]);
    setPopupIdx(i => i + 1);
    setTimeout(() => setPopup(null), 6000);
  }, [open, popupIdx]);

  useEffect(() => {
    const first = setTimeout(() => showNextPopup(), 8000);
    popupTimer.current = setInterval(() => showNextPopup(), 40000);
    return () => {
      clearTimeout(first);
      if (popupTimer.current) clearInterval(popupTimer.current);
    };
  }, [showNextPopup]);

  useEffect(() => {
    if (open) {
      setPopup(null);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 200);
    }
  }, [open, messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "يا عيني عليا! في مشكلة دلوقتي 😅 جرب تاني بعد ثانية.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <>
      {/* ── Auto popup bubble ── */}
      {popup && !open && (
        <div
          className="fixed bottom-24 left-6 z-50 max-w-[220px] animate-in slide-in-from-bottom-3 fade-in duration-300"
          dir="rtl"
        >
          <div
            className="relative px-4 py-3 rounded-2xl text-sm font-bold leading-relaxed shadow-2xl cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#1a1a2e,#2a2440)",
              border: "1px solid rgba(226,185,121,0.3)",
              color: "#e2b979",
            }}
            onClick={() => { setPopup(null); setOpen(true); }}
          >
            {popup}
            <button
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#333] text-gray-400 text-xs flex items-center justify-center hover:bg-[#444] transition-colors"
              onClick={e => { e.stopPropagation(); setPopup(null); }}
            >✕</button>
            <div className="absolute -bottom-2 left-6 w-3 h-3 rotate-45"
              style={{ background: "#1a1a2e", border: "1px solid rgba(226,185,121,0.3)", borderTop: "none", borderLeft: "none" }} />
          </div>
        </div>
      )}

      {/* ── Expanded panel ── */}
      {open && (
        <div
          className="fixed bottom-24 left-5 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{ width: "340px", height: "500px", background: "#111", border: "1px solid #2a2a2a" }}
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#e2b979,#c9973a)" }}>
            <img src="/logo-dark.png" alt="شدج" className="w-8 h-8 object-contain rounded-lg bg-black/10 p-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-black text-black text-sm">مساعد شَدِج الذكي 🤖</div>
              <div className="text-xs text-black/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-800 inline-block" />
                متاح دايماً • Moonshot AI
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-black/50 hover:text-black/80 transition-colors flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex flex-shrink-0" style={{ borderBottom: "1px solid #222" }}>
            <button
              className="flex-1 py-2 text-xs font-bold transition-colors"
              style={{ color: tab === "chat" ? "#e2b979" : "#555", borderBottom: tab === "chat" ? "2px solid #e2b979" : "2px solid transparent" }}
              onClick={() => setTab("chat")}
            >
              💬 شات الذكاء الاصطناعي
            </button>
            <button
              className="flex-1 py-2 text-xs font-bold transition-colors"
              style={{ color: tab === "order" ? "#e2b979" : "#555", borderBottom: tab === "order" ? "2px solid #e2b979" : "2px solid transparent" }}
              onClick={() => setTab("order")}
            >
              🎨 ابدأ مشروعك
            </button>
          </div>

          {/* Chat tab */}
          {tab === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                    <div
                      className="max-w-[82%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"
                      style={msg.role === "user"
                        ? { background: "#222", color: "#e5e5e5", borderRadius: "16px 16px 4px 16px" }
                        : { background: "linear-gradient(135deg,#e2b979,#c9973a)", color: "#0d0d0d", borderRadius: "16px 16px 16px 4px" }
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-end">
                    <div className="px-4 py-3 rounded-2xl" style={{ background: "#222", borderRadius: "16px 16px 16px 4px" }}>
                      <div className="flex gap-1.5 items-center">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-2 h-2 rounded-full bg-[#e2b979] animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 p-3 flex-shrink-0"
                style={{ borderTop: "1px solid #222" }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="اكتب سؤالك هنا يسطا..."
                  disabled={loading}
                  className="flex-1 bg-[#1e1e1e] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none placeholder:text-gray-600 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105 flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#e2b979,#c9973a)" }}
                >
                  <svg className="w-4 h-4 text-black rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </>
          )}

          {/* Order tab */}
          {tab === "order" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-5">
              <div className="text-5xl">🎨</div>
              <div>
                <h3 className="text-white font-black text-lg mb-2">عايز تصميم يقلب الدنيا؟</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  يسطا ده وقتك! ابعتلنا تفاصيل مشروعك دلوقتي وفريق شَدِج هيتكفل بكل حاجة 💪
                </p>
              </div>
              <button
                onClick={() => { setOpen(false); navigate("/order"); }}
                className="w-full py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg,#e2b979,#c9973a)", color: "#0d0d0d" }}
              >
                ابدأ مشروعك الآن ←
              </button>
              <p className="text-gray-600 text-xs">وبنرد في أقل من 24 ساعة إن شاء الله 🙏</p>
            </div>
          )}
        </div>
      )}

      {/* ── Main FAB button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: open
            ? "linear-gradient(135deg,#374151,#1f2937)"
            : "linear-gradient(135deg,#e2b979,#c9973a)",
          boxShadow: open
            ? "0 8px 32px rgba(0,0,0,0.5)"
            : "0 8px 32px rgba(226,185,121,0.45)",
        }}
        title="مساعد شَدِج"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <img
            src="/logo-dark.png"
            alt="شدج"
            className="w-10 h-10 object-contain"
          />
        )}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-25"
            style={{ background: "#e2b979" }} />
        )}
      </button>
    </>
  );
}
