// Sidebar.jsx
import { Home, CalendarDays, Sparkles, Inbox, Settings, Trash2, Search, ClipboardList } from "lucide-react";
import { useDFMEA } from "../contexts/DFMEAContext";

function NavItem({ icon: Icon, label }) {
  return (
    <button disabled className="w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-[13px] text-zinc-700 font-medium opacity-70">
      <Icon size={16} strokeWidth={1.7} />
      <span className="truncate flex-1">{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const { requirementsData } = useDFMEA();
  const tasks = requirementsData?.tasks || [];

  return (
    <aside className="w-[280px] h-full bg-[#f5f5f3] border-r border-zinc-200/70 flex flex-col px-3 py-3">
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="h-8 w-8 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center text-xs font-semibold text-zinc-800">
          IA
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-zinc-900 truncate">Mechanical Engineer</div>
          <div className="text-[11px] text-zinc-500 truncate">Workspace • mock</div>
        </div>
      </div>

      <div className="mt-2 px-2">
        <div className="rounded-md bg-white border border-zinc-200/80 px-2.5 py-2 flex items-center gap-2">
          <Search size={16} strokeWidth={1.7} className="text-zinc-600" />
          <input className="w-full text-[13px] outline-none placeholder:text-zinc-400 bg-transparent" placeholder="Search" disabled />
        </div>
      </div>

      <div className="mt-3 px-2 space-y-0.5">
        <NavItem icon={Home} label="Home" />
        <NavItem icon={CalendarDays} label="Meetings" />
        <NavItem icon={Sparkles} label="Notion AI" />
        <NavItem icon={Inbox} label="Inbox" />
      </div>

      <div className="mt-5 px-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium text-zinc-500">{requirementsData?.tasksTitle || "Tasks"}</div>
          <button disabled className="h-7 px-2 rounded-lg border border-zinc-200/80 bg-white text-[11px] text-zinc-700 flex items-center gap-1.5 opacity-70">
            <ClipboardList size={14} strokeWidth={1.8} className="text-zinc-600" />
            View
          </button>
        </div>

        <div className="mt-2 space-y-1">
          {tasks.map(t => (
            <div key={t.id} className="px-2 py-1.5">
              <div className={`text-[13px] ${t.done ? "text-zinc-400 line-through" : "text-zinc-800"}`}>{t.label}</div>
            </div>
          ))}
          {!tasks.length && <div className="text-[12px] text-zinc-500 px-2 py-2">No tasks in this tab.</div>}
        </div>
      </div>

      <div className="mt-auto px-2 pt-4 space-y-0.5">
        <NavItem icon={Settings} label="Settings" />
        <NavItem icon={Trash2} label="Trash" />
      </div>
    </aside>
  );
}