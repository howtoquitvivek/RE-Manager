"use server"

import { db } from "@/lib/db";
import { towers, apartments, properties, construction, approvals, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- TOWERS ---
export async function getTowersAction(organizationId: string) {
  try {
    // Find all projects in this organization
    const orgProjects = await db.select().from(projects).where(eq(projects.organizationId, organizationId)).all();
    const projIds = orgProjects.map(p => p.id);
    
    if (projIds.length === 0) return { success: true, towers: [] };
    
    const list = await db.select().from(towers).all();
    const filteredList = list.filter(t => projIds.includes(t.projectId));

    const enrichedTowers = await Promise.all(
      filteredList.map(async (t) => {
        const proj = orgProjects.find(p => p.id === t.projectId);
        
        // Count apartments in this tower
        const apts = await db.select().from(apartments).where(eq(apartments.towerId, t.id)).all();
        
        // Find construction progress for this tower or default to project construction
        const progressLog = await db.select()
          .from(construction)
          .where(eq(construction.projectId, t.projectId))
          .limit(1)
          .get();

        return {
          id: t.id,
          name: `${t.name} — ${proj ? proj.name : "Unknown Project"}`,
          floors: t.floors,
          progress: progressLog ? progressLog.progress : 0,
          stage: progressLog ? progressLog.stage : "Planning Phase",
          contractor: progressLog && progressLog.contractorNotes ? progressLog.contractorNotes : "DLF Builders Inc.",
          apartments: `${apts.length} Units`
        };
      })
    );

    return { success: true, towers: enrichedTowers };
  } catch (error) {
    console.error("Error fetching towers:", error);
    return { success: false, towers: [] };
  }
}

export async function createTowerAction(orgSlug: string, data: { name: string; projectId: string; floors: number; status?: string }) {
  try {
    await db.insert(towers).values({
      name: data.name,
      projectId: data.projectId,
      floors: data.floors,
      status: data.status || "planning",
    });
    revalidatePath(`/dashboard/${orgSlug}/towers`);
    return { success: true };
  } catch (error) {
    console.error("Error creating tower:", error);
    return { error: "Failed to create tower" };
  }
}

export async function deleteTowerAction(orgSlug: string, id: string) {
  try {
    await db.delete(towers).where(eq(towers.id, id));
    revalidatePath(`/dashboard/${orgSlug}/towers`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting tower:", error);
    return { error: "Failed to delete tower" };
  }
}

// --- APARTMENTS ---
export async function getApartmentsAction(organizationId: string) {
  try {
    const orgProjects = await db.select().from(projects).where(eq(projects.organizationId, organizationId)).all();
    const projIds = orgProjects.map(p => p.id);
    
    if (projIds.length === 0) return { success: true, apartments: [] };
    
    const allTowers = await db.select().from(towers).all();
    const filteredTowers = allTowers.filter(t => projIds.includes(t.projectId));
    const towerIds = filteredTowers.map(t => t.id);
    
    if (towerIds.length === 0) return { success: true, apartments: [] };

    const list = await db.select().from(apartments).all();
    const filteredList = list.filter(a => towerIds.includes(a.towerId));

    const enrichedApartments = filteredList.map(a => {
      const tower = filteredTowers.find(t => t.id === a.towerId);
      const proj = tower ? orgProjects.find(p => p.id === tower.projectId) : null;

      return {
        id: a.id,
        flatNumber: a.flatNumber,
        tower: tower ? `${tower.name} — ${proj ? proj.name : "Unknown Project"}` : "Unknown Tower",
        bhkType: a.bhkType,
        carpetArea: `${a.carpetArea.toLocaleString()} sq.ft`,
        price: `$${a.price.toLocaleString()}`,
        status: a.status
      };
    });

    return { success: true, apartments: enrichedApartments };
  } catch (error) {
    console.error("Error fetching apartments:", error);
    return { success: false, apartments: [] };
  }
}

export async function createApartmentAction(orgSlug: string, data: { flatNumber: string; towerId: string; bhkType: string; carpetArea: number; price: number; status?: string }) {
  try {
    await db.insert(apartments).values({
      flatNumber: data.flatNumber,
      towerId: data.towerId,
      bhkType: data.bhkType,
      carpetArea: data.carpetArea,
      price: data.price,
      status: data.status || "available",
    });
    revalidatePath(`/dashboard/${orgSlug}/apartments`);
    return { success: true };
  } catch (error) {
    console.error("Error creating apartment:", error);
    return { error: "Failed to create apartment" };
  }
}

export async function deleteApartmentAction(orgSlug: string, id: string) {
  try {
    await db.delete(apartments).where(eq(apartments.id, id));
    revalidatePath(`/dashboard/${orgSlug}/apartments`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting apartment:", error);
    return { error: "Failed to delete apartment" };
  }
}

// --- PLOTS ---
export async function getPlotsAction(organizationId: string) {
  try {
    const list = await db.select()
      .from(properties)
      .where(
        and(
          eq(properties.organizationId, organizationId),
          eq(properties.propertyType, "plot")
        )
      )
      .all();

    const formattedPlots = list.map(p => ({
      id: p.id,
      plotNumber: p.plotNumber || "Plot N/A",
      dimensions: p.dimensions || "N/A",
      price: p.estimatedValue ? `$${p.estimatedValue.toLocaleString()}` : "Price on request",
      status: p.status === "ACTIVE" ? "Available" : "Booked"
    }));

    return { success: true, plots: formattedPlots };
  } catch (error) {
    console.error("Error fetching plots:", error);
    return { success: false, plots: [] };
  }
}

export async function createPlotAction(
  orgSlug: string, 
  organizationId: string, 
  data: { plotNumber: string; dimensions: string; price: number; status?: string; name: string }
) {
  try {
    await db.insert(properties).values({
      name: data.name,
      plotNumber: data.plotNumber,
      dimensions: data.dimensions,
      estimatedValue: data.price,
      status: data.status || "ACTIVE",
      propertyType: "plot",
      organizationId,
    });
    revalidatePath(`/dashboard/${orgSlug}/plots`);
    return { success: true };
  } catch (error) {
    console.error("Error creating plot:", error);
    return { error: "Failed to create plot" };
  }
}

export async function deletePlotAction(orgSlug: string, id: string) {
  try {
    await db.delete(properties).where(eq(properties.id, id));
    revalidatePath(`/dashboard/${orgSlug}/plots`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting plot:", error);
    return { error: "Failed to delete plot" };
  }
}

// --- CONSTRUCTION MILESTONES ---
export async function getConstructionMilestonesAction(organizationId: string) {
  try {
    const orgProjects = await db.select().from(projects).where(eq(projects.organizationId, organizationId)).all();
    const projIds = orgProjects.map(p => p.id);
    
    if (projIds.length === 0) return { success: true, milestones: [] };

    const list = await db.select().from(construction).all();
    const filteredList = list.filter(c => projIds.includes(c.projectId));

    const enrichedMilestones = filteredList.map(c => {
      const proj = orgProjects.find(p => p.id === c.projectId);
      return {
        id: c.id,
        project: proj ? proj.name : "Unknown Project",
        stage: c.stage,
        progress: c.progress,
        contractor: c.contractorNotes || "In-house Logistics",
        updatedAt: c.updatedAt
      };
    });

    return { success: true, milestones: enrichedMilestones };
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return { success: false, milestones: [] };
  }
}

export async function createConstructionMilestoneAction(
  orgSlug: string, 
  data: { projectId: string; stage: string; progress: number; contractorNotes?: string }
) {
  try {
    await db.insert(construction).values({
      projectId: data.projectId,
      stage: data.stage,
      progress: data.progress,
      contractorNotes: data.contractorNotes || null,
    });
    revalidatePath(`/dashboard/${orgSlug}/construction`);
    return { success: true };
  } catch (error) {
    console.error("Error creating milestone:", error);
    return { error: "Failed to create construction milestone" };
  }
}

// --- APPROVALS ---
export async function getApprovalsAction(organizationId: string) {
  try {
    const orgProjects = await db.select().from(projects).where(eq(projects.organizationId, organizationId)).all();
    const projIds = orgProjects.map(p => p.id);
    
    if (projIds.length === 0) return { success: true, approvals: [] };

    const list = await db.select().from(approvals).all();
    const filteredList = list.filter(a => projIds.includes(a.projectId));

    const enrichedApprovals = filteredList.map(a => {
      const proj = orgProjects.find(p => p.id === a.projectId);
      return {
        id: a.id,
        title: a.title,
        type: a.type,
        status: a.status, // pending, under_review, approved, rejected
        project: proj ? proj.name : "Unknown Project",
        reviewedBy: a.reviewedBy || "Pending Review",
        createdAt: a.createdAt
      };
    });

    return { success: true, approvals: enrichedApprovals };
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return { success: false, approvals: [] };
  }
}

export async function createApprovalAction(
  orgSlug: string, 
  data: { title: string; type: string; status?: string; projectId: string; reviewedBy?: string }
) {
  try {
    await db.insert(approvals).values({
      title: data.title,
      type: data.type,
      status: data.status || "pending",
      projectId: data.projectId,
      reviewedBy: data.reviewedBy || null,
    });
    revalidatePath(`/dashboard/${orgSlug}/approvals`);
    return { success: true };
  } catch (error) {
    console.error("Error creating approval:", error);
    return { error: "Failed to create approval request" };
  }
}
