"use client";
import { useState } from "react";
import { Home, CalendarDays, Sparkles, Inbox, Settings, Trash2, Search, ChevronDown, GitBranch, Plus, ClipboardList } from "lucide-react";
import { useDFMEA } from "../contexts/DFMEAContext";

const Item = ({ icon: Icon, label, active, onClick, right, sub }) => (
  <div onClick={onClick} className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-zinc-200/40 text-zinc-700 ${sub ? "pl-7 text-[12px]" : "text-[13px] font-medium"} ${active ? "bg-zinc-200/50 text-zinc-900" : ""}`}>
    {Icon && <Icon size={16} strokeWidth={1.7} />}
    <span className="flex-1 truncate">{label}</span>
    {right}
  </div>
);

export default function Sidebar({ tasksTitle, tasks = [], onOpenRequirementsManager, onOpenTasksTimeline }) {
  const { activeTab, setActiveTab, workflows, selectedWorkflowId, setSelectedWorkflowId, createWorkflow, deleteWorkflow } = useDFMEA();
  const [open, setOpen] = useState({ workflows: false, inbox: false });

  const Chev = ({ is }) => <ChevronDown size={16} className={`text-zinc-500 transition-transform ${is ? "" : "-rotate-90"}`} />;

  return (
    <aside className="w-[280px] h-full bg-[#f5f5f3] border-r border-zinc-200/70 flex flex-col p-3 gap-2">
      <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-200/40 transition-colors cursor-pointer">
        <div className="h-8 w-8 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center text-xs font-bold text-zinc-800">IA</div>
        <div className="min-w-0 leading-tight">
          <div className="text-[13px] font-semibold text-zinc-900 truncate">Mechanical Engineer</div>
          <div className="text-[11px] text-zinc-500 truncate">Workspace • mock</div>
        </div>
      </div>

      <div className="px-2">
        <div className="rounded-md bg-white border border-zinc-200/80 px-2.5 py-2 flex items-center gap-2">
          <Search size={16} className="text-zinc-400" />
          <input className="w-full text-[13px] outline-none bg-transparent placeholder:text-zinc-400" placeholder="Search" disabled />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-0.5 px-2">
        <Item icon={Home} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <Item icon={CalendarDays} label="Meetings" active={activeTab === "meetings"} onClick={() => setActiveTab("meetings")} />
        <Item icon={Sparkles} label="Notion AI" active={activeTab === "ai"} onClick={() => setActiveTab("ai")} />
        
        <Item icon={Inbox} label="Inbox" active={open.inbox} onClick={() => setOpen(p => ({ ...p, inbox: !p.inbox }))} right={<Chev is={open.inbox} />} />
        {open.inbox && <Item sub label="Manager view" active={activeTab === "requirementsManager"} onClick={onOpenRequirementsManager} right={<span className="text-[10px] px-1.5 py-0.5 rounded-full border bg-white text-zinc-500">Read-only</span>} />}

        <Item icon={GitBranch} label="Workflows" active={open.workflows} onClick={() => setOpen(p => ({ ...p, workflows: !p.workflows }))} right={<Chev is={open.workflows} />} />
        {open.workflows && (
          <div className="space-y-0.5">
            {workflows.map(w => (
              <Item key={w.id} sub label={w.title || "Untitled"} active={selectedWorkflowId === w.id && activeTab === "workflows"} onClick={() => { setActiveTab("workflows"); setSelectedWorkflowId(w.id); }}
                right={<Trash2 size={14} className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity" onClick={e => { e.stopPropagation(); if(confirm('Delete?')) deleteWorkflow(w.id); }} />}
              />
            ))}
            <button onClick={createWorkflow} className="w-full pl-7 py-1.5 flex items-center gap-2 text-[12px] text-zinc-500 hover:bg-zinc-200/40 rounded-md transition-colors"><Plus size={14} /> Add workflow</button>
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2 text-[11px] font-medium text-zinc-500 uppercase tracking-wider px-2">
            {tasksTitle || "Tasks"}
            <button onClick={onOpenTasksTimeline} className="h-6 px-2 rounded border bg-white hover:bg-zinc-50 flex items-center gap-1 text-zinc-700"><ClipboardList size={12} /> View</button>
          </div>
          {tasks.length ? tasks.map(t => (
            <div key={t.id} className={`px-2 py-1.5 text-[13px] hover:bg-zinc-200/40 rounded-md transition-colors truncate ${t.done ? "text-zinc-400 line-through" : "text-zinc-800"}`}>{t.label}</div>
          )) : <div className="text-[12px] text-zinc-400 px-2 py-2">No tasks found.</div>}
        </div>
      </nav>

      <div className="pt-4 border-t border-zinc-200/50 px-2 space-y-0.5">
        <Item icon={Settings} label="Settings" />
        <Item icon={Trash2} label="Trash" />
      </div>
    </aside>
  );
}