import { db } from "@/lib/db";
import { users, organizations, memberships } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createOrganization, getUserOrganizations as getOrgs } from "@/services/organization";

export async function syncFirebaseUserToDb(firebaseUser: {
  uid: string;
  email: string;
  name?: string;
  workspaceType?: string;
  subscriptionPlan?: string;
}) {
  let user = await db.select().from(users).where(eq(users.email, firebaseUser.email)).get();

  if (!user) {
    // 1. Create User
    const [newUser] = await db.insert(users).values({
      id: firebaseUser.uid, // Use Firebase UID as the primary key
      email: firebaseUser.email,
      name: firebaseUser.name || firebaseUser.email.split("@")[0],
      passwordHash: "", // Not used since Firebase handles auth
    }).returning();
    
    user = newUser;
  }

  // 2. Create default organization if none exists and a workspaceType is provided
  const existingOrgs = await getOrgs(user.id);
  if (existingOrgs.length === 0 && firebaseUser.workspaceType) {
    let orgName = "Personal Workspace";
    if (firebaseUser.workspaceType === "rental") orgName = "Rental Portfolio";
    else if (firebaseUser.workspaceType === "builder") orgName = "Builder Workspace";
    else if (firebaseUser.workspaceType === "enterprise") orgName = "Enterprise Division";

    const newOrg = await createOrganization(
      orgName, 
      user.id, 
      firebaseUser.workspaceType as any
    );

    // Update the subscription plan if provided
    if (firebaseUser.subscriptionPlan && newOrg) {
      await db.update(organizations)
        .set({ subscriptionPlan: firebaseUser.subscriptionPlan.toLowerCase() })
        .where(eq(organizations.id, newOrg.id))
        .run();
    }
  }

  return user;
}

export async function getUserOrganizations(userId: string) {
  return await db
    .select({
      organization: organizations,
      role: memberships.role,
    })
    .from(memberships)
    .innerJoin(organizations, eq(memberships.organizationId, organizations.id))
    .where(eq(memberships.userId, userId));
}
