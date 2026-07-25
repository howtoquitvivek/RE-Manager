import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { getOrganizationProjects } from "@/services/project";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage({
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

  const projects = await getOrganizationProjects(organization.id);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your real estate developments and projects.</p>
        </div>
        <Link href={`/dashboard/${orgSlug}/projects/new`} className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed border border-border/40 flex flex-col items-center justify-center p-12 text-center bg-card/40 backdrop-blur-md shadow-subtle hover:shadow-premium transition-all duration-300">
          <div className="bg-secondary/50 p-4 rounded-full mb-4 group-hover:scale-105 transition-transform duration-300">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl text-foreground">No projects found</CardTitle>
          <CardDescription className="max-w-xs mx-auto mt-2 text-muted-foreground">
            Get started by creating your first real estate project.
          </CardDescription>
          <Link href={`/dashboard/${orgSlug}/projects/new`} className={buttonVariants({ variant: "outline", className: "mt-6" })}>
              Create Project
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/${orgSlug}/projects/${project.id}`}>
              <Card className="bg-card/40 backdrop-blur-md shadow-subtle border border-border/40 hover:shadow-premium transition-all duration-300 h-full group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="bg-secondary/50 p-2 rounded-lg group-hover:scale-105 transition-transform duration-200">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      project.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-secondary text-muted-foreground border border-border/40'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-foreground group-hover:text-primary transition-colors">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">{project.description || "No description provided."}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-end text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    View details <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
