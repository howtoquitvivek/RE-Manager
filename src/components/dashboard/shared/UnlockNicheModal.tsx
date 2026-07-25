"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Shield, Coins, Building, Sparkles, Loader2, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkspaceType } from "@/types/dashboard";
import { purchaseNichePlanAction } from "@/actions/organization";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface UnlockNicheModalProps {
  isOpen: boolean;
  onClose: () => void;
  nicheType: WorkspaceType | null;
}

const plans: Record<Exclude<WorkspaceType, "personal">, { name: string; price: string; features: string[]; highlight?: boolean }[]> = {
  rental: [
    { name: "Landlord", price: "$29", features: ["Up to 10 Units", "Tenant Screening", "Payment Tracking", "Lease Templates"] },
    { name: "Property Manager", price: "$79", features: ["Unlimited Units", "Auto-Lease Generation", "Financial Reporting", "Multi-user Access"], highlight: true },
    { name: "Business", price: "$199", features: ["Custom Workflows", "API Access", "Bulk Data Export", "White-label Portal"] },
  ],
  builder: [
    { name: "Builder Lite", price: "$129", features: ["Active Projects (5)", "Tower & Plot Checklists", "Timeline Tracking", "Construction Maps"] },
    { name: "Developer OS", price: "$349", features: ["Unlimited Projects", "RERA Document Vault", "Subcontractor Roles", "Progress Logs"], highlight: true },
    { name: "Contractor Premium", price: "$799", features: ["Advanced Flat Ledger", "Investor Progress Portals", "Construction AI Assist", "24/7 SLA"] },
  ],
  enterprise: [
    { name: "Global Command", price: "$999", features: ["Multi-region Portfolios", "Zoning Compliance AI", "GIS Clustered Maps", "Audit Trails"] },
    { name: "Network Ops", price: "$2499", features: ["Unlimited Subsidiary Orgs", "Tamperproof Audit Ledger", "Multi-stage Legal Flows", "RBAC Engine"], highlight: true },
    { name: "Custom Suite", price: "Custom", features: ["Custom ERP Integrations", "Dedicated Generative Models", "On-Prem / VPC Deployment", "Executive SLA Support"] },
  ],
};

const nicheDetails: Record<Exclude<WorkspaceType, "personal">, { title: string; subtitle: string; icon: any; color: string; desc: string }> = {
  rental: {
    title: "Rental Portfolio Niche",
    subtitle: "Unlock complete tenancy logs, leasing templates, automated financial reporting, and payments tracking.",
    icon: Coins,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    desc: "Seamless tenant-landlord communication ledgers and automated cashflows."
  },
  builder: {
    title: "Builder & Projects Niche",
    subtitle: "Unlock tower construction management, flat ledgers, RERA certificate compliance vaults, and project timelines.",
    icon: Sparkles,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    desc: "Ultimate workspace mapping active building sites, towers, blueprints, and progress."
  },
  enterprise: {
    title: "Enterprise Assets Niche",
    subtitle: "Unlock multi-region portfolios, environmental compliance records, high-audit ledgers, and team RBAC rules.",
    icon: Building,
    color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    desc: "Heavy-duty command console for multi-subsidiary networks and global corporate portfolios."
  }
};

const checkoutSteps = [
  "Connecting to Secure Stripe Gateway...",
  "Authorizing premium niche licensing terms...",
  "Deploying database ledger structures & schemas...",
  "Workspace activation complete! Initializing environment..."
];

