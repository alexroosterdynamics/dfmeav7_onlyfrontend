import { useState } from "react";
import { CheckCircle2, AlertTriangle, Clock, Search, LayoutPanelTop, LayoutGrid, LayoutPanelLeft, Maximize2 } from "lucide-react";

// --- Configuration & Data ---
const DATA = {
  project: "DFMEA Project",
  range: { start: "2026-01-15", end: "2026-02-15" },
  lanes: [
    { id: "elec", title: "Electrical", group: "Hardware" },
    { id: "soft", title: "Software", group: "Dev" },
    { id: "mech", title: "Mechanical", group: "Mech" }
  ],
  milestones: [
    { id: "m1", date: "2026-01-20", title: "Kickoff", color: "bg-emerald-500" },
    { id: "m2", date: "2026-02-05", title: "Review", color: "bg-blue-500" }
  ],
  tasks: [
    { id: "T1", title: "Review reqs", status: "todo", priority: "High", owner: "Alice", start: "2026-01-20", end: "2026-01-25", progress: 0, lane: "elec" },
    { id: "T2", title: "Add units", status: "active", priority: "Med", owner: "Bob", start: "2026-01-18", end: "2026-01-22", progress: 60, lane: "soft" },
    { id: "T3", title: "Confirm roles", status: "done", priority: "Low", owner: "Carol", start: "2026-01-15", end: "2026-01-20", progress: 100, lane: "mech" },
    { id: "T4", title: "Specs update", status: "blocked", priority: "High", owner: "Dave", start: "2026-01-22", end: "2026-01-28", progress: 20, lane: "elec" },
    { id: "T5", title: "Validation", status: "todo", priority: "Med", owner: "Eve", start: "2026-01-23", end: "2026-01-30", progress: 0, lane: "mech" },
    { id: "T6", title: "Phase 2", status: "todo", priority: "Low", owner: "Dave", start: "2026-01-24", end: "2026-02-01", progress: 0, lane: "elec" },
  ]
};

const STATUS = {
  done: { label: "Done", tone: "good", icon: CheckCircle2, bar: "bg-emerald-500" },
  blocked: { label: "Blocked", tone: "bad", icon: AlertTriangle, bar: "bg-amber-500" },
  active: { label: "In Progress", tone: "neutral", icon: Clock, bar: "bg-blue-500" },
  todo: { label: "To do", tone: "neutral", icon: Clock, bar: "bg-zinc-600" }
};

// --- Helpers ---
const diff = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
const px = 40; // Pixels per day column width

const Pill = ({ tone, children }) => (
  <span className={`text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1.5 font-medium ${
    tone === "good" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
    tone === "bad" ? "bg-amber-50 border-amber-200 text-amber-700" :
    "bg-white border-zinc-200 text-zinc-600 shadow-sm"
  }`}>{children}</span>
);

