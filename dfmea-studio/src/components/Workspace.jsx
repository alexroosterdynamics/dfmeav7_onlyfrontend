import { useRef, useState, useLayoutEffect } from "react";
import { FileText, CalendarDays } from "lucide-react";
import { useDFMEA } from "../contexts/DFMEAContext";
import RequirementsViewport from "./RequirementsViewport";
import TasksViewport from "./TasksViewport";
import AiDock from "./AiDock";

export default function Workspace({ activeTab = "requirements" }) {
  const { requirementsData } = useDFMEA();
  const dockRef = useRef(null);
  const [dockHeight, setDockHeight] = useState(0);

  useLayoutEffect(() => {
    if (!dockRef.current) return;
    const ro = new ResizeObserver((entries) => {
      setDockHeight(Math.ceil(entries[0].contentRect.height));
    });
    ro.observe(dockRef.current);
    return () => ro.disconnect();
  }, []);

  const currentTitle = activeTab === "tasks" ? "Tasks" : requirementsData?.title || "Requirements";
  const Icon = activeTab === "tasks" ? CalendarDays : FileText;

  return (
    <div className="flex-1 min-w-0 overflow-hidden bg-[#fbfbfa]">
      <div className="h-full flex flex-col">
        <div className="h-12 px-6 flex items-center justify-between bg-[#fbfbfa] border-b border-zinc-200/70">
          <div className="flex items-center gap-2 min-w-0">
            <Icon size={18} strokeWidth={1.6} className="text-zinc-700" />
            <div className="text-[13px] font-semibold tracking-tight text-zinc-900 truncate">
              {currentTitle}
            </div>
            <div className="text-[11px] text-zinc-500 whitespace-nowrap">
              • {requirementsData?.meta?.visibility ?? "private"}
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 whitespace-nowrap">
            {requirementsData?.meta?.edited ?? "—"}
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto overflow-x-hidden" style={{ paddingBottom: dockHeight ? dockHeight + 28 : 320 }}>
            {activeTab === "tasks" ? <TasksViewport /> : <RequirementsViewport data={requirementsData} />}
            <div className="h-10" />
          </div>

          <div className="pointer-events-none absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#fbfbfa] to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#fbfbfa] to-transparent" />

          <div className="absolute left-0 right-0 bottom-0">
            <div className="px-8 pb-6">
              <div ref={dockRef}>
                <AiDock />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}