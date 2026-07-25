import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { redirect } from "next/navigation";
import { getDashboardComponent } from "@/lib/dashboard/dashboard-registry";
import { WorkspaceType } from "@/types/dashboard";

export default async function DashboardPage({
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
  if (!organization) redirect("/dashboard");

  const workspaceType = organization.workspaceType as WorkspaceType;
  const DashboardComponent = getDashboardComponent(workspaceType);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DashboardComponent 
        userId={session.userId} 
        orgId={organization.id} 
        orgSlug={orgSlug} 
      />
    </div>
  );
}
