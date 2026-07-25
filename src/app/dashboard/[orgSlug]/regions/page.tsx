"use client";
import React, { useState } from "react";
import { 
  Globe, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Building2, 
  CheckCircle,
  MapPin, 
  TrendingUp, 
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RegionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockRegions = [
    { id: "REG-N", name: "North India Division (NCR)", activeSites: 4, manager: "Ramesh Sharma", status: "Healthy", projectList: "Blue Horizon Towers, Apex Heights" },
    { id: "REG-S", name: "South Cluster Division (Bengaluru)", activeSites: 3, manager: "Karthik Raja", status: "Review", projectList: "Emerald Heights, Palm Enclave" },
    { id: "REG-W", name: "West Hub Division (Mumbai & Pune)", activeSites: 1, manager: "Vikram Mehta", status: "Healthy", projectList: "Horizon View" },
  ];

  const filteredRegions = mockRegions.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Regional Operation Clusters
          </h1>
          <p className="text-muted-foreground mt-2">Oversee multi-region project hubs, regional manager logs, and cluster-wide operational health.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add Regional Hub
        </Button>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Operation Clusters</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">3 Hubs</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" /> Active DNS synchronization
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Active Sites</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">8 Sites</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Across 3 separate territories
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Hub Managers</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">3 Directors</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Assigned regional clearances
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Territory Turnover</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">$142.6M</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" /> +15% annual projection
          </p>
        </Card>
      </div>

      {/* Directory list */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search regions by hub name or director..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/20 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-2 border-border/50 bg-secondary/30 rounded-xl">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {filteredRegions.map((region) => (
            <Card key={region.id} className="bg-card/30 border border-border/30 rounded-2xl p-6 hover:border-primary/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {region.id}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-1.5">{region.name}</h3>
                  </div>
                  <Badge variant={region.status === "Healthy" ? "secondary" : "outline"} className="text-[9px] uppercase font-extrabold tracking-wider">
                    {region.status}
                  </Badge>
                </div>

                <div className="my-6 py-4 border-y border-border/10 text-xs space-y-3">
                  <div>
                    <p className="text-muted-foreground uppercase font-bold">Active Sites</p>
                    <p className="text-lg font-extrabold text-foreground mt-1 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-primary" /> {region.activeSites} Sites
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase font-bold">Hub Director</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{region.manager}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase font-bold">Managed Projects</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-1 truncate">{region.projectList}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 rounded-full px-4 gap-1">
                  Cluster Ops <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
