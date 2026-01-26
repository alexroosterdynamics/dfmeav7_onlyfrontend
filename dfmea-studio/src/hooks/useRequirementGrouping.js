import { useMemo } from "react";

export function useRequirementGrouping(requirements, { frozenFn, filter = "all" }) {
  return useMemo(() => {
    const map = { Software: [], Electrical: [], Mechanical: [] };

    requirements.forEach((r) => {
      const key = r.domainCategory || "Software";
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });

    const meta = Object.keys(map).map((d) => ({
      d,
      unfrozen: map[d].filter((x) => !frozenFn(x)).length,
      flagged: map[d].filter((x) => x.flagged).length,
      total: map[d].length,
    }));

    const order = meta
      .sort((a, b) => b.unfrozen - a.unfrozen || b.flagged - a.flagged || b.total - a.total)
      .map((x) => x.d);

    order.forEach((d) => {
      map[d].sort(
        (a, b) =>
          (frozenFn(a) ? 0 : 1) - (frozenFn(b) ? 0 : 1) ||
          (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0)
      );
    });

    const filtered = {};
    order.forEach((d) => {
      filtered[d] =
        filter === "all"
          ? map[d]
          : filter === "frozen"
          ? map[d].filter(frozenFn)
          : map[d].filter((r) => !frozenFn(r));
    });

    return { buckets: { map, order }, filtered };
  }, [requirements, frozenFn, filter]);
}