import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import requirementsJson from "../data/requirements.json";
import tasksJson from "../data/tasks.json";

const DFMEAContext = createContext(null);

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
}

export function DFMEAProvider({ children }) {
  const [activeTab, setActiveTab] = useState(requirementsJson?.tabId || "requirements");

  const [requirementsData, setRequirementsData] = useState(requirementsJson);

  const [tasksData, setTasksData] = useState(tasksJson);

  // --- Workflows placeholder (in-memory only)
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);

  const updateRequirement = useCallback((id, patch) => {
    setRequirementsData((prev) => {
      const reqs = prev?.content?.requirements || [];
      return {
        ...prev,
        content: { ...prev.content, requirements: reqs.map((r) => (r.id === id ? { ...r, ...patch } : r)) },
        meta: { ...(prev.meta || {}), edited: "Just now" },
      };
    });
  }, []);

  // ✅ TASKS: CRUD
  const replaceTasks = useCallback((nextTasks) => {
    setTasksData((prev) => ({
      ...prev,
      tasks: nextTasks,
      meta: { ...(prev.meta || {}), edited: "Just now" },
    }));
  }, []);

  const createTask = useCallback((task) => {
    setTasksData((prev) => {
      const t = {
        id: task?.id || uid("T"),
        title: task?.title || "New task",
        status: task?.status || "todo",
        priority: task?.priority || "Med",
        owner: task?.owner || "You",
        start: task?.start || prev?.range?.start || "2026-01-01",
        end: task?.end || prev?.range?.start || "2026-01-01",
        progress: typeof task?.progress === "number" ? task.progress : 0,
        lane: task?.lane || prev?.lanes?.[0]?.id || "elec",
        ...task,
      };

      return {
        ...prev,
        tasks: [t, ...(prev.tasks || [])],
        meta: { ...(prev.meta || {}), edited: "Just now" },
      };
    });

    return task?.id; // optional (not used)
  }, []);

  const updateTask = useCallback((id, patch) => {
    setTasksData((prev) => {
      const tasks = prev?.tasks || [];
      const next = tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
      return {
        ...prev,
        tasks: next,
        meta: { ...(prev.meta || {}), edited: "Just now" },
      };
    });
  }, []);

  const deleteTask = useCallback((id) => {
    setTasksData((prev) => {
      const tasks = prev?.tasks || [];
      return {
        ...prev,
        tasks: tasks.filter((t) => t.id !== id),
        meta: { ...(prev.meta || {}), edited: "Just now" },
      };
    });
  }, []);

  // --- Workflows placeholder actions
  const createWorkflow = useCallback(() => {
    setWorkflows((prev) => [{ id: uid("wf"), title: "Untitled" }, ...prev]);
  }, []);

  const deleteWorkflow = useCallback((id) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
    setSelectedWorkflowId((prev) => (prev === id ? null : prev));
  }, []);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,

      requirementsData,
      setRequirementsData,
      updateRequirement,

      tasksData,
      setTasksData,
      replaceTasks,
      createTask,
      updateTask,
      deleteTask,

      workflows,
      selectedWorkflowId,
      setSelectedWorkflowId,
      createWorkflow,
      deleteWorkflow,
    }),
    [
      activeTab,
      requirementsData,
      updateRequirement,
      tasksData,
      replaceTasks,
      createTask,
      updateTask,
      deleteTask,
      workflows,
      selectedWorkflowId,
      createWorkflow,
      deleteWorkflow,
    ]
  );

  return <DFMEAContext.Provider value={value}>{children}</DFMEAContext.Provider>;
}

export function useDFMEA() {
  const ctx = useContext(DFMEAContext);
  if (!ctx) throw new Error("useDFMEA must be used inside DFMEAProvider");
  return ctx;
}