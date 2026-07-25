"use client";

import React, { useState, useTransition } from "react";
import { 
  TrendingUp, 
  Search, 
  SlidersHorizontal, 
  DollarSign, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  Receipt,
  Plus
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
import { createRentInvoiceAction, updateRentInvoiceStatusAction } from "@/actions/rental";

interface RentInvoice {
  id: string;
  tenant: string;
  unit: string;
  amount: string;
  status: string;
  dueDate: string;
  createdAt: string;
}

interface RentClientProps {
  initialInvoices: RentInvoice[];
  tenants: { name: string }[];
  properties: { name: string }[];
  orgSlug: string;
  orgId: string;
}

export default function RentClient({ initialInvoices, tenants, properties, orgSlug, orgId }: RentClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [tenantName, setTenantName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");

  const filteredInvoices = initialInvoices.filter(i => 
    i.tenant.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName || !unitName || !amount || !dueDate) return;

    startTransition(async () => {
      const res = await createRentInvoiceAction(orgSlug, orgId, {
        tenant: tenantName,
        unit: unitName,
        amount: `$${parseFloat(amount).toLocaleString()}`,
        status,
        dueDate
      });
      if (res.success) {
        setIsDialogOpen(false);
        setTenantName("");
        setUnitName("");
        setAmount("");
        setStatus("Pending");
        setDueDate("");
      }
    });
  };

  const handleMarkPaid = async (id: string) => {
    startTransition(async () => {
      await updateRentInvoiceStatusAction(orgSlug, id, "Paid");
    });
  };

  // Compile calculations
  const totalCollected = initialInvoices
    .filter(i => i.status === "Paid")
    .reduce((acc, i) => {
      const val = parseFloat(i.amount.replace(/[$,]/g, ''));
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

  const totalPending = initialInvoices
    .filter(i => i.status === "Pending")
    .reduce((acc, i) => {
      const val = parseFloat(i.amount.replace(/[$,]/g, ''));
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

  const totalOverdue = initialInvoices
    .filter(i => i.status === "Overdue")
    .reduce((acc, i) => {
      const val = parseFloat(i.amount.replace(/[$,]/g, ''));
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Rent Invoice Tracking
          </h1>
          <p className="text-muted-foreground mt-2">Log payments, check due invoices, and dispatch automated rental reminders.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={(props) => (
            <Button {...props} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Log Payment / Invoice
            </Button>
          )} />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Rental Invoice</DialogTitle>
              <DialogDescription>Record a new rental statement in the ledger.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="tenant">Tenant Name</Label>
                <select 
                  id="tenant" 
                  value={tenantName} 
                  onChange={(e) => setTenantName(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Select Tenant --</option>
                  {tenants.map(t => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Property Unit</Label>
                <select 
                  id="unit" 
                  value={unitName} 
                  onChange={(e) => setUnitName(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Select Unit --</option>
                  {properties.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Invoice Amount ($)</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="e.g. 4200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Payment Status</Label>
                <select 
                  id="status" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Logging..." : "Log Invoice"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Collected</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">${totalCollected.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" /> Collection sync active
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Pending Invoices</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">${totalPending.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Awaiting processing</p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Overdue Amount</p>
          <p className="text-3xl font-extrabold mt-2 text-rose-500">${totalOverdue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-rose-500" /> Late fees applicable
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Avg Speed</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">Live</p>
          <p className="text-xs text-muted-foreground mt-2">Updated in real-time</p>
        </Card>
      </div>

      {/* Directory list */}
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

        {filteredInvoices.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            No rent invoices logged yet. Use the &quot;Log Payment / Invoice&quot; button to record payments.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/20 text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="py-4 font-bold">Invoice ID</th>
                  <th className="py-4 font-bold">Tenant Name</th>
                  <th className="py-4 font-bold">Property Unit</th>
                  <th className="py-4 font-bold">Invoice Amount</th>
                  <th className="py-4 font-bold">Due Date</th>
                  <th className="py-4 font-bold">Status</th>
                  <th className="py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                    <td className="py-4 font-extrabold text-foreground flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-primary" /> {invoice.id.slice(0, 8)}
                    </td>
                    <td className="py-4 font-bold text-foreground">{invoice.tenant}</td>
                    <td className="py-4 text-muted-foreground font-semibold">{invoice.unit}</td>
                    <td className="py-4 font-extrabold text-foreground">{invoice.amount}</td>
                    <td className="py-4 text-muted-foreground font-semibold">
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {invoice.dueDate}</div>
                    </td>
                    <td className="py-4">
                      <Badge variant={invoice.status === "Paid" ? "secondary" : invoice.status === "Overdue" ? "destructive" : "outline"} className="text-[10px] font-bold uppercase tracking-wider">
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      {invoice.status !== "Paid" && (
                        <Button 
                          onClick={() => handleMarkPaid(invoice.id)} 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 hover:bg-emerald-500/5 rounded-full px-3"
                        >
                          Mark Paid
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