export default function TasksViewport() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("split");

  // Filtering & Stats
  const filtered = DATA.tasks.filter(t => 
    (statusFilter === "all" || t.status === statusFilter) && 
    (t.title.toLowerCase().includes(q.toLowerCase()) || t.id.toLowerCase().includes(q.toLowerCase()))
  );
  
  const stats = {
    done: DATA.tasks.filter(t => t.status === "done").length,
    blocked: DATA.tasks.filter(t => t.status === "blocked").length,
    active: DATA.tasks.filter(t => t.status === "active").length
  };

  // View Splitting Logic
  const split = viewMode === "timeline" ? { left: 30, right: 70 } :
                viewMode === "split" ? { left: 45, right: 55 } :
                viewMode === "tasks" ? { left: 65, right: 35 } :
                { left: 0, right: 100 };

  const timelineWidth = diff(DATA.range.start, DATA.range.end) * px;

  return (
    <div className="h-screen flex flex-col bg-zinc-50 overflow-hidden font-sans text-zinc-900">
      
      {/* --- Top Header & Stats --- */}
      <div className="px-8 pt-8 pb-4 shrink-0">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Tasks</h1>
            <p className="mt-1 text-sm text-zinc-500">Project • <span className="font-medium text-zinc-900">{DATA.project}</span></p>
          </div>
          <div className="flex gap-2">
            <Pill tone="good"><CheckCircle2 size={12} /> {stats.done} done</Pill>
            <Pill tone={stats.blocked ? "bad" : "neutral"}><AlertTriangle size={12} /> {stats.blocked} blocked</Pill>
            <Pill><Clock size={12} /> {stats.active} active</Pill>
          </div>
        </div>

        {/* --- Toolbar Card --- */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm ml-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search tasks..." className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg bg-zinc-50 border-transparent focus:bg-white focus:ring-2 ring-zinc-100 outline-none transition-all placeholder:text-zinc-400" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm px-3 py-1.5 rounded-lg bg-zinc-50 border-transparent hover:bg-zinc-100 cursor-pointer outline-none font-medium text-zinc-600">
              <option value="all">All Status</option>
              {Object.keys(STATUS).map(k => <option key={k} value={k}>{STATUS[k].label}</option>)}
            </select>
          </div>

          <div className="flex bg-zinc-100 p-1 rounded-xl">
            {[
              { id: "timeline", icon: LayoutPanelTop, label: "Timeline" },
              { id: "split", icon: LayoutGrid, label: "Split" },
              { id: "tasks", icon: LayoutPanelLeft, label: "List" },
              { id: "full", icon: Maximize2, label: "Full" }
            ].map(m => (
              <button key={m.id} onClick={() => setViewMode(m.id)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium inline-flex items-center gap-1.5 transition-all ${viewMode === m.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}>
                <m.icon size={14} /> {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Main Content Cards --- */}
      <div className="flex-1 min-h-0 px-8 pb-8 flex gap-6 overflow-hidden">
        
        {/* Left Card: Task List */}
        {viewMode !== "full" && split.left > 0 && (
          <div style={{ width: `${split.left}%` }} className="flex flex-col min-w-[320px] transition-all duration-300">
            <div className="h-full rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Task List</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500">{filtered.length} tasks</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filtered.map(t => {
                  const S = STATUS[t.status];
                  return (
                    <div key={t.id} className="group border-b border-zinc-50 last:border-0 px-5 py-3.5 hover:bg-zinc-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="font-mono text-[10px] text-zinc-400">{t.id}</span>
                        <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${S.tone === "good" ? "bg-emerald-50 text-emerald-700" : S.tone === "bad" ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-500"}`}>
                          <S.icon size={10} strokeWidth={3} /> {S.label}
                        </div>
                      </div>
                      <div className="text-[13px] font-semibold text-zinc-900 mb-2">{t.title}</div>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="font-medium">{t.owner}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px]">{t.progress}%</span>
                          <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-zinc-800 rounded-full" style={{ width: `${t.progress}%` }} /></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Right Card: Timeline */}
        <div style={{ width: `${split.right}%` }} className="flex-1 min-w-0 flex flex-col transition-all duration-300">
          <div className="h-full rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200 bg-zinc-50/50 flex items-center justify-between shrink-0">
               <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Timeline</div>
               <div className="flex gap-4 text-xs text-zinc-500 font-medium">
                  <span>{DATA.range.start} → {DATA.range.end}</span>
                  <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded">{Math.floor(timelineWidth / px)} days</span>
               </div>
            </div>

            <div className="flex-1 overflow-auto relative bg-white">
              <div className="min-w-max">
                {/* Timeline Grid Header */}
                <div className="sticky top-0 z-20 flex bg-white border-b border-zinc-200 h-9 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <div className="w-52 shrink-0 border-r border-zinc-100 bg-zinc-50/80 flex items-center px-5 text-xs font-semibold text-zinc-400">Lanes</div>
                  <div className="relative flex-1" style={{ width: timelineWidth }}>
                     <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #f4f4f5 1px, transparent 1px)', backgroundSize: `${px}px 100%` }} />
                     {DATA.milestones.map(m => (
                       <div key={m.id} className={`absolute top-2 px-2 py-0.5 rounded text-[9px] font-bold text-white shadow-sm transform -translate-x-1/2 ${m.color}`} style={{ left: diff(DATA.range.start, m.date) * px }}>
                         {m.title}
                       </div>
                     ))}
                  </div>
                </div>

                {/* Lanes & Tasks */}
                <div className="relative">
                   <div className="absolute inset-0 pointer-events-none" style={{ left: 208, width: timelineWidth, backgroundImage: 'linear-gradient(to right, #f4f4f5 1px, transparent 1px)', backgroundSize: `${px}px 100%` }} />
                   
                   {DATA.lanes.map(lane => {
                     const tasks = filtered.filter(t => t.lane === lane.id).sort((a,b) => new Date(a.start) - new Date(b.start));
                     const rows = [];
                     // Packing Algorithm
                     const packed = tasks.map(t => {
                       let r = rows.findIndex(end => new Date(end) < new Date(t.start));
                       if (r === -1) { r = rows.length; rows.push(t.end); } else { rows[r] = t.end; }
                       return { ...t, row: r };
                     });

                     return (
                       <div key={lane.id} className="flex border-b border-zinc-100 hover:bg-zinc-50/40 relative">
                         <div className="w-52 shrink-0 p-4 border-r border-zinc-100 bg-white sticky left-0 z-10">
                           <div className="text-sm font-semibold text-zinc-900">{lane.title}</div>
                           <div className="text-xs text-zinc-500 mt-0.5">{lane.group}</div>
                         </div>
                         <div className="relative py-4" style={{ height: Math.max(80, (rows.length * 34) + 32) }}>
                           {packed.map(t => (
                             <div key={t.id} 
                               className={`absolute h-[26px] rounded-lg border border-white/20 shadow-sm flex items-center px-2.5 hover:brightness-110 hover:shadow-md hover:z-20 hover:scale-[1.02] transition-all cursor-pointer overflow-hidden ${STATUS[t.status].bar}`}
                               style={{ left: diff(DATA.range.start, t.start) * px, top: t.row * 32, width: Math.max(px, diff(t.start, t.end) * px) - 4 }}
                               title={`${t.title} (${t.progress}%)`}>
                               <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                               <div className="absolute inset-0 bg-black/10" style={{ width: `${100-t.progress}%`, left: `${t.progress}%` }} />
                               <span className="relative z-10 text-[11px] font-medium text-white truncate drop-shadow-sm">{t.title}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     );
                   })}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}