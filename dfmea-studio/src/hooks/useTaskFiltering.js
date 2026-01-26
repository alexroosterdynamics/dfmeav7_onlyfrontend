import { useMemo } from "react";

export function useTaskFiltering(tasks, { q = "", statusFilter = "all" }) {
  return useMemo(() => {
    const query = q.trim().toLowerCase();

    const filtered = tasks.filter((t) => {
      const statusOk = statusFilter === "all" || t.status === statusFilter;
      const textOk =
        !query ||
        t.title.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query);
      return statusOk && textOk;
    });

    return { filtered, count: filtered.length };
  }, [tasks, q, statusFilter]);
}