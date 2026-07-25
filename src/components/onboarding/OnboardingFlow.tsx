"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useOnboardingStore } from "@/store/onboarding-store";
import { WorkspaceTypeModal } from "./WorkspaceTypeModal";
import { PlanSelectionModal } from "./PlanSelectionModal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function OnboardingFlow() {
  const isModalOpen = useOnboardingStore((state) => state.isModalOpen);
  const step = useOnboardingStore((state) => state.step);
  const closeOnboarding = useOnboardingStore((state) => state.closeOnboarding);
  const selectedPlan = useOnboardingStore((state) => state.selectedPlan);
  const router = useRouter();

  // If a plan is selected, redirect to register/login
  useEffect(() => {
    if (selectedPlan) {
      closeOnboarding();
      // In a real app, we'd pass these params to the registration page
      router.push("/login?register=true");
    }
  }, [selectedPlan, closeOnboarding, router]);

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeOnboarding()}>
      <DialogContent className="max-w-5xl p-0 border-none bg-transparent shadow-none sm:max-w-[90vw] lg:max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/80 p-8 backdrop-blur-2xl shadow-2xl sm:p-12">
          {/* Background decorative elements */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />
          
          <div className="relative">
            {step === 'type' ? <WorkspaceTypeModal /> : <PlanSelectionModal />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
