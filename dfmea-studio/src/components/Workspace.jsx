import { FileText, CalendarDays } from "lucide-react";
import RequirementsViewport from "./RequirementsViewport";
import TasksViewport from "./TasksViewport";
import AiDock from "./AiDock";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useRequirements } from "../hooks/useRequirements";
import { useTasks } from "../hooks/useTasks";
import { useDockHeightPadding } from "../hooks/useDockHeightPadding";

export default function Workspace() {
  const { activeTab } = useAppNavigation();
  const { meta: reqMeta, requirementsData } = useRequirements();
  const { meta: tasksMeta, tasksData } = useTasks();

  const { dockRef, dockHeight } = useDockHeightPadding();

  const isTasks = activeTab === "tasks";
  const currentTitle = isTasks ? tasksData?.title || "Tasks" : requirementsData?.title || "Requirements";
  const Icon = isTasks ? CalendarDays : FileText;

  const visibility = isTasks ? tasksMeta?.visibility : reqMeta?.visibility;
  const edited = isTasks ? tasksMeta?.edited : reqMeta?.edited;

  return (
    <div className="flex-1 min-w-0 overflow-hidden bg-[#fbfbfa]">
      <div className="h-full flex flex-col">
        <div className="h-12 px-6 flex items-center justify-between bg-[#fbfbfa] border-b border-zinc-200/70">
          <div className="flex items-center gap-2 min-w-0">
            <Icon size={18} strokeWidth={1.6} className="text-zinc-700" />
            <div className="text-[13px] font-semibold tracking-tight text-zinc-900 truncate">{currentTitle}</div>
            <div className="text-[11px] text-zinc-500 whitespace-nowrap">• {visibility ?? "private"}</div>
          </div>
          <div className="text-[11px] text-zinc-500 whitespace-nowrap">{edited ?? "—"}</div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            className="h-full overflow-y-auto overflow-x-hidden"
            style={{ paddingBottom: dockHeight ? dockHeight + 28 : 320 }}
          >
            {isTasks ? <TasksViewport /> : <RequirementsViewport />}
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