"use client";
import React, { useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  SlidersHorizontal, 
  FileText, 
  Calendar,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Download,
  AlertTriangle,
  UserCheck,
  Fingerprint
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockLogs = [
    { id: "LOG-4921", action: "Tenant Screening Approved", module: "Rental OS", date: "May 18, 2026, 20:31:02", ip: "192.168.1.45", user: "Alexander Thorne", hash: "sha256:f849a92a..." },
    { id: "LOG-2831", action: "RERA Certificate Uploaded", module: "Enterprise Legal", date: "May 18, 2026, 19:42:15", ip: "192.168.1.45", user: "Prerna Roy", hash: "sha256:28cb110a..." },
    { id: "LOG-9028", action: "Vault Access Unlocked", module: "Document Vault", date: "May 18, 2026, 18:15:30", ip: "10.0.4.120", user: "Alexander Thorne", hash: "sha256:bc849da9..." },
    { id: "LOG-1102", action: "Commercial Space Leased", module: "Commercial OS", date: "May 17, 2026, 14:22:10", ip: "192.168.1.68", user: "Suresh Patel", hash: "sha256:de90a12b..." },
  ];

  const filteredLogs = mockLogs.filter(l => 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 uppercase">
            Tamperproof Audit Vault
          </h1>
          <p className="text-muted-foreground mt-2">Access read-only cryptographic activity trails, employee authorization records, and failed compliance requests.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Download className="h-4 w-4" /> Export Audit Trail
        </Button>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Audit Status</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">Active</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Lock className="h-3 w-3 text-emerald-500" /> Tamperproof sha256 enabled
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Sync Logs</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">1,248 Logs</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            Zero logs purged or deleted
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Authorized Signatures</p>
          <p className="text-3xl font-extrabold mt-2 text-foreground">4 Active</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> High-level RBAC
          </p>
        </Card>
        <Card className="border-border/40 bg-card/45 backdrop-blur-md p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Intrusion Audits</p>
          <p className="text-3xl font-extrabold mt-2 text-emerald-500">0 Alerts</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            No failed attempts tracked
          </p>
        </Card>
      </div>

      {/* Audit Vault Logs */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search audit actions or operational modules..." 
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
                <th className="py-4 font-bold">Log Block</th>
                <th className="py-4 font-bold">Action Event</th>
                <th className="py-4 font-bold">Module Path</th>
                <th className="py-4 font-bold">Signed User</th>
                <th className="py-4 font-bold">Network IP Address</th>
                <th className="py-4 font-bold">Time Triggered</th>
                <th className="py-4 font-bold">Cryptographic Hash</th>
                <th className="py-4 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                  <td className="py-4 font-extrabold text-foreground flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-primary" /> {log.id}
                  </td>
                  <td className="py-4 font-bold text-foreground">{log.action}</td>
                  <td className="py-4 text-muted-foreground font-semibold">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                      {log.module}
                    </Badge>
                  </td>
                  <td className="py-4 font-bold text-foreground">
                    <div className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5" /> {log.user}</div>
                  </td>
                  <td className="py-4 text-muted-foreground font-semibold">{log.ip}</td>
                  <td className="py-4 text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {log.date}</div>
                  </td>
                  <td className="py-4 text-muted-foreground font-mono text-xs">{log.hash}</td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/5 rounded-full">
                      <ArrowUpRight className="h-4 w-4" />
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
