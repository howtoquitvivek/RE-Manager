"use server"

import { createProject, updateProject, deleteProject } from "@/services/project";
import { revalidatePath } from "next/cache";

export async function createProjectAction(orgSlug: string, organizationId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const address = formData.get("address") as string;
  
  if (!name) return { error: "Name is required" };

  try {
    await createProject({
      name,
      description,
      address,
      organizationId,
    });
    
    revalidatePath(`/dashboard/${orgSlug}/projects`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to create project" };
  }
}

export async function updateProjectAction(orgSlug: string, organizationId: string, id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const address = formData.get("address") as string;
  const status = formData.get("status") as string;

  try {
    await updateProject(id, organizationId, {
      name,
      description,
      address,
      status,
    });
    
    revalidatePath(`/dashboard/${orgSlug}/projects`);
    revalidatePath(`/dashboard/${orgSlug}/projects/${id}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update project" };
  }
}

export async function deleteProjectAction(orgSlug: string, organizationId: string, id: string) {
  try {
    await deleteProject(id, organizationId);
    revalidatePath(`/dashboard/${orgSlug}/projects`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete project" };
  }
}

export async function getBuilderDashboardData(organizationId: string) {
  try {
    const { db } = await import("@/lib/db");
    const { projects: projectsTable, construction: constructionTable, towers: towersTable } = await import("@/lib/db/schema");
    const { eq, desc } = await import("drizzle-orm");

    const orgProjects = await db.select().from(projectsTable).where(eq(projectsTable.organizationId, organizationId)).all();
    
    const projectsWithConstruction = await Promise.all(
      orgProjects.map(async (project) => {
        const latestConstruction = await db.select()
          .from(constructionTable)
          .where(eq(constructionTable.projectId, project.id))
          .orderBy(desc(constructionTable.createdAt))
          .limit(1)
          .get();

        const projectTowers = await db.select().from(towersTable).where(eq(towersTable.projectId, project.id)).all();
        
        return {
          id: project.id,
          name: project.name,
          address: project.address || "No Address Provided",
          progress: latestConstruction ? latestConstruction.progress : 0,
          stage: latestConstruction ? latestConstruction.stage : "Planning Phase",
          contractorNotes: latestConstruction ? latestConstruction.contractorNotes : "Awaiting commencement log.",
          towersCount: projectTowers.length,
        };
      })
    );

    return { success: true, projects: projectsWithConstruction };
  } catch (error) {
    console.error("Error fetching builder dashboard data:", error);
    return { success: false, projects: [] };
  }
}
