import React, { createContext, useContext, useMemo } from "react";
import requirementsJson from "../data/requirements.json";

const DFMEAContext = createContext(null);

export function DFMEAProvider({ children }) {
  const value = useMemo(() => {
    return {
      requirementsData: requirementsJson
    };
  }, []);

  return <DFMEAContext.Provider value={value}>{children}</DFMEAContext.Provider>;
}



export function useDFMEA() {
  const ctx = useContext(DFMEAContext);
  if (!ctx) throw new Error("useDFMEA must be used inside DFMEAProvider");
  return ctx;
}


