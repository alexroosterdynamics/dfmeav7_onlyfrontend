export default function AiDock() {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_0_rgba(0,0,0,0.05),0_20px_50px_rgba(0,0,0,0.10)] overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-200/70 bg-[#fbfbfa]">
        <div className="text-[12px] font-semibold tracking-tight text-zinc-900">
          AI assistant (mock)
        </div>
        <div className="text-[11px] text-zinc-500">No functionality — visual only</div>
      </div>

      <div className="p-4">
        <div className="text-[12px] text-zinc-700 leading-snug">
          This dock is pinned to the bottom like the original UI. No actions are wired.
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            disabled
            className="text-[12px] px-3 py-2 rounded-xl bg-zinc-900 text-white opacity-70 cursor-not-allowed"
          >
            Generate
          </button>

          <button
            disabled
            className="text-[12px] px-3 py-2 rounded-xl bg-white border border-zinc-200/80 text-zinc-700 opacity-70 cursor-not-allowed"
          >
            Ask question
          </button>
          
        </div>
      </div>
    </div>
  );
}
