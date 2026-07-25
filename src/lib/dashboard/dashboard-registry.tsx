import dynamic from "next/dynamic";
import { WorkspaceType } from "@/types/dashboard";

export const DASHBOARD_COMPONENTS: Record<WorkspaceType, React.ComponentType<any>> = {
  personal: dynamic(() => import("@/components/dashboard/personal/PersonalDashboard"), {
    loading: () => <div className="h-[500px] w-full animate-pulse bg-secondary/10 rounded-xl" />
  }),
  rental: dynamic(() => import("@/components/dashboard/rental/RentalDashboard"), {
    loading: () => <div className="h-[500px] w-full animate-pulse bg-secondary/10 rounded-xl" />
  }),
  builder: dynamic(() => import("@/components/dashboard/builder/BuilderDashboard"), {
    loading: () => <div className="h-[500px] w-full animate-pulse bg-secondary/10 rounded-xl" />
  }),
  enterprise: dynamic(() => import("@/components/dashboard/enterprise/EnterpriseDashboard"), {
    loading: () => <div className="h-[500px] w-full animate-pulse bg-secondary/10 rounded-xl" />
  }),
};

export function getDashboardComponent(type: WorkspaceType) {
  return DASHBOARD_COMPONENTS[type] || DASHBOARD_COMPONENTS.personal;
}
