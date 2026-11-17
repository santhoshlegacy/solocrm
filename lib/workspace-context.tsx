"use client";

import React, { createContext, useContext, useState, useEffect, useTransition } from "react";
import { switchWorkspaceMode } from "@/actions/mode";
import { WorkspaceMode } from "@/lib/supabase/types";

interface WorkspaceContextType {
  currentMode: WorkspaceMode;
  setCurrentMode: (mode: WorkspaceMode) => void;
  isPending: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  newActionTrigger: number;
  triggerNewAction: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  currentMode: "freelancer",
  setCurrentMode: () => {},
  isPending: false,
  searchQuery: "",
  setSearchQuery: () => {},
  newActionTrigger: 0,
  triggerNewAction: () => {},
});

export const useWorkspaceMode = () => useContext(WorkspaceContext);

export const WorkspaceModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMode, setMode] = useState<WorkspaceMode>("freelancer");
  const [searchQuery, setSearchQuery] = useState("");
  const [newActionTrigger, setNewActionTrigger] = useState(0);
  const [isPending, startTransition] = useTransition();

  const triggerNewAction = () => {
    setNewActionTrigger((prev) => prev + 1);
  };

  // Load initial mode from cookie or localStorage if available
  useEffect(() => {
    try {
      // Check cookie first
      const cookieMatch = document.cookie.match(/solocrm_workspace_type=([^;]+)/);
      if (cookieMatch) {
        const val = cookieMatch[1];
        if (val === "business") {
          setMode("business");
          return;
        } else if (val === "freelance") {
          setMode("freelancer");
          return;
        }
      }

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
    <WorkspaceContext.Provider
      value={{
        currentMode,
        setCurrentMode,
        isPending,
        searchQuery,
        setSearchQuery,
        newActionTrigger,
        triggerNewAction,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
