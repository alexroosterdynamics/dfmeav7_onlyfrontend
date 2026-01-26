import { useMemo } from "react";
import { useDFMEA } from "../contexts/DFMEAContext";

export function useTasks() {
  const { tasksData, createTask, updateTask, deleteTask, replaceTasks } = useDFMEA();

  const tasks = tasksData?.tasks ?? [];
  const lanes = tasksData?.lanes ?? [];
  const milestones = tasksData?.milestones ?? [];
  const range = tasksData?.range ?? { start: "2026-01-01", end: "2026-02-01" };
  const project = tasksData?.project ?? "DFMEA Project";
  const meta = tasksData?.meta ?? {};

  const stats = useMemo(
    () => ({
      done: tasks.filter((t) => t.status === "done").length,
      blocked: tasks.filter((t) => t.status === "blocked").length,
      active: tasks.filter((t) => t.status === "active").length,
    }),
    [tasks]
  );

  return {
    tasksData,
    tasks,
    lanes,
    milestones,
    range,
    project,
    meta,
    stats,

    // ✅ CRUD
    createTask,
    updateTask,
    deleteTask,
    replaceTasks,
  };
}