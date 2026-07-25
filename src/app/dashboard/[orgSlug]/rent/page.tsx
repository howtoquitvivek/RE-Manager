import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { redirect } from "next/navigation";
import { getRentInvoicesAction, getTenantsAction } from "@/actions/rental";
import { getOrganizationProperties } from "@/services/property";
import RentClient from "./RentClient";

export default async function RentPage({
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

  const invoicesRes = await getRentInvoicesAction(organization.id);
  const invoices = invoicesRes.success ? invoicesRes.invoices : [];

  const tenantsRes = await getTenantsAction(organization.id);
  const tenants = tenantsRes.success ? tenantsRes.tenants.map(t => ({ name: t.name })) : [];

  const propertiesEntries = await getOrganizationProperties(organization.id);
  const properties = propertiesEntries.map(e => ({ name: e.property.name }));

  return (
    <RentClient 
      initialInvoices={invoices}
      tenants={tenants}
      properties={properties}
      orgSlug={orgSlug}
      orgId={organization.id}
    />
  );
}
