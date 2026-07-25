import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { getPersonalProperties } from "@/actions/personal";
import { redirect } from "next/navigation";
import DocumentVault from "@/components/dashboard/personal/DocumentVault";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Files, Sparkles, FolderLock, Download, ArrowUpRight, FileCheck } from "lucide-react";
import Link from "next/link";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  const organization = await getOrganizationBySlug(orgSlug, session.userId);
  if (!organization) {
    redirect("/dashboard");
  }

  const workspaceType = organization.workspaceType;

  if (workspaceType === "personal") {
    const properties = await getPersonalProperties(session.userId, organization.id);
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DocumentVault properties={properties as any} orgSlug={orgSlug} />
      </div>
    );
  }

  // Specialized Vaults for other experience types
  let vaultTitle = "Legal & Site Document Vault";
  let description = "Secure document command center featuring cryptographic encryption, AI risks extraction, and audit trails.";
  let stats = [
    { title: "Total Encrypted Files", count: "34 Files", subtitle: "Secure AES-256", icon: Files },
    { title: "AI Summaries Active", count: "28 Files", subtitle: "Risk highlights active", icon: Sparkles },
    { title: "Vault Cryptography", count: "Certified", subtitle: "Zero leaks flagged", icon: ShieldCheck }
  ];

  let mockFiles: { id: string; name: string; type: string; size: string; status: string; updated: string }[] = [];

  if (workspaceType === "rental") {
    vaultTitle = "Landlord Leases & Screening Vault";
    description = "Archived lease ledgers, background checks, tenant credit reports, and stamped rental agreements.";
    stats = [
      { title: "Active Leases Signed", count: "18 Agreements", subtitle: "RERA Registered", icon: Files },
      { title: "Tenant Screening Files", count: "24 Checks", subtitle: "Credit & background OK", icon: Sparkles },
      { title: "Secured Escrow Files", count: "24 Files", subtitle: "Security deposits logged", icon: ShieldCheck }
    ];
    mockFiles = [
      { id: "FL-902", name: "Sarah_Jenkins_Lease_2026.pdf", type: "Lease Contract", size: "2.4 MB", status: "Verified", updated: "2 days ago" },
      { id: "FL-410", name: "Marcus_Sterling_Background_Check.pdf", type: "Screening Log", size: "4.8 MB", status: "Verified", updated: "3 days ago" },
      { id: "FL-118", name: "Villa_7_Security_Deposit_Receipt.pdf", type: "Escrow Receipt", size: "1.2 MB", status: "Stamped", updated: "1 week ago" }
    ];
  } else if (workspaceType === "builder") {
    vaultTitle = "Builder Blueprints & RERA Vault";
    description = "Site excavation plans, architect blueprints, structural reports, and zoning clearance certificates.";
    stats = [
      { title: "Structural Blueprints", count: "12 Schematics", subtitle: "CAD & BIM synced", icon: Files },
      { title: "RERA Registrations", count: "4 Numbers", subtitle: "Approved registry", icon: Sparkles },
      { title: "Zoning Clearance NOC", count: "8 Certificates", subtitle: "Fire, environmental OK", icon: ShieldCheck }
    ];
    mockFiles = [
      { id: "FL-301", name: "Tower_A_ApexHeights_Structural_Plan.dwg", type: "CAD Layout", size: "42.5 MB", status: "Approved", updated: "1 day ago" },
      { id: "FL-302", name: "Sector_4_Plotting_Zoning_Clearance.pdf", type: "Legal Certificate", size: "5.1 MB", status: "RERA Stamped", updated: "5 days ago" },
      { id: "FL-303", name: "Water_Mains_Infrastructure_Layout.pdf", type: "Civil Map", size: "12.4 MB", status: "Approved", updated: "2 weeks ago" }
    ];
  } else if (workspaceType === "enterprise") {
    vaultTitle = "Enterprise Global Deeds & Audit Vault";
    description = "High-level regional property deeds, tamperproof corporate approvals, and RBAC logs.";
    stats = [
      { title: "Regional Hub Deeds", count: "42 Deeds", subtitle: "Level 5 Encrypted", icon: Files },
      { title: "Legal Approvals Signed", count: "16 Certificates", subtitle: "TAMPERPROOF logs active", icon: Sparkles },
      { title: "Cryptographic Keys", count: "Active", subtitle: "sha256 stream active", icon: ShieldCheck }
    ];
    mockFiles = [
      { id: "FL-701", name: "NorthNCR_Division_Land_Deeds_2026.pdf", type: "Corporate Deed", size: "18.4 MB", status: "Locked", updated: "12 hours ago" },
      { id: "FL-702", name: "BlueHorizon_Environmental_NOC.pdf", type: "Compliance Certificate", size: "3.2 MB", status: "Approved", updated: "1 day ago" },
      { id: "FL-703", name: "Failed_Access_IP_Logs_Q1.csv", type: "Audit Stream", size: "1.4 MB", status: "Tamperproof", updated: "3 days ago" }
    ];
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FolderLock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">{vaultTitle}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          </div>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          Upload File
        </Button>
      </div>

      {/* Stats Block */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 border-border/40 bg-card/45 backdrop-blur-md rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{stat.title}</p>
              <p className="text-3xl font-extrabold mt-2 text-foreground">{stat.count}</p>
              <p className="text-xs text-muted-foreground mt-2">{stat.subtitle}</p>
            </Card>
          );
        })}
      </div>

      {/* Document Directory */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" /> Document Directory
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/20 text-xs uppercase tracking-widest text-muted-foreground">
                <th className="py-4 font-bold">Document ID</th>
                <th className="py-4 font-bold">File Name</th>
                <th className="py-4 font-bold">Document Type</th>
                <th className="py-4 font-bold">File Size</th>
                <th className="py-4 font-bold">Updated Date</th>
                <th className="py-4 font-bold font-semibold">Security Clearance</th>
                <th className="py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockFiles.map((file) => (
                <tr key={file.id} className="border-b border-border/10 text-sm hover:bg-secondary/5 transition-colors group">
                  <td className="py-4 font-extrabold text-foreground">{file.id}</td>
                  <td className="py-4 font-bold text-foreground">{file.name}</td>
                  <td className="py-4 text-muted-foreground font-semibold">{file.type}</td>
                  <td className="py-4 text-muted-foreground font-semibold">{file.size}</td>
                  <td className="py-4 text-muted-foreground font-semibold">{file.updated}</td>
                  <td className="py-4">
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      {file.status}
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
