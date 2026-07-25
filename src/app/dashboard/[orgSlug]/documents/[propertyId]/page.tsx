import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { db } from "@/lib/db";
import { properties as propertiesTable, documents as documentsTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import PropertyVaultDetail from "@/components/dashboard/personal/PropertyVaultDetail";

export default async function PropertyVaultPage({
  params,
}: {
  params: Promise<{ orgSlug: string; propertyId: string }>;
}) {
  const { orgSlug, propertyId } = await params;
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  const organization = await getOrganizationBySlug(orgSlug, session.userId);
  if (!organization) {
    redirect("/dashboard");
  }

  const property = await db.query.properties.findFirst({
    where: and(
      eq(propertiesTable.id, propertyId), 
      eq(propertiesTable.organizationId, organization.id)
    ),
  });

  if (!property) notFound();

  const documents = await db.query.documents.findMany({
    where: eq(documentsTable.propertyId, propertyId),
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PropertyVaultDetail 
        property={property as any} 
        initialDocuments={documents as any} 
        userId={session.userId} 
        orgSlug={orgSlug}
      />
    </div>
  );
}
