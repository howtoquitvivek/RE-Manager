"use server"

import { db } from "@/lib/db";
import { regions, properties, auditLogs, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- REGIONS ---
export async function getRegionsAction(organizationId: string) {
  try {
    const list = await db.select().from(regions).where(eq(regions.organizationId, organizationId));
    
    const enrichedRegions = await Promise.all(
      list.map(async (r) => {
        // Count sites/projects in this organization (representing sites in this region for simplicity)
        const orgProperties = await db.select().from(properties).where(eq(properties.organizationId, organizationId));
        
        return {
          id: r.id,
          name: r.name,
          manager: r.manager,
          sites: `${orgProperties.length} Assets Mapped`,
          properties: `${orgProperties.length} Units`,
          status: r.status
        };
      })
    );

    return { success: true, regions: enrichedRegions };
  } catch (error) {
    console.error("Error fetching regions:", error);
    return { success: false, regions: [] };
  }
}

export async function createRegionAction(
  orgSlug: string, 
  organizationId: string, 
  data: { name: string; manager: string; status: string }
) {
  try {
    await db.insert(regions).values({
      name: data.name,
      manager: data.manager,
      status: data.status,
      organizationId,
    });
    revalidatePath(`/dashboard/${orgSlug}/regions`);
    return { success: true };
  } catch (error) {
    console.error("Error creating region:", error);
    return { error: "Failed to create region" };
  }
}

// --- COMMERCIAL UNITS ---
export async function getCommercialUnitsAction(organizationId: string) {
  try {
    const list = await db.select()
      .from(properties)
      .where(
        and(
          eq(properties.organizationId, organizationId),
          eq(properties.propertyType, "commercial")
        )
      )
      ;

    const formattedCommercial = list.map(p => ({
      id: p.id,
      name: p.name,
      tower: p.location || "Horizon Tech Park",
      area: p.carpetArea ? `${p.carpetArea.toLocaleString()} sq.ft` : "—",
      tenant: p.description || "—",
      rent: p.rentAmount ? `$${p.rentAmount.toLocaleString()}/mo` : "Price on request",
      status: p.status || "Vacant"
    }));

    return { success: true, commercial: formattedCommercial };
  } catch (error) {
    console.error("Error fetching commercial units:", error);
    return { success: false, commercial: [] };
  }
}

export async function createCommercialUnitAction(
  orgSlug: string, 
  organizationId: string, 
  data: { name: string; tower: string; area: number; tenant?: string; rent: number; status?: string }
) {
  try {
    await db.insert(properties).values({
      name: data.name,
      location: data.tower,
      carpetArea: data.area,
      description: data.tenant || null,
      rentAmount: data.rent,
      status: data.status || "Vacant",
      propertyType: "commercial",
      organizationId,
    });
    revalidatePath(`/dashboard/${orgSlug}/commercial`);
    return { success: true };
  } catch (error) {
    console.error("Error creating commercial unit:", error);
    return { error: "Failed to create commercial unit" };
  }
}

// --- LUXURY ASSETS ---
export async function getLuxuryPortfolioAction(organizationId: string) {
  try {
    const list = await db.select()
      .from(properties)
      .where(
        and(
          eq(properties.organizationId, organizationId),
          eq(properties.propertyType, "luxury")
        )
      )
      ;

    const formattedLuxury = list.map(p => ({
      id: p.id,
      name: p.name,
      location: p.address || p.location || "NCR Elite Sector",
      size: p.carpetArea ? `${p.carpetArea.toLocaleString()} sq.ft` : "—",
      value: p.estimatedValue ? `$${(p.estimatedValue / 1000000).toFixed(1)}M` : "Price on request",
      status: p.status || "Available"
    }));

    return { success: true, luxury: formattedLuxury };
  } catch (error) {
    console.error("Error fetching luxury portfolio:", error);
    return { success: false, luxury: [] };
  }
}

export async function createLuxuryAssetAction(
  orgSlug: string, 
  organizationId: string, 
  data: { name: string; location: string; size: number; value: number; status?: string }
) {
  try {
    await db.insert(properties).values({
      name: data.name,
      address: data.location,
      carpetArea: data.size,
      estimatedValue: data.value,
      status: data.status || "Available",
      propertyType: "luxury",
      organizationId,
    });
    revalidatePath(`/dashboard/${orgSlug}/luxury`);
    return { success: true };
  } catch (error) {
    console.error("Error creating luxury asset:", error);
    return { error: "Failed to create luxury asset" };
  }
}

// --- AUDIT LOGS ---
export async function getAuditLogsAction(organizationId: string) {
  try {
    const list = await db.select()
      .from(auditLogs)
      .where(eq(auditLogs.organizationId, organizationId))
      .orderBy(desc(auditLogs.createdAt))
      ;

    const enrichedLogs = await Promise.all(
      list.map(async (l) => {
        const user = await db.select().from(users).where(eq(users.id, l.userId)).limit(1).then(res => res ? res[0] : undefined);
        return {
          id: l.id,
          action: l.action,
          entityType: l.entityType,
          details: l.details || "—",
          user: user ? user.name || user.email : "System",
          createdAt: l.createdAt
        };
      })
    );

    return { success: true, logs: enrichedLogs };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return { success: false, logs: [] };
  }
}

export async function logAuditEventAction(
  organizationId: string, 
  userId: string, 
  action: string, 
  entityType: string, 
  entityId: string, 
  details?: string
) {
  try {
    await db.insert(auditLogs).values({
      action,
      entityType,
      entityId,
      userId,
      organizationId,
      details: details || null,
    });
    return { success: true };
  } catch (error) {
    console.error("Error logging audit event:", error);
    return { success: false };
  }
}
