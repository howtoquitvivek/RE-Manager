import { getSession } from "@/lib/auth/session";
import { getOrganizationBySlug } from "@/services/organization";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProjectAction } from "@/actions/project";
import Link from "next/link";

export default async function NewProjectPage({
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

  async function handleSubmit(formData: FormData) {
    "use server"
    const result = await createProjectAction(orgSlug, organization!.id, formData);
    if (result.success) {
      redirect(`/dashboard/${orgSlug}/projects`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
         <Link href={`/dashboard/${orgSlug}/projects`} className="text-slate-500 hover:text-slate-900 transition-colors">
           &larr; Back to Projects
         </Link>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create New Project</h1>
        <p className="text-slate-500 mt-2">Add a new real estate development project to your organization.</p>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" name="name" placeholder="e.g. Skyline Residency" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Describe the project..." rows={4} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="e.g. 123 Luxury Way, Beverly Hills, CA" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                 <Link href={`/dashboard/${orgSlug}/projects`} className={buttonVariants({ variant: "outline" })}>Cancel</Link>
               <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
                 Create Project
               </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
