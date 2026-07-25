"use client";
import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  CheckCircle,
  Mail,
  ShieldAlert,
  Calendar,
  ArrowUpRight,
  Shield
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockTeam = [
    { id: 1, name: "Alexander Thorne", email: "alexander@estateos.com", role: "Chairman / Founder", clearance: "Level 5 — All Access", status: "Active", joined: "May 10, 2024" },
    { id: 2, name: "Ramesh Sharma", email: "ramesh@estateos.com", role: "Regional Manager (North Hub)", clearance: "Level 4 — Regional Ops", status: "Active", joined: "Jun 14, 2024" },
    { id: 3, name: "Prerna Roy", email: "prerna@estateos.com", role: "Chief Legal Counsel", clearance: "Level 4 — Legal Clearances", status: "Active", joined: "Sep 01, 2024" },
    { id: 4, name: "Suresh Patel", email: "suresh@estateos.com", role: "Senior Broker Liaison", clearance: "Level 3 — Sales Ledger", status: "Active", joined: "Jan 12, 2025" },
  ];

  const filteredTeam = mockTeam.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Team & RBAC operations
          </h1>
          <p className="text-muted-foreground mt-2">Manage enterprise organizational users, operational roles, and cryptographic permission clearances.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Staff</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">18 Members</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" /> Active directory synced
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Clearance Level 5</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">2 Members</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Full admin capability
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Legal Clearance</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">3 Members</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> NOC & stamp rights
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">RBAC Audits</p>
          <p className="text-3xl font-extrabold mt-2 text-emerald-500">100% Ok</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Zero failed log breaches
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
              placeholder="Search staff by name or operational role..." 
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
                <th className="py-4 font-bold">Staff Member</th>
                <th className="py-4 font-bold">Operational Role</th>
                <th className="py-4 font-bold">RBAC Clearance</th>
                <th className="py-4 font-bold">Joined Date</th>
                <th className="py-4 font-bold">Directory Status</th>
                <th className="py-4 font-bold text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeam.map((member) => (
                <tr key={member.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                  <td className="py-4 font-bold text-foreground">
                    <div>
                      <p className="font-extrabold">{member.name}</p>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1"><Mail className="h-3 w-3" /> {member.email}</span>
                    </div>
                  </td>
                  <td className="py-4 font-bold text-foreground">
                    <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> {member.role}</div>
                  </td>
                  <td className="py-4 text-muted-foreground font-semibold">
                    <Badge variant={member.clearance.startsWith("Level 5") ? "default" : member.clearance.startsWith("Level 4") ? "secondary" : "outline"} className="text-[10px] font-bold uppercase tracking-wider">
                      {member.clearance}
                    </Badge>
                  </td>
                  <td className="py-4 text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {member.joined}</div>
                  </td>
                  <td className="py-4">
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      {member.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/5 rounded-full px-4 gap-1">
                      Clearance Desk <ArrowUpRight className="h-4 w-4" />
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
