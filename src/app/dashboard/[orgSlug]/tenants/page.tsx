import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { redirect } from "next/navigation";
import { getTenantsAction } from "@/actions/rental";
import TenantsClient from "./TenantsClient";

export default async function TenantsPage({
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

  const tenantsRes = await getTenantsAction(organization.id);
  const tenants = tenantsRes.success ? tenantsRes.tenants : [];

  return (
    <TenantsClient 
      initialTenants={tenants} 
      orgSlug={orgSlug} 
      orgId={organization.id} 
    />
  );
}
