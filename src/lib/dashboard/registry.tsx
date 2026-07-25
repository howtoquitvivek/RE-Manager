import { 
  LayoutDashboard, 
  Building2, 
  Files, 
  Map as MapIcon, 
  Users, 
  Key, 
  Wrench, 
  Sparkles, 
  TrendingUp,
  History,
  Briefcase,
  Layers,
  FileCheck,
  Package,
  Hammer,
  Globe
} from "lucide-react";
import { SidebarNavItem, WorkspaceType } from "@/types/dashboard";

export const SIDEBAR_ITEMS: Record<WorkspaceType, SidebarNavItem[]> = {
  personal: [
    { title: "Dashboard", url: "/dashboard/[slug]", icon: LayoutDashboard },
    { title: "Property Listing", url: "/dashboard/[slug]/properties", icon: Building2 },
    { title: "Document Vault", url: "/dashboard/[slug]/documents", icon: Files },
    { title: "Maps", url: "/dashboard/[slug]/maps", icon: MapIcon },
    { title: "Settings", url: "/dashboard/[slug]/settings", icon: Briefcase },
  ],

  rental: [
    { title: "Dashboard", url: "/dashboard/[slug]", icon: LayoutDashboard },
    { title: "Properties", url: "/dashboard/[slug]/properties", icon: Building2 },
    { title: "Tenants", url: "/dashboard/[slug]/tenants", icon: Users },
    { title: "Leases", url: "/dashboard/[slug]/leases", icon: Key },
    { title: "Rent Tracking", url: "/dashboard/[slug]/rent", icon: TrendingUp },
    { title: "Maintenance", url: "/dashboard/[slug]/maintenance", icon: Wrench },
    { title: "Document Vault", url: "/dashboard/[slug]/documents", icon: Files },
    { title: "Maps", url: "/dashboard/[slug]/maps", icon: MapIcon },
    { title: "Settings", url: "/dashboard/[slug]/settings", icon: Briefcase },
  ],

  builder: [
    { title: "Dashboard", url: "/dashboard/[slug]", icon: LayoutDashboard },
    { title: "Projects", url: "/dashboard/[slug]/projects", icon: Briefcase },
    { title: "Towers", url: "/dashboard/[slug]/towers", icon: Building2 },
    { title: "Plots", url: "/dashboard/[slug]/plots", icon: MapIcon },
    { title: "Apartments", url: "/dashboard/[slug]/apartments", icon: Layers },
    { title: "Construction", url: "/dashboard/[slug]/construction", icon: Hammer },
    { title: "Documents", url: "/dashboard/[slug]/documents", icon: Files },
    { title: "Teams", url: "/dashboard/[slug]/teams", icon: Users },
    { title: "Maps", url: "/dashboard/[slug]/maps", icon: MapIcon },
    { title: "Analytics", url: "/dashboard/[slug]/analytics", icon: TrendingUp },
    { title: "Settings", url: "/dashboard/[slug]/settings", icon: Briefcase },
  ],

  enterprise: [
    { title: "Mission Control", url: "/dashboard/[slug]", icon: LayoutDashboard },
    { title: "Regions", url: "/dashboard/[slug]/regions", icon: Globe },
    { title: "Projects", url: "/dashboard/[slug]/projects", icon: Briefcase },
    { title: "Inventory", url: "/dashboard/[slug]/inventory", icon: Package },
    { title: "Towers", url: "/dashboard/[slug]/towers", icon: Building2 },
    { title: "Commercial Units", url: "/dashboard/[slug]/commercial", icon: Building2 },
    { title: "Luxury Inventory", url: "/dashboard/[slug]/luxury", icon: Sparkles },
    { title: "Documents", url: "/dashboard/[slug]/documents", icon: Files },
    { title: "Approvals Desk", url: "/dashboard/[slug]/approvals", icon: FileCheck },
    { title: "Teams & RBAC", url: "/dashboard/[slug]/teams", icon: Users },
    { title: "Analytics", url: "/dashboard/[slug]/analytics", icon: TrendingUp },
    { title: "Audit Logs", url: "/dashboard/[slug]/audit", icon: History },
    { title: "GIS Overview Map", url: "/dashboard/[slug]/maps", icon: MapIcon },
    { title: "Settings", url: "/dashboard/[slug]/settings", icon: Briefcase },
  ],
};

export function getSidebarItems(type: WorkspaceType, slug: string): SidebarNavItem[] {
  const items = SIDEBAR_ITEMS[type] || SIDEBAR_ITEMS.personal;
  return items.map(item => ({
    ...item,
    url: item.url.replace("[slug]", slug)
  }));
}

export function isRouteAllowed(type: WorkspaceType, slug: string, pathname: string): boolean {
  const cleanPath = pathname.toLowerCase();
  
  // Core routes always allowed
  if (cleanPath === "/dashboard" || cleanPath === "/dashboard/") return true;
  if (cleanPath.startsWith(`/dashboard/${slug}/profile`)) return true;

  const items = SIDEBAR_ITEMS[type] || [];
  
  return items.some(item => {
    const allowedUrl = item.url.replace("[slug]", slug).toLowerCase();
    
    // Match exact URL or subpaths (with trailing slash constraint to avoid suffix hijacking)
    if (cleanPath === allowedUrl) return true;
    if (cleanPath.startsWith(allowedUrl + "/")) return true;
    return false;
  });
}
