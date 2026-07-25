import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { getPropertyById } from "@/services/property";
import { getPropertyDocuments } from "@/services/document";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, DollarSign, FileText, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import { uploadDocumentAction, deleteDocumentAction } from "@/actions/document";

export default async function PropertyDetailPage({
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
  if (!organization) redirect("/dashboard");

  const property = await getPropertyById(propertyId);
  if (!property) notFound();

  const documents = await getPropertyDocuments(propertyId);

  async function handleUpload(formData: FormData) {
    "use server"
    await uploadDocumentAction(orgSlug, propertyId, formData);
  }

  async function handleDeleteDoc(docId: string) {
    "use server"
    await deleteDocumentAction(orgSlug, propertyId, docId);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
         <Link href={`/dashboard/${orgSlug}/properties`} className="text-slate-500 hover:text-slate-900 transition-colors">
           &larr; Back to Properties
         </Link>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="bg-emerald-50 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-emerald-600" />
             </div>
             <h1 className="text-3xl font-bold text-slate-900">{property.name || property.title}</h1>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {(property.address || property.location) && (
              <div className="flex items-center text-slate-500 text-sm">
                <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                {property.address || property.location}
              </div>
            )}
            <div className="flex items-center text-slate-900 font-bold text-sm">
              <DollarSign className="h-4 w-4 mr-1 text-emerald-600" />
              {property.estimatedValue || property.price ? (property.estimatedValue || property.price)?.toLocaleString() : "Contact for price"}
            </div>
            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
              property.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {property.status}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
           <Button variant="outline">Edit Property</Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
           <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle>Description</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-slate-600 whitespace-pre-wrap">{property.description || "No description provided."}</p>
             </CardContent>
           </Card>

           <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Documents & AI Summaries</h2>
                <form action={handleUpload}>
                  <label className="cursor-pointer">
                    <div className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                      <Upload className="h-4 w-4" /> Upload Document
                    </div>
                    <input type="file" name="file" className="hidden" onChange={(e) => e.target.form?.requestSubmit()} />
                  </label>
                </form>
             </div>

             {documents.length === 0 ? (
               <Card className="border-dashed border-2 p-12 text-center bg-transparent">
                  <CardDescription>No documents uploaded yet. Upload a PDF to see Gemini AI summary.</CardDescription>
               </Card>
             ) : (
               <div className="grid gap-4">
                 {documents.map((doc) => (
                   <Card key={doc.id} className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                     <CardContent className="p-4 space-y-4">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <FileText className="h-5 w-5 text-blue-600" />
                           <span className="font-medium text-slate-900">{doc.name}</span>
                         </div>
                         <form action={async () => {
                           "use server"
                           await deleteDocumentAction(orgSlug, propertyId, doc.id);
                         }}>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                         </form>
                       </div>
                       
                       {doc.aiSummary && (
                         <div className="bg-blue-50/50 rounded-lg p-4 text-sm">
                           <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
                              AI Summary
                           </div>
                           <p className="text-slate-700 leading-relaxed italic">{doc.aiSummary}</p>
                         </div>
                       )}
                     </CardContent>
                   </Card>
                 ))}
               </div>
             )}
           </div>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="text-lg">Quick Specs</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">ID</span>
                  <span className="font-mono text-xs">{property.id.split('-')[0]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Created At</span>
                  <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
