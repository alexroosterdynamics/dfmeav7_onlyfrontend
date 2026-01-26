import { useMemo } from "react";
import { useDFMEA } from "../contexts/DFMEAContext";

export function useRequirements() {
  const { requirementsData, updateRequirement } = useDFMEA();

  const projectName = requirementsData?.content?.projectName ?? "DFMEA Project";
  const requirements = requirementsData?.content?.requirements ?? [];
  const meta = requirementsData?.meta ?? {};

  const frozen = (r) => Boolean(r?.isComplete && !r?.flagged);

  const stats = useMemo(() => {
    const total = requirements.length;
    const frozenCount = requirements.filter(frozen).length;
    const flaggedCount = requirements.filter((r) => r.flagged).length;
    return {
      total,
      frozen: frozenCount,
      flagged: flaggedCount,
      unfrozen: total - frozenCount,
    };
  }, [requirements]);

  return {
    requirementsData,
    requirements,
    projectName,
    meta,
    frozen,
    stats,
    updateRequirement,
  };
}