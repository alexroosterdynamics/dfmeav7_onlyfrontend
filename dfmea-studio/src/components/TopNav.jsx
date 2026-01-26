import { Search, Bell } from "lucide-react";
import { useAppNavigation } from "../hooks/useAppNavigation";

export default function TopNav() {
  const { activeTab, setActiveTab } = useAppNavigation();

  const label = activeTab === "tasks" ? "Tasks" : "Requirements";

  return (
    <div className="h-14 px-5 flex items-center justify-between bg-[#fbfbfa] border-b border-zinc-200/70">
      <div className="grid grid-cols-[280px_1fr] items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
            DF
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-zinc-900 truncate">DFMEA Studio</div>
            <div className="text-[11px] text-zinc-500 truncate">
              Desktop mock • <span className="text-zinc-700">{label}</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 bg-white rounded-xl p-1 border border-zinc-200/80">
          <button
            onClick={() => setActiveTab("requirements")}
            className={`text-[13px] px-3 py-1.5 rounded-lg font-medium ${
              activeTab === "requirements" ? "text-white bg-zinc-900" : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            Requirements
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`text-[13px] px-3 py-1.5 rounded-lg font-medium ${
              activeTab === "tasks" ? "text-white bg-zinc-900" : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            Tasks
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden xl:flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-zinc-200/80">
          <Search size={18} strokeWidth={1.6} className="text-zinc-600" />
          <input
            className="w-64 text-[13px] outline-none placeholder:text-zinc-400 bg-transparent"
            placeholder="Search (mock)"
            disabled
          />
        </div>

        <button disabled className="h-10 w-10 rounded-xl bg-white border border-zinc-200/80 grid place-items-center opacity-70">
          <Bell size={18} strokeWidth={1.6} className="text-zinc-700" />
        </button>

        <button disabled className="text-[13px] font-medium px-3.5 py-2 rounded-xl bg-zinc-900 text-white opacity-70">
          Share
        </button>
      </div>
    </div>
  );
}