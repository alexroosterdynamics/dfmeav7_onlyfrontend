"use client";
import { useEffect, useRef, useState } from "react";

export default function AiDock() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hey — I'm your AI assistant (mock)." }]);
  const [full, setFull] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMessages([...messages, { role: "user", text: t }, { role: "assistant", text: "Mock response (wire to LLM later)." }]);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <>
      {full && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setFull(false)} />}
      <div className={full ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white z-50 flex flex-col rounded-2xl shadow-2xl border border-zinc-200/80" : "fixed bottom-4 left-1/2 -translate-x-1/2 w-1/2 min-w-[400px] bg-white rounded-2xl shadow-2xl border border-zinc-200/80 flex flex-col"} style={!full ? { height: messages.length <= 1 ? '140px' : '280px' } : {}}>
        
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-zinc-200/60 flex-shrink-0 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-600">AI assistant (mock)</span>
          <button onClick={() => setFull(!full)} className="text-[11px] px-2.5 py-1 rounded-xl bg-white border border-zinc-200/80 text-zinc-700 hover:bg-zinc-50">
            {full ? "Close" : "Full"}
          </button>
        </div>
        
        {/* Messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <span className={`inline-block text-[12px] px-3 py-1.5 rounded-xl ${m.role === "user" ? "bg-blue-500 text-white" : "bg-zinc-100 text-zinc-800"}`}>
                {m.text}
              </span>
            </div>
          ))}
        </div>
        
        {/* Input */}
        <div className="px-4 py-3 border-t border-zinc-200/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <input 
              ref={inputRef}
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && send()} 
              placeholder="Type…" 
              className="flex-1 text-[12px] px-3 py-2 rounded-xl border border-zinc-200/80 outline-none placeholder:text-zinc-400" 
            />
            <button onClick={send} className="text-[11px] px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600">
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}