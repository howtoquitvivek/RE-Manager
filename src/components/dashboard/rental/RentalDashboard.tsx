"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Users, 
  Key, 
  Wrench, 
  TrendingUp,
  AlertCircle,
  Plus,
  Shield,
  EyeOff,
  ChevronRight,
  TrendingDown,
  FileCheck
} from "lucide-react";
import { StatCard } from "@/components/dashboard/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVault } from "@/store/useVaultStore";
import VaultPasswordFlow from "../personal/VaultPasswordFlow";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RentalDashboardProps {
  userId: string;
  orgId: string;
  orgSlug: string;
}

export default function RentalDashboard({ userId, orgId, orgSlug }: RentalDashboardProps) {
  const { isUnlocked } = useVault();
  const [showVaultPrompt, setShowVaultPrompt] = useState(false);
  const [activeMetric, setActiveMetric] = useState<"yield" | "occupancy">("yield");
  const [settings, setSettings] = useState({
    lateFees: true,
    lateFeeAmount: 5,
    dueDate: "1",
    stripeConnected: false,
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`reos_settings_${orgSlug}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSettings(prev => ({
            ...prev,
            ...parsed
          }));
        } catch (e) {
          console.error("Error loading settings:", e);
        }
      }
    }
  }, [orgSlug]);

  const yieldData = [
    { month: "Jun", label: "$10,500", height: 50 },
    { month: "Jul", label: "$11,200", height: 55 },
    { month: "Aug", label: "$12,000", height: 60 },
    { month: "Sep", label: "$11,800", height: 58 },
    { month: "Oct", label: "$12,500", height: 65 },
    { month: "Nov", label: "$13,400", height: 72 },
    { month: "Dec", label: "$13,800", height: 75 },
    { month: "Jan", label: "$14,200", height: 80 },
    { month: "Feb", label: "$14,500", height: 85 },
    { month: "Mar", label: "$14,100", height: 82 },
    { month: "Apr", label: "$14,850", height: 95 },
    { month: "May", label: "$15,200", height: 100 },
  ];

  const occupancyData = [
    { month: "Jun", label: "88%", height: 88 },
    { month: "Jul", label: "90%", height: 90 },
    { month: "Aug", label: "92%", height: 92 },
    { month: "Sep", label: "90%", height: 90 },
    { month: "Oct", label: "94%", height: 94 },
    { month: "Nov", label: "95%", height: 95 },
    { month: "Dec", label: "93%", height: 93 },
    { month: "Jan", label: "94%", height: 94 },
    { month: "Feb", label: "94.4%", height: 94 },
    { month: "Mar", label: "94.4%", height: 94 },
    { month: "Apr", label: "94.4%", height: 94 },
    { month: "May", label: "94.4%", height: 94 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Rental Operations
          </h1>
          <p className="text-muted-foreground text-lg">Streamline operations, leases, and tenant yields.</p>
          
          {/* Live settings policy indicators */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className={cn(
              "text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 backdrop-blur-md transition-colors",
              settings.lateFees 
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500" 
                : "border-muted/30 bg-muted/5 text-muted-foreground"
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full", settings.lateFees ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
              Late Fees: {settings.lateFees ? `${settings.lateFeeAmount}% Active (Grace: ${settings.dueDate} Days)` : "Inactive"}
            </span>
            <span className={cn(
              "text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 backdrop-blur-md transition-colors",
              settings.stripeConnected 
                ? "border-indigo-500/20 bg-indigo-500/5 text-indigo-500" 
                : "border-amber-500/20 bg-amber-500/5 text-amber-500"
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full", settings.stripeConnected ? "bg-indigo-500 animate-pulse" : "bg-amber-500 animate-pulse")} />
              Stripe Gateway: {settings.stripeConnected ? "Connected" : "Setup Pending"}
            </span>
          </div>
        </div>
        <Link href={`/dashboard/${orgSlug}/properties`}>
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-2">
            <Plus className="h-5 w-5" />
            Add Rental Property
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Rentals" 
          value="18" 
          description="Occupied units"
          icon={Building2} 
          index={0}
        />
        
        {/* Secure Rental Valuation and Yields Card */}
        <Card className="relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-md p-6 group transition-all hover:border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Est. Rental Yield</p>
            <Shield className={cn("h-4 w-4 transition-colors", isUnlocked ? "text-emerald-500" : "text-amber-500")} />
          </div>
          <div className="relative h-12 flex items-center">
            <AnimatePresence mode="wait">
              {isUnlocked ? (
                <motion.div
                  key="value"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold tracking-tight"
                >
                  $14,850<span className="text-xs text-muted-foreground font-semibold">/mo</span>
                </motion.div>
              ) : (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-8 bg-muted/20 backdrop-blur-xl rounded-md flex items-center justify-center cursor-pointer group-hover:bg-muted/30 transition-colors"
                  onClick={() => setShowVaultPrompt(true)}
                >
                  <EyeOff className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-xs font-semibold text-muted-foreground">Unlock Vault</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            7.8% Average Annual Yield
          </p>
        </Card>

        <StatCard 
          title="Occupancy Rate" 
          value="94.4%" 
          description="17 occupied, 1 vacant"
          icon={Users} 
          index={2}
        />
        <StatCard 
          title="Maintenance Requests" 
          value="3 Open" 
          description="1 urgent ticket"
          icon={Wrench} 
          index={3}
          className="border-rose-500/20 bg-rose-500/5"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* rent analytics */}
        <Card className="lg:col-span-2 border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Rent Yield & Collection Curve
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("h-8 border-border/50 transition-all font-bold text-xs rounded-lg px-3", activeMetric === "yield" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-secondary/20")}
                onClick={() => setActiveMetric("yield")}
              >
                Revenue Yield ($)
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("h-8 border-border/50 transition-all font-bold text-xs rounded-lg px-3", activeMetric === "occupancy" ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/20")}
                onClick={() => setActiveMetric("occupancy")}
              >
                Occupancy Rate (%)
              </Button>
            </div>
          </div>
          <div className="h-[200px] w-full rounded-2xl bg-secondary/10 flex items-end justify-between p-6 border border-border/40 gap-3 relative overflow-hidden">
            {/* Elegant luxury visual graph using pure Tailwind divs */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(16,185,129,0.05),transparent_50%)]" />
            {(activeMetric === "yield" ? yieldData : occupancyData).map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 z-10">
                <div className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/45 relative group" style={{ height: `${item.height}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover px-2 py-1 rounded border border-border text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg">
                    {item.label}
                  </div>
                </div>
                <span className="text-[9px] uppercase font-extrabold text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Plus className="h-5 w-5 text-primary" />
            Landlord Operations
          </h3>
          <div className="space-y-3">
            <Link href={`/dashboard/${orgSlug}/tenants`} className="block w-full">
              <Button className="w-full justify-between h-12 bg-foreground text-background hover:bg-foreground/90 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><Users className="h-4 w-4" /> Add Tenant</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/leases`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><Key className="h-4 w-4" /> Create Lease</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/rent`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><TrendingUp className="h-4 w-4" /> Rent Invoices</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/${orgSlug}/maintenance`} className="block w-full">
              <Button variant="outline" className="w-full justify-between h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 gap-3 rounded-xl transition-all">
                <span className="flex items-center gap-3"><Wrench className="h-4 w-4" /> Dispatch Mechanic</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Leases expiring */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Leases Nearing Expiration
            </h3>
            <Link href={`/dashboard/${orgSlug}/leases`}>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 h-8">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Sarah Jenkins', unit: 'Apt 1402 — Luxury Tower A', days: 12, rent: "$4,200" },
              { name: 'Marcus Sterling', unit: 'Villa 7 — Palm Estate', days: 28, rent: "$8,500" },
            ].map((lease, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-border/40">
                <div>
                  <p className="text-sm font-bold text-foreground">{lease.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{lease.unit}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-sm font-extrabold text-foreground">{lease.rent}</p>
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Expires in {lease.days} days</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Maintenance queue */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Maintenance Dispatch
            </h3>
            <Link href={`/dashboard/${orgSlug}/maintenance`}>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 h-8">Full Board</Button>
            </Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex justify-between items-start cursor-pointer hover:bg-rose-500/10 transition-all">
              <div>
                <p className="text-sm font-bold text-foreground">Burst Pipe & Flooding - Apt 8C</p>
                <p className="text-xs text-muted-foreground mt-1">Dispatched to: Premier Plumbing LLC • 30m ago</p>
              </div>
              <span className="text-[9px] font-extrabold px-2 py-1 rounded bg-rose-500/20 text-rose-600 uppercase tracking-widest">Urgent</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex justify-between items-start cursor-pointer hover:bg-amber-500/10 transition-all">
              <div>
                <p className="text-sm font-bold text-foreground">HVAC Filter & Refill - Villa 4</p>
                <p className="text-xs text-muted-foreground mt-1">Dispatched to: ClimateTech Corp • 2h ago</p>
              </div>
              <span className="text-[9px] font-extrabold px-2 py-1 rounded bg-amber-500/20 text-amber-600 uppercase tracking-widest">Scheduled</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Vault Password Modal */}
      <AnimatePresence>
        {showVaultPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <VaultPasswordFlow 
                userId={userId} 
                onSuccess={() => setShowVaultPrompt(false)} 
              />
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-muted-foreground"
                onClick={() => setShowVaultPrompt(false)}
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
