import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { redirect } from "next/navigation";
import WorkspaceSettingsClient from "@/components/dashboard/settings/WorkspaceSettingsClient";
import { WorkspaceType } from "@/types/dashboard";

export default async function SettingsPage({
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

  return (
    <WorkspaceSettingsClient 
      organization={{
        name: organization.name,
        slug: organization.slug,
        workspaceType: organization.workspaceType as WorkspaceType,
        subscriptionPlan: organization.subscriptionPlan
      }}
      userId={session.userId}
    />
  );
}
