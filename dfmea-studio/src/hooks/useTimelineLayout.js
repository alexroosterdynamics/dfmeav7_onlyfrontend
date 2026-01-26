import { useMemo } from "react";

const msDay = 86400000;

function diff(a, b) {
  return Math.round((new Date(b) - new Date(a)) / msDay);
}

export function useTimelineLayout({ range, pxPerDay = 40, lanes, tasks }) {
  return useMemo(() => {
    const dayCount = Math.max(1, diff(range.start, range.end));
    const timelineWidth = dayCount * pxPerDay;

    const getLeft = (date) => diff(range.start, date) * pxPerDay;
    const getWidth = (start, end) => Math.max(pxPerDay, diff(start, end) * pxPerDay) - 4;

    const packLaneTasks = (laneId, laneTasks) => {
      const sorted = [...laneTasks].sort((a, b) => new Date(a.start) - new Date(b.start));
      const rows = [];

      const packed = sorted.map((t) => {
        let rowIndex = rows.findIndex((end) => new Date(end) < new Date(t.start));
        if (rowIndex === -1) {
          rowIndex = rows.length;
          rows.push(t.end);
        } else {
          rows[rowIndex] = t.end;
        }
        return { ...t, row: rowIndex };
      });

      return { packed, rowsCount: rows.length };
    };

    const lanesPacked = lanes.map((lane) => {
      const laneTasks = tasks.filter((t) => t.lane === lane.id);
      const { packed, rowsCount } = packLaneTasks(lane.id, laneTasks);
      return { lane, packed, rowsCount };
    });

    return { dayCount, timelineWidth, getLeft, getWidth, lanesPacked };
  }, [range.start, range.end, pxPerDay, lanes, tasks]);
}