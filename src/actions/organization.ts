"use server"

import { getSession } from "@/lib/auth/session";
import { createOrganization } from "@/services/organization";
import { db } from "@/lib/db";
import { organizations, memberships } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { WorkspaceType } from "@/types/dashboard";

export async function purchaseNichePlanAction(workspaceType: WorkspaceType, planName: string) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { error: "Not authenticated" };
  }

  // 1. Map workspace type to standardized names
  let orgName = "Personal Workspace";
  if (workspaceType === "rental") orgName = "Rental Portfolio";
  else if (workspaceType === "builder") orgName = "Builder Workspace";
  else if (workspaceType === "enterprise") orgName = "Enterprise Division";

  try {
    // 2. Check if the user already has a workspace of this type
    const existing = await db.select({
      id: organizations.id,
      slug: organizations.slug,
    })
    .from(organizations)
    .innerJoin(memberships, eq(organizations.id, memberships.organizationId))
    .where(and(eq(organizations.workspaceType, workspaceType), eq(memberships.userId, session.userId)))
    .then(res => res ? res[0] : undefined);

    if (existing) {
      return { success: true, redirectUrl: `/dashboard/${existing.slug}` };
    }

    // 3. Create the organization
    const newOrg = await createOrganization(orgName, session.userId, workspaceType);

    if (!newOrg) {
      return { error: "Failed to create workspace organization" };
    }

    // 4. Update the subscription plan for this organization
    await db.update(organizations)
      .set({ subscriptionPlan: planName.toLowerCase() })
      .where(eq(organizations.id, newOrg.id))
      ;

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/${newOrg.slug}`);
    
    return { success: true, redirectUrl: `/dashboard/${newOrg.slug}` };
  } catch (error: any) {
    console.error("Failed to purchase plan:", error);
    return { error: error.message || "Failed to deploy new niche workspace." };
  }
}

export async function upgradeToPremiumAction(currentOrgSlug: string) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { error: "Not authenticated" };
  }

  try {
    // Find the current organization by slug
    const currentOrg = await db.select()
      .from(organizations)
      .innerJoin(memberships, eq(organizations.id, memberships.organizationId))
      .where(and(eq(organizations.slug, currentOrgSlug), eq(memberships.userId, session.userId)))
      .then(res => res ? res[0] : undefined);

    if (!currentOrg) {
      return { error: "Workspace organization not found" };
    }

    const currentOrgId = currentOrg.organizations.id;

    // 1. Update current organization to premium
    await db.update(organizations)
      .set({ subscriptionPlan: "premium" })
      .where(eq(organizations.id, currentOrgId))
      ;

    // 2. Automatically create the other organizations if they don't exist yet
    const existingOrgs = await db.select({
      workspaceType: organizations.workspaceType
    })
    .from(organizations)
    .innerJoin(memberships, eq(organizations.id, memberships.organizationId))
    .where(eq(memberships.userId, session.userId))
    ;

    const existingTypes = existingOrgs.map(o => o.workspaceType);

    const nichesToCreate: { type: WorkspaceType; name: string }[] = [
      { type: "personal", name: "Personal Property" },
      { type: "rental", name: "Rental Portfolio" },
      { type: "builder", name: "Builder Workspace" },
      { type: "enterprise", name: "Enterprise Division" }
    ];

    for (const niche of nichesToCreate) {
      if (!existingTypes.includes(niche.type)) {
        const newOrg = await createOrganization(niche.name, session.userId, niche.type);
        if (newOrg) {
          await db.update(organizations)
            .set({ subscriptionPlan: "premium" })
            .where(eq(organizations.id, newOrg.id))
            ;
        }
      } else {
        // Update existing organizations to premium too so all of them are marked premium
        const org = await db.select()
          .from(organizations)
          .innerJoin(memberships, eq(organizations.id, memberships.organizationId))
          .where(and(eq(organizations.workspaceType, niche.type), eq(memberships.userId, session.userId)))
          .then(res => res ? res[0] : undefined);
        if (org) {
          await db.update(organizations)
            .set({ subscriptionPlan: "premium" })
            .where(eq(organizations.id, org.organizations.id))
            ;
        }
      }
    }

    // Clear caches
    const { clearOrganizationCache } = await import("@/services/organization");
    clearOrganizationCache();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/[orgSlug]", "layout");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to upgrade subscription:", error);
    return { error: error.message || "Failed to upgrade subscription plan." };
  }
}
