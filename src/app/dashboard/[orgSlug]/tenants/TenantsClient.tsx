"use client";

import React, { useState, useTransition } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
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
import { createTenantAction, deleteTenantAction } from "@/actions/rental";

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  rent: string;
  deposit: string;
  status: string;
  check: string;
}

interface TenantsClientProps {
  initialTenants: Tenant[];
  orgSlug: string;
  orgId: string;
}

export default function TenantsClient({ initialTenants, orgSlug, orgId }: TenantsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("active");

  const filteredTenants = initialTenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    startTransition(async () => {
      const res = await createTenantAction(orgSlug, orgId, { name, email, phone, status });
      if (res.success) {
        setIsDialogOpen(false);
        setName("");
        setEmail("");
        setPhone("");
        setStatus("active");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tenant?")) return;
    startTransition(async () => {
      await deleteTenantAction(orgSlug, id);
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Tenant Directory
          </h1>
          <p className="text-muted-foreground mt-2">Manage renter relationships, security deposits, and verification records.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={(props) => (
            <Button {...props} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Add Tenant
            </Button>
          )} />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Tenant</DialogTitle>
              <DialogDescription>Add a new tenant to this organization registry.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Sarah Jenkins" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="sarah@jenkins.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 234-5678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Lease Status</Label>
                <select 
                  id="status" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Adding..." : "Add Tenant"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Occupants</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">{initialTenants.length}</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Directory synced
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Leased Assets</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">
            {initialTenants.filter(t => t.unit !== "No Unit Assigned").length}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Active rental contracts</p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Deposits Mapped</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">
            ${initialTenants.reduce((acc, t) => {
              const val = parseFloat(t.deposit.replace(/[$,]/g, ''));
              return acc + (isNaN(val) ? 0 : val);
            }, 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> Escrow tracked
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Pending Screening</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">0</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            All background checks clear
          </p>
        </Card>
      </div>

      {/* Directory Table */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tenants by name or unit..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/20 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-2 border-border/50 bg-secondary/30 rounded-xl">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {filteredTenants.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            No tenants registered in this organization workspace yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/20 text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="py-4 font-bold">Tenant Name</th>
                  <th className="py-4 font-bold">Assigned Unit</th>
                  <th className="py-4 font-bold">Rent Term</th>
                  <th className="py-4 font-bold">Escrow Deposit</th>
                  <th className="py-4 font-bold">Screening</th>
                  <th className="py-4 font-bold">Status</th>
                  <th className="py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                    <td className="py-4 font-bold text-foreground">
                      <div>
                        <p className="font-extrabold">{tenant.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {tenant.email}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {tenant.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground font-semibold">{tenant.unit}</td>
                    <td className="py-4 font-bold text-foreground">{tenant.rent}</td>
                    <td className="py-4 text-muted-foreground font-semibold">{tenant.deposit}</td>
                    <td className="py-4">
                      <Badge variant={tenant.check === "Verified" ? "secondary" : "outline"} className="text-[10px] font-bold uppercase tracking-wider">
                        {tenant.check}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant={tenant.status === "active" ? "default" : "secondary"} className="text-[10px] font-bold uppercase tracking-wider">
                        {tenant.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(tenant.id)} 
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
