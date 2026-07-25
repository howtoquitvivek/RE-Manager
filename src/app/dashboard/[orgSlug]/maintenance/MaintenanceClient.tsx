"use client";

import React, { useState, useTransition } from "react";
import { 
  Wrench, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  AlertOctagon, 
  CheckCircle,
  Truck, 
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createMaintenanceTicketAction, updateMaintenanceTicketStatusAction } from "@/actions/rental";

interface MaintenanceTicket {
  id: string;
  title: string;
  unit: string;
  description: string | null;
  priority: string;
  status: string;
  assignee: string;
  createdAt: string;
}

interface MaintenanceClientProps {
  initialTickets: MaintenanceTicket[];
  properties: { name: string }[];
  orgSlug: string;
  orgId: string;
}

export default function MaintenanceClient({ initialTickets, properties, orgSlug, orgId }: MaintenanceClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [priority, setPriority] = useState("Scheduled");
  const [assignee, setAssignee] = useState("");
  const [description, setDescription] = useState("");

  const filteredTickets = initialTickets.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !unit || !assignee) return;

    startTransition(async () => {
      const res = await createMaintenanceTicketAction(orgSlug, orgId, {
        title,
        unit,
        priority,
        assignee,
        description,
        status: "pending"
      });
      if (res.success) {
        setIsDialogOpen(false);
        setTitle("");
        setUnit("");
        setPriority("Scheduled");
        setAssignee("");
        setDescription("");
      }
    });
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "pending" ? "in_progress" : "resolved";
    startTransition(async () => {
      await updateMaintenanceTicketStatusAction(orgSlug, id, nextStatus);
    });
  };

  // Compile calculations
  const totalTickets = initialTickets.length;
  const urgentCount = initialTickets.filter(t => t.priority === "Urgent" && t.status !== "resolved").length;
  const resolvedCount = initialTickets.filter(t => t.status === "resolved").length;

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Maintenance Dispatch
          </h1>
          <p className="text-muted-foreground mt-2">Oversee work order requests, coordinate subcontractor dispatch, and review invoice repair costs.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={(props) => (
            <Button {...props} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Dispatch Mechanic
            </Button>
          )} />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Dispatch Ticket</DialogTitle>
              <DialogDescription>Create a new maintenance work order.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Burst Pipe & Water Flooding" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Select Property Unit</Label>
                <select 
                  id="unit" 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Choose Unit --</option>
                  {properties.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority / Urgency</Label>
                <select 
                  id="priority" 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Contractor / Crew Assigned</Label>
                <Input id="assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} required placeholder="Premier Plumbing LLC" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Dispatching..." : "Create Work Order"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Work Orders</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">{totalTickets}</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" /> {resolvedCount} resolved YTD
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Urgent Dispatch</p>
          <p className="text-3xl font-extrabold mt-2 text-rose-500">{urgentCount}</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <AlertOctagon className="h-3 w-3 text-rose-500" /> High-risk alerts active
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Active Crews</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">
            {new Set(initialTickets.map(t => t.assignee)).size} Teams
          </p>
          <p className="text-xs text-muted-foreground mt-2">Dispatched subcontractors</p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Spend</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">Live</p>
          <p className="text-xs text-muted-foreground mt-2">Tracked in SQLite ledger</p>
        </Card>
      </div>

      {/* Dispatch Board */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tickets by issue or unit..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/20 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-2 border-border/50 bg-secondary/30 rounded-xl">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            No active maintenance orders found. Dispatch a mechanic to start.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/20 text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="py-4 font-bold">Ticket ID</th>
                  <th className="py-4 font-bold">Issue Description</th>
                  <th className="py-4 font-bold">Unit</th>
                  <th className="py-4 font-bold">Urgency</th>
                  <th className="py-4 font-bold">Contractor</th>
                  <th className="py-4 font-bold">Status</th>
                  <th className="py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                    <td className="py-4 font-extrabold text-foreground flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-primary" /> {ticket.id.slice(0, 8)}
                    </td>
                    <td className="py-4 font-bold text-foreground">
                      <div>
                        <p className="font-extrabold">{ticket.title}</p>
                        {ticket.assignee && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Truck className="h-3 w-3" /> crew: {ticket.assignee}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground font-semibold">{ticket.unit}</td>
                    <td className="py-4">
                      <Badge variant={ticket.priority === "Urgent" ? "destructive" : "secondary"} className="text-[10px] font-bold uppercase tracking-wider">
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="py-4 text-muted-foreground font-semibold">{ticket.assignee}</td>
                    <td className="py-4">
                      <Badge variant={ticket.status === "resolved" ? "secondary" : "outline"} className="text-[10px] font-bold uppercase tracking-wider">
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      {ticket.status !== "resolved" && (
                        <Button 
                          onClick={() => handleUpdateStatus(ticket.id, ticket.status)}
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/5 rounded-full px-4 gap-1"
                        >
                          Progress <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
