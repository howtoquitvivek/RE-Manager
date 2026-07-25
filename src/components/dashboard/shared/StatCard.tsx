"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  icon: any;
  index?: number;
  className?: string;
}

export function StatCard({ title, value, description, trend, icon: Icon, index = 0, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn("relative overflow-hidden border-border/50 bg-secondary/20 p-6 transition-all hover:bg-secondary/30", className)}>
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              trend.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
              {trend.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend.value}%
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-foreground mt-1">{value}</h3>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Subtle decorative background gradient */}
        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
      </Card>
    </motion.div>
  );
}
