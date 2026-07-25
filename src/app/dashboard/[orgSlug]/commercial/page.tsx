"use client";
import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Key, 
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CommercialPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockCommercial = [
    { id: "COM-01", name: "Suite 401 — Office Block", tower: "Horizon Tech Park", area: "12,500 sq.ft", tenant: "TechCorp Global", rent: "$24,500/mo", status: "Leased" },
    { id: "COM-02", name: "Ground Floor Showroom", tower: "Apex Commercial Hub", area: "8,200 sq.ft", tenant: "Retail Prime Brand", rent: "$35,000/mo", status: "Leased" },
    { id: "COM-03", name: "Suite 1204 — Shell & Core", tower: "Horizon Tech Park", area: "15,000 sq.ft", tenant: "—", rent: "$28,000/mo", status: "Vacant" },
    { id: "COM-04", name: "Retail Unit B — Corner Slot", tower: "Apex Commercial Hub", area: "4,500 sq.ft", tenant: "Premium Coffee Co.", rent: "$14,000/mo", status: "Booked" },
  ];

  const filteredCommercial = mockCommercial.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.tower.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Commercial Units Registry
          </h1>
          <p className="text-muted-foreground mt-2">Manage premium commercial office blocks, retail floor spaces, corporate leases, and fit-out stages.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add Commercial Space
        </Button>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Commercial Area</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">140k sq.ft</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Grade A IT SEZ park
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Occupancy Rate</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">84.2%</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Corporate anchors locked
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Monthly Yield</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">$102,600</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" /> +8% escalations applied
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Vacant IT Spaces</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">15,000 ft</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Fit-out stage ready
          </p>
        </Card>
      </div>

      {/* Commercial Table */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search commercial offices or tower blocks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/20 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-2 border-border/50 bg-secondary/30 rounded-xl">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/20 text-xs uppercase tracking-widest text-muted-foreground">
                <th className="py-4 font-bold">Space ID</th>
                <th className="py-4 font-bold">Showroom / Suite Name</th>
                <th className="py-4 font-bold">Parent Tech Park</th>
                <th className="py-4 font-bold">Floor Area</th>
                <th className="py-4 font-bold">Active Tenant</th>
                <th className="py-4 font-bold">Monthly Yield</th>
                <th className="py-4 font-bold">Status</th>
                <th className="py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommercial.map((space) => (
                <tr key={space.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                  <td className="py-4 font-extrabold text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> {space.id}
                  </td>
                  <td className="py-4 font-bold text-foreground">{space.name}</td>
                  <td className="py-4 text-muted-foreground font-semibold">{space.tower}</td>
                  <td className="py-4 font-bold text-foreground">
                    <div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> {space.area}</div>
                  </td>
                  <td className="py-4 text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1.5"><Key className="h-3.5 w-3.5" /> {space.tenant}</div>
                  </td>
                  <td className="py-4 font-extrabold text-foreground">{space.rent}</td>
                  <td className="py-4">
                    <Badge variant={space.status === "Leased" ? "secondary" : space.status === "Booked" ? "outline" : "default"} className="text-[10px] font-bold uppercase tracking-wider">
                      {space.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/5 rounded-full px-4 gap-1">
                      Lease Desk <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
