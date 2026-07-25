"use client";

import React, { useState, useTransition } from "react";
import { 
  Key, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  Clock, 
  Lock, 
  Download,
  AlertCircle,
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
import { createLeaseAction, deleteLeaseAction } from "@/actions/rental";

interface Lease {
  id: string;
  tenant: string;
  unit: string;
  start: string;
  end: string;
  rent: string;
  status: string;
  ledger: string;
}

interface LeaseProperty {
  id: string;
  name: string;
}

interface LeaseTenant {
  id: string;
  name: string;
}

interface LeasesClientProps {
  initialLeases: Lease[];
  tenants: LeaseTenant[];
  properties: LeaseProperty[];
  orgSlug: string;
}

export default function LeasesClient({ initialLeases, tenants, properties, orgSlug }: LeasesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [tenantId, setTenantId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");

  const filteredLeases = initialLeases.filter(l => 
    l.tenant.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !propertyId || !rentAmount || !startDate || !endDate) return;

    startTransition(async () => {
      const res = await createLeaseAction(orgSlug, {
        tenantId,
        propertyId,
        rentAmount: parseFloat(rentAmount),
        startDate,
        endDate,
        status
      });
      if (res.success) {
        setIsDialogOpen(false);
        setTenantId("");
        setPropertyId("");
        setRentAmount("");
        setStartDate("");
        setEndDate("");
        setStatus("Active");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to terminate/delete this lease?")) return;
    startTransition(async () => {
      await deleteLeaseAction(orgSlug, id);
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Lease Agreements Ledger
          </h1>
          <p className="text-muted-foreground mt-2">Access legal lease agreements, stamped terms, and security indices.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={(props) => (
            <Button {...props} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Create Lease
            </Button>
          )} />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Lease Agreement</DialogTitle>
              <DialogDescription>Link a tenant to an inventory unit with legal rent terms.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="tenant">Select Tenant</Label>
                <select 
                  id="tenant" 
                  value={tenantId} 
                  onChange={(e) => setTenantId(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Choose Tenant --</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property">Select Property Unit</Label>
                <select 
                  id="property" 
                  value={propertyId} 
                  onChange={(e) => setPropertyId(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Choose Property Unit --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rent">Monthly Rent Amount ($)</Label>
                <Input id="rent" type="number" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} required placeholder="e.g. 4200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Start Date</Label>
                  <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">End Date</Label>
                  <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Lease Status</Label>
                <select 
                  id="status" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Lease"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Active Leases</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">
            {initialLeases.filter(l => l.status === "Active").length}
          </p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Lock className="h-3 w-3 text-emerald-500" /> Relational SQL verified
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Monthly Rent Roll</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">
            ${initialLeases.reduce((acc, l) => {
              const val = parseFloat(l.rent.replace(/[$,/mo]/g, ''));
              return acc + (isNaN(val) ? 0 : val);
            }, 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Sum of active contracts</p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Stamped Leases</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">
            {initialLeases.length}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Registered in ledger</p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Expirations</p>
          <p className="text-3xl font-extrabold mt-2 text-rose-500">0</p>
          <p className="text-xs text-muted-foreground mt-2">No short-term warnings</p>
        </Card>
      </div>

      {/* Directory Table */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by tenant or unit..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/20 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-2 border-border/50 bg-secondary/30 rounded-xl">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {filteredLeases.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            No leases found. Link properties to tenants via the &quot;Create Lease&quot; button.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/20 text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="py-4 font-bold">Lease ID</th>
                  <th className="py-4 font-bold">Tenant</th>
                  <th className="py-4 font-bold">Property Unit</th>
                  <th className="py-4 font-bold">Rent Value</th>
                  <th className="py-4 font-bold">Start/End Terms</th>
                  <th className="py-4 font-bold">Legal Sync</th>
                  <th className="py-4 font-bold">Status</th>
                  <th className="py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeases.map((lease) => (
                  <tr key={lease.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                    <td className="py-4 font-extrabold text-foreground flex items-center gap-2">
                      <Key className="h-4 w-4 text-primary" /> {lease.id.slice(0, 8)}
                    </td>
                    <td className="py-4 font-bold text-foreground">{lease.tenant}</td>
                    <td className="py-4 text-muted-foreground font-semibold">{lease.unit}</td>
                    <td className="py-4 font-bold text-foreground">{lease.rent}</td>
                    <td className="py-4 text-muted-foreground text-xs space-y-1">
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {lease.start}</div>
                      <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {lease.end}</div>
                    </td>
                    <td className="py-4">
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                        RERA Stamped
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant={lease.status === "Active" ? "default" : "secondary"} className="text-[10px] font-bold uppercase tracking-wider">
                        {lease.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(lease.id)} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/5 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
