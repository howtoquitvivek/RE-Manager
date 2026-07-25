"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DynamicSidebar } from "./DynamicSidebar";
import { WorkspaceType } from "@/types/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname, useRouter } from "next/navigation";
import { isRouteAllowed } from "@/lib/dashboard/registry";
import { 
  Bell, 
  Search, 
  Plus,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  LayoutDashboard,
  ChevronDown,
  Check,
  Lock,
  Shield,
  Coins,
  Building,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { UnlockNicheModal } from "@/components/dashboard/shared/UnlockNicheModal";

interface DashboardShellProps {
  children: React.ReactNode;
  organization: {
    id: string;
    name: string;
    slug: string;
    workspaceType: WorkspaceType;
  };
  allOrganizations?: {
    organization: {
      id: string;
      name: string;
      slug: string;
      workspaceType: string;
      subscriptionPlan: string;
    };
  }[];
}

const nicheIcons: Record<WorkspaceType, any> = {
  personal: Shield,
  rental: Coins,
  builder: Sparkles,
  enterprise: Building,
};

export function DashboardShell({ children, organization, allOrganizations = [] }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAllowed = isRouteAllowed(organization.workspaceType, organization.slug, pathname);

  const [isUnlockOpen, setIsUnlockOpen] = useState(false);
  const [selectedLockedNiche, setSelectedLockedNiche] = useState<WorkspaceType | null>(null);

  // Extract unlocked organizations
  const unlockedOrgs = allOrganizations.map((o) => o.organization);
  
  // Calculate locked niches
  const allNiches: WorkspaceType[] = ["personal", "rental", "builder", "enterprise"];
  const unlockedNichesList = unlockedOrgs.map((org) => org.workspaceType);
  const lockedNiches = allNiches.filter(
    (niche) => niche !== "personal" && !unlockedNichesList.includes(niche)
  );

  const CurrentIcon = nicheIcons[organization.workspaceType] || Shield;

  const handleUnlockClick = (niche: WorkspaceType) => {
    setSelectedLockedNiche(niche);
    setIsUnlockOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/50 dark:bg-background/95">
        <DynamicSidebar organization={organization} allOrganizations={allOrganizations} />
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/50 px-6 backdrop-blur-xl transition-all">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border/50" />
            
            {/* Premium Niche Selector Dropdown */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger render={(props) => (
                  <Button 
                    variant="ghost" 
                    className="h-10 px-3 gap-2.5 rounded-xl border border-border/20 bg-secondary/15 hover:bg-secondary/30 transition-all font-medium text-foreground relative group overflow-hidden"
                    {...props}
                  >
                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center border shrink-0 ${
                      organization.workspaceType === "personal" ? "text-blue-500 bg-blue-500/10 border-blue-500/20" :
                      organization.workspaceType === "rental" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                      organization.workspaceType === "builder" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                      "text-violet-500 bg-violet-500/10 border-violet-500/20"
                    }`}>
                      <CurrentIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight max-w-[120px] sm:max-w-none truncate">{organization.name}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground opacity-70 group-hover:translate-y-0.5 transition-transform" />
                  </Button>
                )} />
                
                <DropdownMenuContent align="start" className="w-64 rounded-2xl p-1.5 border border-border/40 bg-card/90 backdrop-blur-xl shadow-2xl z-50">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground px-2.5 py-1.5">
                      Active Portfolios
                    </DropdownMenuLabel>
                    {unlockedOrgs.map((org) => {
                      const OrgIcon = nicheIcons[org.workspaceType as WorkspaceType] || Shield;
                      const isActive = org.id === organization.id || org.slug === organization.slug;
                      return (
                        <DropdownMenuItem 
                          key={org.id} 
                          className="flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer hover:bg-secondary/40 focus:bg-secondary/40 transition-colors"
                          onClick={() => {
                            if (!isActive) {
                              router.push(`/dashboard/${org.slug}`);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`h-7 w-7 rounded-lg flex items-center justify-center border ${
                              org.workspaceType === "personal" ? "text-blue-500 bg-blue-500/10 border-blue-500/20" :
                              org.workspaceType === "rental" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                              org.workspaceType === "builder" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                              "text-violet-500 bg-violet-500/10 border-violet-500/20"
                            }`}>
                              <OrgIcon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-foreground">{org.name}</span>
                              <span className="text-[10px] text-muted-foreground capitalize">{org.workspaceType} console</span>
                            </div>
                          </div>
                          {isActive && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                  
                  {lockedNiches.length > 0 && (
                    <>
                      <DropdownMenuSeparator className="my-1.5 border-border/40" />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground px-2.5 py-1.5">
                          Expand Ecosystem
                        </DropdownMenuLabel>
                        {lockedNiches.map((niche) => {
                          const NicheIcon = nicheIcons[niche] || Shield;
                          return (
                            <DropdownMenuItem 
                              key={niche} 
                              className="flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer hover:bg-primary/5 focus:bg-primary/5 text-muted-foreground hover:text-foreground transition-all group"
                              onClick={() => handleUnlockClick(niche)}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg flex items-center justify-center border border-border/40 bg-secondary/15 text-muted-foreground group-hover:border-primary/20 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                  <NicheIcon className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-semibold capitalize">{niche} Console</span>
                                  <span className="text-[10px] text-muted-foreground">Inactive license</span>
                                </div>
                              </div>
                              <Lock className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuGroup>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="relative hidden lg:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search workspace..."
                  className="w-64 bg-secondary/50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                </Button>
                <ThemeToggle />
                {isAllowed && (
                  <Button size="sm" className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:flex">
                    <Plus className="h-4 w-4" />
                    Quick Action
                  </Button>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {isAllowed ? (
                children
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/25 blur-3xl rounded-full" />
                    <div className="relative h-20 w-20 rounded-3xl bg-card border border-border/80 flex items-center justify-center shadow-2xl">
                      <ShieldAlert className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                    Operational Gate Intercepted
                  </h1>
                  <p className="text-muted-foreground max-w-md mt-3 text-sm leading-relaxed">
                    This module is exclusive to a different operating license. Switch to a workspace that supports this feature, or return to your core dashboard.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Link href={`/dashboard/${organization.slug}`}>
                      <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Go to Dashboard
                      </Button>
                    </Link>
                    
                    <Link href="/dashboard">
                      <Button variant="outline" className="rounded-full border-border bg-secondary/20 hover:bg-secondary/45 h-11 px-6 transition-all hover:scale-105 active:scale-95 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Switch Workspace
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Niche Activation pricing modal */}
      <UnlockNicheModal 
        isOpen={isUnlockOpen} 
        onClose={() => setIsUnlockOpen(false)} 
        nicheType={selectedLockedNiche} 
      />
    </SidebarProvider>
  );
}