export function UnlockNicheModal({ isOpen, onClose, nicheType }: UnlockNicheModalProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPlan(null);
      setIsCheckingOut(false);
      setCheckoutStep(0);
    }
  }, [isOpen]);

  if (!nicheType || nicheType === "personal") return null;

  const currentNiche = nicheDetails[nicheType];
  const currentPlans = plans[nicheType];
  const Icon = currentNiche.icon;

  const handleDeploy = async (planName: string) => {
    setSelectedPlan(planName);
    setIsCheckingOut(true);
    setCheckoutStep(0);

    // Simulate standard setup/checkout process with micro-timeouts
    for (let i = 0; i < checkoutSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setCheckoutStep(i + 1);
    }

    try {
      const res = await purchaseNichePlanAction(nicheType, planName);
      if (res?.error) {
        toast({
          title: "Activation Failed",
          description: res.error,
          variant: "destructive",
        });
        setIsCheckingOut(false);
      } else if (res?.redirectUrl) {
        toast({
          title: "Niche Deploy Success",
          description: `Your new ${nicheType.toUpperCase()} workspace is now active!`,
        });
        onClose();
        router.push(res.redirectUrl);
      }
    } catch (e: any) {
      toast({
        title: "System Exception",
        description: e.message || "Failed to finalize activation.",
        variant: "destructive",
      });
      setIsCheckingOut(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isCheckingOut && !open && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl p-0 border-border/40 bg-card/75 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-3xl z-[100] outline-none">
        <AnimatePresence mode="wait">
          {!isCheckingOut ? (
            <motion.div
              key="plans-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto"
            >
              <DialogHeader className="flex flex-col md:flex-row md:items-center gap-4 border-b border-border/20 pb-6 text-left">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border ${currentNiche.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-extrabold text-foreground uppercase tracking-tight flex items-center gap-2">
                    {currentNiche.title}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                    {currentNiche.subtitle}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="grid gap-6 md:grid-cols-3 pt-2">
                {currentPlans.map((plan, idx) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex"
                  >
                    <Card className={`relative flex flex-col w-full overflow-visible border-border/40 bg-background/30 backdrop-blur-md p-5 rounded-2xl transition-all hover:border-primary/50 ${plan.highlight ? 'ring-2 ring-primary border-primary/50 bg-primary/5 shadow-xl shadow-primary/5' : ''}`}>
                      {plan.highlight && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-primary px-3 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-primary-foreground shadow-md">
                          Recommended
                        </div>
                      )}
                      
                      <div className="mb-4 border-b border-border/20 pb-3">
                        <h4 className="text-lg font-bold tracking-tight text-foreground">{plan.name}</h4>
                        <div className="mt-2 flex items-baseline gap-0.5">
                          <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                          {plan.price !== "Free" && plan.price !== "Custom" && <span className="text-[10px] text-muted-foreground font-semibold">/month</span>}
                        </div>
                      </div>

                      <ul className="space-y-3 flex-grow mb-6">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-normal">
                            <div className="h-4 w-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="h-2.5 w-2.5" />
                            </div>
                            <span className="text-foreground/80">{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full h-10 text-xs font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${plan.highlight ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10 hover:bg-primary/90' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                        onClick={() => handleDeploy(plan.name)}
                      >
                        Deploy {plan.name}
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-10 flex flex-col items-center justify-center text-center space-y-8 min-h-[400px] bg-card/90"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-125" />
                <div className="relative h-20 w-20 rounded-3xl bg-secondary/80 border border-border/80 flex items-center justify-center shadow-2xl">
                  {checkoutStep < checkoutSteps.length ? (
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-bounce" />
                  )}
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground uppercase">
                  {checkoutStep < checkoutSteps.length ? "Setting Up Ledger Workspace" : "Activation Complete!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Deploying active <span className="text-foreground font-semibold capitalize">{nicheType}</span> database structures for {selectedPlan}.
                </p>
              </div>

              <div className="w-full max-w-sm space-y-3">
                <div className="h-2 w-full bg-secondary/40 rounded-full overflow-hidden border border-border/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(checkoutStep / checkoutSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <div className="h-6 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={checkoutStep}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      className="text-xs font-semibold text-primary uppercase tracking-widest"
                    >
                      {checkoutStep < checkoutSteps.length ? checkoutSteps[checkoutStep] : "Finalizing redirect..."}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold bg-secondary/20 border border-border/40 px-3 py-1.5 rounded-full">
                <Lock className="h-3 w-3 text-primary animate-pulse" /> End-to-end Encrypted Provisioning
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
