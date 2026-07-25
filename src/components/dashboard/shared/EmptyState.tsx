"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-secondary/20 p-12 text-center animate-in fade-in zoom-in duration-500",
      className
    )}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-[280px] leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
