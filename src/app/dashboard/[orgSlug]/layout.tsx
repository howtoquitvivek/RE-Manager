import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug, getUserOrganizations, createOrganization } from "@/services/organization";
import { redirect, notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell/DashboardShell";
import { WorkspaceType } from "@/types/dashboard";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  // Verify user exists in DB to avoid foreign key constraint errors
  const [user] = await db.select().from(users).where(eq(users.id, session.userId));

  if (!user) {
    // If session exists but user is gone (e.g. DB reset), show a sync UI instead of redirecting to avoid loops
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto">
            <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Session Sync Required</h1>
          <p className="text-muted-foreground">
            We couldn&apos;t find your profile in the local database. This can happen after a system update or database reset.
          </p>
          <a 
            href="/login?sync=true" 
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            Re-sync Session
          </a>
        </div>
      </div>
    );
  }

  let organization = await getOrganizationBySlug(orgSlug, session.userId);

  if (!organization) {
    if (orgSlug === "personal") {
      // Silently create the personal organization for the user
      organization = await createOrganization("Personal Property", session.userId, "personal");
      if (organization) {
        redirect(`/dashboard/${organization.slug}`);
      } else {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <h1 className="text-xl font-bold">Workspace Initialization Failed</h1>
            <p className="text-muted-foreground mt-2 font-medium">Could not initialize your personal workspace. Please try reloading the page.</p>
          </div>
        );
      }
    } else {
      // If user doesn't have access to this org, or it doesn't exist
      redirect("/dashboard");
    }
  }

  const allOrganizations = await getUserOrganizations(session.userId);

  return (
    <DashboardShell 
      organization={{
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        workspaceType: organization.workspaceType as WorkspaceType
      }}
      allOrganizations={allOrganizations}
    >
      {children}
    </DashboardShell>
  );
}
