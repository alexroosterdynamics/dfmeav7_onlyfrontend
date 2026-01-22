import { useState } from "react";
import { Cpu, Zap, Wrench, Paperclip, CheckCircle2, AlertTriangle, LayoutGrid, List, Minus, Plus } from "lucide-react";

const MOCK = {
  content: {
    projectName: "DFMEA Project",
    requirements: [
      { id: "REQ-001", text: "System shall boot within 2.5s at 12V ±10%", domainCategory: "Software", reqType: "Performance", priority: "High", ownerRole: "System", ownerName: "Alice", files: [1, 2], isComplete: true, flagged: false },
      { id: "REQ-002", text: "ECU shall operate -40°C to 85°C ambient", domainCategory: "Electrical", reqType: "Environmental", priority: "Critical", ownerRole: "Hardware", ownerName: "Bob", files: [], isComplete: false, flagged: true },
      { id: "REQ-003", text: "CAN bus latency < 10ms for critical msgs", domainCategory: "Software", reqType: "Functional", priority: "High", ownerRole: "Firmware", ownerName: "Carol", files: [1], isComplete: true, flagged: false },
      { id: "REQ-004", text: "Connector shall withstand 50N pull force", domainCategory: "Mechanical", reqType: "Structural", priority: "Medium", ownerRole: "Mechanical", ownerName: "Dave", files: [], isComplete: false, flagged: false },
      { id: "REQ-005", text: "Power consumption < 2.5W in sleep mode", domainCategory: "Electrical", reqType: "Performance", priority: "High", ownerRole: "Power", ownerName: "Eve", files: [1, 2, 3], isComplete: true, flagged: false },
    ]
  }
};

const ICONS = { Software: Cpu, Electrical: Zap, Mechanical: Wrench };
const frozen = r => r.isComplete && !r.flagged;

const Pill = ({ tone = "neutral", children }) => (
  <span className={`text-[11px] px-2 py-1 rounded-full border tracking-tight ${
    tone === "bad" ? "bg-amber-50 border-amber-200/70 text-amber-900" :
    tone === "good" ? "bg-emerald-50 border-emerald-200/70 text-emerald-900" :
    "bg-[#fbfbfa] border-zinc-200/80 text-zinc-700"
  }`}>{children}</span>
);

