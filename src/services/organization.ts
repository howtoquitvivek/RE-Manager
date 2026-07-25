import { db } from "@/lib/db";
import { organizations, memberships } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { cache } from "react";

// Simple in-memory cache store to optimize performance and prevent repeated DB hits
const cacheStore = new Map<string, { data: any; timestamp: number }>();
const TTL = 15000; // 15 seconds

function getCached<T>(key: string): T | null {
  const entry = cacheStore.get(key);
  if (entry && Date.now() - entry.timestamp < TTL) {
    return entry.data as T;
  }
  return null;
}

function setCached(key: string, data: any) {
  cacheStore.set(key, { data, timestamp: Date.now() });
}

export function clearOrganizationCache() {
  cacheStore.clear();
}

export const getUserOrganizations = cache(async (userId: string) => {
  const cacheKey = `user-orgs-${userId}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const result = await db.select({
    organization: organizations
  })
  .from(organizations)
  .innerJoin(memberships, eq(organizations.id, memberships.organizationId))
  .where(eq(memberships.userId, userId))
  .all();

  setCached(cacheKey, result);
  return result;
});

export const getOrganizationBySlug = cache(async (slug: string, userId: string) => {
  const cacheKey = `org-slug-${slug}-${userId}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  const result = await db.select({
    organization: organizations
  })
  .from(organizations)
  .innerJoin(memberships, eq(organizations.id, memberships.organizationId))
  .where(and(eq(organizations.slug, slug), eq(memberships.userId, userId)))
  .get();
  
  const org = result?.organization || null;
  setCached(cacheKey, org);
  return org;
});

export async function createOrganization(name: string, userId: string, workspaceType: "personal" | "rental" | "builder" | "enterprise" = "personal") {
  // Create a unique slug based on workspace type and user ID to avoid global collisions
  const slug = workspaceType === "personal" 
    ? `personal-${userId.substring(0, 8)}` 
    : `${name.toLowerCase().replace(/\s+/g, "-")}-${userId.substring(0, 4)}`;
  
  // Check if this organization already exists for the user
  const existing = await db.select()
    .from(organizations)
    .innerJoin(memberships, eq(organizations.id, memberships.organizationId))
    .where(and(eq(organizations.slug, slug), eq(memberships.userId, userId)))
    .get();

  if (existing) return existing.organizations;

  return await db.transaction(async (tx) => {
    const newOrg = await tx.insert(organizations).values({
      name,
      slug,
      workspaceType,
    }).returning().get();

    await tx.insert(memberships).values({
      userId,
      organizationId: newOrg.id,
      role: "OWNER",
    }).run();

    clearOrganizationCache();
    return newOrg;
  });
}
