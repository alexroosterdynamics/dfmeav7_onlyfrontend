import { useDFMEA } from "../contexts/DFMEAContext";

export function useAppNavigation() {
  const { activeTab, setActiveTab } = useDFMEA();
  return { activeTab, setActiveTab };
}