import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "أهلاً! أنا مساعد شَدِج الذكي 🎨\nكيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في اختيار نوع التصميم المناسب، أو تقديم أفكار إبداعية لمشروعك." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 200);
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
      setMessages(prev => [...prev, { role: "assistant", content: "عذراً، حدث خطأ. حاول مرة أخرى." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-24 left-5 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ background: "linear-gradient(135deg,#e2b979,#c9973a)" }}
        title="مساعد شَدِج الذكي"
      >
        {open ? (
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.05 21.95l4.782-1.388A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.117l-.29-.174-3.008.872.888-2.942-.19-.302A7.953 7.953 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>
            <circle cx="8.5" cy="12" r="1.2"/>
            <circle cx="12" cy="12" r="1.2"/>
            <circle cx="15.5" cy="12" r="1.2"/>
          </svg>
        )}
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: "#e2b979" }} />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-44 left-5 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{ width: "340px", height: "480px", background: "#1a1a1a", border: "1px solid #333" }}
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#e2b979,#c9973a)" }}>
            <div className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-lg">🤖</div>
            <div>
              <div className="font-black text-black text-sm">مساعد شَدِج الذكي</div>
              <div className="text-xs text-black/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-800 inline-block" />
                متاح الآن • Moonshot AI
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="mr-auto text-black/50 hover:text-black/80 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                <div
                  className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={msg.role === "user"
                    ? { background: "#2a2a2a", color: "#e5e5e5", borderRadius: "18px 18px 4px 18px" }
                    : { background: "linear-gradient(135deg,#e2b979,#c9973a)", color: "#0d0d0d", borderRadius: "18px 18px 18px 4px" }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="px-4 py-3 rounded-2xl" style={{ background: "#2a2a2a", borderRadius: "18px 18px 18px 4px" }}>
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

          {/* Input */}
          <form onSubmit={sendMessage} className="flex gap-2 p-3 flex-shrink-0" style={{ borderTop: "1px solid #2a2a2a" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              disabled={loading}
              className="flex-1 bg-[#2a2a2a] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none placeholder:text-gray-600 disabled:opacity-50"
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
        </div>
      )}
    </>
  );
}
