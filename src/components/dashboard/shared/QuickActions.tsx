"use client";

import { motion } from "framer-motion";
import { Plus, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export function QuickActions({ actions, title = "Quick Actions" }: QuickActionsProps) {
  return (
    <Card className="border-border/40 bg-secondary/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant={action.variant || "outline"}
              className={cn(
                "w-full justify-start h-11 gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]",
                action.variant === "default" 
                  ? "bg-foreground text-background hover:bg-foreground/90" 
                  : "border-border/50 bg-secondary/30 hover:bg-secondary/50",
                action.className
              )}
              onClick={action.onClick}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
