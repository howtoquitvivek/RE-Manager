"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Building2, 
  Package, 
  FileCheck, 
  TrendingUp,
  Map as MapIcon,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Globe,
  History,
  Shield,
  FileText
} from "lucide-react";
import { StatCard } from "@/components/dashboard/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EnterpriseDashboardProps {
  userId: string;
  orgId: string;
  orgSlug: string;
}

export default function EnterpriseDashboard({ userId, orgId, orgSlug }: EnterpriseDashboardProps) {
  const [settings, setSettings] = React.useState({
    multiSig: false,
    apiKey: "re_prod_7f2bc8a9b3d11ef4",
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`reos_settings_${orgSlug}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSettings(prev => ({
            ...prev,
            ...parsed
          }));
        } catch (e) {
          console.error("Error loading enterprise settings:", e);
        }
      }
    }
  }, [orgSlug]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Global Infrastructure Console
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase mt-2">
            Mission Control
          </h1>
          <p className="text-muted-foreground text-lg">Multi-region Developer Operations & System Audit.</p>
          
          {/* Live settings indicators */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className={cn(
              "text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 backdrop-blur-md transition-colors",
              settings.multiSig 
                ? "border-purple-500/20 bg-purple-500/5 text-purple-500" 
                : "border-muted/30 bg-muted/5 text-muted-foreground"
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full", settings.multiSig ? "bg-purple-500 animate-pulse" : "bg-muted-foreground")} />
              Multi-Sig Shield: {settings.multiSig ? "Enabled (2/3 approvals)" : "Disabled (Standard)"}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-500 flex items-center gap-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              API Gate: {settings.apiKey.substring(0, 10)}...
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/dashboard/${orgSlug}/audit`}>
            <Button variant="outline" className="h-12 border-border/50 bg-secondary/30 rounded-full font-bold px-5">
              System Audit
            </Button>
          </Link>
          <Link href={`/dashboard/${orgSlug}/projects`}>
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-2">
              <Plus className="h-5 w-5" />
              Create Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Projects" 
          value="8 Sites" 
          description="3 in foundation phase"
          icon={Briefcase} 
          index={0}
        />
        <StatCard 
          title="Total Inventory" 
          value="452 Units" 
          description="Across all regional clusters"
          icon={Package} 
          index={1}
        />
        <StatCard 
          title="Global Occupancy" 
          value="88.2%" 
          description="Stable rental yield"
          icon={TrendingUp} 
          index={2}
        />
        <StatCard 
          title="Pending Approvals" 
          value="12 Files" 
          description="Awaiting legal clearance"
          icon={FileCheck} 
          index={3}
          className="border-amber-500/20 bg-amber-500/5 shadow-lg shadow-amber-500/5"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Regional Clusters */}
        <Card className="lg:col-span-2 border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary animate-spin-slow" />
              Regional Operation Clusters
            </h3>
            <div className="flex gap-2">
              <Link href={`/dashboard/${orgSlug}/regions`}>
                <Button variant="outline" size="sm" className="h-8 border-border/50 bg-secondary/35 font-bold">
                  Cluster View
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { name: "North India Hub (Delhi NCR)", sites: "4 Active Sites", progress: 85, status: "Healthy", glow: "from-emerald-500/10 to-transparent border-emerald-500/20" },
              { name: "South Cluster (Bengaluru & Chennai)", sites: "3 Active Sites", progress: 68, status: "Delayed Review", warning: true, glow: "from-rose-500/10 to-transparent border-rose-500/20" },
              { name: "West Division (Mumbai & Pune)", sites: "1 Active Site", progress: 95, status: "Possession Phase", glow: "from-primary/10 to-transparent border-primary/20" },
            ].map((region, i) => (
              <div key={i} className={cn("p-5 rounded-2xl border bg-gradient-to-r backdrop-blur-sm relative overflow-hidden transition-all hover:scale-[1.01] hover:border-primary/40", region.glow)}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-primary/10 to-transparent pointer-events-none rounded-full blur-xl" />
                <div className="flex items-center justify-between text-sm relative z-10 mb-3">
                  <div>
                    <span className="font-extrabold text-foreground tracking-tight text-base">{region.name}</span>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{region.sites}</p>
                  </div>
                  <Badge variant={region.warning ? "destructive" : "secondary"} className="text-[9px] uppercase font-extrabold tracking-wider px-2.5 py-1">
                    {region.status}
                  </Badge>
                </div>
                <div className="space-y-1.5 relative z-10">
                  <div className="flex justify-between text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                    <span>Cluster Load Capacity</span>
                    <span>{region.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary/50 overflow-hidden border border-border/10">
                    <div className={cn("h-full bg-gradient-to-r transition-all duration-700", region.warning ? "from-rose-500 to-amber-500" : "from-primary to-emerald-500")} style={{ width: `${region.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick actions desk */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Plus className="h-5 w-5 text-primary" />
            Infrastructure Desk
          </h3>
          <div className="space-y-3">
            <Link href={`/dashboard/${orgSlug}/regions`} className="block w-full">
              <Button className="w-full justify-between h-12 bg-foreground text-background hover:bg-foreground/90 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><Globe className="h-4 w-4" /> Manage Regions</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/projects`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><Briefcase className="h-4 w-4" /> View Projects</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/inventory`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><Package className="h-4 w-4" /> Global Inventory</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/approvals`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><FileCheck className="h-4 w-4" /> Approvals Desk</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/audit`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><History className="h-4 w-4" /> Tamperproof Audit</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Legal Approvals */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-500" />
              Compliance & RERA approvals
            </h3>
            <Link href={`/dashboard/${orgSlug}/approvals`}>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 h-8">View Status</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { title: "RERA Registration — Blue Horizon", status: "Approved", desc: "Reg ID: RERA-HR-2026-0819 • Valid until Dec 2030", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500" },
              { title: "Zoning & Land Use Clearance", status: "Under Review", desc: "Urban Planning Division • Phase 2 Review", color: "border-amber-500/20 bg-amber-500/5 text-amber-500" },
              { title: "Environmental Clearance Certificate", status: "Pending Dispatch", desc: "State Pollution Board NOC • Clean report verified", color: "border-rose-500/20 bg-rose-500/5 text-rose-500" },
            ].map((doc, i) => (
              <div key={i} className="p-4 rounded-xl bg-background/30 border border-border/40 flex flex-col gap-2 hover:border-primary/20 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-foreground">{doc.title}</span>
                  <Badge variant="outline" className={cn("text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5", doc.color)}>
                    {doc.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium">{doc.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Trails */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500 animate-pulse" />
              Cryptographic Audit Log
            </h3>
            <Link href={`/dashboard/${orgSlug}/audit`}>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 h-8 font-bold">Terminal</Button>
            </Link>
          </div>
          <div className="space-y-3 font-mono">
            {[
              { event: "CREATE_PROJECT", detail: "Blue Horizon Tower B", exec: "admin@estate.com", hash: "sha256:9d8f3c...f2b", time: "14:32:01 UTC" },
              { event: "UPLOAD_RERA_DOC", detail: "File #4928 RERA certificate", exec: "legal@estate.com", hash: "sha256:e24a1b...8e1", time: "11:15:40 UTC" },
              { event: "ROTATE_API_KEYS", detail: "Rotated production access gate", exec: "owner@estate.com", hash: "sha256:7f9b8c...c3a", time: "09:04:12 UTC" }
            ].map((log, i) => (
              <div key={i} className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-colors flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 text-[8px] font-extrabold bg-purple-500/20 text-purple-400 uppercase tracking-widest rounded-bl-lg">
                  SECURE_LEDGER
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-purple-400 font-extrabold">[{log.event}]</span>
                  <span className="text-muted-foreground text-[10px]">{log.time}</span>
                </div>
                <div className="text-[11px] text-foreground font-semibold">
                  Payload: <span className="text-purple-200">{log.detail}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[9px] text-muted-foreground pt-1.5 border-t border-purple-500/10">
                  <span>Executor: {log.exec}</span>
                  <span className="text-purple-300/70 select-all group-hover:text-purple-300 transition-colors">{log.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
