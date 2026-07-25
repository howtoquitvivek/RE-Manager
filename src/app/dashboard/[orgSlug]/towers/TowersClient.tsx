"use client";

import React, { useState, useTransition } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  CheckCircle,
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
import { createTowerAction, deleteTowerAction } from "@/actions/builder";

interface Tower {
  id: string;
  name: string;
  floors: number;
  progress: number;
  stage: string;
  contractor: string;
  apartments: string;
}

interface TowerProject {
  id: string;
  name: string;
}

interface TowersClientProps {
  initialTowers: Tower[];
  projects: TowerProject[];
  orgSlug: string;
}

export default function TowersClient({ initialTowers, projects, orgSlug }: TowersClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [floors, setFloors] = useState("");
  const [status, setStatus] = useState("planning");

  const filteredTowers = initialTowers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.contractor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !projectId || !floors) return;

    startTransition(async () => {
      const res = await createTowerAction(orgSlug, {
        name,
        projectId,
        floors: parseInt(floors),
        status
      });
      if (res.success) {
        setIsDialogOpen(false);
        setName("");
        setProjectId("");
        setFloors("");
        setStatus("planning");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tower?")) return;
    startTransition(async () => {
      await deleteTowerAction(orgSlug, id);
    });
  };

  // Compile calculations
  const totalFloors = initialTowers.reduce((acc, t) => acc + t.floors, 0);
  const avgProgress = initialTowers.length > 0 
    ? Math.round(initialTowers.reduce((acc, t) => acc + t.progress, 0) / initialTowers.length) 
    : 0;

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Towers Under Construction
          </h1>
          <p className="text-muted-foreground mt-2">Manage tower blocks, overall structural floors, builder partners, and inventory capacity.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={(props) => (
            <Button {...props} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Add Tower Block
            </Button>
          )} />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Tower Block</DialogTitle>
              <DialogDescription>Register a new tower block under a development site.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tower Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Tower A" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Select Development Project</Label>
                <select 
                  id="project" 
                  value={projectId} 
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floors">Planned Floors</Label>
                <Input id="floors" type="number" value={floors} onChange={(e) => setFloors(e.target.value)} required placeholder="e.g. 24" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Development Status</Label>
                <select 
                  id="status" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="planning">Planning & RERA Approvals</option>
                  <option value="construction">Structure & slab Core</option>
                  <option value="completed">Completed Structure</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Adding..." : "Add Tower"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Registered Towers</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">{initialTowers.length} Blocks</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" /> Database tracked
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Planned Floors</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">{totalFloors} Floors</p>
          <p className="text-xs text-muted-foreground mt-2">Aggregate structure floors</p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Average Progress</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">{avgProgress}%</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" /> Live from site logs
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Workforce Logged</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">340 crew</p>
          <p className="text-xs text-muted-foreground mt-2">Subcontractor head counts</p>
        </Card>
      </div>

      {/* Directory list */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search towers by name or contractor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/20 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-2 border-border/50 bg-secondary/30 rounded-xl">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {filteredTowers.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            No towers added yet. Create projects first, then register tower blocks.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredTowers.map((tower) => (
              <Card key={tower.id} className="bg-card/30 border border-border/30 rounded-2xl p-6 hover:border-primary/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                        TWR
                      </span>
                      <h3 className="text-lg font-bold text-foreground mt-1.5">{tower.name}</h3>
                    </div>
                    <Badge variant={tower.progress > 50 ? "secondary" : "outline"} className="text-[9px] uppercase font-extrabold tracking-wider">
                      {tower.stage}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 my-6 py-4 border-y border-border/10 text-xs">
                    <div>
                      <p className="text-muted-foreground uppercase font-bold">Planned Floors</p>
                      <p className="text-lg font-extrabold text-foreground mt-1 flex items-center gap-1">
                        <Layers className="h-4 w-4 text-primary" /> {tower.floors}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase font-bold">Capacity</p>
                      <p className="text-lg font-extrabold text-foreground mt-1">
                        {tower.apartments}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase font-bold">Contractor</p>
                      <p className="text-xs font-bold text-foreground mt-2 truncate">
                        {tower.contractor}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                      <span>Structural Completion</span>
                      <span>{tower.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary/40 overflow-hidden border border-border/20">
                      <div className="h-full bg-gradient-to-r from-primary to-emerald-500" style={{ width: `${tower.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(tower.id)} 
                      className="text-destructive hover:bg-destructive/5 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
