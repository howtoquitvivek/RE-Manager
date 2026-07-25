"use client";
import React, { useState } from "react";
import { 
  Layers, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Building2, 
  CheckCircle,
  Home,
  TrendingUp, 
  Maximize2,
  DollarSign,
  ChevronRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ApartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockApartments = [
    { id: "APT-403", flat: "Apt 403 — Tower A", tower: "Apex Heights", bhk: "3 BHK + Study", area: "1,850 sq.ft", price: "$225,000", status: "Sold" },
    { id: "APT-1201", flat: "Apt 1201 — Tower B", tower: "Apex Heights", bhk: "4 BHK Penthouse", area: "3,200 sq.ft", price: "$490,000", status: "Available" },
    { id: "APT-804", flat: "Apt 804 — Tower A", tower: "Apex Heights", bhk: "2 BHK Deluxe", area: "1,250 sq.ft", price: "$150,000", status: "Booked" },
    { id: "APT-202", flat: "Apt 202 — Tower C", tower: "Horizon View", bhk: "3 BHK Premium", area: "1,750 sq.ft", price: "$210,000", status: "Available" },
  ];

  const filteredApartments = mockApartments.filter(a => 
    a.flat.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.bhk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Towers & BHK Flat Registry
          </h1>
          <p className="text-muted-foreground mt-2">Oversee floor units, super-built-up & carpet areas, flat pricing lists, and booking ledger states.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add Flat Unit
        </Button>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Flat Units</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">240 Units</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" /> Spread across 4 blocks
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Units Sold</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">164 Sold</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            68.3% total sales velocity
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Unsold Inventory</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">76 Units</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            72 available, 4 booked
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Sales Turnover</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">$38.2M</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Within builder projections
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
              placeholder="Search flats by unit or BHK configuration..." 
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
                <th className="py-4 font-bold">Flat ID</th>
                <th className="py-4 font-bold">Unit Number</th>
                <th className="py-4 font-bold">Parent Tower Block</th>
                <th className="py-4 font-bold">BHK Layout</th>
                <th className="py-4 font-bold">Carpet Area</th>
                <th className="py-4 font-bold">Pricing List</th>
                <th className="py-4 font-bold">Status</th>
                <th className="py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApartments.map((apartment) => (
                <tr key={apartment.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                  <td className="py-4 font-extrabold text-foreground flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> {apartment.id}
                  </td>
                  <td className="py-4 font-bold text-foreground">{apartment.flat}</td>
                  <td className="py-4 text-muted-foreground font-semibold flex items-center gap-1.5 mt-2">
                    <Building2 className="h-3.5 w-3.5" /> {apartment.tower}
                  </td>
                  <td className="py-4 font-bold text-foreground">{apartment.bhk}</td>
                  <td className="py-4 text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" /> {apartment.area}</div>
                  </td>
                  <td className="py-4 font-extrabold text-foreground">{apartment.price}</td>
                  <td className="py-4">
                    <Badge variant={apartment.status === "Available" ? "outline" : apartment.status === "Booked" ? "secondary" : "default"} className="text-[10px] font-bold uppercase tracking-wider">
                      {apartment.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/5 rounded-full px-4 gap-1">
                      Register Sale <ChevronRight className="h-4 w-4" />
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
