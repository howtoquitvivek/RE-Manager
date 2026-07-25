"use client";
import React from "react";
import { motion } from "framer-motion";
import { User, Building2, Hammer, Shield, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useOnboardingStore } from "@/store/onboarding-store";
import { WorkspaceType } from "@/types/dashboard";

const workspaceTypes: { 
  type: WorkspaceType; 
  title: string; 
  tagline: string;
  description: string; 
  icon: any; 
  color: string;
  badge: string;
}[] = [
  {
    type: "personal",
    title: "Personal REOS",
    tagline: "Apple-Inspired Private Vault",
    description: "Secure, minimalist asset ledger, document vaults with AI clause analysis, and personal OpenStreetMap tracking.",
    icon: User,
    color: "from-blue-500/10 to-indigo-500/10 hover:border-indigo-500/30",
    badge: "Minimalist",
  },
  {
    type: "rental",
    title: "Rental REOS",
    tagline: "Landlord Asset Engine",
    description: "Operational tracking for multi-unit rental yields, lease agreements, tenant relationships, and rent reminders.",
    icon: Building2,
    color: "from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/30",
    badge: "Operational",
  },
  {
    type: "builder",
    title: "Property Builder REOS",
    tagline: "SME Builder command desk",
    description: "Track project phases, towers, plotting dimensions, BHK flat inventory, and construction milestones with site logs.",
    icon: Hammer,
    color: "from-amber-500/10 to-orange-500/10 hover:border-amber-500/30",
    badge: "Builder OS",
  },
  {
    type: "enterprise",
    title: "Enterprise REOS",
    tagline: "Multi-Region Command Center",
    description: "Infrastructure for large networks: regional clusters, compliance screening, approval desks, RBAC, and tamperproof audit logs.",
    icon: Shield,
    color: "from-purple-500/10 to-pink-500/10 hover:border-purple-500/30",
    badge: "Enterprise",
  },
];

export function WorkspaceTypeModal() {
  const setWorkspaceType = useOnboardingStore((state) => state.setWorkspaceType);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">
          OPERATING ECOSYSTEM
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl uppercase">
          Choose Your Niche Experience
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base">
          Unlock a specialized operating system built entirely around your real estate workflow. Four SaaS products, one unified database.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {workspaceTypes.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8 }}
            className="h-full"
          >
            <Card
              className={`group relative cursor-pointer overflow-hidden border-border/40 bg-card/40 backdrop-blur-xl p-6 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(255,255,255,0.02)] h-full flex flex-col justify-between ${item.color}`}
              onClick={() => setWorkspaceType(item.type)}
            >
              {/* Top Accent Gradient glow */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/80 border border-border/50 text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                    <item.icon className="h-6 w-6 transition-transform group-hover:rotate-6" />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold px-2 py-1 rounded-md bg-secondary/80 text-muted-foreground border border-border/20">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-primary/80 font-bold uppercase tracking-wider">
                    {item.tagline}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between text-sm font-bold text-foreground group-hover:text-primary transition-all">
                <span className="uppercase tracking-widest text-[10px]">Deploy Workspace</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
