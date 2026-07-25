import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { getOrganizationProperties } from "@/services/property";
import { getPersonalProperties } from "@/actions/personal";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Building2 as BuildingIcon, ChevronRight as ChevronIcon, MapPin as MapIcon } from "lucide-react";
import Link from "next/link";
import PersonalPropertyListing from "@/components/dashboard/personal/PropertyListing";

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  const organization = await getOrganizationBySlug(orgSlug, session.userId);
  if (!organization) redirect("/dashboard");

  const workspaceType = organization.workspaceType;

  // Personal Workspace Handling
  if (workspaceType === "personal") {
    const properties = await getPersonalProperties(session.userId, organization.id);
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PersonalPropertyListing 
          initialProperties={properties as any} 
          userId={session.userId}
          orgId={organization.id}
          orgSlug={orgSlug}
        />
      </div>
    );
  }

  // Original Logic for Rental/Enterprise
  const propertyEntries = await getOrganizationProperties(organization.id);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Properties</h1>
          <p className="text-muted-foreground mt-2">Inventory of all properties across your projects.</p>
        </div>
      </div>

      {propertyEntries.length === 0 ? (
        <Card className="border-dashed border border-border/40 flex flex-col items-center justify-center p-12 text-center bg-card/40 backdrop-blur-md shadow-subtle hover:shadow-premium transition-all duration-300">
          <div className="bg-secondary/50 p-4 rounded-full mb-4 group-hover:scale-105 transition-transform duration-300">
            <BuildingIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl text-foreground">No properties found</CardTitle>
          <CardDescription className="max-w-xs mx-auto mt-2 text-muted-foreground">
            Properties are usually created within a specific project.
          </CardDescription>
          <Link href={`/dashboard/${orgSlug}/projects`} className={buttonVariants({ variant: "outline", className: "mt-6" })}>
              Go to Projects
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {propertyEntries.map(({ property }) => (
            <Link key={property.id} href={`/dashboard/${orgSlug}/properties/${property.id}`}>
              <Card className="bg-card/40 backdrop-blur-md shadow-subtle border border-border/40 hover:shadow-premium transition-all duration-300 h-full group overflow-hidden flex flex-col">
                <div className="h-32 bg-secondary/30 flex items-center justify-center text-muted-foreground group-hover:bg-secondary/50 transition-colors duration-300">
                   <BuildingIcon className="h-12 w-12 opacity-50 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardHeader className="pb-2 flex-grow">
                  <div className="flex justify-between items-start">
                     <CardTitle className="group-hover:text-primary transition-colors text-lg text-foreground">{property.name}</CardTitle>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      property.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-secondary text-muted-foreground border border-border/40'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  {property.address && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapIcon className="h-3 w-3 mr-1" />
                      {property.address}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="mt-auto">
                   <div className="text-lg font-bold text-foreground">
                     {property.estimatedValue ? `$${property.estimatedValue.toLocaleString()}` : "Price on request"}
                   </div>
                  <div className="flex items-center justify-end text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-4">
                    View details <ChevronIcon className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


