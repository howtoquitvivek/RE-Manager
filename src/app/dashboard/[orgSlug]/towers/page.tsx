import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { getOrganizationProjects } from "@/services/project";
import { getTowersAction } from "@/actions/builder";
import { redirect } from "next/navigation";
import TowersClient from "./TowersClient";

export default async function TowersPage({
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

  const towersRes = await getTowersAction(organization.id);
  const towers = towersRes.success ? towersRes.towers : [];

  const projects = await getOrganizationProjects(organization.id);
  const formattedProjects = projects.map(p => ({ id: p.id, name: p.name }));

  return (
    <TowersClient 
      initialTowers={towers} 
      projects={formattedProjects}
      orgSlug={orgSlug}
    />
  );
}
