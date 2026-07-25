import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { redirect } from "next/navigation";
import { getMaintenanceTicketsAction } from "@/actions/rental";
import { getOrganizationProperties } from "@/services/property";
import MaintenanceClient from "./MaintenanceClient";

export default async function MaintenancePage({
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

  const ticketsRes = await getMaintenanceTicketsAction(organization.id);
  const tickets = ticketsRes.success ? ticketsRes.tickets : [];

  const propertiesEntries = await getOrganizationProperties(organization.id);
  const properties = propertiesEntries.map(e => ({ name: e.property.name }));

  return (
    <MaintenanceClient 
      initialTickets={tickets}
      properties={properties}
      orgSlug={orgSlug}
      orgId={organization.id}
    />
  );
}
