export type WorkspaceType = 'personal' | 'rental' | 'builder' | 'enterprise';

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  config?: any;
}

export interface WorkspaceConfig {
  type: WorkspaceType;
  features: string[];
  sidebarItems: SidebarNavItem[];
  dashboardWidgets: DashboardWidget[];
}

export interface SidebarNavItem {
  title: string;
  url: string;
  icon: any; // Lucide icon
  items?: SidebarNavItem[];
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  limits: {
    properties?: number;
    aiCredits?: number;
    storage?: string;
  };
}
