import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { redirect } from "next/navigation";
import { getLeasesAction, getTenantsAction } from "@/actions/rental";
import { getOrganizationProperties } from "@/services/property";
import LeasesClient from "./LeasesClient";

export default async function LeasesPage({
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

  const leasesRes = await getLeasesAction(organization.id);
  const leases = leasesRes.success ? leasesRes.leases : [];

  const tenantsRes = await getTenantsAction(organization.id);
  const tenants = tenantsRes.success ? tenantsRes.tenants.map(t => ({ id: t.id, name: t.name })) : [];

  const propertiesEntries = await getOrganizationProperties(organization.id);
  const properties = propertiesEntries.map(e => ({ id: e.property.id, name: e.property.name }));

  return (
    <LeasesClient 
      initialLeases={leases}
      tenants={tenants}
      properties={properties}
      orgSlug={orgSlug}
    />
  );
}
