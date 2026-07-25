"use client";
import React, { useState } from "react";
import { 
  Sparkles, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Crown, 
  ShieldCheck, 
  Calendar,
  Compass,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Maximize2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LuxuryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockLuxury = [
    { id: "LUX-007", name: "Villa Palm Meadows — Plot 7", type: "Signature Mansion", area: "8,500 sq.ft", pool: "Infinity Glass Pool", price: "$1,750,000", status: "Active Portfolio" },
    { id: "LUX-012", name: "Penthouse Horizon A — Unit 24", type: "Sky Penthouse", area: "6,200 sq.ft", pool: "Private Jacuzzi Deck", price: "$2,900,000", status: "Reserved" },
    { id: "LUX-033", name: "Imperial Mansion — Plot 3", type: "Heritage Estate", area: "12,000 sq.ft", pool: "Olympic Pool & Spa", price: "$4,200,000", status: "Active Portfolio" },
  ];

  const filteredLuxury = mockLuxury.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Luxury Estates Portfolio
          </h1>
          <p className="text-muted-foreground mt-2">Access high-yield luxury estates, penthouses, waterfront villas, and bespoke concierge schedules.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add Ultra Luxury Asset
        </Button>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Signature Mansions</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">12 Villas</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> Concierge staff retained
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Portfolio Value</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">$48.6M</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Avg yield 9.4%
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Unique Premium Leads</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">24 HNWIs</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Crown className="h-3 w-3 text-amber-500" /> Direct brokerage active
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Available Portfolios</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">3 Estates</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Ready for private bidding
          </p>
        </Card>
      </div>

      {/* Luxury Grid */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search mansions by name or style..." 
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
          {filteredLuxury.map((estate) => (
            <Card key={estate.id} className="bg-card/30 border border-border/30 rounded-2xl p-6 hover:border-primary/20 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <Crown className="h-3 w-3" /> {estate.id}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-1.5">{estate.name}</h3>
                  </div>
                  <Badge variant="secondary" className="text-[9px] uppercase font-extrabold tracking-wider bg-amber-500/10 text-amber-500 border-amber-500/20">
                    {estate.status}
                  </Badge>
                </div>

                <div className="my-6 py-4 border-y border-border/10 text-xs space-y-3">
                  <div>
                    <p className="text-muted-foreground uppercase font-bold">Luxury Specification</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{estate.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase font-bold">Super Area</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                      <Maximize2 className="h-3.5 w-3.5" /> {estate.area}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase font-bold">Amenities Included</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Compass className="h-3.5 w-3.5" /> {estate.pool}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-extrabold text-amber-500">
                  {estate.price}
                </span>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 rounded-full px-4 gap-1">
                  Private Tour <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
