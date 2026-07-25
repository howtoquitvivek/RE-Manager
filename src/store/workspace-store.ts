import { create } from 'zustand';
import { WorkspaceType } from '@/types/dashboard';

interface WorkspaceState {
  currentWorkspace: {
    id: string;
    name: string;
    slug: string;
    type: WorkspaceType;
    plan: string;
  } | null;
  
  setCurrentWorkspace: (workspace: WorkspaceState['currentWorkspace']) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: null,
  
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  clearWorkspace: () => set({ currentWorkspace: null }),
}));
