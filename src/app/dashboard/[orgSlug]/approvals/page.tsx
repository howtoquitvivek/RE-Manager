"use client";
import React, { useState } from "react";
import { 
  FileCheck, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  CheckCircle,
  FileText, 
  UserCheck, 
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Download
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockApprovals = [
    { id: "APP-902", title: "RERA Registration Certificate", type: "RERA Filing", status: "Approved", project: "Blue Horizon Towers", date: "Jan 12, 2026", reviewer: "Legal Division Desk A" },
    { id: "APP-410", title: "Zoning & Land Use Clearance", type: "Zoning Clearance", status: "Under Review", project: "Emerald Heights", date: "Mar 05, 2026", reviewer: "Urban Development Corp" },
    { id: "APP-118", title: "Environmental Clearance Certificate", type: "Environmental Audit", status: "Approved", project: "Horizon View", date: "Apr 28, 2026", reviewer: "State Pollution Control" },
    { id: "APP-229", title: "Fire Safety Certificate NOC", type: "NOC Audit", status: "Pending Dispatch", project: "Apex Heights", date: "May 10, 2026", reviewer: "Fire Emergency Services" },
  ];

  const filteredApprovals = mockApprovals.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Legal Approvals Desk
          </h1>
          <p className="text-muted-foreground mt-2">Oversee zoning clearances, environmental audits, NOC certificate vaults, and RERA number registrations.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Upload Document
        </Button>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Clearances</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">16 Files</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" /> 12 fully certified
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Approved Status</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">75%</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            4 files awaiting review
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">RERA Filings</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">100% Ok</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> Active RERA numbers
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Auditing Status</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">Secure</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Tamperproof logs sync&apos;d
          </p>
        </Card>
      </div>

      {/* Approvals Table */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search approvals by title or project..." 
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
                <th className="py-4 font-bold">Approval ID</th>
                <th className="py-4 font-bold">Certificate Title</th>
                <th className="py-4 font-bold">Parent Project</th>
                <th className="py-4 font-bold">Document Type</th>
                <th className="py-4 font-bold">Reviewer Authority</th>
                <th className="py-4 font-bold">Clearance Date</th>
                <th className="py-4 font-bold">Compliance Status</th>
                <th className="py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.map((approval) => (
                <tr key={approval.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                  <td className="py-4 font-extrabold text-foreground flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" /> {approval.id}
                  </td>
                  <td className="py-4 font-bold text-foreground">{approval.title}</td>
                  <td className="py-4 text-muted-foreground font-semibold">{approval.project}</td>
                  <td className="py-4 font-bold text-foreground">
                    <div className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> {approval.type}</div>
                  </td>
                  <td className="py-4 text-muted-foreground font-semibold flex items-center gap-1.5 mt-2">
                    <UserCheck className="h-3.5 w-3.5" /> {approval.reviewer}
                  </td>
                  <td className="py-4 text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {approval.date}</div>
                  </td>
                  <td className="py-4">
                    <Badge variant={approval.status === "Approved" ? "secondary" : approval.status === "Under Review" ? "outline" : "destructive"} className="text-[10px] font-bold uppercase tracking-wider">
                      {approval.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/5 rounded-full">
                      <Download className="h-4 w-4" />
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
