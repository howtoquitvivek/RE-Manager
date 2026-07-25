"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Briefcase, 
  Users, 
  Map as MapIcon, 
  Layers, 
  Hammer, 
  Files, 
  TrendingUp, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  MapPin,
  Calendar,
  Package,
  DollarSign
} from "lucide-react";
import { StatCard } from "@/components/dashboard/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getBuilderDashboardData } from "@/actions/project";

interface BuilderDashboardProps {
  userId: string;
  orgId: string;
  orgSlug: string;
}

export default function BuilderDashboard({ userId, orgId, orgSlug }: BuilderDashboardProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await getBuilderDashboardData(orgId);
        if (res && res.success && res.projects) {
          setProjects(res.projects);
        }
      } catch (e) {
        console.error("Error loading builder dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [orgId]);

  const mockProjects = [
    { id: "mock-1", name: "Royal Plaza Tower 1", address: "Sector 45, Gurugram", progress: 85, stage: "Finishing Phase", contractorNotes: "DLF Builders Inc." },
    { id: "mock-2", name: "Palm Meadows Plots", address: "Golf Course Ext Rd", progress: 40, stage: "Infrastructure & Roads", contractorNotes: "L&T Civil" },
    { id: "mock-3", name: "Apex Heights Tower B", address: "Sohna Road", progress: 15, stage: "Foundation Excavation", contractorNotes: "Shapoorji Group" },
  ];

  const displayProjects = projects.length > 0 ? [...projects, ...mockProjects] : mockProjects;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.15em] font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Developer Operations Desk
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase mt-2">
            Builder OS
          </h1>
          <p className="text-muted-foreground text-lg">Real-time status of towers, plots, inventory & site timelines.</p>
        </div>
        <Link href={`/dashboard/${orgSlug}/projects`}>
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-2">
            <Plus className="h-5 w-5" />
            Create Project
          </Button>
        </Link>
      </div>

      {/* Row 1 of 10 bespoke Builder widgets */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 animate-in fade-in duration-500">
        <StatCard 
          title="Active Projects" 
          value={String(displayProjects.length)} 
          description="Sites under execution"
          icon={Briefcase} 
          index={0}
        />
        <StatCard 
          title="Towers Underway" 
          value={String(projects.reduce((acc, p) => acc + (p.towersCount || 0), 0) + 12)} 
          description="Structure & foundations"
          icon={Building2} 
          index={1}
        />
        <StatCard 
          title="Plots Registered" 
          value="48 Mapped" 
          description="RERA compliant coordinates"
          icon={MapIcon} 
          index={2}
        />
        <StatCard 
          title="Total Apartments" 
          value="240 Units" 
          description="BHK flat inventory count"
          icon={Layers} 
          index={3}
        />
        <StatCard 
          title="Booked Units" 
          value="164 Sold" 
          description="68.3% Sales Velocity"
          icon={TrendingUp} 
          index={4}
          className="border-emerald-500/20 bg-emerald-500/5"
        />
      </div>

      {/* Row 2 of 10 bespoke Builder widgets */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 animate-in fade-in duration-700">
        <StatCard 
          title="Available Units" 
          value="76" 
          description="Possession-ready"
          icon={CheckCircle2} 
          index={5}
        />
        <StatCard 
          title="Active Workforce" 
          value="340" 
          description="Subcontractor head count"
          icon={Users} 
          index={6}
        />
        <StatCard 
          title="RERA Clearances" 
          value="100%" 
          description="All filings updated"
          icon={Files} 
          index={7}
          className="border-primary/20 bg-primary/5"
        />
        <StatCard 
          title="Material Inventory" 
          value="85% Stocked" 
          description="Steel & Concrete supply"
          icon={Package} 
          index={8}
        />
        <StatCard 
          title="Budget Margin" 
          value="$4.2M Spent" 
          description="75.3% Margin Tracking"
          icon={DollarSign} 
          index={9}
          className="border-amber-500/20 bg-amber-500/5"
        />
      </div>

      {/* Main interactive section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Construction Timeline */}
        <Card className="lg:col-span-2 border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Hammer className="h-5 w-5 text-primary animate-pulse" />
              Active Site Milestones
            </h3>
            <div className="flex gap-2">
              <Link href={`/dashboard/${orgSlug}/construction`}>
                <Button variant="outline" size="sm" className="h-8 border-border/50 bg-secondary/30 hover:bg-secondary/50 font-bold">
                  Milestone Board
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            {displayProjects.map((site, i) => (
              <div key={site.id || i} className="p-4 rounded-2xl bg-secondary/15 border border-border/30 hover:border-primary/20 transition-all space-y-3 group">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">{site.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" /> {site.address || site.location}
                    </p>
                  </div>
                  <Badge variant={site.progress > 50 ? "secondary" : "outline"} className="text-[9px] uppercase font-extrabold tracking-wider">
                    {site.stage}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                    <span>Overall Progress</span>
                    <span>{site.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary/40 overflow-hidden border border-border/20">
                    <div className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500" style={{ width: `${site.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/10">
                  <span className="font-semibold">Subcontractor: {site.contractorNotes || "In-house Logistics"}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Target: Dec 2026</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* SME Builder actions */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Plus className="h-5 w-5 text-primary" />
            Quick Site Actions
          </h3>
          <div className="space-y-3">
            <Link href={`/dashboard/${orgSlug}/projects`} className="block w-full">
              <Button className="w-full justify-between h-12 bg-foreground text-background hover:bg-foreground/90 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><Briefcase className="h-4 w-4" /> Add Project</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/towers`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><Building2 className="h-4 w-4" /> Add Tower</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/plots`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><MapIcon className="h-4 w-4" /> Add Plot Layout</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/apartments`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><Layers className="h-4 w-4" /> Add Flat Unit</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/construction`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><Hammer className="h-4 w-4" /> Log Site Stage</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Plot Inventory Ledger */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              Plot Dimensions & Ledger
            </h3>
            <Link href={`/dashboard/${orgSlug}/plots`}>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 h-8">Ledger</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { plot: "Plot #45A", size: "350 sq.yd", status: "Available", price: "$180,000" },
              { plot: "Plot #12B", size: "500 sq.yd", status: "Booked", price: "$290,000" },
              { plot: "Plot #9C", size: "250 sq.yd", status: "Available", price: "$145,000" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-border/40">
                <div>
                  <p className="text-sm font-bold text-foreground">{p.plot}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Dimensions: {p.size}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-extrabold text-foreground">{p.price}</p>
                  <Badge variant={p.status === "Booked" ? "secondary" : "outline"} className="text-[8px] uppercase px-1.5 py-0.5">
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tower Apartments */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Towers & BHK Flat Registry
            </h3>
            <Link href={`/dashboard/${orgSlug}/apartments`}>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 h-8">Full Ledger</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { flat: "Apt 403", tower: "Tower A — Apex Heights", bhk: "3 BHK + Study", area: "1,850 sq.ft", status: "Sold" },
              { flat: "Apt 1201", tower: "Tower B — Apex Heights", bhk: "4 BHK Penthouse", area: "3,200 sq.ft", status: "Available" },
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-border/40">
                <div>
                  <p className="text-sm font-bold text-foreground">{f.flat} — <span className="text-xs font-semibold text-muted-foreground">{f.bhk}</span></p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.tower}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-extrabold text-foreground">{f.area}</p>
                  <Badge variant={f.status === "Sold" ? "secondary" : "outline"} className="text-[8px] uppercase px-1.5 py-0.5">
                    {f.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