const Btn = ({ active, disabled, onClick, children }) => (
  <button onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-xl border tracking-tight transition-colors ${
    active ? "bg-zinc-900 text-white border-zinc-900" :
    disabled ? "bg-white border-zinc-200/60 text-zinc-300 cursor-not-allowed" :
    "bg-white border-zinc-200/80 text-zinc-700 hover:bg-zinc-100"
  }`}>{children}</button>
);

export default function RequirementsViewport({ data = MOCK }) {
  const { projectName, requirements } = data.content;
  const [view, setView] = useState("cards");
  const [size, setSize] = useState("md");
  const [filter, setFilter] = useState("all");

  const total = requirements.length;
  const froz = requirements.filter(frozen).length;
  const flag = requirements.filter(r => r.flagged).length;
  const stats = { total, frozen: froz, flagged: flag, unfrozen: total - froz };

  const map = { Software: [], Electrical: [], Mechanical: [] };
  requirements.forEach(r => map[r.domainCategory].push(r));
  
  const meta = Object.keys(map).map(d => ({
    d,
    unfrozen: map[d].filter(x => !frozen(x)).length,
    flagged: map[d].filter(x => x.flagged).length,
    total: map[d].length
  }));
  
  const order = meta.sort((a, b) => b.unfrozen - a.unfrozen || b.flagged - a.flagged || b.total - a.total).map(x => x.d);
  
  order.forEach(d => map[d].sort((a, b) => (frozen(a) ? 0 : 1) - (frozen(b) ? 0 : 1) || (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0)));
  
  const buckets = { map, order };

  const filtered = {};
  buckets.order.forEach(d => {
    filtered[d] = filter === "all" ? buckets.map[d] :
             filter === "frozen" ? buckets.map[d].filter(frozen) :
             buckets.map[d].filter(r => !frozen(r));
  });

  const grid = size === "xs" ? "grid-cols-5 gap-3" : size === "sm" ? "grid-cols-4 gap-3" : size === "lg" ? "grid-cols-2 gap-4" : "grid-cols-3 gap-4";
  const pad = size === "xs" || size === "sm" ? "p-3" : size === "lg" ? "p-5" : "p-4";

  return (
    <div className="pb-24">
      <div className="max-w-6xl mx-auto px-10 pt-12 pb-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-[40px] leading-[1.12] font-semibold tracking-tight">Requirements</div>
            <div className="mt-2 text-[13px] text-zinc-600">Project • <span className="text-zinc-900 font-medium">{projectName}</span></div>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <Pill tone={stats.frozen === stats.total ? "good" : "bad"}>
              <span className="inline-flex items-center gap-1.5">
                {stats.frozen === stats.total ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                {stats.frozen}/{stats.total} frozen
              </span>
            </Pill>
            <Pill tone={stats.flagged ? "bad" : "good"}>
              <span className="inline-flex items-center gap-1.5"><AlertTriangle size={12} /> {stats.flagged} flagged</span>
            </Pill>
            <div className="ml-2 flex gap-1.5">
              {[["all", "All"], ["unfrozen", "Unfrozen"], ["frozen", "Frozen"]].map(([m, l]) => (
                <Btn key={m} active={filter === m} onClick={() => setFilter(m)}>{l}</Btn>
              ))}
            </div>
            <div className="ml-2 flex gap-1.5">
              <Btn active={view === "cards"} onClick={() => setView("cards")}><LayoutGrid size={14} /> Cards</Btn>
              <Btn active={view === "list"} onClick={() => setView("list")}><List size={14} /> List</Btn>
              <div className="w-px h-6 bg-zinc-200/80 mx-1" />
              <Btn onClick={() => setSize(s => s === "lg" ? "md" : s === "md" ? "sm" : "xs")} disabled={view !== "cards"}><Minus size={14} /></Btn>
              <Btn onClick={() => setSize(s => s === "xs" ? "sm" : s === "sm" ? "md" : "lg")} disabled={view !== "cards"}><Plus size={14} /></Btn>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-10 space-y-5">
        {buckets.order.map(d => {
          const list = filtered[d];
          if (!list.length) return null;
          const full = buckets.map[d];
          const Icon = ICONS[d];
          const uf = full.filter(r => !frozen(r)).length;
          const fg = full.filter(r => r.flagged).length;

          return (
            <div key={d} className="rounded-xl border border-zinc-200/80 bg-white shadow-[0_1px_0_rgba(0,0,0,0.05),0_14px_40px_rgba(0,0,0,0.06)]">
              <div className="px-4 py-3 border-b border-zinc-200/70 bg-[#fbfbfa] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl border border-zinc-200/80 bg-white grid place-items-center">
                    <Icon size={16} strokeWidth={1.8} className="text-zinc-800" />
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-zinc-900">{d}</div>
                    <div className="text-[11px] text-zinc-500">{uf} unfrozen • {fg} flagged • {full.length} total</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Pill tone={uf ? "bad" : "good"}>{uf} unfrozen</Pill>
                  <Pill tone={fg ? "bad" : "good"}>{fg} flagged</Pill>
                </div>
              </div>

              {view === "cards" ? (
                <div className={`p-4 grid ${grid}`}>
                  {list.map(r => (
                    <div key={r.id} className={`rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_0_rgba(0,0,0,0.05),0_10px_24px_rgba(0,0,0,0.06)] ${pad}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-[11px] text-zinc-500">{r.id}</div>
                            {frozen(r) ? <CheckCircle2 size={14} className="text-zinc-900" /> : 
                             r.flagged ? <AlertTriangle size={14} className="text-zinc-900" /> :
                             <AlertTriangle size={14} className="text-zinc-600" />}
                          </div>
                          <div className="mt-1 text-[13px] font-semibold text-zinc-900 line-clamp-2">{r.text}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Pill><span className="inline-flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-zinc-900/70" />{r.reqType}</span></Pill>
                        <Pill>{r.priority}</Pill>
                        <Pill tone={frozen(r) ? "good" : "neutral"}>{frozen(r) ? "Frozen" : r.flagged ? "Flagged" : "Incomplete"}</Pill>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                        <div>{r.ownerRole} • {r.ownerName}</div>
                        <div className="flex items-center gap-2"><Paperclip size={14} strokeWidth={1.7} />{r.files.length}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-12 text-[11px] font-medium text-zinc-500 bg-[#fbfbfa] border-b border-zinc-200/70">
                    <div className="col-span-2 px-5 py-3">ID</div>
                    <div className="col-span-5 px-5 py-3">Requirement</div>
                    <div className="col-span-2 px-5 py-3">Owner</div>
                    <div className="col-span-2 px-5 py-3">Status</div>
                    <div className="col-span-1 px-5 py-3 text-right">Files</div>
                  </div>
                  {list.map(r => (
                    <div key={r.id} className="grid grid-cols-12 text-[13px] border-b last:border-b-0 border-zinc-200/60 hover:bg-[#fbfbfa] transition-colors">
                      <div className="col-span-2 px-5 py-3 text-zinc-600 flex items-center gap-2">
                        <span>{r.id}</span>
                        {frozen(r) ? <CheckCircle2 size={14} className="text-zinc-900" /> : 
                         r.flagged ? <AlertTriangle size={14} className="text-zinc-900" /> :
                         <AlertTriangle size={14} className="text-zinc-600" />}
                      </div>
                      <div className="col-span-5 px-5 py-3">
                        <div className="text-zinc-900 leading-snug">{r.text}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Pill><span className="inline-flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-zinc-900/70" />{r.reqType}</span></Pill>
                          <Pill tone={frozen(r) ? "good" : r.flagged ? "bad" : "neutral"}>{frozen(r) ? "Frozen" : r.flagged ? "Flagged" : "Incomplete"}</Pill>
                        </div>
                      </div>
                      <div className="col-span-2 px-5 py-3 text-zinc-600">
                        <div className="text-zinc-900">{r.ownerRole}</div>
                        <div className="mt-0.5 text-[11px] text-zinc-500">Added by {r.ownerName}</div>
                      </div>
                      <div className="col-span-2 px-5 py-3 text-zinc-600">
                        <div className="text-zinc-900">{r.priority}</div>
                        <div className="mt-0.5 text-[11px] text-zinc-500">{frozen(r) ? "Frozen" : r.flagged ? "Flagged" : "Incomplete"}</div>
                      </div>
                      <div className="col-span-1 px-5 py-3 text-right text-zinc-600 flex items-center justify-end gap-2">
                        <Paperclip size={14} strokeWidth={1.7} className="text-zinc-500" />{r.files.length}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}