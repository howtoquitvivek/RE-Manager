"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnboardingStore } from "@/store/onboarding-store";
import { WorkspaceType } from "@/types/dashboard";

const plans: Record<WorkspaceType, { name: string; price: string; features: string[]; highlight?: boolean }[]> = {
  personal: [
    { name: "Starter", price: "Free", features: ["Up to 3 Properties", "Basic AI Summary", "Standard Mapping", "Cloud Storage (1GB)"] },
    { name: "Pro", price: "$19", features: ["Unlimited Properties", "Advanced AI Insights", "Precision Mapping", "Priority Support"], highlight: true },
    { name: "Elite", price: "$49", features: ["Portfolio Analytics", "Legal Document Vault", "Dedicated Agent AI", "24/7 Support"] },
  ],
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

export function PlanSelectionModal() {
  const selectedType = useOnboardingStore((state) => state.selectedType);
  const setPlan = useOnboardingStore((state) => state.setPlan);
  const prevStep = useOnboardingStore((state) => state.prevStep);

  if (!selectedType) return null;

  const currentPlans = plans[selectedType];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 border-b border-border/40 pb-6">
        <Button variant="outline" size="icon" onClick={prevStep} className="h-10 w-10 rounded-full border-border/50 bg-secondary/30">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center flex-grow pr-10 space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground uppercase">Select Your Portfolio Tier</h2>
          <p className="text-muted-foreground text-sm">Deploy state-of-the-art tools optimized for your operational scale.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 pt-4">
        {currentPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex"
          >
            <Card className={`relative flex flex-col w-full overflow-visible border-border/40 bg-card/30 backdrop-blur-xl p-6 transition-all hover:border-primary/40 ${plan.highlight ? 'ring-2 ring-primary border-primary/50 bg-primary/5 shadow-2xl shadow-primary/10' : ''}`}>
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 rounded-full bg-primary px-4 py-1 text-[9px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-6 border-b border-border/20 pb-4">
                <h3 className="text-xl font-extrabold tracking-tight text-foreground">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  {plan.price !== "Free" && plan.price !== "Custom" && <span className="text-xs text-muted-foreground font-semibold">/month</span>}
                </div>
              </div>

              <ul className="space-y-4 flex-grow mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground leading-snug">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full h-11 text-sm font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${plan.highlight ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                onClick={() => setPlan(plan.name)}
              >
                Deploy {plan.name}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
