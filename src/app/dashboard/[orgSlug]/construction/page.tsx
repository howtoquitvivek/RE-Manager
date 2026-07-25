"use client";
import React, { useState } from "react";
import { 
  Hammer, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  CheckCircle,
  Truck, 
  Calendar,
  ChevronRight,
  TrendingUp,
  MapPin
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ConstructionPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockMilestones = [
    { id: "M-110", name: "Foundation Excavation — Horizon View", stage: "Foundation", progress: 85, contractor: "Shapoorji Group", notes: "Excavation complete, pouring deep core columns." },
    { id: "M-225", name: "Structure & Slab Core — Tower A", stage: "Structure", progress: 95, contractor: "DLF Builders Inc.", notes: "Slab cast for floor 22. Core structure nearly complete." },
    { id: "M-402", name: "Finishing Phase — Tower B", stage: "Finishing", progress: 35, contractor: "L&T Civil", notes: "Plumbing piping and interior drywall fitting." },
    { id: "M-903", name: "Infrastructure & Roads — Palm Meadows", stage: "Infrastructure", progress: 60, contractor: "L&T Civil", notes: "Paving main access pathways, water mains laydown." }
  ];

  const filteredMilestones = mockMilestones.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.contractor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Construction Milestones Stages
          </h1>
          <p className="text-muted-foreground mt-2">Log site phases (Foundation, Structure, Finishing, Possession), track progress percentage, and coordinate materials.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Log Site Stage
        </Button>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Active Sites</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">4 Sites</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" /> RERA certified layouts
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Average Progress</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">68.7%</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" /> On target for Q4 2026
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Contractor Partners</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">3 Groups</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Shapoorji, DLF, L&T
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Active Labor Force</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">340 crew</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Logged across all slots
          </p>
        </Card>
      </div>

      {/* Progress Board */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search milestones by name or contractor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/20 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-2 border-border/50 bg-secondary/30 rounded-xl">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="space-y-6">
          {filteredMilestones.map((milestone) => (
            <div key={milestone.id} className="p-5 rounded-2xl bg-secondary/10 border border-border/40 hover:border-primary/30 transition-colors group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-extrabold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {milestone.id}
                    </span>
                    <Badge variant={milestone.progress > 75 ? "secondary" : "outline"} className="text-[8px] uppercase tracking-widest font-extrabold px-1.5 py-0.5">
                      {milestone.stage}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-1.5">{milestone.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Contractor: <span className="font-semibold text-foreground">{milestone.contractor}</span></p>
                </div>
                
                <div className="w-full md:w-64 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground">
                    <span>Phase Progress</span>
                    <span>{milestone.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary/40 overflow-hidden border border-border/20">
                    <div className="h-full bg-gradient-to-r from-primary to-emerald-500" style={{ width: `${milestone.progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-xs text-muted-foreground italic">“{milestone.notes}”</p>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/5 rounded-full px-4 gap-1 ml-auto">
                  Log Entry <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
