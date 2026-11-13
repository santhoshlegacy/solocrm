"use client";

import React, { createContext, useContext, useState, useEffect, useTransition } from "react";
import { switchWorkspaceMode } from "@/actions/mode";
import { WorkspaceMode } from "@/lib/supabase/types";

interface WorkspaceContextType {
  currentMode: WorkspaceMode;
  setCurrentMode: (mode: WorkspaceMode) => void;
  isPending: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  currentMode: "freelancer",
  setCurrentMode: () => {},
  isPending: false,
});

export const useWorkspaceMode = () => useContext(WorkspaceContext);

export const WorkspaceModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMode, setMode] = useState<WorkspaceMode>("freelancer");
  const [isPending, startTransition] = useTransition();

  // Load initial mode from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("solocrm_workspace_mode") as WorkspaceMode | null;
      if (saved === "freelancer" || saved === "business") {
        setMode(saved);
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  }, []);

  const setCurrentMode = (mode: WorkspaceMode) => {
    if (mode === currentMode) return;
    setMode(mode);
    try {
      localStorage.setItem("solocrm_workspace_mode", mode);
    } catch {
      // Ignore
    }

    startTransition(async () => {
      try {
        await switchWorkspaceMode(mode);
      } catch (err) {
        console.error("Error switching workspace mode:", err);
      }
    });
  };

  return (
    <WorkspaceContext.Provider value={{ currentMode, setCurrentMode, isPending }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
