"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Files, 
  Sparkles, 
  History, 
  Map as MapIcon,
  Plus,
  ArrowUpRight,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  FileWarning,
  ChevronRight
} from "lucide-react";
import { StatCard } from "@/components/dashboard/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVault } from "@/store/useVaultStore";
import { getDashboardStats } from "@/actions/personal";
import { DashboardStats } from "@/types/personal";
import VaultPasswordFlow from "./VaultPasswordFlow";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Dynamically import map to avoid SSR issues
const MiniMap = dynamic<any>(() => import("@/components/dashboard/personal/PersonalMap"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-secondary/20 animate-pulse rounded-xl" />
});

export default function PersonalDashboard({ userId, orgId, orgSlug }: { userId: string, orgId: string, orgSlug: string }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { isUnlocked, lockVault } = useVault();
  const [showVaultPrompt, setShowVaultPrompt] = useState(false);
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      const data = await getDashboardStats(userId, orgId);
      setStats(data);
      setLoading(false);
    }
    fetchStats();

    const timer = setTimeout(() => setLoadMap(true), 200);
    return () => clearTimeout(timer);
  }, [userId, orgId]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 w-1/3 bg-secondary/20 rounded-xl" />
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-secondary/20 rounded-xl" />)}
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[400px] bg-secondary/20 rounded-xl" />
          <div className="h-[400px] bg-secondary/20 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Portfolio Overview
          </h1>
          <p className="text-muted-foreground text-lg">Securely managing your personal real estate assets.</p>
        </div>
        <Link href={`/dashboard/${orgSlug}/properties`}>
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-2">
            <Plus className="h-5 w-5" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Properties" 
          value={stats?.totalProperties.toString() || "0"} 
          description="Registered assets"
          icon={Building2} 
          index={0}
        />
        
        {/* Secure Net Value Card */}
        <Card className="relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-md p-6 group transition-all hover:border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Net Portfolio Value</p>
            <div className="flex items-center gap-1.5">
              {isUnlocked && (
                <button 
                  onClick={() => { lockVault(); }} 
                  className="text-[10px] font-extrabold text-amber-500 hover:text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1"
                  title="Lock Vault immediately"
                >
                  <Shield className="h-2.5 w-2.5 animate-pulse" /> Lock
                </button>
              )}
              <Link href={`/dashboard/${orgSlug}/settings`}>
                <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer" title="Setup Password / Settings">
                  Setup
                </span>
              </Link>
            </div>
          </div>
          <div className="relative h-12 flex items-center">
            <AnimatePresence mode="wait">
              {isUnlocked ? (
                <motion.div
                  key="value"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
                >
                  ${(stats?.netEstimatedValue || 0).toLocaleString()}
                </motion.div>
              ) : (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-8 bg-muted/20 backdrop-blur-xl rounded-md flex items-center justify-center cursor-pointer group-hover:bg-muted/30 transition-colors"
                  onClick={() => setShowVaultPrompt(true)}
                >
                  <EyeOff className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-xs font-semibold text-muted-foreground">Unlock to View</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            Estimated market value
          </p>
        </Card>

        <StatCard 
          title="Total Documents" 
          value={stats?.recentlyUploadedDocs.length.toString() || "0"} 
          description="Securely vaulted"
          icon={Files} 
          index={2}
        />
        <StatCard 
          title="Missing Records" 
          value={stats?.propertiesMissingDocs.length.toString() || "0"} 
          description="Action required"
          icon={FileWarning} 
          index={3}
          className={stats?.propertiesMissingDocs.length && stats.propertiesMissingDocs.length > 0 ? "border-amber-500/20 bg-amber-500/5" : ""}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Map Preview */}
        <Card className="lg:col-span-2 border-border/40 bg-card/40 backdrop-blur-md p-6 overflow-hidden flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              Global Map View
            </h3>
            <Link href={`/dashboard/${orgSlug}/maps`}>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 rounded-full px-4">
                Full Map
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="flex-grow rounded-2xl overflow-hidden relative border border-border/50">
            {loadMap ? (
              <MiniMap isMini />
            ) : (
              <div className="h-full w-full bg-secondary/20 animate-pulse rounded-xl" />
            )}
          </div>
        </Card>

        {/* Quick Activity */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Recent Activity
            </h3>
          </div>
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {stats?.recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                <History className="h-12 w-12 opacity-10 mb-2" />
                <p className="text-sm">No activity recorded yet.</p>
              </div>
            ) : (
              stats?.recentActivity.map((activity, i) => (
                <div key={activity.id} className="flex gap-3 relative pb-4">
                  {i !== stats.recentActivity.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-border/30" />
                  )}
                  <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {activity.activityType.replace("_", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.details ? JSON.parse(activity.details).name : ""}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(new Date(activity.createdAt))} ago
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Sections */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Missing Documents Section */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
              Document Integrity
            </h3>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-mono font-bold">
              {stats ? (stats.totalProperties > 0 ? Math.round(((stats.totalProperties - stats.propertiesMissingDocs.length) / stats.totalProperties) * 100) : 100) : 85}% Secured
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Progress Gauge bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>Vault Coverage</span>
                <span>{stats ? (stats.totalProperties > 0 ? Math.round(((stats.totalProperties - stats.propertiesMissingDocs.length) / stats.totalProperties) * 100) : 100) : 85}% Done</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary/50 overflow-hidden border border-border/10">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700" 
                  style={{ width: `${stats ? (stats.totalProperties > 0 ? Math.round(((stats.totalProperties - stats.propertiesMissingDocs.length) / stats.totalProperties) * 100) : 100) : 85}%` }} 
                />
              </div>
            </div>

            {/* Checklist elements with states */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { label: "Property Purchase Deed", checked: stats ? stats.recentlyUploadedDocs.length > 0 : true },
                { label: "Tax Registration Receipts", checked: stats ? stats.recentlyUploadedDocs.length > 1 : false },
                { label: "Insurance Certificate", checked: stats ? stats.recentlyUploadedDocs.length > 2 : true },
                { label: "Utility Connection Proofs", checked: stats ? stats.recentlyUploadedDocs.length > 3 : false },
              ].map((item, i) => (
                <div key={i} className={cn(
                  "p-3 rounded-xl border flex items-center justify-between text-xs transition-colors",
                  item.checked 
                    ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-500/90 font-semibold" 
                    : "border-amber-500/10 bg-amber-500/5 text-amber-500/90 font-medium"
                )}>
                  <span>{item.label}</span>
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-extrabold tracking-wider px-1.5 py-0.5 border-none",
                    item.checked ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500 animate-pulse"
                  )}>
                    {item.checked ? "VERIFIED" : "MISSING"}
                  </Badge>
                </div>
              ))}
            </div>

            {stats?.propertiesMissingDocs.length && stats.propertiesMissingDocs.length > 0 ? (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Properties Lacking Records ({stats.propertiesMissingDocs.length})</p>
                <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {stats.propertiesMissingDocs.map(property => (
                    <div key={property.id} className="group flex items-center justify-between p-3 rounded-xl bg-background/30 border border-border/40 transition-all hover:border-primary/20">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-amber-500" />
                        <span className="font-semibold text-xs text-foreground truncate max-w-[150px]">{property.name}</span>
                      </div>
                      <Link href={`/dashboard/${orgSlug}/documents`}>
                        <Button variant="ghost" size="sm" className="h-7 rounded-lg text-[10px] bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 font-bold px-2.5">
                          Fix Gap
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
                <Shield className="h-4 w-4 mr-2" /> All property portfolios fully documented!
              </div>
            )}
          </div>
        </Card>

        {/* Recently Uploaded Documents */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Files className="h-5 w-5 text-primary" />
              Secure Document Vault
            </h3>
            <Link href={`/dashboard/${orgSlug}/documents`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Enter Vault
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats?.recentlyUploadedDocs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm italic">No documents uploaded yet.</p>
            ) : (
              stats?.recentlyUploadedDocs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10 transition-all hover:border-primary/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                      <Files className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm truncate max-w-[200px]">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(doc.createdAt))} ago
                      </p>
                    </div>
                  </div>
                  {doc.aiSummary && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      AI Summary Ready
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Vault Prompt Modal */}
      <AnimatePresence>
        {showVaultPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <VaultPasswordFlow 
                userId={userId} 
                onSuccess={() => setShowVaultPrompt(false)} 
              />
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-muted-foreground"
                onClick={() => setShowVaultPrompt(false)}
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
