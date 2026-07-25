"use server";

import { syncFirebaseUserToDb, getUserOrganizations } from "@/services/auth.service";
import { createSession, deleteSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { memberships, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function syncUserSession(firebaseUser: { 
  uid: string, 
  email: string, 
  name?: string | null,
  workspaceType?: string,
  subscriptionPlan?: string
}) {
  try {
    // Sync with our database
    const user = await syncFirebaseUserToDb({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.name || undefined,
      workspaceType: firebaseUser.workspaceType,
      subscriptionPlan: firebaseUser.subscriptionPlan,
    });

    // Create custom session cookie for Next.js middleware
    await createSession(user.id);

    // Get the user's default organization to redirect to
    const orgs = await getUserOrganizations(user.id);
    if (orgs.length > 0) {
      return { success: true, redirectUrl: `/dashboard/${orgs[0].organization.slug}` };
    }

    return { success: true, redirectUrl: "/dashboard" };
  } catch (error) {
    console.error("Session sync failed", error);
    return { error: "Authentication failed" };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function getTeamMembersAction(organizationId: string) {
  try {
    const list = await db.select()
      .from(memberships)
      .where(eq(memberships.organizationId, organizationId))
      .all();

    const enrichedMembers = await Promise.all(
      list.map(async (m) => {
        const user = await db.select().from(users).where(eq(users.id, m.userId)).limit(1).get();
        return {
          id: m.id,
          name: user ? user.name || "Unnamed Member" : "Unknown User",
          email: user ? user.email : "—",
          role: m.role,
          clearance: m.clearance || "Level 3 — Standard Access",
          status: "Active",
          joined: m.joined || new Date(m.createdAt).toLocaleDateString()
        };
      })
    );

    return { success: true, team: enrichedMembers };
  } catch (error) {
    console.error("Error fetching team members:", error);
    return { success: false, team: [] };
  }
}

export async function createTeamMemberAction(
  orgSlug: string, 
  organizationId: string, 
  data: { name: string; email: string; role: string; clearance: string }
) {
  try {
    // Check if user exists in DB
    let user = await db.select().from(users).where(eq(users.email, data.email)).limit(1).get();
    
    if (!user) {
      // Create user record
      const userId = uuidv4();
      [user] = await db.insert(users).values({
        id: userId,
        email: data.email,
        name: data.name,
        passwordHash: "", // Firebase auth handled
      }).returning();
    }

    // Check if membership already exists
    const existingMember = await db.select()
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, user.id),
          eq(memberships.organizationId, organizationId)
        )
      )
      .limit(1)
      .get();

    if (existingMember) {
      return { error: "User is already a member of this organization" };
    }

    // Create membership record
    await db.insert(memberships).values({
      userId: user.id,
      organizationId,
      role: data.role,
      clearance: data.clearance,
      joined: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: '2-digit' }),
    });

    revalidatePath(`/dashboard/${orgSlug}/teams`);
    return { success: true };
  } catch (error) {
    console.error("Error creating team member:", error);
    return { error: "Failed to create team member" };
  }
}

