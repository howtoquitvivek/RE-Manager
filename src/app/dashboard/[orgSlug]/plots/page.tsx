import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { getPlotsAction } from "@/actions/builder";
import { redirect } from "next/navigation";
import PlotsClient from "./PlotsClient";

export default async function PlotsPage({
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

  const plotsRes = await getPlotsAction(organization.id);
  const plots = plotsRes.success ? plotsRes.plots : [];

  return (
    <PlotsClient 
      initialPlots={plots} 
      orgSlug={orgSlug}
      orgId={organization.id}
    />
  );
}
