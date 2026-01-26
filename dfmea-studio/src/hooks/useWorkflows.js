import { useDFMEA } from "../contexts/DFMEAContext";

export function useWorkflows() {
  const {
    workflows,
    selectedWorkflowId,
    setSelectedWorkflowId,
    createWorkflow,
    deleteWorkflow,
  } = useDFMEA();

  return {
    workflows,
    selectedWorkflowId,
    setSelectedWorkflowId,
    createWorkflow,
    deleteWorkflow,
  };
}