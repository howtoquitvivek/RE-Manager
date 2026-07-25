import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { getProjectById } from "@/services/project";
import { getProjectProperties } from "@/services/property";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Building2, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import ProjectMap from "@/components/maps/ProjectMap";
import { MapMarker } from "@/lib/maps/coordinates";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectId: string }>;
}) {
  const { orgSlug, projectId } = await params;
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  const organization = await getOrganizationBySlug(orgSlug, session.userId);
  if (!organization) redirect("/dashboard");

  const project = await getProjectById(projectId, organization.id);
  if (!project) notFound();

  const properties = await getProjectProperties(projectId);

  const markers: MapMarker[] = project.latitude && project.longitude 
    ? [{
        id: project.id,
        lat: project.latitude,
        lng: project.longitude,
        title: project.name,
        type: "project",
        status: project.status,
        location: project.address || undefined
      }] 
    : properties.filter(p => p.latitude && p.longitude).map(p => ({
        id: p.id,
        lat: p.latitude!,
        lng: p.longitude!,
        title: p.name || p.title || "Untitled Property",
        type: "property",
        price: p.estimatedValue || p.price || undefined,
        status: p.status,
        location: p.address || p.location || undefined
      }));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
         <Link href={`/dashboard/${orgSlug}/projects`} className="text-slate-500 hover:text-slate-900 transition-colors">
           &larr; Back to Projects
         </Link>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="bg-blue-50 p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
             </div>
             <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          </div>
          <p className="text-slate-500 max-w-2xl">{project.description}</p>
          {project.address && (
            <div className="flex items-center text-slate-400 text-sm mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              {project.address}
            </div>
          )}
        </div>
        <div className="flex gap-3">
           <Button variant="outline">Edit Project</Button>
           <Link href={`/dashboard/${orgSlug}/projects/${projectId}/properties/new`} className={buttonVariants({ className: "bg-slate-900 hover:bg-slate-800" })}>
               <Plus className="mr-2 h-4 w-4" /> Add Property
           </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Properties in this project</h2>
            {properties.length === 0 ? (
              <Card className="border-dashed border-2 p-12 text-center bg-transparent">
                <CardDescription>No properties added yet.</CardDescription>
                <Link href={`/dashboard/${orgSlug}/projects/${projectId}/properties/new`} className={buttonVariants({ variant: "link", className: "mt-2" })}>
                   Add your first property
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {properties.map((property) => (
                  <Link key={property.id} href={`/dashboard/${orgSlug}/properties/${property.id}`}>
                    <Card className="hover:shadow-md transition-shadow border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden">
                      <div className="p-4 flex gap-4">
                        <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                           <Building2 className="h-8 w-8 text-slate-300" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900 line-clamp-1">{property.name || property.title}</div>
                          <div className="text-sm text-slate-500 line-clamp-1">{property.address || property.location}</div>
                          <div className="text-sm font-bold text-slate-900">
                            {property.estimatedValue || property.price ? `$${(property.estimatedValue || property.price)?.toLocaleString()}` : "Price on request"}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm h-[400px]">
             <CardHeader>
               <CardTitle className="text-lg">Location</CardTitle>
             </CardHeader>
             <CardContent className="h-[300px]">
                {markers.length > 0 ? (
                  <ProjectMap markers={markers} zoom={14} orgSlug={orgSlug} />
                ) : (
                  <div className="h-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm text-center p-8">
                    Add an address or coordinates to see this project on the map.
                  </div>
                )}
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
