import { db } from "@/lib/db";
import { properties, projects } from "@/lib/db/schema";
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

export function clearPropertyCache() {
  cacheStore.clear();
}

export const getProjectProperties = cache(async (projectId: string) => {
  const cacheKey = `project-props-${projectId}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const result = await db.select()
    .from(properties)
    .where(eq(properties.projectId, projectId))
    ;

  setCached(cacheKey, result);
  return result;
});

export const getOrganizationProperties = cache(async (organizationId: string) => {
  const cacheKey = `org-props-${organizationId}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const result = await db.select({
    property: properties
  })
  .from(properties)
  .innerJoin(projects, eq(properties.projectId, projects.id))
  .where(eq(projects.organizationId, organizationId))
  ;

  setCached(cacheKey, result);
  return result;
});

export const getPropertyById = cache(async (id: string) => {
  const cacheKey = `prop-id-${id}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  const result = await db.select()
    .from(properties)
    .where(eq(properties.id, id))
    .then(res => res ? res[0] : undefined);

  setCached(cacheKey, result);
  return result;
});

export async function createProperty(data: {
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  projectId: string;
  organizationId: string;
}) {
  const [newProperty] = await db.insert(properties).values({
    name: data.title,
    title: data.title,
    description: data.description,
    address: data.location,
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    estimatedValue: data.price,
    price: data.price,
    projectId: data.projectId,
    organizationId: data.organizationId,
    status: "ACTIVE",
  }).returning();
  
  clearPropertyCache();
  return newProperty;
}

export async function updateProperty(id: string, data: Partial<{
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  price: number;
  status: string;
}>) {
  const [updatedProperty] = await db.update(properties)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(properties.id, id))
    .returning();
    
  clearPropertyCache();
  return updatedProperty;
}

export async function deleteProperty(id: string) {
  const result = await db.delete(properties)
    .where(eq(properties.id, id))
    .returning();
    
  clearPropertyCache();
  return result;
}
