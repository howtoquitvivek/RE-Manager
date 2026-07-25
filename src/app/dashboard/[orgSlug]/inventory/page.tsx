"use client";
import React, { useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Building2, 
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockInventory = [
    { id: "INV-001", name: "Apt 1201 — Penthouse", block: "Tower B — Apex Heights", type: "Residential", value: "$490,000", status: "Available" },
    { id: "INV-002", name: "Unit 301 — Office Suite", block: "Horizon Commercial Tower", type: "Commercial", value: "$320,000", status: "Booked" },
    { id: "INV-003", name: "Villa 7 — Palm Meadows", block: "Palm Estate Enclave", type: "Luxury Villa", value: "$850,000", status: "Sold" },
    { id: "INV-004", name: "Apt 403 — Deluxe Unit", block: "Tower A — Apex Heights", type: "Residential", value: "$225,000", status: "Sold" },
  ];

  const filteredInventory = mockInventory.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.block.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Global Inventory Overview
          </h1>
          <p className="text-muted-foreground mt-2">Aggregate total residential apartments, commercial offices, and luxury asset blocks across all operational divisions.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add Asset
        </Button>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Residential Units</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">340 Flats</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> 164 sold, 76 available
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Commercial Units</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">84 Suites</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            42 leased, 42 vacant
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Luxury Villas</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">28 Estates</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-500" /> Premium high-yield assets
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Inventory Valuation</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">$142.6M</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" /> Net asset value
          </p>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search assets by unit name or block location..." 
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
                <th className="py-4 font-bold">Asset ID</th>
                <th className="py-4 font-bold">Unit Name</th>
                <th className="py-4 font-bold">Parent Block</th>
                <th className="py-4 font-bold">Asset Type</th>
                <th className="py-4 font-bold">Estimated Value</th>
                <th className="py-4 font-bold">Inventory Status</th>
                <th className="py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                  <td className="py-4 font-extrabold text-foreground flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" /> {item.id}
                  </td>
                  <td className="py-4 font-bold text-foreground">{item.name}</td>
                  <td className="py-4 text-muted-foreground font-semibold">{item.block}</td>
                  <td className="py-4 font-bold text-foreground">
                    <Badge variant={item.type === "Residential" ? "secondary" : item.type === "Commercial" ? "outline" : "default"} className="text-[10px] font-bold uppercase tracking-wider">
                      {item.type}
                    </Badge>
                  </td>
                  <td className="py-4 font-extrabold text-foreground">{item.value}</td>
                  <td className="py-4">
                    <Badge variant={item.status === "Available" ? "outline" : item.status === "Booked" ? "secondary" : "default"} className="text-[10px] font-bold uppercase tracking-wider">
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/5 rounded-full px-4 gap-1">
                      Manage <ArrowUpRight className="h-4 w-4" />
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
