import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { cache } from "react";

// Simple in-memory cache store to optimize performance and prevent repeated DB hits
const cacheStore = new Map<string, { data: any; timestamp: number }>();
const TTL = 10000; // 10 seconds

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

export function clearProjectCache() {
  cacheStore.clear();
}

export const getOrganizationProjects = cache(async (organizationId: string) => {
  const cacheKey = `org-projects-${organizationId}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const result = await db.select()
    .from(projects)
    .where(eq(projects.organizationId, organizationId))
    ;

  setCached(cacheKey, result);
  return result;
});

export const getProjectById = cache(async (id: string, organizationId: string) => {
  const cacheKey = `project-id-${id}-${organizationId}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  const result = await db.select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.organizationId, organizationId)))
    .then(res => res ? res[0] : undefined);

  setCached(cacheKey, result);
  return result;
});

export async function createProject(data: {
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  organizationId: string;
}) {
  const [newProject] = await db.insert(projects).values({
    ...data,
    status: "ACTIVE",
  }).returning();
  
  clearProjectCache();
  return newProject;
}

export async function updateProject(id: string, organizationId: string, data: Partial<{
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
}>) {
  const [updatedProject] = await db.update(projects)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(and(eq(projects.id, id), eq(projects.organizationId, organizationId)))
    .returning();
    
  clearProjectCache();
  return updatedProject;
}

export async function deleteProject(id: string, organizationId: string) {
  const result = await db.delete(projects)
    .where(and(eq(projects.id, id), eq(projects.organizationId, organizationId)))
    .returning();
    
  clearProjectCache();
  return result;
}
