"use client";

import React, { useState, useTransition } from "react";
import { 
  Map as MapIcon, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  CheckCircle,
  TrendingUp,
  Trash2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createPlotAction, deletePlotAction } from "@/actions/builder";

interface Plot {
  id: string;
  plotNumber: string;
  dimensions: string;
  price: string;
  status: string;
}

interface PlotsClientProps {
  initialPlots: Plot[];
  orgSlug: string;
  orgId: string;
}

export default function PlotsClient({ initialPlots, orgSlug, orgId }: PlotsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const filteredPlots = initialPlots.filter(p => 
    p.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.dimensions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !plotNumber || !dimensions || !price) return;

    startTransition(async () => {
      const res = await createPlotAction(orgSlug, orgId, {
        name,
        plotNumber,
        dimensions,
        price: parseFloat(price),
        status
      });
      if (res.success) {
        setIsDialogOpen(false);
        setName("");
        setPlotNumber("");
        setDimensions("");
        setPrice("");
        setStatus("ACTIVE");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plot?")) return;
    startTransition(async () => {
      await deletePlotAction(orgSlug, id);
    });
  };

  // Compile calculations
  const availableCount = initialPlots.filter(p => p.status === "Available").length;
  const bookedCount = initialPlots.filter(p => p.status === "Booked").length;

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Plot Dimensions & Ledger
          </h1>
          <p className="text-muted-foreground mt-2">Manage corporate residential layouts, RERA dimensions, boundaries, and availability status.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={(props) => (
            <Button {...props} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Add Plot Layout
            </Button>
          )} />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Plot Layout</DialogTitle>
              <DialogDescription>Create a new RERA boundary plot record.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plot Name / Label</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Sector 4 Plot A" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plotNumber">Plot Number</Label>
                <Input id="plotNumber" value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)} required placeholder="e.g. Plot #45A" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input id="dimensions" value={dimensions} onChange={(e) => setDimensions(e.target.value)} required placeholder="e.g. 350 sq.yd" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Estimated Value ($)</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="e.g. 180000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Availability</Label>
                <select 
                  id="status" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ACTIVE">Available</option>
                  <option value="INACTIVE">Booked</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Adding..." : "Add Plot"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Plots</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">{initialPlots.length}</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" /> SQL synced ledger
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Available Plots</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">{availableCount}</p>
          <p className="text-xs text-muted-foreground mt-2">Ready for bookings</p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Booked / Reserved</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">{bookedCount}</p>
          <p className="text-xs text-muted-foreground mt-2">Sold layout blocks</p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Avg Plot Yield</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">Live</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" /> Boundary tracks OK
          </p>
        </Card>
      </div>

      {/* List Ledger */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search plots by number or dimension..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/20 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-2 border-border/50 bg-secondary/30 rounded-xl">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {filteredPlots.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            No plot boundaries logged in this workspace. Click &quot;Add Plot Layout&quot; to create one.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1">
            {filteredPlots.map((plot) => (
              <div key={plot.id} className="flex items-center justify-between p-6 rounded-2xl bg-card/30 border border-border/30 hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MapIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">{plot.plotNumber}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Dimensions: {plot.dimensions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right space-y-1">
                    <p className="text-sm font-extrabold text-foreground">{plot.price}</p>
                    <Badge variant={plot.status === "Booked" ? "secondary" : "outline"} className="text-[8px] uppercase px-1.5 py-0.5">
                      {plot.status}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(plot.id)} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/5 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
