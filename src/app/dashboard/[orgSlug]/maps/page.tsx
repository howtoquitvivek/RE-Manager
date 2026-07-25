import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { getOrganizationProperties } from "@/services/property";
import { getPersonalProperties } from "@/actions/personal";
import { redirect } from "next/navigation";
import PersonalMapWrapper from "@/components/dashboard/personal/PersonalMapWrapper";

export default async function MapsPage({
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

  let properties: any[] = [];
  if (workspaceType === "personal") {
    properties = await getPersonalProperties(session.userId, organization.id);
  } else {
    const entries = await getOrganizationProperties(organization.id);
    properties = entries.map(e => e.property);
  }

  return (
    <div className="h-[calc(100vh-12rem)] w-full rounded-3xl overflow-hidden border border-border/40 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PersonalMapWrapper 
        properties={properties} 
        workspaceType={workspaceType} 
        orgSlug={orgSlug} 
      />
    </div>
  );
}
