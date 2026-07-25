"use server";

import { db } from "@/lib/db";
import { properties, documents, activities, vaultSettings, organizations } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { 
  PersonalProperty, 
  NewPersonalProperty, 
  NewPropertyDocument, 
  ActivityType,
  DashboardStats 
} from "@/types/personal";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { summarizeDocument } from "@/lib/ai/gemini";
import { clearPropertyCache } from "@/services/property";
import { clearProjectCache } from "@/services/project";
import { clearOrganizationCache } from "@/services/organization";

// --- Activity Logging ---
export async function logActivity(userId: string, activityType: ActivityType, propertyId?: string, details?: any) {
  await db.insert(activities).values({
    userId,
    propertyId,
    activityType,
    details: details ? JSON.stringify(details) : null,
  });
}

// --- Property Actions ---
export async function createPersonalProperty(data: NewPersonalProperty) {
  const [newProperty] = await db.insert(properties).values(data).returning();
  
  await logActivity(data.userId!, "property_created", newProperty.id, { name: newProperty.name });
  
  clearPropertyCache();
  clearProjectCache();
  clearOrganizationCache();
  
  revalidatePath("/dashboard/[orgSlug]/properties", "page");
  revalidatePath("/dashboard/[orgSlug]", "page");
  return newProperty;
}

export async function getPersonalProperties(userId: string, orgId: string) {
  return await db.query.properties.findMany({
    where: and(eq(properties.userId, userId), eq(properties.organizationId, orgId)),
    orderBy: [desc(properties.createdAt)],
  });
}

// --- Vault Actions ---
export async function setupVaultPassword(userId: string, password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  await db.insert(vaultSettings).values({
    userId,
    vaultPasswordHash: hash,
  }).onConflictDoUpdate({
    target: vaultSettings.userId,
    set: { vaultPasswordHash: hash, updatedAt: sql`CURRENT_TIMESTAMP` },
  });

  await logActivity(userId, "vault_access", undefined, { action: "password_setup" });
  clearPropertyCache();
  return { success: true };
}

export async function verifyVaultPassword(userId: string, password: string) {
  const settings = await db.query.vaultSettings.findFirst({
    where: eq(vaultSettings.userId, userId),
  });

  if (!settings) return { success: false, error: "No vault password set." };

  const isValid = await bcrypt.compare(password, settings.vaultPasswordHash);
  
  if (isValid) {
    await logActivity(userId, "vault_access", undefined, { action: "password_verified" });
  }

  return { success: isValid };
}

export async function checkVaultSetup(userId: string) {
  const settings = await db.query.vaultSettings.findFirst({
    where: eq(vaultSettings.userId, userId),
  });
  return !!settings;
}

// --- Document Actions ---
export async function uploadPropertyDocument(data: NewPropertyDocument, textContent?: string) {
  let aiSummary = null;
  if (textContent && data.type === "application/pdf") {
    aiSummary = await summarizeDocument(textContent);
  }

  const [doc] = await db.insert(documents).values({
    ...data,
    aiSummary,
  }).returning();

  const property = await db.query.properties.findFirst({
    where: eq(properties.id, data.propertyId),
  });

  await logActivity(property!.userId!, "document_uploaded", data.propertyId, { name: data.name });

  clearPropertyCache();

  revalidatePath("/dashboard/[orgSlug]/documents", "page");
  return doc;
}

// --- Dashboard Stats ---
export async function getDashboardStats(userId: string, orgId: string): Promise<DashboardStats> {
  const userProperties = await getPersonalProperties(userId, orgId);
  const totalValue = userProperties.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);

  const recentActs = await db.query.activities.findMany({
    where: eq(activities.userId, userId),
    limit: 10,
    orderBy: [desc(activities.createdAt)],
  });

  const propertyIds = userProperties.map(p => p.id);
  
  const docs = propertyIds.length > 0 ? await db.query.documents.findMany({
    where: sql`${documents.propertyId} IN (${sql.join(propertyIds, sql`,`)})`,
    orderBy: [desc(documents.createdAt)],
  }) : [];

  const missingDocs = userProperties.filter(p => {
    return !docs.some(d => d.propertyId === p.id);
  });

  return {
    totalProperties: userProperties.length,
    netEstimatedValue: totalValue,
    recentActivity: recentActs as any[],
    propertiesMissingDocs: missingDocs,
    recentlyUploadedDocs: docs.slice(0, 5),
  };
}
