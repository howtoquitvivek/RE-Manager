"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Building2, 
  LogOut, 
  User as UserIcon, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Check,
  Lock,
  Shield,
  Coins,
  Building,
  Sparkles
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { getSidebarItems } from "@/lib/dashboard/registry";
import { WorkspaceType } from "@/types/dashboard";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";
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

interface DynamicSidebarProps {
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

export function DynamicSidebar({ organization, allOrganizations = [] }: DynamicSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, isMobile } = useSidebar();
  const items = getSidebarItems(organization.workspaceType, organization.slug);

  const [isUnlockOpen, setIsUnlockOpen] = React.useState(false);
  const [selectedLockedNiche, setSelectedLockedNiche] = React.useState<WorkspaceType | null>(null);

  // Extract unlocked organizations
  const unlockedOrgs = allOrganizations.map((o) => o.organization);
  
  // Programmatically prefetch all workspace routes and active sidebar item links
  React.useEffect(() => {
    // Prefetch other organization paths
    unlockedOrgs.forEach((org) => {
      if (org.slug !== organization.slug) {
        router.prefetch(`/dashboard/${org.slug}`);
      }
    });

    // Prefetch all current sidebar menu items
    items.forEach((item) => {
      router.prefetch(item.url);
    });
  }, [unlockedOrgs, items, organization.slug, router]);
  
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
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4 group-data-[collapsible=icon]:px-0 justify-center border-b border-border/40 bg-sidebar/50 backdrop-blur-xl transition-all">
        {state === "collapsed" ? (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm ring-1 ring-primary/20">
            <CurrentIcon className="w-4 h-4 text-primary-foreground shrink-0" />
          </div>
        ) : (
          <div className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger render={(props) => (
                <button 
                  className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-border/40 bg-background/40 hover:bg-secondary/40 p-2 font-semibold text-sm tracking-tight text-foreground transition-all duration-200 outline-none"
                  {...props}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center border shrink-0 ${
                      organization.workspaceType === "personal" ? "text-blue-500 bg-blue-500/10 border-blue-500/20" :
                      organization.workspaceType === "rental" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                      organization.workspaceType === "builder" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                      "text-violet-500 bg-violet-500/10 border-violet-500/20"
                    }`}>
                      <CurrentIcon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col items-start overflow-hidden text-left">
                      <span className="text-xs font-bold text-foreground truncate w-[110px]">{organization.name}</span>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground/80 font-bold capitalize">{organization.workspaceType} console</span>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70" />
                </button>
              )} />
              
              <DropdownMenuContent align="start" className="w-60 rounded-2xl p-1.5 border border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl z-50">
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
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-secondary/40 focus:bg-secondary/40 transition-colors"
                        onClick={() => {
                          if (!isActive) {
                            router.push(`/dashboard/${org.slug}`);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded-lg flex items-center justify-center border ${
                            org.workspaceType === "personal" ? "text-blue-500 bg-blue-500/10 border-blue-500/20" :
                            org.workspaceType === "rental" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                            org.workspaceType === "builder" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                            "text-violet-500 bg-violet-500/10 border-violet-500/20"
                          }`}>
                            <OrgIcon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-foreground truncate w-[100px]">{org.name}</span>
                            <span className="text-[9px] text-muted-foreground capitalize">{org.workspaceType}</span>
                          </div>
                        </div>
                        {isActive && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
                
                 {lockedNiches.length > 0 && (
                  <>
                    <DropdownMenuSeparator className="my-1 border-border/40" />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground px-2.5 py-1.5">
                        Expand Ecosystem
                      </DropdownMenuLabel>
                      {lockedNiches.map((niche) => {
                        const NicheIcon = nicheIcons[niche] || Shield;
                        return (
                          <DropdownMenuItem 
                            key={niche} 
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-primary/5 focus:bg-primary/5 text-muted-foreground hover:text-foreground transition-all group"
                            onClick={() => handleUnlockClick(niche)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-lg flex items-center justify-center border border-border/40 bg-secondary/15 text-muted-foreground group-hover:border-primary/20 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                <NicheIcon className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-semibold capitalize">{niche}</span>
                                <span className="text-[9px] text-muted-foreground">Inactive</span>
                              </div>
                            </div>
                            <Lock className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="pt-4 px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-bold px-2 group-data-[collapsible=icon]:hidden mb-2">
            {organization.workspaceType} Console
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive = item.title === "Dashboard" 
                  ? pathname === item.url 
                  : (pathname === item.url || pathname.startsWith(`${item.url}/`));
                  
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      render={(buttonProps) => <Link href={item.url} {...buttonProps} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "h-10 transition-all duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary font-semibold shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                        <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-primary")} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-3 group-data-[collapsible=icon]:p-2 bg-sidebar/50">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton render={(buttonProps) => <Link href={`/dashboard/${organization.slug}/profile`} {...buttonProps} />} tooltip="Profile" className="text-muted-foreground hover:text-foreground h-9">
                <UserIcon className="w-4 h-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Logout" 
              className="text-muted-foreground hover:text-destructive transition-colors h-9"
              onClick={() => logoutAction()}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Sidebar niche activation pricing modal */}
      <UnlockNicheModal 
        isOpen={isUnlockOpen} 
        onClose={() => setIsUnlockOpen(false)} 
        nicheType={selectedLockedNiche} 
      />
    </Sidebar>
  );
}
