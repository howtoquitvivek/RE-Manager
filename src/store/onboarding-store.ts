import { create } from 'zustand';
import { WorkspaceType } from '@/types/dashboard';

interface OnboardingState {
  selectedType: WorkspaceType | null;
  selectedPlan: string | null;
  isModalOpen: boolean;
  step: 'type' | 'plan';
  
  setWorkspaceType: (type: WorkspaceType) => void;
  setPlan: (plan: string) => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  selectedType: null,
  selectedPlan: null,
  isModalOpen: false,
  step: 'type',

  setWorkspaceType: (type) => set({ selectedType: type, step: 'plan' }),
  setPlan: (plan) => set({ selectedPlan: plan }),
  openOnboarding: () => set({ isModalOpen: true, step: 'type' }),
  closeOnboarding: () => set({ isModalOpen: false }),
  nextStep: () => set((state) => ({ step: state.step === 'type' ? 'plan' : 'type' })),
  prevStep: () => set((state) => ({ step: state.step === 'plan' ? 'type' : 'type' })),
  reset: () => set({ selectedType: null, selectedPlan: null, step: 'type', isModalOpen: false }),
}));
